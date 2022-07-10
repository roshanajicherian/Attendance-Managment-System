let express = require("express");
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Teacher = require("./models/Teachers");
const Student = require("./models/Students");
const Course = require("./models/Courses");
const bcrypt = require("bcryptjs")
const passport = require("passport")
const session = require('express-session');
const flash = require("connect-flash")
const intializePassportTeacher = require("./config/passport").teacherLogin
intializePassportTeacher(passport);
const intializePassportStudent = require("./config/passport").studentLogin
intializePassportStudent(passport);
const isTeacherLoggedIn = require("./config/auth").isTeacherLoggedIn;
const isStudentLoggedIn = require("./config/auth").isStudentLoggedIn;
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
myApp.use(flash())
myApp.use(passport.initialize());
myApp.use(passport.session());

myApp.use(function(req, res, next) {
    res.locals.success_alert_message  = req.flash('success_alert_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

myApp.get("/",(req,res) =>
{
    let pageTitle = "Login"
    let userName = "Log In"
    res.render("loginPage",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/enrollStudents",isTeacherLoggedIn,(req,res) =>
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

myApp.get("/teacherLanding",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Teacher Dashboard"
    let userName = req.user.tName
    res.render("teacherLanding",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/addCourse",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Add Course"
    let userName = "Teacher Name"
    res.render("addCourse",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/createCourse",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Create Course"
    let userName = req.user.tName;
    res.render("createCourse",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/addStudenttoCourse",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Add Student to Course"
    let userName = "Teacher Name"
    res.render("addStudenttoCourse",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/markAttendance",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Attendance Marker"
    let userName = "Teacher Name"
    res.render("markAttendance",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/studentLanding",isStudentLoggedIn,(req,res) =>
{
    let pageTitle = "Student Dashboard"
    let userName = req.user.sName;
    let studentID = req.user.sId;
    let emailID = "abc@xyz.com"
    let studentAddress = "5-C, New Oaks Apartment, Pattom, Trivandrum 695004"

    res.render("studentLanding",{pageTitle : pageTitle,userName : userName, studentID : studentID,emailID : emailID, studentAddress : studentAddress})
})

myApp.get("/logout",(req,res)=>
{
    req.logout((err) =>
    {
        if(err) throw err;
        res.redirect("/");
    });
    
})
myApp.post("/login",(req,res,next)=>
{
    console.log(req.body);
    if(req.body.loginUserType === "Student")
    {
        passport.authenticate("studentLocal",{
            successRedirect : "/studentLanding",
            failureRedirect : "/",
            failureFlash : true
        })(req, res, next);
    }
    if(req.body.loginUserType === "Teacher")
    {
        passport.authenticate("teacherLocal",{
            successRedirect : "/teacherLanding",
            failureRedirect : "/",
            failureFlash : true
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
                        req.flash("success_alert_message","Student has been registered. You can now login")
                        res.redirect("/")
                    }) 
        })
        })
    }
})

myApp.post("/createCourse",isTeacherLoggedIn,(req,res) =>
{
    console.log(req.body);
    const {cSemester, cid, cName} = req.body;
    console.log(cSemester, cid, cName);

    const newCourse = new Course(
        {
            cid:cid,
            cName:cName,
            cSemester:cSemester
        }
    );

    newCourse.save();


    res.redirect("/teacherLanding");
    
})

myApp.post("/addCourse",isTeacherLoggedIn,(req,res) =>
{
    console.log(req.body);
    const {semSelect, courseSelect} = req.body;
    console.log(semSelect, courseSelect);

    const newCourse = new Course(
        {
            semSelect, 
            courseSelect
        }
    );

    //newCourse.save();

    //console.log(newCourse.cid, newCourse.cName, newCourse.cSemester);


    res.redirect("/teacherLanding");
    
})



myApp.listen(3000,()=>
{
    console.log("Server is live on PORT 3000")
})