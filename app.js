let express = require("express")
// let ejs = require("ejs")
let bodyParser = require("body-parser")

let myApp = new express();
myApp.use(bodyParser.urlencoded({extended:true}))
myApp.set('view engine', 'ejs');
myApp.use(express.static("public"))

myApp.get("/",(req,res) =>
{
    let pageTitle = "Login"
    let userName = "Log In"
    res.render("loginPage",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/enrollStudents",(req,res) =>
{
    let pageTitle = "Enroll Students"
    let userName = "Log In"
    res.render("enrollStudents",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/teacherLanding",(req,res) =>
{
    let pageTitle = "Teacher Dashboard"
    let userName = "Teacher Name"
    res.render("teacherLanding",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/addCourse",(req,res) =>
{
    let pageTitle = "Add Course"
    let userName = "Teacher Name"
    res.render("addCourse",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/addStudenttoCourse",(req,res) =>
{
    let pageTitle = "Add Student to Course"
    let userName = "Teacher Name"
    res.render("addStudenttoCourse",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/markAttendance",(req,res) =>
{
    let pageTitle = "Attendance Marker"
    let userName = "Teacher Name"
    res.render("markAttendance",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/studentLanding",(req,res) =>
{
    let pageTitle = "Student Dashboard"
    let userName = "Student Name"
    res.render("studentLanding",{pageTitle : pageTitle,userName : userName})
})

myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})