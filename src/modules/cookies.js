function setCookie(res, name, value, options) {
    res.cookie(name, value, options);
    console.log(`Cookie ${name} set with value ${value}`);
}
function getCookie(req, name) {
    return req.cookies[name];
}
module.exports = {
    setCookie,
    getCookie
};
