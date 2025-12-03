// @client

const KEY = "roundQueue";
const MAX = 10;

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
function saveQueue(queue) {
  localStorage.setItem(KEY, JSON.stringify(queue));
}

let queue = loadQueue();
let filling = false;

import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.30.0/+esm';

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
const worker_url = URL.createObjectURL(
  new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
);
const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
URL.revokeObjectURL(worker_url);
const c = await db.connect();
await c.query(`
    CREATE TABLE t AS
    SELECT * FROM '${window.location.origin}${window.location.pathname}assets/data.parquet'
`);

async function query(sql) {
  const q = await c.query(sql);
  const rows = q.toArray().map((row) => row.toJSON());
  rows.columns = q.schema.fields.map((d) => d.name);
  return rows;
};

async function generateRound() {
    const category = [
        {name: 'Estado', col: 'estado'},
        {name: 'Mesoregião', col: 'mesoregiao'},
        {name: 'Microregião', col: 'microregiao'},
        {name: 'População', col: 'pop_bin'}
    ][Math.floor(Math.random() * 4)]
    const value = (await query(`
        SELECT *
        FROM (
            SELECT ${category.col} col 
            FROM t
        ) USING SAMPLE(1)
    `))[0].col;
    const options = await query(`
        SELECT *
        FROM (
            SELECT *
            FROM (
                SELECT cidade AS id, cidade AS name, false AS ans
                FROM t
                WHERE ${category.col} = '${value}'
            ) USING SAMPLE(4)
            UNION ALL
            SELECT *
            FROM (
                SELECT cidade AS id, cidade AS name, true AS ans
                FROM t
                WHERE ${category.col} <> '${value}'
            ) USING SAMPLE(1)
        ) ORDER BY RANDOM()
    `);
    const answer = options.find(opt => opt.ans).id;
    return {
        category: category.name,
        value: value,
        options: options,
        answer: answer,
    };
}

async function fillQueue() {
  if (filling) return;
  filling = true;
  while (queue.length < MAX) {
    const item = await generateRound();
    queue.push(item);
    saveQueue(queue);
  }
  filling = false;
}
fillQueue();

export async function fetchRound() {
  if (!queue.length) queue = loadQueue();
  if (!queue.length) {
    const item = await generateRound();
    return item;
  }
  const item = queue.shift();
  saveQueue(queue);
  fillQueue();
  return item;
}

const STORAGE_KEY = "scoreboard";
export function saveScore(entry) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  data.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function fetchScoreboard() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const sorted = data.sort((a, b) => {
    // 1. score descending
    if (b.score !== a.score) return b.score - a.score;
    // 2. correct answers descending
    if (b.correct !== a.correct) return b.correct - a.correct;
    // 3. total time ascending
    if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
    // 4. timestamp descending
    return b.timestamp - a.timestamp;
  });

  return sorted.slice(0, 10); // top 10
}

export function clearScoreboard() {
  localStorage.removeItem(STORAGE_KEY);
}