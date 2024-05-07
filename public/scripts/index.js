//Funktioner til at vise eller skjule vores modals
const MODAL = document.getElementById('modal');
const CLOSE_MODAL_BUTTON = document.getElementById('closeModal');
const SHOW_MODAL_BUTTON = document.getElementById('showModalButton');
const FORM_MODAL = document.getElementById('courseForm');
const FOCUS_FIELD = document.getElementById('title');
const SUBMIT = document.getElementById('submitCreation');
let isCloseButtonFocused = false;

function closeModal(skipConfirmation) {
    const hasInputs = checkForInputs();
    if (hasInputs && !skipConfirmation) {
        const shouldClose = confirm('Der er ikke-færdiggjorte ændringer, er du sikker på du vil lukke kursusoprettelsen?');
        if (!shouldClose) {
            return;
        }
    }
    clearInputs();
    MODAL.classList.add('hidden');
}

function showModal() {
    MODAL.classList.remove('hidden');
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

//----------------------------------- Modal form logic ------------------------------//
function checkForInputs() {
    const inputFields = document.querySelectorAll('#courseForm [required]');
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].value.trim() !== '') {
            return true;
        }
    }
    return false;
}
function clearInputs() {
    const inputFields = document.querySelectorAll('#courseForm [required]');
    inputFields.forEach(function(input) {
        input.value = '';
    });
}

const DAY_DROPDOWN = document.getElementById('dateDay');
const MONTH_DROPDOWN = document.getElementById('dateMonth');
const YEAR_DROPDOWN = document.getElementById('dateYear');

if (YEAR_DROPDOWN && MONTH_DROPDOWN && DAY_DROPDOWN) {
    const CURRENT_DAY = new Date().getDate();
    const CURRENT_MONTH = new Date().getMonth();
    const CURRENT_YEAR = new Date().getFullYear();
    let selectedMonth = parseInt(MONTH_DROPDOWN.value);
    let selectedYear = parseInt(YEAR_DROPDOWN.value);

    MONTH_DROPDOWN.options[CURRENT_MONTH].selected = true;
    for (let i = 0; i < 6; i++) {
        const option = document.createElement('option');
        const year = CURRENT_YEAR + i;
        option.value = year;
        option.text = year;
        YEAR_DROPDOWN.add(option);
    }
    
    function updateMonthOptions() {
        selectedMonth = parseInt(MONTH_DROPDOWN.value);
        selectedYear = parseInt(YEAR_DROPDOWN.value);
        let disabledMonths = selectedYear === CURRENT_YEAR ? CURRENT_MONTH : -1;
        for (let i = 0; i < MONTH_DROPDOWN.options.length; i++) {
            MONTH_DROPDOWN.options[i].disabled = i < disabledMonths;
        }
        updateDayOptions();
    }
    
    function updateDayOptions() {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const disablePriorDays = (selectedYear === CURRENT_YEAR && selectedMonth === CURRENT_MONTH);
    
        DAY_DROPDOWN.innerHTML = '';
    
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (disablePriorDays && i < CURRENT_DAY) {
                option.disabled = true;
            }
            DAY_DROPDOWN.appendChild(option);
        }
    }

    updateDayOptions();
    updateMonthOptions();
    MONTH_DROPDOWN.addEventListener('change', updateMonthOptions);
    YEAR_DROPDOWN.addEventListener('change', updateDayOptions);
    YEAR_DROPDOWN.addEventListener('change', updateMonthOptions);
}

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const DESCRIPTION = document.getElementById('description');

if (page1 && page2 && prevBtn && nextBtn) {
    let currentPage = 1;
    function showPage1() {
        page1.classList.remove('hidden');
        page2.classList.add('hidden');
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        currentPage = 1;
        nextBtn.focus();
        updatePagination();
    }
    function showPage2() {
        page1.classList.add('hidden');
        page2.classList.remove('hidden');
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        currentPage = 2;
        DESCRIPTION.focus();
        updatePagination();
    }

    function updatePagination() {
        document.getElementById('pagination').textContent = '(' + currentPage + '/2)';
    }

        // Function to handle space key press for next button
    function handleNextButtonSpace(event) {
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault(); // Prevent scrolling
            showPage2(); // Show page 2 when space key is pressed on next button
        }
    }

    // Function to handle space key press for previous button
    function handlePrevButtonSpace(event) {
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault(); // Prevent scrolling
            showPage1(); // Show page 1 when space key is pressed on previous button
        }
    }

    // Add event listeners for keydown event
    document.addEventListener('keydown', function(event) {
        if (nextBtn === document.activeElement) { // Check if nextBtn has focus
            handleNextButtonSpace(event);
        } else if (prevBtn === document.activeElement) { // Check if prevBtn has focus
            handlePrevButtonSpace(event);
        }
    });

    showPage1();
    prevBtn.addEventListener('click', showPage1);
    nextBtn.addEventListener('click', showPage2);
}
