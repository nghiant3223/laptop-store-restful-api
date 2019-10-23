function extractJoiErrorDetail(err) {
    return err.details.map(detail => detail.message);
}

module.exports = {
    extractJoiErrorDetail
};
