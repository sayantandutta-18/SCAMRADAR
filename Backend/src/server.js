const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`ScamRadar server running on port ${env.port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();