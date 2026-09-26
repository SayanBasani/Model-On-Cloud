"use client";

import {
    Menu,
    Moon,
    Sun,
    PanelLeft,
    PanelLeftClose
} from "lucide-react";

type HeaderProps = {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    darkMode: boolean;
    onToggleTheme: () => void;
};

export default function Header({
    sidebarOpen,
    sidebarCollapsed,
    onToggleSidebar,
    darkMode,
    onToggleTheme
}: HeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 md:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={
                        onToggleSidebar
                    }
                    className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                    aria-label={
                        sidebarCollapsed
                            ? "Open sidebar"
                            : "Collapse sidebar"
                    }
                >
                    <span className="hidden md:block">
                        {sidebarCollapsed ? (
                            <PanelLeft
                                size={19}
                            />
                        ) : (
                            <PanelLeftClose
                                size={19}
                            />
                        )}
                    </span>

                    <span className="block md:hidden">
                        {sidebarOpen ? (
                            <PanelLeftClose
                                size={19}
                            />
                        ) : (
                            <Menu
                                size={19}
                            />
                        )}
                    </span>
                </button>

                <div>
                    <p className="text-sm font-semibold">
                        ModelOnCloud
                    </p>

                    <p className="text-xs text-[var(--muted)]">
                        Llama 3.2 1B
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={
                    onToggleTheme
                }
                className="rounded-xl p-2.5 text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                aria-label="Toggle theme"
            >
                {darkMode ? (
                    <Sun size={19} />
                ) : (
                    <Moon size={19} />
                )}
            </button>
        </header>
    );
}