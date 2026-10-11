const dotenv = require("dotenv");

dotenv.config();

const env = {

    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,

};

module.exports = env;