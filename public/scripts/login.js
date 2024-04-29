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
            window.location.href = data.redirectUrl;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert(error.message); // Display the error message
    }
});
