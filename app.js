const express = require("express");
const fs = require("fs");
/** Middlewares */
const session = require("express-session");
const methodOverride = require("method-override");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const timeout = require("connect-timeout");
const cors = require("cors");
const cookieParser = require("cookie-parser");
/** My Packages */
const route = require("./routes.js");

const app = express();

app.use(timeout(5000));
/** Timeout middleware */
const haltExecution = (req, res, next) => {
    console.log("Timeoout, ", req.timedout);
    if (req.timedout) {
        res.status(408).send("<h1>Reqest Timeout</h1>")
    } else {
        next();
    }
}

/**  Cross origin resource sharing */
app.use(cors({
    origin: ["http://127.0.0.1:3000/"],
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"]
}));

/** Session middleware */
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


/**  Security middleware */
app.use(helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
    noCache: true,
    referrerPolicy: true
}));;


/** Cookie parser */
app.use(cookieParser());

/** Logger middleware */
const logFile = fs.createWriteStream(__dirname + "/logger.log", { flags: 'a' });
app.use(morgan("combined", { stream: logFile }));

/** Compression Middleware */
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) return false // TODO: don't compress response
    else return compression.filter(req, res);
};
app.use(compression({ filter: shouldCompress, level: 1 }));

/** Devloper mode logger  */
app.use(morgan("dev"));

/** Handling Errors */
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Somethong broke!, Error while generating response..");
});

app.use(haltExecution);

/** endpoints */
app.use("/", route);

/** endpoint not found */
app.use((req, res, next) => {
    res.status(404).send(`<h1>404 Bed Request</h1><h3>Sorry! what you are requested, we can not find that</h3>`);
});

/** Handling Errors */
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Somethong broke!, Error while generating response..");
});

app.listen(PORT);