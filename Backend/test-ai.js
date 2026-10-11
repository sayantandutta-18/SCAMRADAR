require("dotenv").config();

const { analyzeScamMessage } = require("./src/services/ai.service");

const test = async () => {
  try {
    const result = await analyzeScamMessage(
      "Your KYC has expired. Click this link immediately or your bank account will be blocked."
    );

    console.log("AI RESULT:");
    console.log(result);
  } catch (error) {
    console.error("AI TEST ERROR:", error.message);
  }
};

test();