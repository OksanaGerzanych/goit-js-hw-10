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
        return
    }
    fetchCountries(findCountry)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info(
                'Too many matches found. Please enter a more specific name.');
                clearPage();
                return;
            } else if (country.length >= 2 && country.length <= 10) {
                markupCountryList(country);
                countryInfo.innerHTML = '';
            } else if (country.length === 1) {
                markupOneCountry(country);
                countryList.innerHTML = '';
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
        <img src="${flags.svg}" alt="${name}" width="30", height="15">&nbsp${name.official}`)
        .join('');
    countryList.innerHTML = markup;
};

function markupOneCountry(countries) {
    const markup = countries.map(({ name, capital, population, flags, languages }) => 
    
       ` <section><img src="${flags.svg}" alt="${name}" width="30", height="20">&nbsp<b><BIG>${name.official}</BIG></b>
        <p><span><b>Capital:</b> </span>${capital}</p>
        <p><span><b>Population:</b> </span>${population}</p>
        <p><span><b>Languages:</b> </span>${Object.values(languages).join(",")}</p></section>`).join('');
     
    countryInfo.innerHTML = markup;
    
};


function clearPage() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

