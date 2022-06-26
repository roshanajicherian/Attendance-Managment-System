let express = require("express")
let bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Teacher = require("./models/Teachers");

let myApp = new express();
myApp.use(bodyParser.urlencoded({extended:true}))
myApp.set('view engine', 'ejs');
myApp.use(express.static("public"))

const db = require("./config/keys").MongoURI;
mongoose.connect(db,{useNewUrlParser : true})
.then(()=>console.log("MongoDB Connected"))
.catch((err) => {console.log(err)})

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
myApp.get("/addTeacher",(req,res) =>
{
    let pageTitle = "Add Teacher"
    let userName = "Log In"
    res.render("addTeacher",{pageTitle : pageTitle,userName : userName})
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
    let firstName = "John"
    let lastName = "Doe"
    let studentID = "TRV000IT000"
    let emailID = "abc@xyz.com"
    let studentAddress = "5-C, New Oaks Apartment, Pattom, Trivandrum 695004"

    res.render("studentLanding",{pageTitle : pageTitle,userName : userName, firstName : firstName, lastName : lastName, studentID : studentID,emailID : emailID, studentAddress : studentAddress})
})

myApp.post("/login",(req,res)=>
{
    console.log(req.body);
    res.send("Hello");

})
myApp.post("/addTeacher",(req,res)=>
{
    let errors = [];
    const {tName, tid, tPassword, tPhone, tDepartment} = req.body;
    if(errors.length === 0)
    {
        const newTeacher = new Teacher(
            {
                tName,
                tid,
                tPassword,
                tPhone,
                tDepartment
            }
        );
        newTeacher.save().then((user)=>{
            console.log("Teacher details sucessfully saved.")
            res.redirect("/login")
        }) 
    }
    
})

myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})