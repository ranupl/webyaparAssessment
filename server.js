const express = require("express");
const app = express();
require("dotenv").config();
const bodyparser = require("body-parser");
const passport = require('passport');
const session = require("express-session");
const { UserDB } = require('./src/model/user'); 
const routes = require("./src/router/router");
require('./src/middleware/passport-setup');
require("./src/db/connection");

const PORT = process.env.PORT;

app.use("/public", express.static(`${__dirname}/uploads`));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
    session({
      secret: "#google#secure",
      resave: false,
      saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] },)
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    async (req, res) => {
      const email = req.user.email; 
      const user = await UserDB.findOne({email});
      if(user){
        res.render("dashboard", {user});
      } 
});

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})