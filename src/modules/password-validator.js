function validatePassword(password) {
    try {
        const minLength = 16;
        const regexSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const regexDigit = /[0-9]/;
        const regexUpperCase = /[A-Z]/;

        if (password.length < minLength) {
            throw new Error('Password skal være mindst 16 tegn langt.');
        }

        if (!regexSpecial.test(password)) {
            throw new Error('Password skal indeholde mindst ét specialtegn.');
        }

        if (!regexDigit.test(password)) {
            throw new Error('Password skal indeholde mindst ét tal.');
        }

        if (!regexUpperCase.test(password)) {
            throw new Error('Password skal indeholde mindst ét stort bogstav.');
        }

        return { isValid: true };
    } catch (error) {
        return { isValid: false, message: error.message };
    }
}

module.exports = { validatePassword };
