const mongoose = require("mongoose");

const TeaherSchema = new mongoose.Schema({
    tid : {
        type : String,
        required : true
    },
    tName : {
        type : String,
        required : true
    },
    tPassword : {
        type : String,
        required : true
    },
    tDepartment : {
        type : String,
        required: true
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
});

const Teacher = mongoose.model("Teacher",TeaherSchema);

module.exports = Teacher;