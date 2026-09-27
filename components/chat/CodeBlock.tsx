"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
    code: string;
    language?: string;
};

export default function CodeBlock({
    code,
    language = "text"
}: CodeBlockProps) {
    const [copied, setCopied] =
        useState(false);

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

    const normalizedLanguage =
        language
            .replace(/^language-/, "")
            .toLowerCase();

    return (
        <div className="code-block my-4 overflow-hidden rounded-xl border border-[var(--code-border)]">
            <div className="code-header flex items-center justify-between border-b border-[var(--code-border)] px-3 py-2">
                <span className="text-xs font-medium text-[var(--code-muted)]">
                    {normalizedLanguage === "text"
                        ? "Code"
                        : normalizedLanguage.toUpperCase()}
                </span>

                <button
                    type="button"
                    onClick={copyCode}
                    className="code-copy-button flex items-center gap-1.5 rounded-md px-2 py-1 text-xs"
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

            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={
                        normalizedLanguage === "text"
                            ? "text"
                            : normalizedLanguage
                    }
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        background:
                            "var(--code-background)",
                        padding: "1rem",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        whiteSpace: "pre",
                        overflowX: "auto"
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        }
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}