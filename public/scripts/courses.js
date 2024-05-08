document.getElementById('courseForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Forhindrer standardformularhåndtering

    const formData = new FormData(this); // Indsaml data fra formularen
    const courseData = {};
    formData.forEach((value, key) => {
        courseData[key] = value;
    });

    try {
        const response = await fetch('http://localhost:3000/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData), // Brug formData direkte som body
            credentials: "include" // Inkluderer cookies i anmodningen
        });
        const data = await response.json();
        if(response.ok){
            window.location.href = data.redirectUrl;
        }
    } catch (error) {
        console.error('Fejl ved sendning af anmodning:', error);
        alert('Der opstod en fejl ved sendning af anmodning til /courses-endepunktet.');
    }
});

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            console.log("SessionId from cookies:", cookieValue);
            return cookieValue;
        }
    }
}