const USERNAME_LOGIN = document.getElementById('username');
const NAME_FORM = document.getElementById('name');
const USERNAME_REGEX = /[^a-zæøåA-ZÆØÅ0-9]/g;
const NAME_REGEX = /[^a-zæøåA-ZÆØÅ\s]/g;
const MAX_USERNAME_LENGTH = 20;
const MAX_NAME_LENGTH = 50;

function restrictInput(input, regex, maxLength) {
    let value = input.value;
    
    value = value.replace(regex, '');
    
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }
    
    input.value = value;
}

if (USERNAME_LOGIN) {
    USERNAME_LOGIN.addEventListener("input", function() {
        restrictInput(USERNAME_LOGIN, USERNAME_REGEX, MAX_USERNAME_LENGTH);
    });
}

if (NAME_FORM) {
    NAME_FORM.addEventListener("input", function() {
        restrictInput(NAME_FORM, NAME_REGEX, MAX_NAME_LENGTH);
    });
}
