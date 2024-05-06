const NUMBERS_ONLY = /[^\d]/g;
const LETTERS_ONLY = /[^a-zæøåA-ZÆØÅ\s]/g;
const inputs = {
    'username': {
        element: document.getElementById('username'),
        regex: /[^a-zæøåA-ZÆØÅ0-9]/g,
        maxLength: 20
    },
    'name': {
        element: document.getElementById('name'),
        regex: LETTERS_ONLY,
        maxLength: 50
    },
    'title': {
        element: document.getElementById('title'),
        regex: LETTERS_ONLY,
        maxLength: 150
    },
    'hours': {
        element: document.getElementById('durationHrs'),
        regex: NUMBERS_ONLY,
        maxLength: 3
    },
    'minutes': {
        element: document.getElementById('durationMin'),
        regex: NUMBERS_ONLY,
        maxLength: 3
    },
    'price': {
        element: document.getElementById('price'),
        regex: NUMBERS_ONLY,
        maxLength: 5
    },
    'participants': {
        element: document.getElementById('participants'),
        regex: NUMBERS_ONLY,
        maxLength: 3
    }
};

function restrictInput(inputObj) {
    let value = inputObj.element.value;
    const newValue = value.replace(inputObj.regex, ''); // Remove disallowed characters
    value = newValue.slice(0, inputObj.maxLength); // Limit to maximum length
    inputObj.element.value = value;
}

for (const inputName in inputs) {
    const input = inputs[inputName];
    if (input.element) {
        input.element.addEventListener("input", function() {
            restrictInput(input);
        });
    }
}

