document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const username = formData.get("username");
    const password = formData.get("password");
    
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log('Login response:', data); // Tilføj denne linje for at kontrollere svaret fra serveren
        
        if (response.ok) {
            // Hent session-ID fra cookien
            const sessionId = getCookieValue("sessionId");
            console.log("Session ID fra cookien:", sessionId);

            // Omdiriger til den angivne URL
            window.location.href = data.redirectUrl;
        } else {
            // Håndter forskellige typer af fejl fra serveren
            if (response.status === 401) {
                throw new Error("Forkert brugernavn eller adgangskode.");
            } else if (response.status === 500) {
                throw new Error("Der opstod en serverfejl. Prøv igen senere.");
            } else {
                throw new Error("Der opstod en ukendt fejl.");
            }
        }
    } catch (error) {
        console.error("Fejl:", error);
        alert(error.message); // Vis fejlmeddelelse til brugeren
    }
});

// Hjælpefunktion til at hente værdien af en cookie baseret på navnet
function getCookieValue(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return null;
    }
}
