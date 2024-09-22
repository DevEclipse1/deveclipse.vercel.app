require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require('url');

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
            res.redirect(url.parse(req.url).pathname);
            res.type('html').send(file);
        });
    } else {
        res.status(403).send("Forbidden");
    }
});

app.listen(3001, err => {
    if (err) console.log(err);
    console.log("Listening on port 3001");
});