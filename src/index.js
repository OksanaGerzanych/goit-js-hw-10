import './css/styles.css';
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info')
const DEBOUNCE_DELAY = 300;

function clearPage() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))

function searchCountry(event) {
    const findCountry = event.target.value.trim();
    if (!findCountry) {
        clearPage();
        return;
    }
    fetchCountries(findCountry)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.');
                
                return;
            } else if (country.length > 1 && country.length <= 10) {
                markupCountryList(countries);
               
            } else if (country.length === 1) {
                markupOneCountry(country);
                
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            clearPage();
            return error;
        });
}
function markupCountryList(countries) {
    const markup = countries.map(({ name, flags }) => `<li>
        <img src="${flags.svg}" alt="прапор ${name.official}" width="30", height="60">
        <h2>${name.official}</h2>`).join('');
    countryList.innerHTML = markup;
    console.log(countries)
}

function markupOneCountry(country) {
    const markup = country.map(({ name, capital, population, flags, languages }) =>
        `<li>
        <h2><img src="${flags.svg}" alt="прапор ${name.official}" width="30", height="60">
        ${name.official}</h2>
        <p><span>Capital: </span>${capital}</p>
        <p><span>Population: </span>${population}</p>
        <p><span>Languages: </span>${Object.values(languages)}</p>
        </li>`).join('');
    
    countryList.innerHTML = markup;
}



