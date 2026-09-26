import { Chat } from "./types";

const STORAGE_KEY = "modeloncloud-chats";

export function loadChats(): Chat[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data) as Chat[];
    } catch {
        return [];
    }
}

export function saveChats(chats: Chat[]): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(chats)
    );
}

export function clearChats(): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
}