export async function readAIStream(
    response: Response,
    onToken: (token: string) => void,
    signal?: AbortSignal
) {
    if (!response.body) {
        throw new Error(
            "Response does not contain a stream."
        );
    }

    const reader =
        response.body.getReader();

    const decoder =
        new TextDecoder();

    let buffer = "";

    try {
        while (true) {
            if (signal?.aborted) {
                await reader.cancel();
                return;
            }

            const { value, done } =
                await reader.read();

            if (done) {
                break;
            }

            if (signal?.aborted) {
                await reader.cancel();
                return;
            }

            buffer += decoder.decode(
                value,
                {
                    stream: true
                }
            );

            const events =
                buffer.split("\n");

            buffer =
                events.pop() || "";

            for (const event of events) {
                if (signal?.aborted) {
                    await reader.cancel();
                    return;
                }

                const line =
                    event.trim();

                if (
                    !line ||
                    !line.startsWith("data:")
                ) {
                    continue;
                }

                const payload =
                    line
                        .slice(5)
                        .trim();

                if (
                    payload === "[DONE]"
                ) {
                    return;
                }

                try {
                    const parsed =
                        JSON.parse(
                            payload
                        );

                    const token =
                        parsed?.response ??
                        parsed?.result
                            ?.response ??
                        parsed?.text ??
                        "";

                    if (
                        typeof token ===
                            "string" &&
                        token
                    ) {
                        if (
                            signal?.aborted
                        ) {
                            await reader.cancel();
                            return;
                        }

                        onToken(token);
                    }
                } catch {
                    // Ignore incomplete SSE JSON.
                }
            }
        }
    } finally {
        try {
            reader.releaseLock();
        } catch {
            // Reader already released.
        }
    }
}