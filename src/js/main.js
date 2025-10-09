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

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
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

function closeSubcategores() {
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
}

catalogMenuCategoriesElements.forEach((el) => el.addEventListener('click', selectCategory));

document.querySelectorAll('.categories_subcategory-title').forEach(el => el.addEventListener('click', closeSubcategores));

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

/* add product to cart */

async function addProductToCart(e) {
  e.preventDefault();

  const id = e.target.dataset['id'];
  const formData = new FormData();
  // formData.append('art', art);
  // formData.append('brand', brand);
  formData.append('id', id);

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
  console.log(1, addCartButtons);

  addCartButtons.forEach((el) => el.addEventListener('click', addProductToCart));
}

addCartButtonEvents();

/* category page */
function addUpdatePriceEvents() {
  const updatePriceButtons = document.querySelectorAll('.js-update-price');

  async function loadPrice(e) {
    e.preventDefault();

    const cardControls = e.target.parentElement.parentElement.parentElement;
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

  setTimeout(() => {
    toggleFakeSelect({ target: nextPopup?.previousElementSibling });
  }, 100);
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
      window.location.reload(true);
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
  searchDropdown.classList.add('loading');
  searchInput.disabled = true;

  const formData = new FormData();
  const inputValue = document.querySelector('input[name="q"]').value;
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

}, 400);

searchInput.addEventListener('input', debouncedSearchCallback);


/* filters */
const filtersMoreButtons = document.querySelectorAll('.filters_more');
filtersMoreButtons.forEach((el) => {
  el.addEventListener('click', function(e) {
    el.remove();
  });
});

const mobileFiltersToggles = document.querySelectorAll('.js-filters-toggle');

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

  initFilterHandlers();
  addCartButtonEvents();
  addUpdatePriceEvents();
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
