const Student = require('../models/Students');
const Teacher = require('../models/Teachers');

function isTeacherLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        Teacher.findOne({tid : req.user.tid}).then((teacher)=>
        {
            if(!teacher)
            {
                res.send("Forbidden")
            }
            else
              return next();
        })
    }
    else
    {
        res.send("Forbidden")
    }
}
function isStudentLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        Student.findOne({sId : req.user.sId}).then((student)=>
        {
            console.log(student);
            if(!student)
            {
                res.send("Forbidden")
            }
            else
              return next();
        })

    }
    else
    {
        res.send("Forbidden")
    }
}

module.exports = {isTeacherLoggedIn, isStudentLoggedIn}