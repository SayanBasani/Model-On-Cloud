const API_URL = "https://model-on-cloud.vercel.app";

async function askAI(message) {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })
    });

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    const data = await response.json();

    return data.answer;
}


async function main() {
    while(True)
        {
            try {
                const answer = await askAI(
                    "Explain artificial intelligence in simple words."
                );

                console.log("AI:", answer);

            } catch (error) {
                console.error("Error:", error.message);
            }
        }
}


main();