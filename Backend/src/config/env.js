const dotenv = require("dotenv");

dotenv.config();

const env = {

    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || "scamradar_super_secure_jwt_secret_dev_2026_x89f",
};

module.exports = env;