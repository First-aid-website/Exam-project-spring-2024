// sanitizeInput.js

// Define regular expressions and maximum lengths for sanitization
const TITLE_REGEX = /[^a-zæøåA-ZÆØÅ0-9\s[.,()]/g;
const NUMBERS_ONLY = /[^\d]/g;

// Function to sanitize input data
function sanitizeInput(courseData) {
    const inputs = {
        'title': {
            regex: TITLE_REGEX,
            maxLength: 100
        },
        'startTimeHrs': {
            regex: NUMBERS_ONLY,
            maxLength: 2
        },
        'startTimeMin': {
            regex: NUMBERS_ONLY,
            maxLength: 2
        },
        'endTimeHrs': {
            regex: NUMBERS_ONLY,
            maxLength: 2
        },
        'endTimeMin': {
            regex: NUMBERS_ONLY,
            maxLength: 2
        },
        'price': {
            regex: NUMBERS_ONLY,
            maxLength: 5
        },
        'participants': {
            regex: NUMBERS_ONLY,
            maxLength: 2
        }
    };

    for (const inputName in inputs) {
        const inputValue = courseData[inputName];
        if (inputValue && typeof inputValue === 'string') {
            const { regex, maxLength } = inputs[inputName];
            const sanitizedValue = inputValue.replace(regex, '').slice(0, maxLength);
            courseData[inputName] = sanitizedValue;
        }
    }

    if (typeof courseData.teachings === 'string') {
        // Split values by comma or whitespace
        courseData.teachings = courseData.teachings.split(',');
    }

    return courseData;
}

module.exports = sanitizeInput;
