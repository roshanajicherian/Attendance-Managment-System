let express = require("express")
// let ejs = require("ejs")
let bodyParser = require("body-parser")

let myApp = new express();
myApp.use(bodyParser.urlencoded({extended:true}))
myApp.set('view engine', 'ejs');
myApp.use(express.static("public"))

myApp.get("/",(req,res) =>
{
    let pageTitle = "Home"
    let userName = "John Doe"
    res.render("header",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/teacherLanding",(req,res) =>
{
    let pageTitle = "Teacher Landing"
    let userName = "Teacher Name"
    res.render("teacherLanding",{pageTitle : pageTitle,userName : userName})
})
myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})