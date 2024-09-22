require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const firebase = require("firebase-admin")

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FB_PROJ_ID,
    "private_key_id": process.env.FB_PRIVATE_KEY_ID,
    "private_key": process.env.FB_PRIVATE_KEY,
    "client_email": process.env.FB_CLIENT_EMAIL,
    "client_id": process.env.FB_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FB_CLIENT_CERT_URL
};
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://deveclipse-5ad77-default-rtdb.europe-west1.firebasedatabase.app"
});
const db = firebase.firestore();
console.log(db);

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
        try {
            const newPost = {
                title: title,
                content: content,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            const docRef = await db.collection("posts").add(newPost);
            res.status(200).send(`Post created with ID: ${docRef.id}`);
        } catch (error) {
            res.status(500).send("Error creating post: " + error.message);
        }
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