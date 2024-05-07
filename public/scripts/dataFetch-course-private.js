document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/courses/private')
        .then(response => response.json())
        .then(data => {
            const privateCourseList = document.getElementById('privateCourseList');
            privateCourseList.innerHTML = '';
            data.forEach(course => {
                const listItem = document.createElement('li');
                listItem.classList.add('courseWrapper');
                listItem.innerHTML = `
                    <div class="courseDetails">
                        <h2 class="courseTitle">${course.title}</h2>
                        <p class="courseParticipants">${course.participants}</p>
                        <h3 class="courseDuration">${course.dateDay}${course.dateMonth}${course.dateYear} kl. ${course.startTimeHrs}:${course.startTimeMin}-${course.endTimeHrs}:${course.endTimeMin}</h3>
                        <h3 class="coursePrice">${course.price},-</h3>
                        <a href="#" class="bookBtn readMore">Bestil Plads</a>
                    </div>
                    <ul class="courseTeachings">
                    ${course.content.split(',').map(content => `<li>${content.trim()}</li>`).join('')}
                    </ul>
                `;
                privateCourseList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fejl ved hentning af kurser til private:', error));
    });
    