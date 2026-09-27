"use client";

import { useEffect, useState } from "react";
import Chat from "@/components/chat/Chat";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { loadChats, saveChats } from "@/lib/storage";
import { Chat as ChatType } from "@/lib/types";

export default function Home() {
    const [ sidebarCollapsed, setSidebarCollapsed ] = useState(false);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    function handleSidebarToggle() {
        if (window.innerWidth >= 768) {
            setSidebarCollapsed(
                (value) => !value
            );
        } else {
            setSidebarOpen(
                (value) => !value
            );
        }
    }

    useEffect(() => {
        setChats(loadChats());
        const storedChats = loadChats();
        setChats(storedChats);

        if (storedChats.length > 0) {
            setActiveChatId(
                storedChats[0].id
            );
        }

        const storedTheme =
            localStorage.getItem(
                "modeloncloud-theme"
            );

        if (storedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add(
                "dark"
            );
        }
    }, []);

    function toggleTheme() {
        const nextTheme = !darkMode;

        setDarkMode(nextTheme);

        if (nextTheme) {
            document.documentElement.classList.add(
                "dark"
            );

            localStorage.setItem(
                "modeloncloud-theme",
                "dark"
            );
        } else {
            document.documentElement.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "modeloncloud-theme",
                "light"
            );
        }
    }

    function createNewChat() {
        const newChat: ChatType = {
            id: crypto.randomUUID(),
            title: "New conversation",
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const updatedChats = [
            newChat,
            ...chats
        ];

        setChats(updatedChats);
        setActiveChatId(newChat.id);

        saveChats(updatedChats);
    }

    function deleteChat(id: string) {
        const updatedChats =
            chats.filter(
                (chat) => chat.id !== id
            );

        setChats(updatedChats);

        saveChats(updatedChats);

        if (activeChatId === id) {
            setActiveChatId(
                updatedChats[0]?.id || null
            );
        }
    }

    function selectChat(id: string) {
        setActiveChatId(id);

        if (
            window.innerWidth < 768
        ) {
            setSidebarOpen(false);
        }
    }

    function refreshChats() { setChats(loadChats());}

    return (
        <main className="flex h-screen overflow-hidden bg-\[var(--background)] text-\[var(--foreground)]">
            <Sidebar
                chats={ chats }
                activeChatId={ activeChatId }
                isOpen={ sidebarOpen }
                collapsed={ sidebarCollapsed }
                onClose={() => setSidebarOpen( false ) }
                onCollapsedChange={ setSidebarCollapsed }
                onNewChat={ createNewChat }
                onSelectChat={ selectChat }
                onDeleteChat={ deleteChat }
                onChatsChanged={refreshChats}
            />

            <section className="flex min-w-0 flex-1 flex-col">
                <Header
                    sidebarOpen={sidebarOpen}
                    sidebarCollapsed={sidebarCollapsed}
                    onToggleSidebar={
                        handleSidebarToggle
                    }
                    darkMode={darkMode}
                    onToggleTheme={
                        toggleTheme
                    }
                />

                {!activeChatId ? (
                    <div className="flex flex-1 items-center justify-center px-6 text-center">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Welcome to ModelOnCloud
                            </h2>

                            <p className="mt-2 text-sm text-\[var(--muted)]">
                                Start a new conversation
                                to begin.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    createNewChat
                                }
                                className="mt-6 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
                            >
                                New chat
                            </button>
                        </div>
                    </div>
                ) : (
                    <Chat
                        activeChatId={
                            activeChatId
                        }
                        // onChatCreated={
                        //     setActiveChatId
                        // }
                        onChatsChanged={
                            refreshChats
                        }
                    />
                )}
            </section>
        </main>
    );
}