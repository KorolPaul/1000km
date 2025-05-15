const menuToggleElement = document.querySelector('.menu-toggle');
const menuCloseElement = document.querySelector('.main-menu_close');

function toggleMenu(e) {
  e.preventDefault();

  document.body.classList.toggle('menu-opened');
}

menuToggleElement.addEventListener('click', toggleMenu);
menuCloseElement.addEventListener('click', toggleMenu);
