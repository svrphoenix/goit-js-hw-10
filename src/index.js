import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  infoBox: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
  const { target } = evt;
  let searchValue = '';
  if (target.value === '') {
    renderClear(refs.countryList, refs.infoBox);
    return;
  }
  searchValue = target.value.trim();
  renderClear(refs.countryList, refs.infoBox);
  fetchCountries(searchValue).then(countries => {
    if (countries.length > 10) {
      Notify.warning('Too many matches found. Please enter a more specific name.');
      return;
    }
    if (countries.length > 1) {
      renderList(countries, refs.countryList);
      return;
    }
    renderCountry(countries, refs.infoBox);
  }).catch(err => {
    Notify.failure(`Oops, there is no country with that name! ${err} `);
  });
}

function renderList(countries, tagRef) {
  const countryListMarkup = countries.map(country => `<li class="country-item">
    <img class="country-flag" src="${country.flags.svg}" alt="flag of ${country.name.official}">
      <p>${country.name.official}</p></li>`).join('');
  tagRef.insertAdjacentHTML('afterbegin', countryListMarkup);
}

function renderCountry(countries, tagRef) {
  const countryMarkup = countries.map(country => `<div class="country-header" ><img class="country-flag" src="${country.flags.svg}" alt="flag of ${country.name}">
  <h1>${country.name.official}</h1></div>
  <p><span class="label">Capital</span>: ${country.capital}</p>
  <p><span class="label">Population</span>: ${country.population}</p>
  <p><span class="label">Languages</span>: ${Object.values(country.languages).join(', ')}</p>`).join('');
  tagRef.insertAdjacentHTML('afterbegin', countryMarkup);
}

function renderClear(...refs) {
  refs.forEach(ref => ref.innerHTML = '');
}