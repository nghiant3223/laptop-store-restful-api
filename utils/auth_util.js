const jwt = require("jsonwebtoken");
const config = require("../config");

function transformFacebookUser(fUser) {
    return {
        email: fUser._json["email"],
        firstName: fUser._json["first_name"],
        lastName: fUser._json["last_name"],
        profileImage: fUser.photos[0].value,
        fbId: fUser._json["id"]
    };
}

function signAccessToken(user) {
    const { secret, lifetime } = config.jwt;
    return jwt.sign({ id: user.id }, secret, { expiresIn: lifetime });
}

function verifyAccessToken(token) {
    const { secret } = config.jwt;

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(decoded);
        });
    });
}

module.exports = {
    transformFacebookUser,
    signAccessToken,
    verifyAccessToken
};
