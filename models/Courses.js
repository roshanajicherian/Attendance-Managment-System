const mongoose = require("mongoose")

const CourseScheme = new mongoose.Schema({
    cid : {
        type : String,
        required : true
    },
    cName :
    {
        type: String,
        required : true
    },

    cSemester : {
        type: String
    }
});

const Course = mongoose.model("Course",CourseScheme);

module.exports = Course;