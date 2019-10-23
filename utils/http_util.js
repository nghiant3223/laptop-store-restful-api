function newSuccess(data = null, message = null) {
    return {
        status: "success",
        data,
        message
    };
}

function newError(message = null, status, code = "undefined", source = null, detail) {
    const err = new Error(message);

    err.status = status;
    err.code = code;
    err.source = source;
    err.detail = detail;

    return err;
}

module.exports = {
    newSuccess,
    newError
};
