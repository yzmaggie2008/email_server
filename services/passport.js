const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    //the user.id is the mongo unique id when you store the data in it
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null,user);
        });
});

//create a new instance of google passport strategy, and it tell the application to be authenticated my users with google
// passport.use tell the passport to authenticate in a very specific provider 
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        //after the user grants permission, the third one will tell the system where the user will direct to with the code inside 
        callbackURL: '/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleID: profile.id})
            .then((existingUser) => {
                if(existingUser) {
                    //we already have a record with the given profile id
                    done(null, existingUser);
                }else {
                    // we don't have a user record with this ID, make a new record
                    new User({ googleID: profile.id})
                        .save()
                        .then(user => done(null, user));

                }
            });
        
    })
);