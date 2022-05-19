let express = require("express")
let ejs = require("ejs")
let bodyParser = require("body-parser")

let myApp = new express();

myApp.get("/",(req,res) =>
{
    res.send("Hello!!!!")
})
myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})