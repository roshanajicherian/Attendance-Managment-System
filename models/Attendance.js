const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    courseId : {
        type : String,
        required : true
    },
    studentId : {
        type : String,
        required : true
    },
    lessonDate : {
        type : Date,
        required : true
    }
});

const Attendance = mongoose.mongoose.model("Attendance",AttendanceSchema);

module.exports = Attendance;