const Db = require("../models");
const { verifyAccessToken } = require("../utils/auth_util");
const { ErrorTypes } = require("../constants/error");
const { newError } = require("../utils/http_util");

const User = Db.User;

function needAuthentication(required = true) {
    return async (req, res, next) => {
        const authorization = req.headers.authorization;

        if (typeof authorization === "undefined") {
            if (required) {
                res.status(403).send("No authorization provided!");
                return;
            } else {
                next();
            }
        }

        const bearer = authorization.split(" ");
        const accessToken = bearer[1];

        try {
            const { id } = await verifyAccessToken(accessToken);
            const user = await User.find(id);

            if (!user) {
                next(newError("User not found", 404, ErrorTypes.USER_NOT_FOUND, id));
                return;
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                if (required) {
                    res.status(401).send("Token has expired");
                } else {
                    next();
                }

                return;
            }

            if (err.name === "JsonWebTokenError") {
                if (required) {
                    res.status(401).send("Wrong token provided");
                } else {
                    next();
                }

                return;
            }

            next(err);
        }
    };
}

function needAdminRole(req, res, next) {
    const { user } = req;

    if (!user) {
        throw new Error("This middleware must be behind needAuthentication");
    }

    if (user.username !== "admin") {
        next(newError("Only admin can access this route", 403, ErrorTypes.NO_PERMISSION));
        return;
    }

    next();
}

module.exports = {
    needAuthentication,
    needAdminRole
};
