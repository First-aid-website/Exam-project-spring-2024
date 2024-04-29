document.getElementById('courseForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Forhindrer standardformularhåndtering

    const formData = new FormData(this); // Indsaml data fra formularen
    const courseData = {};
    formData.forEach((value, key) => {
        courseData[key] = value;
    });

    try {
        const cookieValue = getCookie('sessionId'); // Få session cookie-værdien ved at kalde den lokale getCookie-funktion
        console.log("SessionId sendt med anmodning:", cookieValue);
        
        const response = await fetch('http://localhost:3000/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sessionId': cookieValue // Tilføj session cookien til anmodningens header
            },
            body: JSON.stringify(courseData), // Brug formData direkte som body
            withCredentials: true // Tilføj denne linje
        });
        const data = await response.json();
        console.log(data); // Udskriv det modtagne svar i konsollen
        alert('Kursus oprettet!');
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