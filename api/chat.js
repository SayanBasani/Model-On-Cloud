import "dotenv/config";

const MODEL = "@cf/meta/llama-3.2-1b-instruct";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const body = req.body || {};

        let messages = body.messages;

        if (!Array.isArray(messages) && typeof body.message === "string") {
            messages = [
                {
                    role: "user",
                    content: body.message
                }
            ];
        }

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                error: "message or messages is required"
            });
        }

        messages = messages
            .filter(message =>
                message &&
                typeof message.content === "string" &&
                (
                    message.role === "user" ||
                    message.role === "assistant" ||
                    message.role === "system"
                )
            )
            .slice(-20);

        const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
        const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

        if (!ACCOUNT_ID) {
            return res.status(500).json({
                success: false,
                error: "CLOUDFLARE_ACCOUNT_ID is not configured"
            });
        }

        if (!API_TOKEN) {
            return res.status(500).json({
                success: false,
                error: "CLOUDFLARE_API_TOKEN is not configured"
            });
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
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
            console.error("Cloudflare AI error:", data);

            return res.status(response.status).json({
                success: false,
                error:
                    data?.errors?.[0]?.message ||
                    "Cloudflare AI request failed"
            });
        }

        return res.status(200).json({
            success: true,
            answer: data?.result?.response || "",
            model: MODEL
        });

    } catch (error) {
        console.error("AI generation error:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "AI generation failed"
        });
    }
}