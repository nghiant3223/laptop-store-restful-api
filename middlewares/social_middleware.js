const passport = require("passport");
const config = require("../config");
const FacebookTokenStrategy = require("passport-facebook-token");

const facebookAuthenticator = passport.authenticate(
    "facebook-token",
    config.facebook.options,
    null
);
const facebookTokenStrategy = new FacebookTokenStrategy(
    {
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
);

module.exports = {
    facebookAuthenticator,
    facebookTokenStrategy
};
