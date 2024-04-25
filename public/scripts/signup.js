document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const username = formData.get("username");
    const password = formData.get("password");
    
    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        // Assuming successful registration
        alert(data.message); // Display a success message
    } catch (error) {
        console.error("Error:", error);
        alert(error.message); // Display the error message
    }
});
