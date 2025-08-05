const isMobile = screen.width <= 1024;

// common
function handleClickOutside(target, callback) {
  if (!target) return;

  function handleClick(event) {
    if (!target.contains(event.target)) {
      callback(event);
    }
  }

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
}

const menuToggleElement = document.querySelector('.menu-toggle');
const menuCloseElement = document.querySelector('.main-menu_close');

function toggleMenu(e) {
  e.preventDefault();

  document.body.classList.toggle('menu-opened');
}

menuToggleElement.addEventListener('click', toggleMenu);
menuCloseElement.addEventListener('click', toggleMenu);

/* popups */
function closePopup() {
  document.querySelectorAll('.popup.opened').forEach((el) => el.classList.remove('opened'));
  document.body.classList.remove('popup-opened');
}

document.querySelectorAll('.fade').forEach((el) => el.addEventListener('click', closePopup));
document.querySelectorAll('.popup_close').forEach((el) => el.addEventListener('click', closePopup));

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
let fakeSelectClickOutsideEvent = null;

function toggleFakeSelect(e) {
  if (e?.preventDefault) {
    e?.preventDefault();
  }

  if (e.target.nextElementSibling.classList.contains('opened')) {
    fakeSelectPopups.forEach((el => el.classList.remove('opened')));
    e.target.removeEventListener('click', fakeSelectClickOutsideEvent);
    fakeSelectClickOutsideEvent = null;
  } else {
    if (e?.preventDefault) {
      fakeSelectClickOutsideEvent = handleClickOutside(e.target, () => fakeSelectPopups.forEach((el => {
        el.classList.remove('opened');
      })));
    }
    e.target.nextElementSibling.classList.add('opened');

  }
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

  const formData = new FormData();
  formData.append('art', art);
  formData.append('brand', brand);
  formData.append('artbrand', artbrand);

  const responce = await fetch('/service-request/get-price/', {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formData,
  });
// debugger;
  const data = await responce.json();
  if (data) {
    document.querySelector('[data-artbrand=' + artbrand + ']').innerHTML = data.data.html;
  }

  cardControls.classList.remove('loading');
}

updatePriceButtons.forEach((el) => el.addEventListener('click', loadPrice));


/* Car finder */
const carFinderOptions = document.querySelectorAll('.car-finder_filters-item .fake-select_value');

function generateOptions(target, data) {
  const nextFilter = target.parentElement.parentElement.parentElement.nextElementSibling;
  nextFilter?.classList.add('active');

  const nextPopup = nextFilter?.querySelector('.fake-select_popup');

  if (!nextPopup || !data) {
    return;
  }

  nextPopup.innerHTML = '';

  function createItem(itemData) {
    const el = document.createElement('span');
    el.classList.add('fake-select_value');
    el.dataset.id = itemData?.id;
    el.dataset.year = itemData?.year;
    el.dataset.mark = itemData?.mark;
    el.dataset.model = itemData?.model;
    el.dataset.body = itemData?.body;
    el.innerHTML = itemData?.label;
    el.addEventListener('click', handleSelectCarFinderOption);

    return el;
  }

  data.forEach((item) => nextPopup.appendChild(createItem(item)));

  toggleFakeSelect({ target: nextPopup?.previousElementSibling });
}

async function handleSelectCarFinderOption(e) {
  e.preventDefault();

  const parentPopup = e.target.parentElement;
  parentPopup?.classList.remove('opened');

  if (parentPopup && parentPopup.previousElementSibling && e.target.innerText) {
    parentPopup.previousElementSibling.innerText = e.target.innerText;
  }

  const key = parentPopup?.dataset?.key || null;

  let data = null;
  const formData = new FormData();

  switch(key) {
    case 'year':
      year = e.target.dataset['year'];
      formData.append('year', year);

      const yearResponce = await fetch('/car-ajax/get-marks-by-year/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      data = await yearResponce.json();
      break;

    case 'mark':
      year = e.target.dataset['year'];
      markId = e.target.dataset['id'];

      formData.append('year', year);
      formData.append('mark', markId);

      markResponce = await fetch('/car-ajax/get-models-by-year-mark/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      data = await markResponce.json();
      break;
    case 'model':
      year = e.target.dataset['year'];
      modelId = e.target.dataset['id'];
      markId = e.target.dataset['mark'];

      formData.append('year', year);
      formData.append('mark', markId);
      formData.append('model', modelId);

      bodyResponce = await fetch('/car-ajax/get-body-by-year-mark-models/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      data = await bodyResponce.json();
      break;
    case 'body':
      year = e.target.dataset['year'];
      bodyId = e.target.dataset['id'];
      modelId = e.target.dataset['model'];
      markId = e.target.dataset['mark'];

      formData.append('year', year);
      formData.append('mark', markId);
      formData.append('model', modelId);
      formData.append('body', bodyId);

      engineResponce = await fetch('/car-ajax/get-engine-by-year-mark-models-body/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      data = await engineResponce.json();
      break;
    case 'engine_fuel':
      year = e.target.dataset['year'];
      engineId = e.target.dataset['id'];
      modelId = e.target.dataset['model'];
      markId = e.target.dataset['mark'];

      formData.append('year', year);
      formData.append('mark', markId);
      formData.append('model', modelId);
      formData.append('engine', engineId);

      engineResponce = await fetch('/car-ajax/get-engine-code-by-year-mark-models-body-fuel-volume/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      data = await engineResponce.json();
      break;
    case 'engine_code':
      engineId = e.target.dataset['id'];

      formData.append('engine', engineId);

      engineResponce = await fetch('/car-ajax/set-engine-by-id/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData,
      });
      //window.location.reload(true);
      data = await engineResponce.json();
      break;
  }

  generateOptions(e.target, data);
}

carFinderOptions.forEach((el) => el.addEventListener('click', handleSelectCarFinderOption));

/* disclaimer */
const disclaimerButtons = document.querySelectorAll('.disclaimer_button');

function toggleDisclaimer(e) {
  e.preventDefault();
  e.target.parentElement.parentElement.classList.toggle('opened');
}

disclaimerButtons.forEach((el) => el.addEventListener('click', toggleDisclaimer));

/* cars popup */
const carsPopupButtons = document.querySelectorAll('.js-cars-select-button');

function toggleCarsPopup(popup) {
  popup.classList.toggle('opened');
  document.body.classList.toggle('popup-opened');
}

carsPopupButtons.forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  toggleCarsPopup(document.querySelector('.js-my-cars-popup'));
}));

const carsInPopup = document.querySelectorAll('.car-finder_my-cars-popup .car-finder_result-car');

function selectCarFromPopup(e) {
  const { currentTarget } = e;

  document.querySelector('.car-finder_result-car').innerHTML = currentTarget.querySelector('.car-finder_result-car-content').innerHTML;
  currentTarget.querySelector('input').checked = true;
  closePopup();
}

carsInPopup.forEach((el) => el.addEventListener('click', selectCarFromPopup));

const addCarButton = document.querySelectorAll('.js-cars-add-car');
addCarButton.forEach((el) => el.addEventListener('click', () => document.querySelector('.car-finder.hidden')?.classList.remove('hidden')));
