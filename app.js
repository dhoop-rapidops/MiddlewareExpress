const session = require("express-session");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const { loginGet, loginPost } = require("./pages/login.js");
const { registerGet, registerPost } = require("./pages/register.js");
const { home, logout } = require("./pages/home.js");

const app = express();

const urlEncoder = bodyParser.urlencoded({ extended: false });

const {
    SESSION_AGE = 1000 * 60 * 15,
    NODE_ENV = "production",
    PORT = 3000,
    SESSION_ID = 'sid',
    SESSION_SECRET = 'sk1a5Fhjd3P2'
} = process.env;

app.use(session({
    name: SESSION_ID,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESSION_AGE,
        sameSite: true,
    },
    secret: SESSION_SECRET
}));

const isSessionIdSet = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        next();
    }
}

app.get("/", isSessionIdSet, home);
app.post("/logout", isSessionIdSet, logout);

app.get("/login", redirectHome, loginGet);
app.post("/login", redirectHome, urlEncoder, loginPost);

app.get("/register", redirectHome, registerGet);
app.post("/register", redirectHome, urlEncoder, registerPost);

app.listen(PORT);