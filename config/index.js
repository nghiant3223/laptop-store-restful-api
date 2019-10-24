const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    db: {
        url: process.env.DB_URL,
        // sync: "force"
    },
    facebook: {
        clientId: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        options: { session: false }
    },
    cors: {
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        exposedHeaders: ["x-auth-token"]
    },
    jwt: {
        secret: "fucking_secret",
        lifetime: "240000h"
    }
};
