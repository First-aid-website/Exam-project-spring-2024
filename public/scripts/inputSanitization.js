const USERNAME_INPUT = document.getElementById('username');
const NAME_INPUT = document.getElementById('name');
const TITLE_INPUT = document.getElementById('title');
const NUMBER_INPUT = document.querySelectorAll('.numberInput');
const USERNAME_REGEX = /[^a-zæøåA-ZÆØÅ0-9]/g;
const LETTERS_ONLY_REGEX = /[^a-zæøåA-ZÆØÅ\s]/g;
const NUMBERS_ONLY_REGEX = /[^\d]/g;
const MAX_USERNAME_LENGTH = 20;
const MAX_NAME_LENGTH = 50;
const MAX_TITLE_LENGTH = 150;
const MAX_NUMBER_LENGTH = 5;

function restrictInput(input, regex, maxLength) {
    let value = input.value;
    
    value = value.replace(regex, '');
    
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }
    
    input.value = value;
}

if (USERNAME_INPUT) {
    USERNAME_INPUT.addEventListener("input", function() {
        restrictInput(USERNAME_INPUT, USERNAME_REGEX, MAX_USERNAME_LENGTH);
    });
}

if (NAME_INPUT) {
    NAME_INPUT.addEventListener("input", function() {
        restrictInput(NAME_INPUT, LETTERS_ONLY_REGEX, MAX_NAME_LENGTH);
    });
}

if (TITLE_INPUT) {
    TITLE_INPUT.addEventListener("input", function() {
        restrictInput(TITLE_INPUT, LETTERS_ONLY_REGEX, MAX_TITLE_LENGTH);
    });
}

if (NUMBER_INPUT) {
    NUMBER_INPUT.forEach(function(input) {
        input.addEventListener("input", function() {
            restrictInput(input, NUMBERS_ONLY_REGEX, MAX_NUMBER_LENGTH);
        });
    });
}
