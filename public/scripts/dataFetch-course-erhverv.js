document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/courses/erhverv')
        .then(response => response.json())
        .then(data => {
            const erhvervCourseList = document.getElementById('erhvervCourseList');
            erhvervCourseList.innerHTML = '';
            data.forEach(course => {
                const listItem = document.createElement('li');
                listItem.classList.add('courseWrapper');
                const duration = calcDuration(course.startTimeHrs, course.startTimeMin, course.endTimeHrs, course.endTimeMin);
                listItem.innerHTML = `
                    <div class="courseDetails">
                        <h2 class="courseTitle">${course.title}</h2>
                        <p class="courseParticipants">${course.participants}</p>
                        <h3 class="courseDuration">${course.dateDay}${course.dateMonth}${course.dateYear} kl. ${course.startTimeHrs}:${course.startTimeMin}-${course.endTimeHrs}:${course.endTimeMin} (${duration})</h3>
                        <h3 class="coursePrice">${course.price},- ekls. moms</h3>
                        <a href="#" class="bookBtn readMore">Bestil Plads</a>
                    </div>
                    <ul class="courseTeachings">
                    ${course.content.split(',').map(content => `<li>${content.trim()}</li>`).join('')}
                    </ul>
                `;
                erhvervCourseList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fejl ved hentning af kurser til erhverv:', error));
    });

    function calcDuration(startHr, startMin, endHr, endMin) {
        // Convert start time to minutes
        const startTimeInMinutes = startHr * 60 + startMin;
    
        // Convert end time to minutes
        const endTimeInMinutes = endHr * 60 + endMin;
    
        // Calculate difference in minutes
        let durationInMinutes = endTimeInMinutes - startTimeInMinutes;
    
        // If the end time is before the start time, adjust for crossing midnight
        if (durationInMinutes < 0) {
            durationInMinutes += 24 * 60; // Add 24 hours in minutes
        }
    
        // Calculate duration in hours and minutes
        const durationHours = Math.floor(durationInMinutes / 60);
        const durationMinutes = durationInMinutes % 60;
    
        if (durationMinutes === 0) {
            return `${durationHours} timer`;
        } else {
            return `${durationHours} timer og ${durationMinutes} minutter`;
        }
    }
    console.log(calcDuration(10,40,15,30));