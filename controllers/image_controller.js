const Db = require("../models");
const { newSuccess, newError } = require("../utils/http_util");

const Image = Db.Image;

async function deleteImage(req, res, next) {
    const { id } = req.params;

    try {
        await Image.delete(id);
        res.status(204).send(newSuccess(null, "Delete image successfully"));
    } catch (e) {
        next(e);
    }
}
module.exports = {
    deleteImage
};
