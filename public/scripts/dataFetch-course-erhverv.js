document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/courses/erhverv')
    .then(response => response.json())
    .then(data => {
        const erhvervCourseList = document.getElementById('erhvervCourseList');
            erhvervCourseList.innerHTML = '';
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
                    <h3 class="coursePrice">${course.price},- eksl. moms</h3>
                    <a href="#" class="bookBtn readMore joinCourse">Bestil Plads</a>
                    <a href="#" class="bookBtn readMore">Læs mere</a>
                </div>
                <ul class="courseTeachings">
                ${course.content.split(',').map(content => `<li>${content.trim()}</li>`).join('')}
                </ul>
                `;
                erhvervCourseList.appendChild(listItem);
            });
            // Tilføj eventhandler til alle "Bestil Plads" knapper
            const joinButtons = document.querySelectorAll('.joinCourse');
            joinButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    const courseTitle = this.closest('.courseWrapper').querySelector('.courseTitle').textContent;
                    showModal(courseTitle);
                });
            });
        })
        .catch(error => console.error('Fejl ved hentning af kurser til erhverv:', error));
    });