"use client";

import { readAIStream } from "@/lib/stream";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/lib/types";
import { loadChats, saveChats } from "@/lib/storage";
import { createChatTitle } from "@/lib/message-utils";
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

    const [error, setError] =
        useState<string | null>(null);

    const bottomRef =
        useRef<HTMLDivElement>(null);
        
    const abortControllerRef =
        useRef<AbortController | null>(
            null
        );
    const generationIdRef = useRef<string | null>(null);

    function stopGeneration() {
        generationIdRef.current =
            null;

        abortControllerRef.current?.abort();

        abortControllerRef.current =
            null;

        setIsLoading(false);
    }

    useEffect(() => {
        const chats = loadChats();

        const chat = chats.find(
            (item) =>
                item.id === activeChatId
        );

        setMessages(
            chat?.messages || []
        );

        setInput("");
        setError(null);
    }, [activeChatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [
        messages,
        isLoading
    ]);

    function updateChat(
        updatedMessages: Message[]
    ) {
        const chats = loadChats();

        const chatIndex =
            chats.findIndex(
                (chat) =>
                    chat.id === activeChatId
            );

        if (chatIndex === -1) {
            return;
        }

        const chat = chats[chatIndex];

        if (
            chat.title ===
            "New conversation"
        ) {
            const firstUserMessage =
                updatedMessages.find(
                    (message) =>
                        message.role ===
                        "user"
                );

            if (firstUserMessage) {
                chat.title =
                    createChatTitle(
                        firstUserMessage.content
                    );
            }
        }

        chat.messages =
            updatedMessages;

        chat.updatedAt =
            Date.now();

        chats.splice(
            chatIndex,
            1
        );

        chats.unshift(chat);

        saveChats(chats);

        onChatsChanged();
    }

    async function requestAI(
        conversation: Message[]
    ) {
        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        messages:
                            conversation.map(
                                (
                                    message
                                ) => ({
                                    role:
                                        message.role,
                                    content:
                                        message.content
                                })
                            )
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error ||
                    "AI request failed"
            );
        }

        return data.answer || "";
    }

    async function sendMessage() {
        const content = input.trim();

        if (!content || isLoading) {
            return;
        }

        setError(null);

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

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const generationId = crypto.randomUUID();
        generationIdRef.current = generationId;

        try {
            const response =
                await fetch(
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
                        }),
                        signal:
                            controller.signal
                    }
                );

            if (!response.ok) {
                let errorMessage =
                    "AI request failed.";

                try {
                    const data =
                        await response.json();

                    errorMessage =
                        data?.error ||
                        errorMessage;
                } catch {
                    // Ignore JSON parsing errors.
                }

                throw new Error(
                    errorMessage
                );
            }

            let answer = "";

            const assistantId =
                crypto.randomUUID();

            const streamingMessage:
                Message = {
                    id: assistantId,
                    role: "assistant",
                    content: "",
                    createdAt: Date.now()
                };

            setMessages([
                ...updatedMessages,
                streamingMessage
            ]);

            await readAIStream(
                response,
                (token) => {
                    if (
                        generationIdRef.current !==
                        generationId
                    ) {
                        return;
                    }

                    answer += token;

                    setMessages([
                        ...updatedMessages,
                        {
                            ...streamingMessage,
                            content: answer
                        }
                    ]);
                },
                controller.signal
            );

            if (
                generationIdRef.current !==
                generationId
            ) { return; }

            const finalMessages = [
                ...updatedMessages,
                {
                    ...streamingMessage,
                    content:
                        answer ||
                        "I couldn't generate a response."
                }
            ];
            setMessages( finalMessages );
            updateChat( finalMessages );

        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {
                return;
            }

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            if ( generationIdRef.current === generationId ) {
                generationIdRef.current = null;
                abortControllerRef.current = null;
                setIsLoading(false);
            }
        }
    }
    
    function editMessage(
        message: Message
    ) {
        setInput(
            message.content
        );

        const messageIndex =
            messages.findIndex(
                (item) =>
                    item.id ===
                    message.id
            );

        if (messageIndex === -1) {
            return;
        }

        const newMessages =
            messages.slice(
                0,
                messageIndex
            );

        setMessages(
            newMessages
        );

        updateChat(
            newMessages
        );
    }

    async function regenerateResponse(
        message: Message
    ) {
        if (isLoading) {
            return;
        }

        const messageIndex =
            messages.findIndex(
                (item) =>
                    item.id ===
                    message.id
            );

        if (messageIndex === -1) {
            return;
        }

        const previousUserMessage =
            messages
                .slice(0, messageIndex)
                .reverse()
                .find(
                    (item) =>
                        item.role ===
                        "user"
                );

        if (!previousUserMessage) {
            return;
        }

        const conversation =
            messages.slice(
                0,
                messageIndex
            );

        setIsLoading(true);
        setError(null);

        try {
            const answer =
                await requestAI(
                    conversation
                );

            const newAssistantMessage:
                Message = {
                    id:
                        crypto.randomUUID(),
                    role:
                        "assistant",
                    content:
                        answer,
                    createdAt:
                        Date.now()
                };

            const finalMessages = [
                ...conversation,
                newAssistantMessage
            ];

            setMessages(
                finalMessages
            );

            updateChat(
                finalMessages
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to regenerate response."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function retryLastMessage() {
        const lastUserMessage =
            [...messages]
                .reverse()
                .find(
                    (message) =>
                        message.role ===
                        "user"
                );

        if (!lastUserMessage) {
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const answer =
                await requestAI(
                    messages
                );

            const assistantMessage:
                Message = {
                    id:
                        crypto.randomUUID(),
                    role:
                        "assistant",
                    content:
                        answer,
                    createdAt:
                        Date.now()
                };

            const finalMessages = [
                ...messages,
                assistantMessage
            ];

            setMessages(
                finalMessages
            );

            updateChat(
                finalMessages
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Retry failed."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
                    {messages.length ===
                    0 ? (
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
                                    (
                                        prompt
                                    ) => (
                                        <button
                                            key={
                                                prompt
                                            }
                                            type="button"
                                            onClick={() =>
                                                setInput(
                                                    prompt
                                                )
                                            }
                                            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left text-sm transition hover:bg-[var(--surface-hover)]"
                                        >
                                            {
                                                prompt
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(
                                (
                                    message
                                ) => (
                                    <MessageBubble
                                        key={
                                            message.id
                                        }
                                        message={
                                            message
                                        }
                                        onEdit={
                                            message.role ===
                                            "user"
                                                ? editMessage
                                                : undefined
                                        }
                                        onRegenerate={
                                            message.role ===
                                            "assistant"
                                                ? regenerateResponse
                                                : undefined
                                        }
                                        isLoading={
                                            isLoading
                                        }
                                    />
                                )
                            )}

                            {isLoading && (
                                <TypingIndicator />
                            )}

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                    <div className="flex items-center justify-between gap-4">
                                        <span>
                                            {error}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={
                                                retryLastMessage
                                            }
                                            disabled={
                                                isLoading
                                            }
                                            className="shrink-0 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium hover:bg-red-500/10 disabled:opacity-40"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div
                                ref={
                                    bottomRef
                                }
                            />
                        </>
                    )}
                </div>
            </div>

            <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendMessage}
                onStop={ stopGeneration }
                isLoading={ isLoading }
            />
        </div>
    );
}