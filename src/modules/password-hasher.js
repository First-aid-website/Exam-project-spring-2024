const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const saltRounds = 12; //Antal saltrunder
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Kunne ikke hashe kodeordet: ' + error.message);
    }
}

module.exports = {
    hashPassword
};
