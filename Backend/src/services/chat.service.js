const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = async (message) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `
You are ScamRadar AI, a cybersecurity awareness assistant.

Your job is to help users understand suspicious messages, calls,
emails, UPI requests, links, job offers, loan offers and other
possible scams.

Rules:
- Give simple and practical answers.
- Never ask users to share OTPs, passwords, PINs or sensitive information.
- If something looks suspicious, clearly warn the user.
- Explain why it may be a scam.
- Give safe next steps.
- Do not claim certainty when there is insufficient information.
- Keep responses concise.

User message:
"${message}"
`,
  });

  return response.text;
};

module.exports = {
  chatWithAI,
};