export default function Lives(props) {
    return <div class="flex items-center justify-center">
        <For each={Array.from({ length: 5 })}>
            {(_, i) => (
                <Show 
                    when={i() >= props.value}
                    fallback={
                        <button type="button" class="size-5 inline-flex justify-center items-center text-2xl rounded-full text-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500">
                            <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
                            </svg>
                        </button>
                    }
                >
                    <button type="button" class="size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-600 dark:hover:text-red-500">
                        <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
                        </svg>
                    </button>
                </Show>
            )}
        </For>
    </div>
}