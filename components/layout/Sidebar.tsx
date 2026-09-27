"use client";

import {
    Check,
    MessageSquare,
    Pencil,
    Plus,
    Search,
    Settings,
    Trash2,
    X
} from "lucide-react";

import { useState } from "react";
import { Chat } from "@/lib/types";
import { loadChats, saveChats } from "@/lib/storage";

type SidebarProps = {
    chats: Chat[];
    activeChatId: string | null;
    isOpen: boolean;
    collapsed: boolean;
    onClose: () => void;
    onCollapsedChange: ( collapsed: boolean ) => void;
    onNewChat: () => void;
    onSelectChat: ( id: string ) => void;
    onDeleteChat: ( id: string ) => void;
    onChatsChanged: () => void;
};

export default function Sidebar({
    chats,
    activeChatId,
    isOpen,
    collapsed,
    onClose,
    onCollapsedChange,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onChatsChanged
}: SidebarProps) {
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    function startRename(chat: Chat) { setEditingChatId(chat.id); setEditingTitle(chat.title); }
    function cancelRename() { setEditingChatId(null); setEditingTitle(""); }
    const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChats =
        chats.filter((chat) =>
            chat.title
                .toLowerCase()
                .includes(
                    searchQuery
                        .trim()
                        .toLowerCase()
                )
        );

    function confirmDeleteChat() {
        if (!deleteChatId) {
            return;
        }

        onDeleteChat(
            deleteChatId
        );

        setDeleteChatId(null);
    }

    function cancelDeleteChat() {
        setDeleteChatId(null);
    }

    function saveRename(chatId: string) {
        const title = editingTitle.trim();
        if (!title) { return; }
        const storedChats = loadChats();

        const updatedChats =
            storedChats.map(
                (chat) =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            title,
                            updatedAt:
                                Date.now()
                        }
                        : chat
            );
        saveChats( updatedChats );
        setEditingChatId(null);
        setEditingTitle("");
        onChatsChanged();
        window.dispatchEvent(
            new Event("chatsUpdated")
        );
    }


    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    z-50 flex
                    shrink-0
                    flex-col
                    border-r
                    border-\[var(--border)]
                    bg-\[var(--surface)]

                    transition-[width,transform]
                    duration-200

                    fixed
                    inset-y-0
                    left-0

                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    w-72

                    md:relative
                    md:inset-auto
                    md:translate-x-0

                    ${
                        collapsed
                            ? "md:w-16"
                            : "md:w-72"
                    }
                `}
            >
                {/* Sidebar header */}
                <div
                    className={`
                        flex
                        h-16
                        shrink-0
                        items-center
                        border-b
                        border-\[var(--border)]

                        ${
                            collapsed
                                ? "justify-center"
                                : "justify-between px-4"
                        }
                    `}
                >
                    <div
                        className={`
                            flex
                            items-center
                            gap-2
                            min-w-0
                        `}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                            <MessageSquare
                                size={18}
                            />
                        </div>

                        <div
                            className={`
                                min-w-0
                                ${
                                    collapsed
                                        ? "md:hidden"
                                        : ""
                                }
                            `}
                        >
                            <h1 className="truncate text-sm font-semibold">
                                ModelOnCloud
                            </h1>

                            <p className="truncate text-xs text-\[var(--muted)]">
                                AI in the cloud
                            </p>
                        </div>
                    </div>

                    {/* Mobile close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-\[var(--muted)] hover:bg-\[var(--surface-hover)] md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* New chat */}
                <div
                    className={`
                        p-3
                        ${
                            collapsed
                                ? "md:px-2"
                                : ""
                        }
                    `}
                >
                    <button
                        type="button"
                        onClick={onNewChat}
                        className={`
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-\[var(--border)]
                            bg-\[var(--background)]
                            text-sm
                            font-medium
                            transition
                            hover:bg-\[var(--surface-hover)]
                        `}
                        title={
                            collapsed
                                ? "New chat"
                                : undefined
                        }
                    >
                        <Plus
                            size={17}
                        />

                        <span
                            className={
                                collapsed
                                    ? "md:hidden"
                                    : ""
                            }
                        >
                            New chat
                        </span>
                    </button>
                </div>

                {/* Recent chats */}
                <div className="min-h-0 flex-1 overflow-y-auto px-3">
                    {!collapsed && (
                        <div className="mb-3">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-\[var(--muted)]"
                                />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search conversations..."
                                    className="h-10 w-full rounded-xl border border-\[var(--border)] bg-\[var(--background)] pl-9 pr-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-400"
                                />
                            </div>
                        </div>
                    )}

                    <p
                        className={`
                            mb-2
                            px-2
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-\[var(--muted)]
                            ${
                                collapsed
                                    ? "md:hidden"
                                    : ""
                            }
                        `}
                    >
                        Recent chats
                    </p>
                    <div className="space-y-1">
                        {chats.length === 0 ? (
                            <div
                                className={`
                                    px-2 py-6 text-center text-sm text-\[var(--muted)]
                                    ${
                                        collapsed
                                            ? "md:hidden"
                                            : ""
                                    }
                                `}
                            >
                                <div
                                    className={`
                                        px-2
                                        py-6
                                        text-center
                                        text-sm
                                        text-\[var(--muted)]
                                        ${
                                            collapsed
                                                ? "md:hidden"
                                                : ""
                                        }
                                    `}
                                >
                                    {searchQuery.trim()
                                        ? "No matching conversations."
                                        : "No conversations yet."}
                                </div>                            </div>
                        ) : (
                            chats.map(
                                (chat) => (
                                    <div
                                        key={ chat.id }
                                        className={`
                                            group
                                            flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            px-2
                                            py-2.5

                                            ${
                                                activeChatId ===
                                                chat.id
                                                    ? "bg-\[var(--surface-hover)]"
                                                    : "hover:bg-\[var(--surface-hover)]"
                                            }

                                            ${
                                                collapsed
                                                    ? "md:justify-center"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectChat(
                                                    chat.id
                                                )
                                            }
                                            className={`
                                                flex
                                                min-w-0
                                                items-center
                                                ${
                                                    collapsed
                                                        ? "md:justify-center"
                                                        : ""
                                                }
                                                flex-1
                                                text-left
                                            `}
                                            title={
                                                collapsed
                                                    ? chat.title
                                                    : undefined
                                            }
                                        >
                                            <MessageSquare
                                                size={
                                                    16
                                                }
                                                className="shrink-0 text-\[var(--muted)]"
                                            />

                                            {/* {!collapsed && (
                                                <div className="ml-2 min-w-0">
                                                    <p className="truncate text-sm">
                                                        { chat.title }
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-\[var(--muted)]">
                                                        {chat.messages.length}{" "}messages
                                                    </p>
                                                </div>
                                            )} */}
                                            {editingChatId === chat.id ? (
                                                <div
                                                    className="ml-2 min-w-0 flex-1"
                                                >
                                                    <input
                                                        autoFocus
                                                        value={editingTitle}
                                                        onChange={(event) =>
                                                            setEditingTitle(
                                                                event.target.value
                                                            )
                                                        }
                                                        onKeyDown={(event) => {
                                                            if (
                                                                event.key ===
                                                                "Enter"
                                                            ) {
                                                                saveRename(
                                                                    chat.id
                                                                );
                                                            }

                                                            if (
                                                                event.key ===
                                                                "Escape"
                                                            ) {
                                                                cancelRename();
                                                            }
                                                        }}
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                        className="w-full rounded-md border border-\[var(--border)] bg-\[var(--background)] px-2 py-1 text-sm outline-none focus:border-zinc-400"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`
                                                        ml-2
                                                        min-w-0
                                                        ${
                                                            collapsed
                                                                ? "md:hidden"
                                                                : ""
                                                        }
                                                    `}
                                                >
                                                    <p className="truncate text-sm">
                                                        {chat.title}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-\[var(--muted)]">
                                                        {chat.messages.length} messages
                                                    </p>
                                                </div>
                                            )}                                        </button>

                                        {editingChatId === chat.id ? (
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    saveRename( chat.id );
                                                }}
                                                className="rounded-lg p-1.5 text-green-600 transition hover:bg-green-500/10"
                                                aria-label="Save chat name"
                                            >
                                                <Check
                                                    size={15}
                                                />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        startRename(chat);
                                                    }}
                                                    className={`
                                                    rounded-lg
                                                    p-1.5
                                                    text-\[var(--muted)]
                                                    transition
                                                    hover:bg-\[var(--surface-hover)]
                                                    hover:text-\[var(--foreground)]
                                                    ${
                                                        collapsed
                                                            ? "hidden"
                                                            : "opacity-0 group-hover:opacity-100"
                                                    }
                                                `}
                                                aria-label="Rename chat"
                                            >
                                                <Pencil
                                                    size={15}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    // onDeleteChat( chat.id );
                                                    setDeleteChatId( chat.id );
                                                }}
                                                className={`
                                                    rounded-lg
                                                    p-1.5
                                                    text-\[var(--muted)]
                                                    transition
                                                    hover:bg-red-500/10
                                                    hover:text-red-500
                                                    ${
                                                        collapsed
                                                            ? "hidden"
                                                            : "opacity-0 group-hover:opacity-100"
                                                    }
                                                `}
                                                aria-label="Delete chat"
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </>
                                    )}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>

                {/* Settings */}
                <div
                    className={`
                        shrink-0
                        border-t
                        border-\[var(--border)]
                        p-3

                        ${
                            collapsed
                                ? "md:px-2"
                                : ""
                        }
                    `}
                >
                    <button
                        type="button"
                        className={`
                            flex
                            h-10
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            text-sm
                            text-\[var(--muted)]
                            transition
                            hover:bg-\[var(--surface-hover)]
                            hover:text-\[var(--foreground)]

                            ${
                                collapsed
                                    ? "justify-center px-0"
                                    : ""
                            }
                        `}
                        title={
                            collapsed
                                ? "Settings"
                                : undefined
                        }
                    >
                        <Settings
                            size={17}
                        />

                        <span
                            className={
                                collapsed
                                    ? "md:hidden"
                                    : ""
                            }
                        >
                            Settings
                        </span>
                    </button>
                </div>
                {deleteChatId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-2xl">
                            <h2 className="text-base font-semibold">
                                Delete conversation?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                This conversation will be permanently
                                removed from your local chat history.
                            </p>

                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        cancelDeleteChat
                                    }
                                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-hover)]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        confirmDeleteChat
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}