const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
    sId : {
        type : String,
        required : true
    },
    sName : {
        type : String,
        required : true
    },
    sPassword : {
        type : String,
        default : "gecbh*123"
    },
    sEmail : {
        type : String,
        required : true
    },
    sAddress : {
        type : String,
        required : true
    },
    sPhone : {
        type : String,
        required: true
    },
    sParentPhone : {
        type : String,
        required: true
    },
    sSemester : {
        type : String,
        required: true
    },
    sDepartment : {
        type : String,
        required: true
    },
    enrolledCourse :
    {
        type: Array
    },
    isStudentActive :
    {
        type: Boolean,
        default : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
});

const Student = mongoose.model("Student",StudentSchema);

module.exports = Student;