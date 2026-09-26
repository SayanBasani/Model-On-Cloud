"use client";

import {
    Bot,
    Check,
    Copy,
    User
} from "lucide-react";

import { useState } from "react";

import { Message } from "@/lib/types";

type MessageBubbleProps = {
    message: Message;
};

export default function MessageBubble({
    message
}: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);

    const isUser = message.role === "user";

    async function copyMessage() {
        await navigator.clipboard.writeText(
            message.content
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }

    return (
        <div
            className={`flex w-full ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`flex max-w-[90%] gap-3 md:max-w-[80%] ${
                    isUser
                        ? "flex-row-reverse"
                        : "flex-row"
                }`}
            >
                <div
                    className={`
                        flex h-8 w-8 shrink-0 items-center
                        justify-center rounded-lg
                        ${
                            isUser
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                : "border border-[var(--border)] bg-[var(--surface)]"
                        }
                    `}
                >
                    {isUser ? (
                        <User size={16} />
                    ) : (
                        <Bot size={16} />
                    )}
                </div>

                <div
                    className={`
                        min-w-0 rounded-2xl px-4 py-3
                        ${
                            isUser
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                : "border border-[var(--border)] bg-[var(--surface)]"
                        }
                    `}
                >
                    <div className="whitespace-pre-wrap break-words text-sm leading-7">
                        {message.content}
                    </div>

                    {!isUser && (
                        <div className="mt-3 flex border-t border-[var(--border)] pt-2">
                            <button
                                type="button"
                                onClick={copyMessage}
                                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                            >
                                {copied ? (
                                    <>
                                        <Check size={13} />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={13} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}