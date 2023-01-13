import './css/styles.css';
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import { fetchCountries } from './js/fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info')
const DEBOUNCE_DELAY = 300;

countryList.style.listStyle = "none";

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))

function searchCountry(event) {
    const findCountry = event.target.value.trim();
    if (!findCountry) {
        clearPage();
    }
    fetchCountries(findCountry)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.');
                return;
            } else if (country.length >= 2 && country.length <= 10) {
                markupCountryList(country);
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
        <img src="${flags.svg}" alt="${name}" width="30", height="15"> ${name}</p>`)
        .join('');
    countryList.innerHTML = markup;
}

function markupOneCountry(countries) {
    const markup = countries.map(({ name,capital,population,flags,languages }) =>
        `<li>
        <img src="${flags.svg}" alt="${name}" width="30", height="20">&nbsp<b><BIG>${name}</BIG></b>
        
        <p><b><span>Capital:</b> </span>${capital}</p>
        <p><b><span>Population:</b> </span>${population}</p>
        <p><b><span>Languages:</b> </span>${Object.values(languages)}</p>
        </li>`).join('');
     
    countryList.innerHTML = markup;
    console.log(markup)
}


function clearPage() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

