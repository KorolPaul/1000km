// js-cookie
!function (e) { if ("function" == typeof define && define.amd) define(e); else if ("object" == typeof exports) module.exports = e(); else { var n = window.Cookies, o = window.Cookies = e(window.jQuery); o.noConflict = function () { return window.Cookies = n, o } } }(function () { function e() { for (var e = 0, n = {}; e < arguments.length; e++) { var o = arguments[e]; for (var t in o) n[t] = o[t] } return n } function n(o) { function t(n, r, i) { var c; if (arguments.length > 1) { if (i = e({ path: "/" }, t.defaults, i), "number" == typeof i.expires) { var s = new Date; s.setMilliseconds(s.getMilliseconds() + 864e5 * i.expires), i.expires = s } try { c = JSON.stringify(r), /^[\{\[]/.test(c) && (r = c) } catch (a) { } return r = encodeURIComponent(String(r)), r = r.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), n = encodeURIComponent(String(n)), n = n.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent), n = n.replace(/[\(\)]/g, escape), document.cookie = [n, "=", r, i.expires && "; expires=" + i.expires.toUTCString(), i.path && "; path=" + i.path, i.domain && "; domain=" + i.domain, i.secure ? "; secure" : ""].join("") } n || (c = {}); for (var p = document.cookie ? document.cookie.split("; ") : [], u = /(%[0-9A-Z]{2})+/g, d = 0; d < p.length; d++) { var f = p[d].split("="), l = f[0].replace(u, decodeURIComponent), m = f.slice(1).join("="); '"' === m.charAt(0) && (m = m.slice(1, -1)); try { if (m = o && o(m, l) || m.replace(u, decodeURIComponent), this.json) try { m = JSON.parse(m) } catch (a) { } if (n === l) { c = m; break } n || (c[l] = m) } catch (a) { } } return c } return t.get = t.set = t, t.getJSON = function () { return t.apply({ json: !0 }, [].slice.call(arguments)) }, t.defaults = {}, t.remove = function (n, o) { t(n, "", e(o, { expires: -1 })) }, t.withConverter = n, t } return n() });


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

/* sticky header */
document.addEventListener('DOMContentLoaded', () => {
  const onScroll = () => {
    if (window.scrollY >= 130) {
      if (!document.body.classList.contains('fixed-menu')) {
        document.body.classList.add('fixed-menu');
        document.body.style.paddingTop = '189px';
      }
    } else {
      document.body.classList.remove('fixed-menu');
      document.body.style.paddingTop = '0';
    }
  };

  if (!isMobile) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
});

/* popups */
function closePopup() {
  document.querySelectorAll('.popup.opened').forEach((el) => el.classList.remove('opened'));
  document.body.classList.remove('popup-opened');
}

document.querySelectorAll('.fade').forEach((el) => el.addEventListener('click', closePopup));
document.querySelectorAll('.popup_close').forEach((el) => el.addEventListener('click', closePopup));

/* catalog menu */
const catalogMenuCategoriesElements = document.querySelectorAll('.catalog-menu_category-item, .categories_category-item');
const catalogSubcategories = document.querySelectorAll('.catalog-menu_subcategory, .categories_subcategory');

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

function closeSubcategores(e) {
  e?.preventDefault();
  catalogSubcategories.forEach((el) => el.classList.remove('opened'));
}

