document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/courses/erhverv')
        .then(response => response.json())
        .then(data => {
            const erhvervCourseList = document.getElementById('erhvervCourseList');
            erhvervCourseList.innerHTML = '';
            data.forEach(course => {
                const listItem = document.createElement('li');
                listItem.classList.add('courseWrapper');
                listItem.innerHTML = `
                    <div class="courseDetails">
                        <h2 class="courseTitle">${course.title}</h2>
                        <p class="courseParticipants">${course.participants}</p>
                        <h3 class="courseDuration">${course.duration}</h3>
                        <h3 class="coursePrice">${course.price}</h3>
                        <a href="#" class="bookBtn readMore">Bestil Plads</a>
                    </div>
                    <ul class="courseTeachings">
                    ${course.indhold}
                    </ul>
                    `;
                erhvervCourseList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fejl ved hentning af kurser til erhverv:', error));
    });
    
    // ${course.teachings.map(teaching => `<li>${teaching}</li>`).join('')}