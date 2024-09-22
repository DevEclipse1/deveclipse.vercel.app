require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const firebase = require("firebase-admin")

const firebase_config = {
    apiKey:process.env.FB_API_KEY,
    authDomain:process.env.FB_AUTH_DOMAIN,
    projectId:process.env.FB_PROJ_ID,
    storageBucket:process.env.FB_STORAGE_BUCKET,
    messagingSenderId:process.env.FB_MSG_SENDER_ID,
    appId:process.env.FB_APP_ID,
    measurementId:process.env.FB_MEASURE_ID,
    databaseURL:"https://deveclipse-5ad77-default-rtdb.europe-west1.firebasedatabase.app"
};
firebase.initializeApp(firebase_config);
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

app.get("/create_post", (req, res) => {
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