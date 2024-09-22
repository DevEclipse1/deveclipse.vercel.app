require("dotenv").config();
const express = require("express")

const app = express();
app.use(express.json());

app.get("*",async(req, res) => {
    res.send("Hello, World!");
});

app.listen(80, function(err)
{
   if(err) console.log(err);
   console.log("Listening on port 80"); 
});