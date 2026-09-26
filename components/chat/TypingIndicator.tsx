export default function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 px-1 py-2">
            <div className="flex items-center gap-1 rounded-2xl bg-[var(--surface)] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)] [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)]" />
            </div>
        </div>
    );
}