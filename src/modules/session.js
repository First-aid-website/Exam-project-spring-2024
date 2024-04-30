const sessions = {};
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutter i millisekunder

function createSession(userId) {
    const sessionId = generateSessionId();
    sessions[sessionId] = { userId };
    return sessionId;
}
function getSession(sessionId) {
    return sessions[sessionId];
}
function deleteSession(sessionId) {
    delete sessions[sessionId];
}
function validateAndUpdateSession(sessionId) {
    const session = sessions.get(sessionId);
    if (session && session.expirationTime > Date.now()) {
        // Opdater udløbstiden
        session.expirationTime = Date.now() + SESSION_TIMEOUT;
        return true; // Sessionen er gyldig og blev opdateret
    } else {
        // Sessionen er udløbet eller findes ikke
        deleteSession(sessionId);
        return false; // Sessionen er ikke gyldig
    }
}
function generateSessionId() {
    // Implementer logik til at generere et unikt session ID
    return Math.random().toString(36).substring(2, 15);
}
module.exports = {
    createSession,
    getSession,
    deleteSession,
    validateAndUpdateSession
};