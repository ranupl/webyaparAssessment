const express = require("express");
const app = express();
require("dotenv").config();
const bodyparser = require("body-parser");
const passport = require('passport');
const session = require("express-session");
const { UserDB } = require('./src/model/user'); 
const multer = require('multer');
require('./passport-setup');
require("./src/db/connection");

const PORT = process.env.PORT;

// bodyParser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(
    session({
      secret: "#google#secure",
      resave: false,
      saveUninitialized: true,
    })
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

// view engine set
app.set("view engine", "ejs");

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

// Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    async (req, res) => {
      const email = req.user.email; 
      const user = await UserDB.findOne({email});
      if(user){
        res.render("dashboard", {user});
      } 
});

// page routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Error during logout");
        }
        req.session = null;
        res.redirect('/');
    });
});

app.post("/upload", upload.single("profileImage"), async(req, res) => {
    console.log(req.file);
    console.log(req.body);
    const email = req.user.email; 
    const user = await UserDB.findOne({email});
    return res.render("dashboard", {user});
})

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})