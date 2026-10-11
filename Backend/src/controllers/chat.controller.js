const { chatWithAI } = require("../services/chat.service");

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await chatWithAI(message);

    return res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process chat request",
    });
  }
};

module.exports = {
  chatController,
};