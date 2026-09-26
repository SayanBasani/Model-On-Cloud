"use client";

import {
    Bot,
    Check,
    Copy,
    Pencil,
    RefreshCw,
    User
} from "lucide-react";

import {
    useState
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Message } from "@/lib/types";

type MessageBubbleProps = {
    message: Message;
    onEdit?: (
        message: Message
    ) => void;
    onRegenerate?: (
        message: Message
    ) => void;
    isLoading?: boolean;
};

export default function MessageBubble({
    message,
    onEdit,
    onRegenerate,
    isLoading = false
}: MessageBubbleProps) {
    const [copied, setCopied] =
        useState(false);

    const isUser =
        message.role === "user";

    async function copyMessage() {
        try {
            await navigator.clipboard.writeText(
                message.content
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div
            className={`group flex w-full ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`flex max-w-[95%] gap-3 md:max-w-[85%] ${
                    isUser
                        ? "flex-row-reverse"
                        : "flex-row"
                }`}
            >
                <div
                    className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
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
                    {isUser ? (
                        <div className="whitespace-pre-wrap break-words text-sm leading-7">
                            {message.content}
                        </div>
                    ) : (
                        <div className="markdown-content max-w-none break-words">
                            <ReactMarkdown
                                remarkPlugins={[
                                    remarkGfm
                                ]}
                                components={{
                                    h1({
                                        children
                                    }) {
                                        return (
                                            <h1 className="mb-3 mt-5 text-xl font-semibold first:mt-0">
                                                {children}
                                            </h1>
                                        );
                                    },

                                    h2({
                                        children
                                    }) {
                                        return (
                                            <h2 className="mb-3 mt-5 text-lg font-semibold first:mt-0">
                                                {children}
                                            </h2>
                                        );
                                    },

                                    h3({
                                        children
                                    }) {
                                        return (
                                            <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">
                                                {children}
                                            </h3>
                                        );
                                    },

                                    p({
                                        children
                                    }) {
                                        return (
                                            <p className="my-2 leading-7 first:mt-0 last:mb-0">
                                                {children}
                                            </p>
                                        );
                                    },

                                    ul({
                                        children
                                    }) {
                                        return (
                                            <ul className="my-3 list-disc space-y-1 pl-6">
                                                {children}
                                            </ul>
                                        );
                                    },

                                    ol({
                                        children
                                    }) {
                                        return (
                                            <ol className="my-3 list-decimal space-y-1 pl-6">
                                                {children}
                                            </ol>
                                        );
                                    },

                                    li({
                                        children
                                    }) {
                                        return (
                                            <li className="leading-7">
                                                {children}
                                            </li>
                                        );
                                    },

                                    blockquote({
                                        children
                                    }) {
                                        return (
                                            <blockquote className="my-3 border-l-2 border-zinc-400 pl-4 text-[var(--muted)]">
                                                {children}
                                            </blockquote>
                                        );
                                    },

                                    a({
                                        href,
                                        children
                                    }) {
                                        return (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline underline-offset-2 hover:opacity-70"
                                            >
                                                {children}
                                            </a>
                                        );
                                    },

                                    strong({
                                        children
                                    }) {
                                        return (
                                            <strong className="font-semibold">
                                                {children}
                                            </strong>
                                        );
                                    },

                                    code({
                                        children,
                                        className
                                    }) {
                                        const isInline =
                                            !className;

                                        if (
                                            isInline
                                        ) {
                                            return (
                                                <code className="rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--foreground)]">
                                                    {
                                                        children
                                                    }
                                                </code>
                                            );
                                        }

                                        return (
                                            // <code
                                            //     className={`block overflow-x-auto p-4 font-mono text-sm leading-6 !text-[var(--code-text)] ${className || ""}`}
                                            // >
                                            <code
                                                className={`block overflow-x-auto whitespace-pre p-4 font-mono text-sm leading-6 !text-[var(--code-text)] ${className || ""}`}
>
                                                {
                                                    children
                                                }
                                            </code>
                                        );
                                    },

                                    pre({
                                        children
                                    }) {
                                        return (
                                            <CodeBlock>
                                                {
                                                    children
                                                }
                                            </CodeBlock>
                                        );
                                    },

                                    hr() {
                                        return (
                                            <hr className="my-4 border-[var(--border)]" />
                                        );
                                    },

                                    table({
                                        children
                                    }) {
                                        return (
                                            <div className="my-4 overflow-x-auto rounded-lg border border-[var(--border)]">
                                                <table className="w-full border-collapse text-sm">
                                                    {children}
                                                </table>
                                            </div>
                                        );
                                    },

                                    th({
                                        children
                                    }) {
                                        return (
                                            <th className="border-b border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-left font-semibold">
                                                {children}
                                            </th>
                                        );
                                    },

                                    td({
                                        children
                                    }) {
                                        return (
                                            <td className="border-b border-[var(--border)] px-3 py-2">
                                                {children}
                                            </td>
                                        );
                                    }
                                }}
                            >
                                {
                                    message.content
                                }
                            </ReactMarkdown>
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-1 border-t border-[var(--border)] pt-2">
                        <button
                            type="button"
                            onClick={
                                copyMessage
                            }
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                        >
                            {copied ? (
                                <>
                                    <Check
                                        size={
                                            13
                                        }
                                    />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy
                                        size={
                                            13
                                        }
                                    />
                                    Copy
                                </>
                            )}
                        </button>

                        {isUser &&
                            onEdit && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(
                                            message
                                        )
                                    }
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                                >
                                    <Pencil
                                        size={
                                            13
                                        }
                                    />
                                    Edit
                                </button>
                            )}

                        {!isUser &&
                            onRegenerate && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRegenerate(
                                            message
                                        )
                                    }
                                    disabled={
                                        isLoading
                                    }
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:opacity-40"
                                >
                                    <RefreshCw
                                        size={
                                            13
                                        }
                                    />
                                    Regenerate
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CodeBlock({
    children
}: {
    children: React.ReactNode;
}) {
    const [copied, setCopied] =
        useState(false);

    let code = "";

    if (
        children &&
        typeof children === "object" &&
        "props" in children
    ) {
        const child =
            children as React.ReactElement<{
                children?: React.ReactNode;
            }>;

        code = String(
            child.props.children ?? ""
        ).replace(/\n$/, "");
    }

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(
                code
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div className="code-block my-4 overflow-hidden rounded-xl border">
            <div className="code-header flex items-center justify-between border-b px-3 py-2">
                <span className="text-xs font-medium">
                    Code
                </span>

                <button
                    type="button"
                    onClick={copyCode}
                    className="code-copy-button flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition"
                >
                    {copied ? (
                        <>
                            <Check
                                size={13}
                            />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy
                                size={13}
                            />
                            Copy
                        </>
                    )}
                </button>
            </div>

            {children}
        </div>
    );
}