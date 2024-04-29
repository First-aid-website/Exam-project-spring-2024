const PASSWORD_FIELD = document.getElementById("password");
const CONFIRM_PASSWORD_FIELD = document.getElementById("confirmPassword");
const OUTPUT_LIST = document.getElementById("passFeedbackList");
const REGISTER_BUTTON = document.getElementById("registerButton");

REGISTER_BUTTON.disabled = true;

const PASSWORD_CRITERIA = {
    minLength: {
        regex: /^.{16,}$/,
        message: "*Kodeordet skal være mindst 16 tegn"
    },
    lowerUpperCase: {
        regex: /(?=.*\p{Ll})(?=.*\p{Lu})/gu,
        message: "*Kodeordet skal indeholde mindst ét stort og småt bogstav"
    },
    numbers: {
        regex: /(?=.*\d)/,
        message: "*Kodeordet skal indeholde mindst ét tal"
    },
    specialChars: {
        regex: /(?=.*\W)/,
        message: "*Kodeordet skal indeholde mindst ét specialtegn (#,@,!,?... osv.)"
    },
};

for (const criterion in PASSWORD_CRITERIA) {
    addFeedback(PASSWORD_CRITERIA[criterion].message);
}

PASSWORD_FIELD.addEventListener("input", validatePassword);
CONFIRM_PASSWORD_FIELD.addEventListener("input", validatePassword);
CONFIRM_PASSWORD_FIELD.addEventListener("input", validatePasswordsMatch);


let passwordMatchMessageShown = false;

function validatePassword() {
    const password = PASSWORD_FIELD.value;
    const isValid = validatePass(password);
    const matching = validatePasswordsMatch();
    
    if (!isValid || !matching || password === "" || CONFIRM_PASSWORD_FIELD.value === "") {
        REGISTER_BUTTON.disabled = true;
    } else {
        REGISTER_BUTTON.disabled = false;
    }
}

function validatePasswordsMatch() {
    const password = PASSWORD_FIELD.value;
    const confirmPassword = CONFIRM_PASSWORD_FIELD.value;
    const message = "*Kodeordene er ikke ens";

    let matching = true;

    if (password !== confirmPassword && confirmPassword !== "") {
        matching = false;
        if (!passwordMatchMessageShown) {
            addFeedback(message);
            passwordMatchMessageShown = true;
        }
    } else {
        removeFeedback(message);
        passwordMatchMessageShown = false;
    }

    return matching;
}

function validatePass(password) {
    let isValid = true;
    OUTPUT_LIST.innerHTML = "";

    for (const criterion in PASSWORD_CRITERIA) {
        if (!PASSWORD_CRITERIA[criterion].regex.test(password)) {
            addFeedback(PASSWORD_CRITERIA[criterion].message);
            isValid = false;
        } else {
            removeFeedback(PASSWORD_CRITERIA[criterion].message);
        }
    }

    return isValid;
}

function addFeedback(message) {
    const feedback = document.createElement("li");
    feedback.textContent = message;
    feedback.classList.add("invalid-feedback");
    OUTPUT_LIST.appendChild(feedback);
}

function removeFeedback(message) {
    const feedbackItems = OUTPUT_LIST.querySelectorAll("li");
    feedbackItems.forEach(item => {
        if (item.textContent === message) {
            item.remove();
        }
    });
}
