import { pipeline, env } from "@huggingface/transformers";

env.cacheDir = "/tmp/transformers-cache";

let generator = null;

async function getGenerator() {

    if (!generator) {

        console.log(
            "Loading Qwen2.5-0.5B-Instruct..."
        );

        generator = await pipeline(
            "text-generation",
            "onnx-community/Qwen2.5-0.5B-Instruct",
            {
                dtype: "q4"
            }
        );

        console.log(
            "Qwen2.5-0.5B-Instruct loaded."
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

        const body = req.body || {};

        let messages = [];


        /*
         * New format:
         *
         * {
         *     "messages": [
         *         {
         *             "role": "user",
         *             "content": "Hello"
         *         }
         *     ]
         * }
         */

        if (Array.isArray(body.messages)) {

            messages = body.messages;

        }


        /*
         * Also support old/simple format:
         *
         * {
         *     "message": "Hello"
         * }
         */

        else if (
            typeof body.message === "string" &&
            body.message.trim()
        ) {

            messages = [
                {
                    role: "user",
                    content: body.message.trim()
                }
            ];

        }
        
        console.log("User Question ");
        console.log(messages);

        if (messages.length === 0) {

            return res.status(400).json({
                success: false,
                error:
                    "message or messages is required"
            });

        }


        /*
         * Keep only valid chat messages.
         * Limit context to the latest 12 messages.
         */

        messages = messages
            .filter(
                message =>
                    message &&
                    typeof message.content === "string" &&
                    (
                        message.role === "user" ||
                        message.role === "assistant" ||
                        message.role === "system"
                    )
            )
            .slice(-12);


        if (messages.length === 0) {

            return res.status(400).json({
                success: false,
                error: "No valid messages found"
            });

        }


        const model =
            await getGenerator();


        const output =
            await model(
                messages,
                {
                    max_new_tokens: 128,
                    do_sample: false
                }
            );


        let answer = "";


        if (output?.[0]?.generated_text) {

            const generated =
                output[0].generated_text;


            if (Array.isArray(generated)) {

                const lastMessage =
                    generated[
                        generated.length - 1
                    ];

                answer =
                    lastMessage?.content || "";

            }

            else {

                answer = generated;

            }

        }

        console.log("Model Output");
        console.log(answer);

        return res.status(200).json({
            success: true,
            answer: answer
        });


    }

    catch (error) {

        console.error(
            "AI generation error:",
            error
        );


        return res.status(500).json({
            success: false,
            error:
                error.message ||
                "AI generation failed"
        });

    }

}