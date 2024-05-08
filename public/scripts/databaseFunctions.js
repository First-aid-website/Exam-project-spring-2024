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
        // Format the duration string
        if (durationHours === 0) {
            return `${durationMinutes} minutter`;
        } else {
            return `${durationHours} timer og ${durationMinutes} minutter`;
        }
    }
}
function getMonthName(monthNumber) {
    const months = [
        "Januar", "Februar", "Marts", "April", "Maj", "Juni",
        "Juli", "August", "September", "Oktober", "November", "December"
    ];
    return months[monthNumber - 1]; // Month numbers are 1-indexed, but array is 0-indexed
}