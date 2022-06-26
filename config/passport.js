const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


const Student = require('../models/Students');
const Teacher = require('../models/Teachers');

module.exports = function(passport) {
  passport.use(
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
            return done(null, student);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, user) {
      done(err, user);
    });
  });
};