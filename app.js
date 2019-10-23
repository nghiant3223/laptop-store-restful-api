const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const { facebookTokenStrategy } = require("./middlewares/social_middleware");
const config = require("./config");
const apiRouter = require("./routes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cors(config.cors));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
passport.use(facebookTokenStrategy);

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    console.error(err);

    if (!err.status) {
        err.status = 500;
    }

    res.status(err.status).send({
        status: "error",
        message: err.message,
        code: err.code,
        source: err.source,
        detail: err.detail
    });
});

module.exports = app;
