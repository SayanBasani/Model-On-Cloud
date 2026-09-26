import { NextRequest, NextResponse } from "next/server";

const MODEL = "@cf/meta/llama-3.2-1b-instruct";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        let messages = body.messages;

        if (
            !Array.isArray(messages) &&
            typeof body.message === "string"
        ) {
            messages = [
                {
                    role: "user",
                    content: body.message
                }
            ];
        }

        if (
            !Array.isArray(messages) ||
            messages.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "message or messages is required"
                },
                {
                    status: 400
                }
            );
        }

        messages = messages
            .filter(
                (message: {
                    role?: string;
                    content?: string;
                }) =>
                    message &&
                    typeof message.content === "string" &&
                    (
                        message.role === "user" ||
                        message.role === "assistant" ||
                        message.role === "system"
                    )
            )
            .slice(-20);

        const accountId =
            process.env.CLOUDFLARE_ACCOUNT_ID;

        const apiToken =
            process.env.CLOUDFLARE_API_TOKEN;

        if (!accountId) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "CLOUDFLARE_ACCOUNT_ID is not configured"
                },
                {
                    status: 500
                }
            );
        }

        if (!apiToken) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "CLOUDFLARE_API_TOKEN is not configured"
                },
                {
                    status: 500
                }
            );
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages,
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.9
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                "Cloudflare AI error:",
                data
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        data?.errors?.[0]?.message ||
                        "Cloudflare AI request failed"
                },
                {
                    status: response.status
                }
            );
        }

        return NextResponse.json({
            success: true,
            answer: data?.result?.response || "",
            model: MODEL
        });
    } catch (error) {
        console.error(
            "Chat API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "AI generation failed"
            },
            {
                status: 500
            }
        );
    }
}