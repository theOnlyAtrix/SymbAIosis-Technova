import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // ✅ needed for OpenAI HTTP call

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
    res.send("✅ SymbAIosis backend running properly");
});

// ✅ Main route: generate company blueprint
app.post("/api/generateBlueprint", async (req, res) => {
    try {
        const { companyName, description, goals, companyEmails } = req.body;

        // Validation (simplified + clear)
        if (!companyName || !description || !goals) {
            console.error("❌ Missing essential company data:", req.body);
            return res.status(400).json({ error: "Missing essential company data" });
        }

        // ✅ Construct clean prompt
        const prompt = `
You are a business architect AI. 
Generate a structured, step-by-step blueprint that explains each stage in clear, actionable language. 
Do not start with 'Sure' or 'Here is the blueprint' — begin directly with the first step.

Company Name: ${companyName}
Description: ${description}
Goals: ${goals}
${companyEmails && companyEmails.length > 0 ? `Team Emails: ${companyEmails.join(", ")}` : ""}
`;

        console.log("🧩 Generating blueprint for:", companyName);

        // ✅ Call OpenAI endpoint properly
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // ✅ reliable model name
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a strategic AI architect that creates business blueprints in concise, clear steps.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        // ✅ Handle possible API errors
        if (!response.ok) {
            console.error("❌ OpenAI API error:", data);
            return res.status(500).json({
                error: data.error?.message || "OpenAI API error",
                details: data,
            });
        }

        // ✅ Check if a valid response exists
        const blueprint = data.choices?.[0]?.message?.content;
        if (!blueprint) {
            console.error("❌ Invalid OpenAI response:", data);
            return res.status(400).json({ error: "Failed to generate blueprint" });
        }

        console.log("✅ Blueprint generated successfully");
        res.json({ blueprint });
    } catch (err) {
        console.error("🔥 Backend error in /generateBlueprint:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});