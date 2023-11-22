const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserDB } = require('../model/user'); // Import your UserDB model

async function passport_middleware() {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true
    }, async function (request, accessToken, refreshToken, profile, done) {
        try {
            let user = await UserDB.findOne({ email: profile._json.email });
    
            if (!user) {
                user = new UserDB({
                    fullname: profile._json.name,
                    email: profile._json.email,
                    profile: profile._json.picture,
                });
    
                await user.save();
            }
    
            request.session.user = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                profile: user.profile,
            };
            
            return done(null, request.session.user);
            
        } catch (error) {
            console.error(error);
            return done(error, null);
        }
    }));
}

module.exports = {passport_middleware};


