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


  catalogMenuCategoriesElements.forEach((el) => el.classList.remove('active'));
  catalogSubcategories.forEach((el) => el.classList.remove('opened'));

  document.querySelector(`.catalog-menu_category-item[data-catalog-menu="${index}"]`)?.classList.add('active');
  document.querySelector(`.catalog-menu_subcategory[data-catalog-menu="${index}"]`)?.classList.add('opened');

}

catalogMenuCategoriesElements.forEach((el) => el.addEventListener('click', selectCategory));

/* fake select */
const fakeSelects = document.querySelectorAll('.fake-select_button');
const fakeSelectPopups = document.querySelectorAll('.fake-select_popup');

function toggleFakeSelect(e) {
  e.preventDefault();

  fakeSelectPopups.forEach((el => el.classList.remove('opened')));

  e.target.nextElementSibling.classList.toggle('opened');
}

fakeSelects.forEach((el => el.addEventListener('click', toggleFakeSelect)));

/* category page */
const updatePriceButtons = document.querySelectorAll('.js-update-price');

async function loadPrice(e) {
  e.preventDefault();

  const cardControls = e.target.parentElement.parentElement.parentElement;
  const art = e.target.dataset['art'];
  const brand = e.target.dataset['brand'];
  const artbrand = e.target.dataset['artbrand'];

  cardControls.classList.add('loading');

  const responce = await fetch('/service-request/get-price/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      art,
      brand,
      artbrand,
    }),
  });

  const data = await responce.json();
  if (data) {

    document.querySelector('[data-id=' + artbrand + ']').innerHTML = data.html;
  }

  cardControls.classList.remove('loading');

}

updatePriceButtons.forEach((el) => el.addEventListener('click', loadPrice));
