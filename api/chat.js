export default function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    }


    const { message } = req.body;


    if (!message) {

        return res.status(400).json({
            success: false,
            error: "message is required"
        });

    }


    return res.status(200).json({
        success: true,
        answer: "The AI model will be connected here."
    });

}