const Users = require("./data.js");

const ifUserIsPaid = (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
        let user = Users.find(user => user._id == userId);
        if (user.name == "Dhoop") {
            next();
        } else if (user.name == "dulari") { // TODO: not working
            let total = 0;
            console.log("Loop start");
            for (let i = 1; i <= 6999999999; i++) {
                total += i;
            }
            console.log("Loop over");
            next('route');
        } else {
            next('route');
        }
    }
}

const gettingPaidContent = (req, res, next) => {
    // fetching paid content
    console.log("paid content");
    next();
}

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

module.exports = { ifUserIsPaid, gettingPaidContent, isSessionIdSet, redirectHome };