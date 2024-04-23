function setCookie(res, name, value, options) {
    res.cookie(name, value, options);
}
function getCookie(req, name) {
    return req.cookies[name];
}
module.exports = {
    setCookie,
    getCookie
};
