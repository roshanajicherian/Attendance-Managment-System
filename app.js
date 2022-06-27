let express = require("express");
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Teacher = require("./models/Teachers");
const Student = require("./models/Students");
const bcrypt = require("bcryptjs")
const passport = require("passport")
const session = require('express-session');
const intializePassportTeacher = require("./config/passport").teacherLogin
intializePassportTeacher(passport);
const intializePassportStudent = require("./config/passport").studentLogin
intializePassportStudent(passport);
let myApp = new express();
myApp.use(bodyParser.urlencoded({extended:true}))
myApp.set('view engine', 'ejs');
myApp.use(express.static("public"))

const db = require("./config/keys").MongoURI;
mongoose.connect(db,{useNewUrlParser : true})
.then(()=>console.log("MongoDB Connected"))
.catch((err) => {console.log(err)})

myApp.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
myApp.use(passport.initialize());
myApp.use(passport.session());

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
    let userName = req.user.tName
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
    console.log(req.session)
    let pageTitle = "Student Dashboard"
    let userName = req.user.sName;
    let studentID = req.user.sId;
    let emailID = "abc@xyz.com"
    let studentAddress = "5-C, New Oaks Apartment, Pattom, Trivandrum 695004"

    res.render("studentLanding",{pageTitle : pageTitle,userName : userName, studentID : studentID,emailID : emailID, studentAddress : studentAddress})
})

myApp.post("/login",(req,res,next)=>
{
    if(req.body.loginUserType === "Student")
    {
        passport.authenticate("studentLocal",{
            successRedirect : "/studentLanding",
            failureRedirect : "/"
        })(req, res, next);
    }
    if(req.body.loginUserType === "Teacher")
    {
        passport.authenticate("teacherLocal",{
            successRedirect : "/teacherLanding",
            failureRedirect : "/"
        })(req, res, next);
    }
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
        bcrypt.genSalt(10,(err,salt) => 
        {
            if(err) throw err;
                bcrypt.hash(newTeacher.tPassword,salt,(err,hash) => {
                    if(err) throw err;
                    console.log(hash)
                    newTeacher.tPassword = hash
                    newTeacher.save().then((user)=>{
                        console.log("Teacher details sucessfully saved.")
                        res.redirect("/")
                    }) 
        })
        })
    }
    
})
myApp.post("/enrollStudents",(req,res) =>
{
    let errors = [];
    console.log(req.body);
    const {sName, sId, sPhone, sParentPhone, sSemester, sDepartment} = req.body;
    if(errors.length === 0)
    {
        const newStudent = new Student(
            {
                sName,
                sId,
                sPhone,
                sParentPhone,
                sSemester,
                sDepartment
            }
        );
        bcrypt.genSalt(10,(err,salt) => 
        {
            if(err) throw err;
                bcrypt.hash(newStudent.sPassword,salt,(err,hash) => {
                    if(err) throw err;
                    newStudent.sPassword = hash
                    newStudent.save().then((user)=>{
                        console.log("Student details sucessfully saved.")
                        res.redirect("/")
                    }) 
        })
        })
    }
})
myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})