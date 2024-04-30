// cookies.js
function setCookie(res, name, value, options) {
    const defaultOptions = {
        path: '/',
        sameSite: 'Strict', // eller 'Lax' afhængigt af dine behov
        secure: true, // Kræver HTTPS-forbindelse
        httpOnly: true // Forhindrer JavaScript-adgang til cookien
    };
    // Fusioner standardindstillinger med de indstillinger, der er angivet i options-parameteren
    const mergedOptions = { ...defaultOptions, ...options };
    // Implementér logikken til at indstille en cookie i svaret (response)
    res.cookie(name, value, mergedOptions);
}
function getCookie(req, name) {
    // Implementér logikken til at hente en cookie fra forespørgslen (request)
    return req.cookies[name];
}
module.exports = { setCookie, getCookie };