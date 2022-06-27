const Student = require('../models/Students');
const Teacher = require('../models/Teachers');

function isTeacherLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        Teacher.findOne({id : req.user_id}).then((teacher)=>
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
        Teacher.findOne({id : req.user_id}).then((teacher)=>
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

module.exports = {isTeacherLoggedIn, isStudentLoggedIn}