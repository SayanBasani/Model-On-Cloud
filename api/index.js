import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());


app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        status: "healthy",
        service: "Model On Cloud"
    });

});


app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;


        if (!message) {

            return res.status(400).json({
                success: false,
                error: "message is required"
            });

        }


        /*
         * AI MODEL WILL BE CONNECTED HERE
         */

        const answer =
            "The AI model will be connected here.";


        return res.status(200).json({

            success: true,

            answer

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: "Internal server error"

        });

    }

});


export default app;