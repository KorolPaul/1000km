const isMobile = screen.width <= 1024;

const menuToggleElement = document.querySelector('.menu-toggle');
const menuCloseElement = document.querySelector('.main-menu_close');

function toggleMenu(e) {
  e.preventDefault();

  document.body.classList.toggle('menu-opened');
}

menuToggleElement.addEventListener('click', toggleMenu);
menuCloseElement.addEventListener('click', toggleMenu);

/* catalog menu */
const catalogMenuCategoriesElements = document.querySelectorAll('.catalog-menu_category-item');
const catalogSubcategories = document.querySelectorAll('.catalog-menu_subcategory');

if (!isMobile) {
  catalogSubcategories[0]?.classList.add('opened');
  catalogMenuCategoriesElements[0]?.classList.add('active');
}


const catalogMenuElement = document.querySelector('.catalog-menu');
const catalogMenuToggleElements = document.querySelectorAll('.js-toggle-catalog-menu');

function toggleCatalogMenu(e) {
  e.preventDefault();
  catalogMenuElement.classList.toggle('opened');
}

catalogMenuToggleElements.forEach((el) => el.addEventListener('click', toggleCatalogMenu));


function selectCategory(e) {
  e.preventDefault();

  catalogMenuCategoriesElements.forEach((el) => el.classList.remove('active'));
  e.currentTarget.classList.add('active');

  const index = e.currentTarget.dataset.catalogMenu;
  console.log(e.currentTarget.dataset.catalogMenu);


  catalogMenuCategoriesElements.forEach((el) => el.classList.remove('active'));
  catalogSubcategories.forEach((el) => el.classList.remove('opened'));

  document.querySelector(`.catalog-menu_category-item[data-catalog-menu="${index}"]`)?.classList.add('active');
  document.querySelector(`.catalog-menu_subcategory[data-catalog-menu="${index}"]`)?.classList.add('opened');

}

catalogMenuCategoriesElements.forEach((el) => el.addEventListener('click', selectCategory));
