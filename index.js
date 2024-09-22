require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

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
        fs.writeFile(title+".html",content,(err) => {
            if(err)
            {
                res.json({
                    "code":"failed",
                    "message":err.message
                });

                return;
            }
            else
            {
                res.json({
                    "code":"success",
                    "message":"sucessfully created post",
                    "title":title,
                    "content":content
                });
            }
        });
    } else {
        res.status(403).send("Forbidden");
    }
});

app.listen(80, err => {
    if (err) console.log(err);
    console.log("Listening on port 80");
});