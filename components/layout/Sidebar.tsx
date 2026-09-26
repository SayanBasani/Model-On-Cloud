"use client";

import {
    MessageSquare,
    Plus,
    Settings,
    Trash2,
    X
} from "lucide-react";

import { Chat } from "@/lib/types";

type SidebarProps = {
    chats: Chat[];
    activeChatId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
};

export default function Sidebar({
    chats,
    activeChatId,
    isOpen,
    onClose,
    onNewChat,
    onSelectChat,
    onDeleteChat
}: SidebarProps) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex w-72
                    flex-col border-r border-[var(--border)]
                    bg-[var(--surface)]
                    transition-transform duration-200
                    md:relative md:z-auto md:translate-x-0
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                            <MessageSquare size={18} />
                        </div>

                        <div>
                            <h1 className="text-sm font-semibold">
                                ModelOnCloud
                            </h1>

                            <p className="text-xs text-[var(--muted)]">
                                AI in the cloud
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] md:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-3">
                    <button
                        type="button"
                        onClick={onNewChat}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
                    >
                        <Plus size={17} />
                        New chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3">
                    <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        Recent chats
                    </p>

                    <div className="space-y-1">
                        {chats.length === 0 ? (
                            <div className="px-2 py-6 text-center text-sm text-[var(--muted)]">
                                No conversations yet.
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`
                                        group flex items-center gap-2
                                        rounded-xl px-3 py-2.5
                                        ${
                                            activeChatId === chat.id
                                                ? "bg-[var(--surface-hover)]"
                                                : "hover:bg-[var(--surface-hover)]"
                                        }
                                    `}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectChat(chat.id)
                                        }
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <p className="truncate text-sm">
                                            {chat.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                                            {chat.messages.length} messages
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteChat(chat.id)
                                        }
                                        className="rounded-lg p-1.5 text-[var(--muted)] opacity-0 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                                        aria-label="Delete chat"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="border-t border-[var(--border)] p-3">
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                    >
                        <Settings size={17} />
                        Settings
                    </button>
                </div>
            </aside>
        </>
    );
}