import { pipeline } from "@huggingface/transformers";

let generator = null;

async function getGenerator() {

    if (!generator) {

        console.log("Loading Qwen2.5-1.5B-Instruct...");

        generator = await pipeline(
            "text-generation",
            "onnx-community/Qwen2.5-1.5B-Instruct",
            {
                dtype: "q4"
            }
        );

        console.log("Model loaded successfully.");

    }

    return generator;
}

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    }

    try {

        const { message } = req.body || {};

        if (!message || typeof message !== "string") {

            return res.status(400).json({
                success: false,
                error: "message is required"
            });

        }

        const model = await getGenerator();

        const messages = [
            {
                role: "system",
                content: "You are a helpful AI assistant."
            },
            {
                role: "user",
                content: message
            }
        ];

        const output = await model(messages, {
            max_new_tokens: 256,
            do_sample: false
        });

        let answer = "";

        if (
            output &&
            output[0] &&
            output[0].generated_text
        ) {

            const generated = output[0].generated_text;

            if (Array.isArray(generated)) {

                const lastMessage = generated[generated.length - 1];

                answer = lastMessage?.content || "";

            } else {

                answer = generated;

            }

        }

        return res.status(200).json({
            success: true,
            answer: answer
        });

    } catch (error) {

        console.error("AI error:", error);

        return res.status(500).json({
            success: false,
            error: error.message || "AI generation failed"
        });

    }

}