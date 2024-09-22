require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const credentials = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    const filePath = path.join(process.cwd(), 'index.html');
    fs.readFile(filePath, 'utf8', (err, file) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.type('html').send(file);
    });
});

app.get("/dashboard", (req, res) => {
    const password = req.query.password;
    if (password === process.env.ADMIN_PASSWORD) {
        const filePath = path.join(process.cwd(), 'dashboard.html');
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.type('html').send(file);
        });
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get("/create_post", async (req, res) => {
    const password = req.query.password;
    const title = req.query.title;
    const content = req.query.content;

    if (password === process.env.ADMIN_PASSWORD) {
        
    } else {
        res.status(403).send("Forbidden");
    }
});

const PORT = 80
app.listen(PORT, (err) => {
    if (err) {
        console.error("Server error:", err);
    } else {
        console.log(`Listening on port ${PORT}`);
    }
});