function selectCategory(e) {
  e.preventDefault();

  catalogMenuCategoriesElements.forEach((el) => el.classList.remove('active'));
  e.currentTarget.classList.add('active');

  const index = e.currentTarget.dataset.catalogMenu || e.currentTarget.dataset.category;

  catalogMenuCategoriesElements.forEach((el) => el.classList.remove('active'));
  closeSubcategores();
  document.querySelectorAll(`.catalog-menu_category-item[data-catalog-menu="${index}"], .categories_category-item[data-category="${index}"]`)
    .forEach(el => el?.classList.add('active'));
  document.querySelectorAll(`.catalog-menu_subcategory[data-catalog-menu="${index}"], .categories_subcategory[data-category="${index}"]`)
    .forEach(el => el?.classList.add('opened'));

  document.querySelector('.categories_subcategory opened')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

catalogMenuCategoriesElements.forEach((el) => el.addEventListener('click', selectCategory));

document.querySelectorAll('.categories_subcategory-title').forEach(el => el.addEventListener('click', closeSubcategores));
document.querySelectorAll('.catalog-menu_subcategory-title').forEach(el => el.addEventListener('click', (e) => {
  e.preventDefault();
  e.target.parentElement.classList.remove('opened');
}));

/* fake select */
const fakeSelects = document.querySelectorAll('.fake-select_button');
const fakeSelectPopups = document.querySelectorAll('.fake-select_popup');

function toggleFakeSelect(e) {
  if (e?.preventDefault) {
    e?.preventDefault();
  }

  if (e.target.nextElementSibling.classList.contains('opened')) {
    fakeSelectPopups.forEach((el => el.classList.remove('opened')));
  } else {
    e.target.nextElementSibling.classList.add('opened');
  }
}

fakeSelects.forEach((el => {
  el.addEventListener('click', toggleFakeSelect);
  handleClickOutside(el.parentElement, (e) => {
    if (el.nextElementSibling.classList.contains('opened')) {
      el.nextElementSibling.classList.remove('opened');
    }
  });
}));

/* add product to cart */

async function addProductToCart(e) {
  e.preventDefault();

  const button = e.target.closest('.add-to-cart');

  const parent = button.closest('.product-card_buttons');
  const input = parent.querySelector('.number-input_input');
  let qty = parseInt(input.value, 10);

  const id = e.target.dataset['id'];
  const formData = new FormData();

  formData.append('id', id);
  formData.append('qty', qty);

  const responce = await fetch('/cart/add-to-cart/', {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formData,
  });
  const dataResponse = await responce.json();
  if (dataResponse) {
    basket = document.querySelector('.header_cart-button-count');
    basket.textContent = dataResponse.data.values.count;
  }
}

function addCartButtonEvents() {
  const addCartButtons = document.querySelectorAll('.add-to-cart');
  addCartButtons.forEach((el) => el.addEventListener('click', addProductToCart));
}

addCartButtonEvents();

/* category page */
function addUpdatePriceEvents() {
  const updatePriceButtons = document.querySelectorAll('.js-update-price');

  async function loadPrice(e) {
    e.preventDefault();

    const cardControls = e.target.parentElement.parentElement.parentElement.parentElement;
    const art = e.target.dataset['art'];
    const brand = e.target.dataset['brand'];
    const artbrand = e.target.dataset['artbrand'];
    const pdp = e.target.dataset.hasOwnProperty('pdp') ? e.target.dataset['pdp'] : 0;

    cardControls.classList.add('loading');

    const formData = new FormData();
    formData.append('art', art);
    formData.append('brand', brand);
    formData.append('artbrand', artbrand);
    formData.append('pdp', pdp);

    const responce = await fetch('/service-request/get-price/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });

    const data = await responce.json();
    if (data) {
      document.querySelector('[data-artbrand="' + artbrand + '"]').innerHTML = data.data.html;
      addCartButtonEvents();
    }

    cardControls.classList.remove('loading');
  }

  updatePriceButtons.forEach((el) => el.addEventListener('click', loadPrice));
}

addUpdatePriceEvents();


/* Car finder */
window.selectCar = {};

function setGlobalValue(key, value) {
  if (value) {
    window.selectCar[key] = value;
  }
}

const carFinderOptions = document.querySelectorAll('.car-finder_filters-item .fake-select_value');

function generateOptions(target, data, openNextPopup = false) {
  const targetFilter = target;

  targetFilter?.classList.add('active');

  const targetPopup = targetFilter?.querySelector('.fake-select_popup');

  if (!targetPopup || !data) {
    return;
  }

  targetPopup.innerHTML = '';
  let activeOption = null;

  function createItem(itemData) {
    const el = document.createElement('span');
    el.classList.add('fake-select_value');
    el.dataset.id = itemData?.id;
    el.dataset.year = itemData?.year;
    el.dataset.mark = itemData?.mark;
    el.dataset.model = itemData?.model;
    el.dataset.body = itemData?.body;
    el.innerHTML = itemData?.label || itemData?.name;
    el.addEventListener('click', handleSelectCarFinderOption);

    if (itemData.is_active) {
      activeOption = itemData;
    }

    return el;
  }

  data.forEach((item) => targetPopup.appendChild(createItem(item)));

  if (activeOption) {
    targetFilter.querySelector('.fake-select_button').innerHTML = activeOption.label || activeOption.name;
    targetFilter.parentElement.classList.add('active');

    const previousFilter = targetFilter.parentElement.previousElementSibling.querySelector('.fake-select_button');
    if (!previousFilter.dataset.value) {
      previousFilter.classList.add('error');
    }
  }

  if (openNextPopup) {
    setTimeout(() => {
      toggleFakeSelect({ target: targetPopup?.previousElementSibling });
    }, 100);
  }
}

async function handleSelectCarFinderOption(e) {
  e.preventDefault();

  const parentPopup = e.target.parentElement;
  parentPopup?.classList.remove('opened');

  if (parentPopup && parentPopup.previousElementSibling && e.target.innerText) {
    const button = parentPopup.previousElementSibling;
    button.innerText = e.target.innerText;
    button.dataset.value = e.target.innerText;
    button.classList.remove('error');
  }

  const key = parentPopup?.dataset?.key || null;

  let data = null;
  let nextFilterKey = '';
  const formData = new FormData();

  async function fetchMarks() {
    formData.append('year', window.selectCar.year);

    const yearResponce = await fetch('/car-ajax/get-marks-by-year/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    data = await yearResponce.json();
    nextFilterKey = 'mark';
  }

  async function fetchModels() {
    formData.append('year', window.selectCar.year);
    formData.append('mark', window.selectCar.markId);

    markResponce = await fetch('/car-ajax/get-models-by-year-mark/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    data = await markResponce.json();
    nextFilterKey = 'model';
  }

  async function fetchBody() {
    formData.append('year', window.selectCar.year);
    formData.append('mark', window.selectCar.markId);
    formData.append('model', window.selectCar.modelId);

    bodyResponce = await fetch('/car-ajax/get-body-by-year-mark-models/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    data = await bodyResponce.json();
    nextFilterKey = 'body';
  }

  async function fetchEngine() {
    formData.append('year', window.selectCar.year);
    formData.append('mark', window.selectCar.markId);
    formData.append('model', window.selectCar.modelId);
    formData.append('body', window.selectCar.bodyId);

    engineResponce = await fetch('/car-ajax/get-engine-by-year-mark-models-body/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    data = await engineResponce.json();
    nextFilterKey = 'engine_fuel';
  }

  async function fetchFuelVolume() {
    formData.append('year', window.selectCar.year);
    formData.append('mark', window.selectCar.markId);
    formData.append('model', window.selectCar.modelId);
    formData.append('engine', window.selectCar.engineId);

    engineResponce = await fetch('/car-ajax/get-engine-code-by-year-mark-models-body-fuel-volume/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    data = await engineResponce.json();
    nextFilterKey = 'engine_code';
  }

  async function fetchEngineById() {
    formData.append('engine', window.selectCar.engineId);

    engineResponce = await fetch('/car-ajax/set-engine-by-id/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData,
    });
    window.location.reload(true);
    data = await engineResponce.json();
    nextFilterKey = '';
  }

  switch(key) {
    case 'year':
      setGlobalValue('year', e.target.dataset['year']);

      if (window.selectCar.modelId) {
        await fetchBody();
      } else if (window.selectCar.markId) {
        await fetchModels();
      } else {
        await fetchMarks();
      }
      break;

    case 'mark':
      setGlobalValue('markId', e.target.dataset['id']);

      await fetchModels();
      break;

    case 'model':
      setGlobalValue('modelId', e.target.dataset['id']);

      await fetchBody()
      break;

    case 'body':
      setGlobalValue('bodyId', e.target.dataset['id']);

      await fetchEngine();
      break;

    case 'engine_fuel':
      setGlobalValue('engineId', e.target.dataset['id']);

      await fetchFuelVolume();
      break;

    case 'engine_code':
      setGlobalValue('engineId', e.target.dataset['id']);

      await fetchEngineById();
      break;
  }

  if (nextFilterKey) {
    generateOptions(document.querySelector(`.car-finder_filters-item[data-key="${nextFilterKey}"]`), data, true);
  }
}

carFinderOptions.forEach((el) => el.addEventListener('click', handleSelectCarFinderOption));

const carFinderHiddenFields = document.querySelectorAll('input[name^="fastSearch"]');

function handleCarFinderHiddenFieldsValues(field) {
  const { dataset,  value } = field;

  if (!value) {
    return '';
  }

  const parsedValue = JSON.parse(value);
  const name = dataset.name;
  const select = document.querySelector(`.fake-select_popup[data-key="${name}"]`)?.previousElementSibling;

  if (select) {
    generateOptions(select.parentElement, parsedValue);

    const selectedValue = parsedValue.find((el) => el.is_active);
    if (selectedValue) {
      setGlobalValue(`${name}Id`, selectedValue.id);
      select.parentElement.querySelector('.fake-select_button').dataset.value = selectedValue.label;
    }
  }
}

carFinderHiddenFields.forEach((el) => handleCarFinderHiddenFieldsValues(el));


/* disclaimer */
const disclaimerButtons = document.querySelectorAll('.disclaimer_button');

function toggleDisclaimer(e) {
  e.preventDefault();
  e.target.parentElement.parentElement.classList.toggle('opened');
}

disclaimerButtons.forEach((el) => el.addEventListener('click', toggleDisclaimer));

/* cars popup */
const carsPopupButtons = document.querySelectorAll('.js-cars-select-button');

function togglePopup(popup) {
  popup.classList.toggle('opened');
  document.body.classList.toggle('popup-opened');
}

carsPopupButtons.forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  togglePopup(document.querySelector('.js-my-cars-popup'));
}));

const carsInPopup = document.querySelectorAll('.car-finder_my-cars-popup .car-finder_result-car');

function selectCarFromPopup(e) {
  const { currentTarget } = e;

  if (e.target.classList.contains('car-finder_delete')) {
    return;
  }

  document.querySelector('.car-finder_selected-car').innerHTML = currentTarget.querySelector('.car-finder_result-car-content').innerHTML;
  currentTarget.querySelector('input').checked = true;
  closePopup();
}

carsInPopup.forEach((el) => el.addEventListener('click', selectCarFromPopup));

const addCarButton = document.querySelectorAll('.js-cars-add-car');
addCarButton.forEach((el) => el.addEventListener('click', () => document.querySelector('.car-finder.hidden')?.classList.remove('hidden')));

/* map popup */
const locationButtons = document.querySelectorAll('.js-map-toggle');
locationButtons.forEach(el => el.addEventListener('click', () => {
  togglePopup(document.querySelector('.js-map-popup'));
}));


/* search in header */
const toggleMobileSearchButton = document.querySelector('.js-search-toggle');

if (toggleMobileSearchButton) {
  toggleMobileSearchButton.addEventListener('click', function(e) {
    e.preventDefault();

    document.querySelector('.header_search')?.classList.toggle('active');
  });
};

const searchInput = document.querySelector('.search_input');
const searchDropdown = document.querySelector('.search_dropdown');

searchInput.addEventListener('focus', () => searchDropdown.classList.add('active'));
handleClickOutside(document.querySelector('.search'), () => {
  if (searchDropdown.classList.contains('active')) {
    searchDropdown.classList.remove('active');
  }
});

function debounce(func, delay) {
  let debounceTimer;

  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

const debouncedSearchCallback = debounce(async () => {
  const inputValue = document.querySelector('input[name="q"]').value;
  if (inputValue.length < 3) {
    return;
  }

  searchDropdown.classList.add('loading');
  searchInput.disabled = true;

  const formData = new FormData();
  formData.append('q', inputValue);
  formData.append('ajax', 1);

  const params = new URLSearchParams(formData).toString();

  const response = await fetch('/search/index/?'+ params, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (response.ok) {
    html = await response.text();
    document.getElementById('searchResult').innerHTML = html;
    searchDropdown.classList.remove('loading');
    searchInput.disabled = false;
    searchInput.focus();
  }

}, 700);

searchInput.addEventListener('input', debouncedSearchCallback);


/* filters */
function addShowMoreEvents() {
  const filtersMoreButtons = document.querySelectorAll('.filters_more');
  filtersMoreButtons.forEach((el) => {
    el.addEventListener('click', function(e) {
      el.remove();
    });
  });
}

addShowMoreEvents();

const mobileFiltersToggles = document.querySelectorAll('.js-filters-toggle, .filters_close, .catalog_filters-fade');

function toggleMobileMenu(e) {
  e.preventDefault();

  document.body.classList.toggle('filters-opened');
}

mobileFiltersToggles.forEach(el => el.addEventListener('click', toggleMobileMenu));

async function handleFilterClick(e) {
  const url = e.target.dataset.url;

  if (!url) {
    return;
  }

  window.history.pushState({}, '', window.location.origin + url);
  const catalogHolderElement = document.querySelector('.catalog_holder');

  catalogHolderElement.classList.add('loading');

  const response = await fetch(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const filtersElement = doc.querySelector('.filters');
  const contentElement = doc.querySelector('.catalog_content');

  document.querySelector('.filters').innerHTML = filtersElement.innerHTML;
  document.querySelector('.catalog_content').innerHTML = contentElement.innerHTML;

  document.querySelector('head title').innerText = doc.querySelector('head title').innerText;
  document.querySelector('meta[name="keywords"]').content = doc.querySelector('meta[name="keywords"]').content;
  document.querySelector('meta[name="description"]').content = doc.querySelector('meta[name="description"]').content;

  document.querySelector('.catalog-head h1').innerHTML = doc.querySelector('.catalog-head h1').innerHTML;

  if (document.querySelector('.catalog-head .catalog-info_text') && doc.querySelector('.catalog-head .catalog-info_text')) {
    document.querySelector('.catalog-head .catalog-info_text').innerHTML = doc.querySelector('.catalog-head .catalog-info_text').innerHTML;
  }

  initFilterHandlers();
  addCartButtonEvents();
  addUpdatePriceEvents();
  addShowMoreEvents();

  catalogHolderElement.classList.remove('loading');
}

function initFilterHandlers() {
  document.querySelector('.filters_submit')?.addEventListener('click', toggleMobileMenu);

  const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
  filterCheckboxes.forEach((el) => el.addEventListener('change', handleFilterClick));
}

initFilterHandlers();


/* gallery */
if (window.lightGallery) {
  lightGallery(document.querySelector('.product_gallery'), {
    speed: 500,
    selector: '.js-gallery-image',
    download: false,
  });
}

/* cookies */
const hasCookies = localStorage.getItem('accept');

const cookiesBanner = document.querySelector('.cookies');
const cookiesAcceptButton = document.querySelector('.cookies_close');

if (cookiesAcceptButton) {
  cookiesAcceptButton.addEventListener('click', function (e) {
    e.preventDefault();

    localStorage.setItem('accept', 'true');
    cookiesBanner.style.display = 'none';
  });
}

if (cookiesBanner && !hasCookies) {
  cookiesBanner.style.display = 'block';
}
