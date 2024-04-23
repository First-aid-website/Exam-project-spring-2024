const sessions = new Map();

function createSession(userId) {
    const sessionId = generateSessionId();
    sessions.set(sessionId, { userId });
    return sessionId;
}

function getSession(sessionId) {
    return sessions.get(sessionId);
}

function deleteSession(sessionId) {
    sessions.delete(sessionId);
}

function generateSessionId() {
    // Implementer logik til at generere et unikt session ID
    return Math.random().toString(36).substring(2, 15);
}

module.exports = {
    createSession,
    getSession,
    deleteSession
};
