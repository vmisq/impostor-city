import { createSignal, createEffect, onCleanup } from "solid-js";
import Lives from "./Lives";
import Options from "./Options";
import Scoreboard from "./Scoreboard";
import { fetchRound, saveScore } from "../lib/data.js"

const PREP_COUNTDOWN = 3;
const TIME_LEFT = 10;
const LIVES = 5;

export default function Game() {
    const [prepCountdown, setPrepCountdown] = createSignal(PREP_COUNTDOWN);
    const [timeLeft, setTimeLeft] = createSignal(TIME_LEFT);
    const [totalTime, setTotalTime] = createSignal(0);
    const [correct, setCorrect] = createSignal(0);
    const [score, setScore] = createSignal(0);
    const [lives, setLives] = createSignal(LIVES);
    const [category, setCategory] = createSignal();
    const [value, setValue] = createSignal();
    const [options, setOptions] = createSignal([]);
    const [answer, setAnswer] = createSignal();
    const [selected, setSelected] = createSignal();
    const [stage, setStage] = createSignal(null); //null, prep, playing, checking

    function newRound() {
        setPrepCountdown(PREP_COUNTDOWN);
        setStage('prep');
    }

    async function startNewRound() {
        const newRound = await fetchRound();
        setCategory(newRound.category);
        setValue(newRound.value);
        setOptions(newRound.options);
        setAnswer(newRound.answer);
        setStage('playing');
        setTimeLeft(10);
    }

    function newGame() {
        setPrepCountdown(PREP_COUNTDOWN);
        setTimeLeft(TIME_LEFT);
        setTotalTime(0);
        setCorrect(0);
        setScore(0);
        setLives(LIVES);
        setCategory();
        setValue();
        setOptions([]);
        setAnswer();
        setSelected();
        setStage(null);
        newRound();
    }

    function validateAnswer(ans) {
        setStage('checking');
        setSelected(ans);
        if (ans === answer()) {
            setCorrect(correct() + 1);
            setScore(score() + 10 + timeLeft());
        } else {
            setLives(lives() - 1);
        };
        newRound();
    }

    function endGame() {
        saveScore({
            timestamp: Date.now(),
            score: score(),
            correct: correct(),
            totalTime: totalTime(),
        });
        setStage(null);
    }

    createEffect(() => {
        if (stage() == 'playing') {
            const interval = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        return 0;
                    }
                    return t - 1;
                });
                setTotalTime((t) => {
                    return t + 1;
                });
            }, 1000);
            onCleanup(() => clearInterval(interval));
        } else if (stage() == 'prep') {
            const interval = setInterval(() => {
                setPrepCountdown((t) => {
                    if (t <= 1) {
                        clearInterval(interval);
                        if (lives() > 0) {
                            startNewRound();
                        } else {
                            endGame();
                        }
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            onCleanup(() => clearInterval(interval));
        }
    });

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad = (n) => n.toString().padStart(2, "0");

        if (hrs > 0) {
            return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
        }
        return `${pad(mins)}:${pad(secs)}`;
    }

    return (
        <>
            <div class="flex flex-row gap-4 items-center justify-center">
                <div class="flex flex-col flex-1">
                    <div class="h-10 flex items-center justify-center">
                        <h1 class="text-lg font-bold">{score}</h1>
                    </div>
                    <h3 class="text-center text-sm opacity-70">Pontuação</h3>
                </div>
                <div class="flex flex-col flex-1">
                    <div class="h-10 flex items-center justify-center">
                        <h1 class="text-lg font-bold">{correct}</h1>
                    </div>
                    <h3 class="text-center text-sm opacity-70">Acertos</h3>
                </div>
                <div class="flex flex-col flex-1">
                    <div class="h-10 flex items-center justify-center">
                        <h1 class="text-lg font-bold">{formatTime(totalTime())}</h1>
                    </div>
                    <h3 class="text-center text-sm opacity-70">Tempo</h3>
                </div>
                <div class="flex flex-col flex-1">
                    <div class="h-10 flex items-center justify-center">
                        <Lives value={lives()} />
                    </div>
                    <h3 class="text-center text-sm opacity-70">Vidas</h3>
                </div>
            </div>
            <div class="card card-border bg-base-100 min-h-100">
                <div class="card-body">
                    <Show when={category()} fallback={
                        <h3 class="card-title justify-center text-lg font-bold"> </h3>
                    }>
                        <h3 class="card-title justify-center text-lg font-bold">{category}: {value}</h3>
                    </Show>
                    <Show when={stage() == 'playing'}>
                        <progress class="w-full progress" value={timeLeft()} max={TIME_LEFT}></progress>
                    </Show>
                    <Show when={stage() == 'prep'}>
                        <progress class="w-full progress" value={prepCountdown()} max={PREP_COUNTDOWN}></progress>
                    </Show>
                    <div class="card-actions grid grid-cols-1 gap-4 h-full overflow-auto">
                        <Show when={!stage()} fallback={
                            <Options onClick={validateAnswer} options={options()} answer={answer()} stage={stage()} selected={selected()} />
                        }>
                            <div class="justify-center items-center"> {/*grid grid-rows-3 gap-4 h-full*/}
                                <div class="flex flex-col row-span-2 justify-center items-center">
                                    <Scoreboard />
                                </div>
                                <button type="button" class="btn btn-ghost btn-block" onClick={newGame}>Novo Jogo</button>
                            </div>
                        </Show>
                    </div>
                    <Show when={stage()=='prep' && lives() > 0}>
                        <h3 class="card-title justify-center text-lg font-bold"> Nova rodada em {prepCountdown()}s </h3>
                    </Show>
                    <Show when={stage()=='prep' && lives() == 0}>
                        <h3 class="card-title justify-center text-lg font-bold"> Fim de jogo! </h3>
                    </Show>
                </div>
            </div >
        </>
    );
}
