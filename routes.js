const express = require("express");
const bodyParser = require("body-parser");
const { loginGet, loginPost } = require("./pages/login.js");
const { registerGet, registerPost } = require("./pages/register.js");
const { home, logout } = require("./pages/home.js");
const { ifUserIsPaid, gettingPaidContent, isSessionIdSet, redirectHome } = require("./pages/handler.js");

let router = express.Router();


const urlEncoder = bodyParser.urlencoded({ extended: false });

const haltExecution = (req, res, next) => {
    console.log("Timeoout, ", req.timedout);
    if (req.timedout) {
        res.status(408).send("<h1>Reqest Timeout</h1>")
    } else {
        next();
    }
}

/** Home, Logout page */
router.get("/", isSessionIdSet, ifUserIsPaid, gettingPaidContent, home);
router.get("/", isSessionIdSet, haltExecution, home);

router.post("/logout", isSessionIdSet, logout);

/** Login */
router.get("/login", redirectHome, loginGet);
router.post("/login", redirectHome, urlEncoder, loginPost);

/** Register */
router.get("/register", redirectHome, registerGet);
router.post("/register", redirectHome, urlEncoder, registerPost);

module.exports = router;