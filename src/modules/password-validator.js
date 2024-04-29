function validatePassword(password) {
    try {
        const minLength = 16;
        const regexSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const regexDigit = /[0-9]/;
        const regexUpperCase = /[A-ZÆØÅ]/;
        const regexLowerCase = /[a-zæøå]/;

        if (password.length < minLength) {
            throw new Error('Kodeordet skal være mindst 16 tegn langt.');
        }
        if (!regexLowerCase) {
            throw new Error('Kodeordet skal indeholde mindst ét lille bogstav')
        }
        if (!regexSpecial.test(password)) {
            throw new Error('Kodeordet skal indeholde mindst ét specialtegn.');
        }

        if (!regexDigit.test(password)) {
            throw new Error('Kodeordet skal indeholde mindst ét tal.');
        }

        if (!regexUpperCase.test(password)) {
            throw new Error('Kodeordet skal indeholde mindst ét stort bogstav.');
        }

        return { isValid: true };
    } catch (error) {
        return { isValid: false, message: error.message };
    }
}

module.exports = { validatePassword };
