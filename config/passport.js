const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');


const Student = require('../models/Students');
const Teacher = require('../models/Teachers');

let isTeacher = false;

function studentLogin(passport) {
  console.log("In student login authenticate");
  passport.use("studentLocal",
    new LocalStrategy({ usernameField: 'ID'}, (ID, password, done) => {
      Student.findOne({
        sId: ID
      }).then((student) => {
        if (!student) {
          return done(null, false, { message: 'The student does not exist' });
        }
        bcrypt.compare(password, student.sPassword, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            isTeacher = false;
            return done(null, student);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });

  // passport.deserializeUser(function(id, done) {
  //   Student.findById(id, function(err, user) {
  //     done(err, user);
  //   });
  // });
};

function teacherLogin(passport) {
  console.log("In teacher login authenticate");

  passport.use("teacherLocal",
    new LocalStrategy({ usernameField: 'ID'}, (ID, password, done) => {
      Teacher.findOne({
        tid: ID
      }).then((teacher) => {
        if (!teacher) {
          return done(null, false, { message: 'The teacher does not exist' });
        }
        bcrypt.compare(password, teacher.tPassword, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            isTeacher = true;
            return done(null, teacher);
          } else {
            return done(null, false, { message: 'Password incorrect teacher',passIn: password, passDB: teacher.tPassword});
          }
        });
      });
    })
  );

  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });

  // passport.deserializeUser(function(id, done) {
  //   Teacher.findById(id, function(err, user) {
  //     done(err, user);
  //   });
  // });
};
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    if(isTeacher === false)
    {
      Student.findById(id, function(err, user) {
        done(err, user);
      });
    }
    if(isTeacher === true)
    {
      Teacher.findById(id, function(err, user) {
        done(err, user);
      });
    }
  
});

module.exports = {studentLogin,teacherLogin}