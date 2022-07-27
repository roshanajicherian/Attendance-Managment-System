let express = require("express");
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
const csv=require("csvtojson");
const Teacher = require("./models/Teachers");
const Student = require("./models/Students");
const Course = require("./models/Courses");
const Attendance = require("./models/Attendance");
const bcrypt = require("bcryptjs")
const passport = require("passport")
const session = require('express-session');
const flash = require("connect-flash");
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
.catch((err) => {if (err) throw err;})

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
    res.locals.error_alert_message  = req.flash('error_alert_message');
    // res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

// Globals 
let selectedCourse = null;
let courseId = null;
let attendanceDate = null;

myApp.use(function(req, res, next) {
    courseList = []
    Course.find((err,course)=>{
    if(err) throw err;
    for(let i=0;i<course.length;i++)
    {
        courseList.push({cid : course[i].id,sem : course[i].cSemester, cName : course[i].cName})
    }
    res.locals.courseList = courseList;
});
    next();
});
myApp.get("/",(req,res) =>
{
    let pageTitle = "Login"
    res.render("loginPage",{pageTitle : pageTitle})
})
myApp.get("/enrollStudents",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Enroll Students"
    let userName = req.user.tName
    res.render("enrollStudents",{pageTitle : pageTitle,userName : userName, sName: "", sId: "", sEmail: "", sAddress: "", sPhone: "", sParentPhone: "", sSemester: "", sDepartment: ""})
})
myApp.get("/addTeacher",(req,res) =>
{
    let pageTitle = "Add Teacher"
    let userName = req.user.tName
    res.render("addTeacher",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/teacherLanding",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Teacher Dashboard"
    let userName = req.user.tName
    res.render("teacherLanding",{pageTitle : pageTitle,userName : userName, errors : []})
})
myApp.get("/addCourse",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Add Course"
    let userName = req.user.tName
    let courseList = [];
    Course.find((err,course)=>{
        if(err) throw err;
        for(let i=0;i<course.length;i++)
        {
            courseList.push({cid : course[i].id,sem : course[i].cSemester, cName : course[i].cName})
        }
        res.render("addCourse",{pageTitle : pageTitle,userName : userName, courseList : courseList})
    })
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
    let userName = req.user.tName
    let courseList = [];
    Course.find((err,course)=>{
        if(err) throw err;
        for(let i=0;i<course.length;i++)
        {
            courseList.push({cid : course[i].id,sem : course[i].cSemester, cName : course[i].cName})
        }
    res.render("addStudenttoCourse",{pageTitle : pageTitle,userName : userName, courseList : courseList})
    });
})

myApp.get("/markAttendance",isTeacherLoggedIn,(req,res) =>
{
    let pageTitle = "Attendance Marker"
    let userName = req.user.tName
    let courseList = [];
    Course.find((err,course)=>{
        if(err) throw err;
        for(let i=0;i<course.length;i++)
        {
            courseList.push({cid : course[i].id,sem : course[i].cSemester, cName : course[i].cName})
        }
    res.render("markAttendance",{pageTitle : pageTitle,userName : userName, courseList : courseList})
    });
})
myApp.get("/viewAttendance",isStudentLoggedIn,(req,res) =>
{
    const pageTitle = "View Attendance"
    let userName = req.user.sName
    let courseList =  [];
    Course.find((err,course)=>{
        if(err) throw err;
        for(let i=0;i<course.length;i++)
        {
            courseList.push({cid : course[i].id,sem : course[i].cSemester, cName : course[i].cName})
        }
    res.render("viewAttendance",{pageTitle : pageTitle,userName : userName, courseList : courseList, studentDetails : null, dateList : null})
    });
})

