const _ = require("lodash");

function toUserDto(user) {
    return {
        ..._.pick(user, ["firstName", "lastName", "profileImage"])
    };
}

module.exports = {
    toUserDto
};
