import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());

app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


app.get("/api/health", (req, res) => {

    res.json({
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
         * AI MODEL WILL BE CONNECTED HERE.
         *
         * Example:
         *
         * const answer = await model(message);
         */


        const answer =
            "The AI model will be connected here.";


        res.json({

            success: true,

            answer

        });

    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            error: "Internal server error"

        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});