myApp.get("/displayStudentDetails",isTeacherLoggedIn,(req,res) =>
{
    const pageTitle = "Display Student Details"
    let userName = req.user.tName
    res.render("displayStudentDetails",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/modifyStudentDetails",isTeacherLoggedIn,(req,res) =>
{
    const pageTitle = "Modify Student Details"
    let userName = req.user.tName
    res.render("modifyStudentDetails",{pageTitle : pageTitle,userName : userName})
})
myApp.get("/viewCourses",isTeacherLoggedIn,(req,res) =>
{
    const pageTitle = "View Courses"
    let userName = req.user.tName
    let courseList = req.user.courseIdList
    let courseNames = []
    for(let i=0;i<courseList.length;i++)
        courseNames.push({cId : courseList[i].cid,cName : courseList[i].cName})
    res.render("viewCourses",{pageTitle : pageTitle,userName : userName, courseNames : courseNames})
})

myApp.get("/batchAddStudents",isTeacherLoggedIn,(req,res) =>
{
    const pageTitle = "Batch Add Students"
    let userName = req.user.tName
    res.render("batchAddStudents",{pageTitle : pageTitle,userName : userName})
})

myApp.get("/studentLanding",isStudentLoggedIn,(req,res) =>
{
    let pageTitle = "Student Dashboard"
    let userName = req.user.sName;
    let studentID = req.user.sId;
    let emailID = req.user.sEmail;
    let studentAddress = req.user.sAddress;

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
    let pageTitle = "Add Teacher"
    let errors = [];
    const {tName, tid, tPassword, tPhone, tDepartment} = req.body;
    if(!tName || !tid || !tPassword || !tPhone || !tDepartment)
    {
        errors.push("Please fill all the details.")
    }
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
    else
    {
        res.render("addTeacher",{pageTitle : pageTitle,errors : errors})
    }
    
})
myApp.post("/enrollStudents",(req,res) =>
{
    let pageTitle = "Enroll Students"
    let userName = req.user.tName;
    let errors = [];
    const {sName, sId, sPhone, sEmail,sAddress,sParentPhone, sSemester, sDepartment} = req.body;
    if(!sName||!sId||!sPhone||!sEmail||!sAddress||!sParentPhone||!sSemester||!sDepartment)
    {
        errors.push("Please fill all the details.")
    }
    if(errors.length === 0)
    {
        const newStudent = new Student(
            {
                sName,
                sId,
                sEmail,
                sAddress,
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
                        res.redirect("/enrollStudents")
                    }).catch((err)=>{
                        if(err.code === 11000)
                        {
                            errors.push("Student already exists")
                            console.log(sName);
                            res.render("enrollStudents",{pageTitle : pageTitle,userName : userName,errors : errors, sName, sId, sPhone, sEmail,sAddress,sParentPhone, sSemester, sDepartment})
                        }
                    })
        })
        })
    }
    else
    {
        res.render("enrollStudents",{pageTitle : pageTitle,userName : userName,errors : errors})
    }
})

myApp.post("/createCourse",isTeacherLoggedIn,(req,res) =>
{
    const {cSemester, cid, cName} = req.body;
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
    Teacher.findOne({_id : req.user._id},"courseIdList").then((proj)=>
    {
        let courseIdList = proj.courseIdList;
        Course.findOne({_id : req.body.courseSelect}).then((course) =>
        {
            courseIdList.push(course);
            Teacher.updateOne({_id : req.user._id},{courseIdList : courseIdList}).then((res) =>
            {
                console.log("Updated");
            }).catch((err)=> {if(err) throw err;})
        }).catch((err)=> {if(err) throw err});
    }).catch((err)=> {if(err) throw err});
    res.redirect("/teacherLanding");
})
myApp.post("/addStudenttoCourse",isTeacherLoggedIn,(req,res) =>
{
    selectedCourse = req.body.courseSelect;
    let studentDetails = [];
    Student.find({sSemester : req.body.semSelect}).then((studentList)=>
    {
        for(let i = 0;i<studentList.length;i++)   
            studentDetails.push({sId : studentList[i].sId, sName : studentList[i].sName})
        res.render("addStudenttoCourse",{pageTitle : "Add Student to Course",userName : "Teacher Name",studentDetails : studentDetails})
    }).catch((err)=>{
        if(err) throw err;
    })
})
myApp.post("/studentDisplayTableConfirm",isTeacherLoggedIn,(req,res) =>
{
    // TODO : Add authentication condition over here 
    // TODO : Add condition of the course is already added for a student check
    let studentDetails = req.body.studentDetails;
    for(let i=0;i<studentDetails.length;i++)
    {
        Student.findOne({sId : studentDetails[i]},"enrolledCourse").then((proj)=>
        {
            let enrolledCourse = [];
            if(proj.enrolledCourse)
                enrolledCourse = proj.enrolledCourse;
            enrolledCourse.push(selectedCourse)
            Student.updateOne({sId : studentDetails[i]},{enrolledCourse : enrolledCourse}).then((student)=>
            {
                console.log("Updated");
            }).catch((err) => {
                if(err) throw err;
            })
        }).catch((err) => {if (err) throw err;})
    }
    res.redirect("/teacherLanding");
})
myApp.post("/markAttendance",isTeacherLoggedIn,(req,res) =>
{
    let studentDetails = [];
    courseId = req.body.courseSelect;
    attendanceDate =  req.body.dateSelect;
    Student.find({sSemester : req.body.semSelect, enrolledCourse : req.body.courseSelect}).then((studentList)=>
    {
        for(let i = 0;i<studentList.length;i++)   
            studentDetails.push({sId : studentList[i].sId, sName : studentList[i].sName})
        res.render("markAttendance",{pageTitle : "Mark Attendance",userName : req.user.tName,studentDetails : studentDetails, dateSelect : req.body.dateSelect})
    }).catch((err)=>{
        if(err) throw err;
    })
})
myApp.post("/markAttendanceConfirm",isTeacherLoggedIn,(req,res) =>
{
    const studentDetails = req.body.studentDetails;
    for (let i=0;i<studentDetails.length;i++)
    {
        const newAttendance = new Attendance(
            {
                courseId : courseId,
                studentId : studentDetails[i],
                lessonDate : attendanceDate
            }
        );
        newAttendance.save().then((attendance)=>{
            console.log("Attendance details sucessfully saved.")
        }) 
    }
    res.redirect("/teacherLanding")
})
myApp.post("/viewAttendance",isStudentLoggedIn,(req,res) =>
{
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday']
    let datesList = [];
    let sId = req.user.sId;
    let courseId = req.body.courseSelect;
    Attendance.find({studentId : sId, courseId : courseId}).
    then((attend)=>{
        for(let i = 0;i<attend.length;i++)   
        {
            let tempDate = new Date(attend[i].lessonDate);
            datesList.push(weekday[tempDate.getDay()] +", " + tempDate.toLocaleDateString());
        }
        res.render("viewAttendance",{pageTitle : "View Attendance",userName : req.user.sName,dateSelect : req.body.dateSelect, dateList : datesList})
    }).
    catch((err)=>{
        if(err) throw err;
    });

})
myApp.post("/displayStudentDetails",isTeacherLoggedIn,(req,res) =>
{
    Student.findOne({sId : req.body.studentId}).then((student)=>
    {
        res.render("displayStudentDetails",{pageTitle : "Display Student Details",userName : req.user.tName,studentDetails : student})	
    }).catch((err)=>{
        if(err) throw err;
    });
})
myApp.post("/modifyStudentDetails",isTeacherLoggedIn,(req,res) =>
{
    Student.findOne({sId : req.body.studentId}).then((student)=>
    {
        const {sId, sName, sSemester, sEmail, sPhone, sParentPhone,sAddress, sDepartment,isStudentActive} = student;
        res.render("modifyStudentDetails",{pageTitle : "Modify Student Details",userName : req.user.tName,sId, sName, sSemester, sEmail, sPhone, sAddress, sParentPhone, sDepartment,isStudentActive})	
    }).catch((err)=>{
        if(err) throw err;
    });
})

