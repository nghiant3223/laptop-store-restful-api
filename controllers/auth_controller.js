const { transformFacebookUser } = require("../utils/auth_util");
const Db = require("../models");
const { signAccessToken } = require("../utils/auth_util");
const { toMeDto } = require("../mappers");
const { newSuccess, newError } = require("../utils/http_util");
const { LogInValidator } = require("../validators/login_validator");
const { ErrorTypes } = require("../constants/error");
const { extractJoiErrorDetail } = require("../utils/error_util");

const User = Db.User;

async function logInWithFacebook(req, res, next) {
    const { user: fUser } = req;
    const socialUser = transformFacebookUser(fUser);

    let user;

    try {
        const userInQuestion = await User.findBy("fbId", socialUser.fbId);
        if (userInQuestion == null) {
            user = await User.save(socialUser);
        } else {
            user = userInQuestion;
        }

        const accessToken = signAccessToken(user);
        const userDto = toMeDto(user);

        res.status(200).send(newSuccess({ accessToken, user: userDto }, "Login successfully"));
    } catch (e) {
        next(e);
    }
}

async function logIn(req, res, next) {
    const { error, value: body } = LogInValidator.validate(req.body);

    if (error != null) {
        next(
            newError(
                "Invalid login data",
                401,
                ErrorTypes.LOGIN_FORM_FAILED,
                req.body,
                extractJoiErrorDetail(error)
            )
        );
        return;
    }

    const { username, password } = body;

    const user = await User.findBy("username", username);
    if (user == null) {
        next(newError("Username not found", 401, ErrorTypes.USER_NOT_FOUND, req.body));
        return;
    }
    if (user.password !== password) {
        next(newError("Password not match", 401, ErrorTypes.PASSWORD_NOT_MATCHED, req.body));
        return;
    }

    const accessToken = signAccessToken(user);
    const userDto = toMeDto(user);

    res.status(200).send(newSuccess({ accessToken, user: userDto }, "Login successfully"));
}

module.exports = {
    logInWithFacebook,
    logIn
};
