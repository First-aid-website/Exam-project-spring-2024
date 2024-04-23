const speakeasy = require('speakeasy');

function generateMFACode() {
    return speakeasy.totp({
        secret: speakeasy.generateSecret().base32,
        encoding: 'base32'
    });
}

function verifyMFACode(secret, code) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: 2 // Antal sekunder, hvor koden er gyldig
    });
}

module.exports = {
    generateMFACode,
    verifyMFACode
};
