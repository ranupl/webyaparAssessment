// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { UserDB } = require('./src/model/user');

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID ,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL,
//     passReqToCallback: true
// }, function (request, accessToken, refreshToken, profile, done){
//     console.log(profile);
//     return done(null, profile);
// }));

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserDB } = require('./src/model/user'); // Import your UserDB model

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
    try {
        // Check if the user already exists in the database
        let user = await UserDB.findOne({ email: profile._json.email });

        if (!user) {
            // If the user doesn't exist, create a new user
            user = new UserDB({
                fullname: profile._json.name,
                email: profile._json.email,
                profile: profile._json.picture,
            });

            await user.save();
        }

        // Store the user data in the session
        request.session.user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profile: user.profile,
        };

        // console.log(profile._json);

        // Return the user data to be stored in the session
        return done(null, request.session.user);
    } catch (error) {
        console.error(error);
        return done(error, null);
    }
}));