myApp.post("/batchAddStudents",isTeacherLoggedIn,(req,res) =>
{
    let csvDataInput = req.body.csvData;
    let finalData = [];
    csv({
        noheader:true,
        output: "csv"
    })
    .fromString(csvDataInput)
    .then((csvRow)=>{ 
        for(let i = 1;i<csvRow.length;i++)
        {
            let sName = csvRow[i][0]
            let sId = csvRow[i][1]
            let sPhone = csvRow[i][2]
            let sEmail = csvRow[i][3]
            let sAddress = csvRow[i][4]
            let sParentPhone = csvRow[i][5]
            let sSemester = csvRow[i][6]
            let sDepartment = csvRow[i][7]
            finalData.push({sName : sName, sId : sId, sPhone : sPhone, sEmail : sEmail,sAddress : sAddress,sParentPhone : sParentPhone, sSemester : sSemester, sDepartment : sDepartment});
        }
        let errors = [];
        let errorEncountered = false;
        for(let i = 0;i<finalData.length;i++)
        {
            if(errorEncountered)
                break;
            const {sName, sId, sPhone, sEmail,sAddress,sParentPhone, sSemester, sDepartment} = finalData[i];
            if(!sName||!sId||!sPhone||!sEmail||!sAddress||!sParentPhone||!sSemester||!sDepartment)
            {
                errors.push("Error in CSV data. Please check the data again.");
            }
            if(errors.length === 0)
            {
                const newStudent = new Student(
                    {
                        sName,
                        sId,
                        sEmail,
                        sAddress,
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
                            newStudent.save().then((student)=>{
                                console.log("Student details saved successfully.");
                            }).catch((err)=>{
                                errorEncountered = true;
                                if(err.code === 11000)
                                {
                                    errors.push("Student already exists")
                                    console.log(sName);
                                    res.render("batchAddStudents",{pageTitle : pageTitle,userName : userName,errors : errors, sName, sId, sPhone, sEmail,sAddress,sParentPhone, sSemester, sDepartment})
                                }
                            });
                })
                })
            }
            else
            {
                errorEncountered = true;
                res.render("batchAddStudents",{pageTitle : pageTitle,userName : userName,errors : errors})
            }
        }
        if(errorEncountered ===false)
            res.redirect("/teacherLanding");

    })
})

myApp.post("/modifyStudentDetailsConfirm",isTeacherLoggedIn,(req,res) =>
{
    let isStudentActive = null;
    const {sName, sId, sSemester, sEmail, sPhone, sParentPhone,sDepartment,sAddress} = req.body;
    if(req.body.isStudentActive)
            isStudentActive = true;
        else
            isStudentActive = false;
    Student.updateOne({sId : sId},{sName : sName, sSemester : sSemester, sEmail : sEmail, 
        sPhone : sPhone, sParentPhone : sParentPhone, sAddress : sAddress, sDepartment : sDepartment,
        isStudentActive : isStudentActive}).
    then((student)=>{
        req.flash("success_alert_message","Student details updated successfully.")
        res.redirect("/modifyStudentDetails")
    }).
    catch((err) => {if (err) throw err;})
})

let port = process.env.PORT;
if(port== null || port=="")
    port = 3000;
myApp.listen(port|| 3000,()=>
{
    console.log("Server is live.")
})