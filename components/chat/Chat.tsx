"use client";

import { useEffect, useState } from "react";

import { Message } from "@/lib/types";

import {
    loadChats,
    saveChats
} from "@/lib/storage";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

type ChatProps = {
    activeChatId: string;
    onChatsChanged: () => void;
};

export default function Chat({
    activeChatId,
    onChatsChanged
}: ChatProps) {
    const [messages, setMessages] =
        useState<Message[]>([]);

    const [input, setInput] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    useEffect(() => {
        const chats = loadChats();

        const chat = chats.find(
            (item) => item.id === activeChatId
        );

        setMessages(
            chat?.messages || []
        );
    }, [activeChatId]);

    async function sendMessage() {
        const content = input.trim();

        if (!content || isLoading) {
            return;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content,
            createdAt: Date.now()
        };

        const updatedMessages = [
            ...messages,
            userMessage
        ];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        messages:
                            updatedMessages.map(
                                (message) => ({
                                    role:
                                        message.role,
                                    content:
                                        message.content
                                })
                            )
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        "Request failed"
                );
            }

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    data.answer ||
                    "I couldn't generate a response.",
                createdAt: Date.now()
            };

            const finalMessages = [
                ...updatedMessages,
                assistantMessage
            ];

            setMessages(finalMessages);

            const chats = loadChats();

            const chatIndex =
                chats.findIndex(
                    (chat) =>
                        chat.id === activeChatId
                );

            if (chatIndex !== -1) {
                chats[chatIndex].messages =
                    finalMessages;

                chats[chatIndex].updatedAt =
                    Date.now();

                saveChats(chats);

                onChatsChanged();
            }
        } catch (error) {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    error instanceof Error
                        ? `Error: ${error.message}`
                        : "Something went wrong.",
                createdAt: Date.now()
            };

            setMessages([
                ...updatedMessages,
                errorMessage
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
                    {messages.length === 0 ? (
                        <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                <span className="text-xl font-bold">
                                    M
                                </span>
                            </div>

                            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                How can I help you?
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                                Ask ModelOnCloud anything.
                                Your conversation is powered
                                by Cloudflare Workers AI.
                            </p>

                            <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                                {[
                                    "Explain AI in simple words",
                                    "Write a Java program",
                                    "Help me learn DSA",
                                    "Explain how APIs work"
                                ].map(
                                    (prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() =>
                                                setInput(
                                                    prompt
                                                )
                                            }
                                            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left text-sm transition hover:bg-[var(--surface-hover)]"
                                        >
                                            {prompt}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(
                                (message) => (
                                    <MessageBubble
                                        key={
                                            message.id
                                        }
                                        message={
                                            message
                                        }
                                    />
                                )
                            )}

                            {isLoading && (
                                <TypingIndicator />
                            )}
                        </>
                    )}
                </div>
            </div>

            <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}