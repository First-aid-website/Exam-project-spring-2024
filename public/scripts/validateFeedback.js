const USERNAME_FIELD = document.getElementById("username");
const PASSWORD_FIELD = document.getElementById("password");
const CONFIRM_PASSWORD_FIELD = document.getElementById("confirmPassword");
const PASSWORD_FEEDBACK_LIST = document.getElementById("passFeedbackListPassword");
const MATCH_FEEDBACK_LIST = document.getElementById("passFeedbackListMatch");
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
    addFeedback(PASSWORD_CRITERIA[criterion].message, PASSWORD_FEEDBACK_LIST);
}

PASSWORD_FIELD.addEventListener("input", toggleButton);
CONFIRM_PASSWORD_FIELD.addEventListener("input", toggleButton);
CONFIRM_PASSWORD_FIELD.addEventListener("input", validatePasswordsMatch);
USERNAME_FIELD.addEventListener("input", toggleButton);

let passwordMatchMessageShown = false;

function toggleButton() {
    const password = PASSWORD_FIELD.value;
    const isValid = validatePass(password);
    const matching = validatePasswordsMatch();
    
    if (!isValid || !matching || password === "" || CONFIRM_PASSWORD_FIELD.value === "" || USERNAME_FIELD.value === "") {
        REGISTER_BUTTON.disabled = true;
    } else {
        REGISTER_BUTTON.disabled = false;
    }
}

function validatePasswordsMatch() {
    const password = PASSWORD_FIELD.value;
    const confirmPassword = CONFIRM_PASSWORD_FIELD.value;
    const message = "*Kodeordene er ikke ens";
    MATCH_FEEDBACK_LIST.innerHTML = "";

    if (password !== confirmPassword && confirmPassword !== "") {
        addFeedback(message, MATCH_FEEDBACK_LIST);
        passwordMatchMessageShown = true;
        return false;
    } else {
        removeFeedback(message, MATCH_FEEDBACK_LIST);
        passwordMatchMessageShown = false;
        return true;
    }
}

function validatePass(password) {
    let isValid = true;
    PASSWORD_FEEDBACK_LIST.innerHTML = "";

    for (const criterion in PASSWORD_CRITERIA) {
        if (!PASSWORD_CRITERIA[criterion].regex.test(password)) {
            addFeedback(PASSWORD_CRITERIA[criterion].message, PASSWORD_FEEDBACK_LIST);
            isValid = false;
        } else {
            removeFeedback(PASSWORD_CRITERIA[criterion].message, PASSWORD_FEEDBACK_LIST);
        }
    }

    return isValid;
}

function addFeedback(message, feedbackList) {
    const feedback = document.createElement("li");
    feedback.textContent = message;
    feedback.classList.add("invalid-feedback");
    feedbackList.appendChild(feedback);
}

function removeFeedback(message, feedbackList) {
    const feedbackItems = feedbackList.querySelectorAll("li");
    feedbackItems.forEach(item => {
        if (item.textContent === message) {
            item.remove();
        }
    });
}
