require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.get("*", (req, res) => {
    const filePath = path.join(process.cwd(), 'index.html');
    fs.readFile(filePath, (err, file) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(file);
    });
});

app.listen(80, err => {
    if (err) console.log(err);
    console.log("Listening on port 80"); 
});
