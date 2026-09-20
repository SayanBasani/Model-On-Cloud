import { pipeline, env } from "@huggingface/transformers";

env.cacheDir = "/tmp/transformers-cache";

let generator = null;

async function getGenerator() {

    if (!generator) {

        generator = await pipeline(
            "text-generation",
            "onnx-community/SmolLM-135M-Instruct-ONNX",
            {
                dtype: "q4"
            }
        );

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

        const output = await model(message, {
            max_new_tokens: 64,
            do_sample: false
        });

        const answer =
            output?.[0]?.generated_text || "";

        return res.status(200).json({
            success: true,
            answer
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message || "AI generation failed"
        });

    }

}