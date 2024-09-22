require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

const app = express();
app.use(express.json());

const fb_config = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJ_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MSG_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASURE_ID
};

const fb_app = initializeApp(fb_config);
const fb_db = getDatabase(fb_app);

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
    console.log("Create post request received"); // Log when request is received

    const password = req.query.password;
    const title = req.query.title;
    const content = req.query.content;

    if (password === process.env.ADMIN_PASSWORD) {
        console.log("Password correct, proceeding to create post...");

        const postRef = ref(fb_db, "posts/" + Date.now());
        set(postRef, {
            title: title,
            content: content
        })
        .then(() => {
            console.log("Post created successfully");
            res.send("Post created successfully.");
        })
        .catch((err) => {
            console.error("Error creating post:", err);
            res.status(500).send("Error creating post.");
        });
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