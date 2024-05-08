document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/courses/private')
        .then(response => response.json())
        .then(data => {
            const privateCourseList = document.getElementById('privateCourseList');
            privateCourseList.innerHTML = '';
            data.forEach(course => {
                const listItem = document.createElement('li');
                listItem.classList.add('courseWrapper');
                const startTimeHrs = parseInt(course.startTimeHrs);
                const startTimeMin = parseInt(course.startTimeMin);
                const endTimeHrs = parseInt(course.endTimeHrs);
                const endTimeMin = parseInt(course.endTimeMin);
                const monthName = getMonthName(parseInt(course.dateMonth));
                const duration = calcDuration(startTimeHrs, startTimeMin, endTimeHrs, endTimeMin);
                listItem.innerHTML = `
                    <div class="courseDetails">
                        <h2 class="courseTitle">${course.title}</h2>
                        <p class="courseParticipants"><i class="fas fa-users"></i> Op til ${course.participants} deltagere</p>
                        <h3 class="courseDuration"><i class="far fa-calendar"></i> ${course.dateDay}. ${monthName} (${course.dateYear})<br><i class="far fa-clock"></i> ${duration}</h3>
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
    
    // kl. ${course.startTimeHrs}:${course.startTimeMin}-${course.endTimeHrs}:${course.endTimeMin} 