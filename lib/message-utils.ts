export function createChatTitle(
    content: string
): string {
    const cleaned = content
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) {
        return "New conversation";
    }

    if (cleaned.length <= 40) {
        return cleaned;
    }

    return `${cleaned.slice(0, 40).trim()}...`;
}

export function formatMessageTime(
    timestamp: number
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(
        new Date(
            timestamp
        )
    );
}