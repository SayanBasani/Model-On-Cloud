import {
    NextRequest
} from "next/server";

const MODEL =
    "@cf/meta/llama-3.2-1b-instruct";

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            await request.json();

        let messages =
            body?.messages;

        if (
            !Array.isArray(
                messages
            ) &&
            typeof body?.message ===
                "string"
        ) {
            messages = [
                {
                    role: "user",
                    content:
                        body.message
                }
            ];
        }

        if (
            !Array.isArray(
                messages
            ) ||
            messages.length === 0
        ) {
            return Response.json(
                {
                    success: false,
                    error:
                        "message or messages is required"
                },
                {
                    status: 400
                }
            );
        }

        const accountId =
            process.env
                .CLOUDFLARE_ACCOUNT_ID;

        const apiToken =
            process.env
                .CLOUDFLARE_API_TOKEN;

        if (!accountId) {
            return Response.json(
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
            return Response.json(
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

        const safeMessages =
            messages
                .filter(
                    (
                        message
                    ) =>
                        message &&
                        typeof message.content ===
                            "string" &&
                        [
                            "system",
                            "user",
                            "assistant"
                        ].includes(
                            message.role
                        )
                )
                .slice(-20);

        const response =
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
                {
                    method:
                        "POST",

                    headers: {
                        Authorization:
                            `Bearer ${apiToken}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {
                                messages:
                                    safeMessages,

                                stream:
                                    true,

                                max_tokens:
                                    1024,

                                temperature:
                                    0.6,

                                top_p:
                                    0.9
                            }
                        )
                }
            );

        if (!response.ok) {
            const errorText =
                await response.text();

            console.error(
                "Cloudflare AI error:",
                errorText
            );

            return Response.json(
                {
                    success: false,
                    error:
                        "Cloudflare AI request failed"
                },
                {
                    status:
                        response.status
                }
            );
        }

        if (!response.body) {
            return Response.json(
                {
                    success: false,
                    error:
                        "AI returned no stream"
                },
                {
                    status: 502
                }
            );
        }

        return new Response(
            response.body,
            {
                status: 200,

                headers: {
                    "Content-Type":
                        "text/event-stream",

                    "Cache-Control":
                        "no-cache, no-transform",

                    Connection:
                        "keep-alive"
                }
            }
        );
    } catch (error) {
        console.error(
            "Chat API error:",
            error
        );

        return Response.json(
            {
                success: false,
                error:
                    "AI request failed"
            },
            {
                status: 500
            }
        );
    }
}