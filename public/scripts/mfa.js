// mfa.js
document.getElementById("mfaForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const mfaCode = formData.get("mfaCode");
    
    try {
        const response = await fetch("http://localhost:3000/activate-mfa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mfaCode })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message); // Assuming the server sends back some response data
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while activating MFA.");
    }
});
