const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mainMenu');

function hideMobileMenu() {
    mobileMenu.classList.add('hidden');
}
function showMobileMenu() {
    mobileMenu.classList.remove('hidden')
}
function toggleMobileMenu() {
    if(mobileMenu.classList.contains('hidden')){
        showMobileMenu();
    } else {
        hideMobileMenu();
    }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);