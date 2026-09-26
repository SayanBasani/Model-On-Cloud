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
    collapsed: boolean;

    onClose: () => void;
    onCollapsedChange: (
        collapsed: boolean
    ) => void;

    onNewChat: () => void;
    onSelectChat: (
        id: string
    ) => void;
    onDeleteChat: (
        id: string
    ) => void;
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
    onDeleteChat
}: SidebarProps) {
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
                    {/* {!collapsed && (
                        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-\[var(--muted)]">
                            Recent chats
                        </p>
                    )} */}
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
                        {/* {chats.length === 0 ? (
                            !collapsed && (
                                <div className="px-2 py-6 text-center text-sm text-\[var(--muted)]">
                                    No conversations yet.
                                </div>
                            )
                        ) : ( */}
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
                                No conversations yet.
                            </div>
                        ) : (
                            chats.map(
                                (chat) => (
                                    <div
                                        key={
                                            chat.id
                                        }
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
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteChat(
                                                    chat.id
                                                )
                                            }
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
            </aside>
        </>
    );
}