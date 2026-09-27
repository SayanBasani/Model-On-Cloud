"use client";

import { ArrowUp, Square } from "lucide-react";

type ChatInputProps = {
    value: string;
    onChange: (
        value: string
    ) => void;
    onSend: () => void;
    onStop: () => void;
    isLoading: boolean;
};

export default function ChatInput({
    value,
    onChange,
    onSend,
    onStop,
    isLoading
}: ChatInputProps) {
    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            if (!isLoading) {
                onSend();
            }
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 pb-4">
            <div className="relative rounded-2xl border border-\[var(--border)] bg-\[var(--surface)] shadow-sm transition focus-within:border-zinc-400">
                <textarea
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Message ModelOnCloud..."
                    rows={1}
                    className="max-h-48 min-h-14 w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm outline-none placeholder:text-[var(--muted)]"
                />

                <button
                    type="button"
                    onClick={
                        isLoading
                            ? onStop
                            : onSend
                    }
                    disabled={
                        isLoading ||
                        !value.trim()
                    }
                    className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-zinc-900"
                    aria-label="Send message"
                >
                    {isLoading ? (
                        // <Square size={15} />
                        <span className="text-2xl border w-7 h-7 flex items-center justify-center rounded-2xl"> ■ </span>
                    ) : (
                        // <ArrowUp size={18} />
                        <ArrowUp size={17} />
                    )}
                </button>
            </div>

            <p className="mt-2 text-center text-xs text-\[var(--muted)]">
                ModelOnCloud can make mistakes. Check important information.
            </p>
        </div>
    );
}