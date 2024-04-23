const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mainMenu');
let burgerMenu = 'fa-bars';
let closeMenu = 'fa-x';

function hideMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.classList.remove(closeMenu);
    mobileMenuBtn.classList.add(burgerMenu);
}
function showMobileMenu() {
    mobileMenu.classList.remove('hidden')
    mobileMenuBtn.classList.remove(burgerMenu);
    mobileMenuBtn.classList.add(closeMenu);
}
function toggleMobileMenu() {
    if(mobileMenu.classList.contains('hidden')){
        showMobileMenu();
    } else {
        hideMobileMenu();
    }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);