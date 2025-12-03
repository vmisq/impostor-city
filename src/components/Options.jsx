export default function Options(props) {
    return <For each={props.options}>{(opt, i) =>
        <button
            type="button"
            class={
                props.stage == 'playing' ? "btn btn-ghost justify-start" :
                    opt.id == props.answer ?
                        "btn btn-success justify-start" :
                        opt.id == props.selected ?
                            "btn btn-error justify-start" :
                            "btn btn-ghost justify-start"
            }
            onClick={() => props.stage === "playing" && props.onClick(opt.id)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="size-8">
                <path d={
                    props.stage == 'playing' ? "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" :
                        (opt.id == props.answer ?
                            "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" :
                            "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z")
                } />
            </svg>
            {opt.name}
        </button>
    }</For>
}