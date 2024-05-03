//Funktioner til at vise eller skjule vores modals
const MODAL = document.getElementById('modal');
const CLOSE_MODAL_BUTTON = document.getElementById('closeModal');
const SHOW_MODAL_BUTTON = document.getElementById('showModalButton');
const FORM_MODAL = document.getElementById('courseForm');
const FOCUS_FIELD = document.getElementById('title');
let isCloseButtonFocused = false;

function closeModal() {
    MODAL.classList.add('hidden');
    document.body.classList.remove('modal-open');
    SHOW_MODAL_BUTTON.focus();
}
function showModal() {
    MODAL.classList.remove('hidden');
    document.body.classList.add('modal-open');
    FOCUS_FIELD.focus();
}
function modalShown() {
    console.log(!MODAL.classList.contains('hidden'));
    return !MODAL.classList.contains('hidden');
}

//Sørger lige for, at vi kun tilføjer eventhandleren hvis et modal element findes
if (MODAL) {
    MODAL.addEventListener('click', function(event) {
        //Lukker modal'et hvis der klikkes på andet end formen
        if (!FORM_MODAL.contains(event.target)) {
            closeModal();
        }
    });
    CLOSE_MODAL_BUTTON.addEventListener('click', function() {
        closeModal();
    });
    SHOW_MODAL_BUTTON.addEventListener('click', function() {
        showModal();
    })
    window.addEventListener('keyup', function(e) {
        if (e.key === 'Escape' && modalShown()) {
            closeModal();
        }
        if (isCloseButtonFocused && e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });
    CLOSE_MODAL_BUTTON.addEventListener('focus', function() {
        isCloseButtonFocused = true;
    });
    CLOSE_MODAL_BUTTON.addEventListener('blur', function() {
        isCloseButtonFocused = false;
    });
}
