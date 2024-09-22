require("dotenv").config();
const express = require("express")
const fs = require("node:fs")

const app = express();
app.use(express.json());

app.get("*",async(req, res) => {
    let p = path.join(process.cwd(), 'index.html');
    let file = fs.readFileSync(p);
    res.send(file);
});

app.listen(80, function(err)
{
   if(err) console.log(err);
   console.log("Listening on port 80"); 
});