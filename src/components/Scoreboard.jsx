import { createResource, For, Show } from "solid-js";
import { fetchScoreboard } from "../lib/data.js";

export default function Scoreboard() {
    const [scoreboard] = createResource(fetchScoreboard);

    const columnLabels = {
        timestamp: "Data e Hora",
        score: "Pontuação",
        correct: "Acertos",
        totalTime: "Tempo"
    };

    function formatTimestamp(ts) {
        const d = new Date(ts);
        const pad = (n) => n.toString().padStart(2, "0");

        const year = d.getFullYear() % 100; // last two digits
        const month = pad(d.getMonth() + 1); // months are 0-based
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());

        return `${day}/${month}/${pad(year)} ${hours}:${minutes}`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(mins)}:${pad(secs)}`;
    }

    return (
        <div class="overflow-x-auto">
            <table class="table">
                <thead>
                    <Show
                        when={scoreboard()?.length}
                        fallback={
                            <tr>
                                <th>Clique em Novo Jogo para iniciar!</th>
                            </tr>
                        }
                    >
                        <tr>
                            <th>#</th>
                            <For each={Object.keys(scoreboard()[0] || {})}>
                                {(key) => <th>{columnLabels[key] || key}</th>}
                            </For>
                        </tr>
                    </Show>
                </thead>

                <tbody>
                    <For each={scoreboard() || []}>
                        {(item, i) => (
                            <tr>
                                <th>{i() + 1}</th>
                                <For each={Object.entries(item)}>
                                    {([key, val]) => {
                                        let display = val;
                                        if (key === "timestamp") display = formatTimestamp(val);
                                        if (key === "totalTime") display = formatTime(val);
                                        return <td>{display}</td>;
                                    }}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    );
}
