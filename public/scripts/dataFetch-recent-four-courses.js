document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display 4 most recent private courses
    fetch('http://localhost:3000/courses/private')
        .then(response => response.json())
        .then(data => {
            const privateCoursesList = document.getElementById('privateCourses');
            privateCoursesList.innerHTML = ''; // Clear existing content
            data.slice(0, 4).forEach(course => { // Slice to get the first 4 courses
                const listItem = document.createElement('li');
                listItem.textContent = course.title; // Display only the course title
                privateCoursesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fejl ved hentning af private kurser:', error));

    // Fetch and display 4 most recent erhverv courses
    fetch('http://localhost:3000/courses/erhverv')
        .then(response => response.json())
        .then(data => {
            const erhvervCoursesList = document.getElementById('erhvervCourses');
            erhvervCoursesList.innerHTML = ''; // Clear existing content
            data.slice(0, 4).forEach(course => { // Slice to get the first 4 courses
                const listItem = document.createElement('li');
                listItem.textContent = course.title; // Display only the course title
                erhvervCoursesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fejl ved hentning af erhvervskurser:', error));
});
