const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// app.use(express.static(path.join(__dirname, "screenshots")));
console.log(path.join(__dirname, "../renderer/index.html"))
app.use(express.static(path.join(__dirname, "../renderer")));
app.use(express.static(path.join(__dirname, "../screenshots")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "../renderer/index.html"));
})


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
