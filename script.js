let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

const phoneNumbers = [
    {
        numPrefix: "+49",
        country: "Niemcy",
        regex: /^\d{9}$/,
        sampleNumber: "501234567"
    },
    {
        numPrefix: "+48",
        country: "Polska",
        regex: /^\d{9}$/,
        sampleNumber: "501234567"
    },
    {
        numPrefix: "+1",
        country: "USA",
        regex: /^\d{10}$/,
        sampleNumber: "1234567890"
    }
];

async function fetchAndFillCountries() {
    const selectElement = document.getElementById('country');

    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Błąd pobierania krajów');

        const data = await response.json();
        const countries = data.map(c => c.name.common).sort();

        // Dodaj opcje do selecta
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            selectElement.appendChild(option);
        });

        // Inicjalizacja Tom Select
        new TomSelect('#country', {
            placeholder: 'Wybierz kraj',
            allowEmptyOption: false,
            maxOptions: 500,
            onInitialize: function () {
                getCountryByIP();
            }
        });

    } catch (error) {
        console.error('Błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const countrySelect = document.getElementById('country');
            const tomSelectInstance = countrySelect.tomselect; // dostęp do instancji Tom Select

            // Ustawienie wybranej wartości przez API Tom Select
            if (tomSelectInstance) {
                tomSelectInstance.setValue(country);
            }

            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Błąd pobierania danych');
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            const countryCodeSelect = document.getElementById('countryCode');
            const tomSelectInstance = countryCodeSelect.tomselect;

            if (tomSelectInstance) {
                tomSelectInstance.setValue(countryCode);
            }

            // Aktualizacja etykiety numeru telefonu
            const phoneData = phoneNumbers.find(num => num.numPrefix === countryCode);
            const phoneLabel = document.querySelector("label[for='phoneNumber']");
            if (phoneData) {
                phoneLabel.innerText = `Numer telefonu komórkowego (Np: ${phoneData.sampleNumber})`;
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}


function showVatOption() {
    const vatFields = document.getElementById('vatFields');

    if (this.checked) {
        // Skopiuj dane z pól adresowych
        const streetValue = document.getElementById('street')?.value || '';
        const zipCodeValue = document.getElementById('zipCode')?.value || '';
        const cityValue = document.getElementById('city')?.value || '';

        document.getElementById('vatStreet').value = streetValue;
        document.getElementById('vatZipCode').value = zipCodeValue;
        document.getElementById('vatCity').value = cityValue;

        vatFields.style.display = 'block';
    } else {
        vatFields.style.display = 'none';
    }
}

function keyboardEvent(e) {
    const form = document.getElementById('form');
    const submitBtn = form?.querySelector('button[type="submit"]');

    // Enter (poza textarea) = wyślij formularz
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        submitBtn.click();
    }

    // Alt + V = Przełącza checkbox VAT
    if (e.altKey && e.key.toLowerCase() === 'v') {
        const checkbox = document.getElementById('vatUE');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    }

    // 💡 Alt + X = reset formularza
    if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        form.reset();
        const vatFields = document.getElementById('vatFields');
        if (vatFields) vatFields.style.display = 'none';
    }
}

function populateCountryCodes() {
    const countrySelect = document.getElementById('countryCode');

    phoneNumbers.forEach(phone => {
        const option = document.createElement('option');
        option.value = phone.numPrefix;
        option.textContent = `${phone.numPrefix} (${phone.country})`;
        countrySelect.appendChild(option);
    });

    // Inicjalizacja Tom Select po dodaniu opcji
    new TomSelect('#countryCode', {
        placeholder: 'Wybierz numer kierunkowy',
        allowEmptyOption: false,
        maxOptions: 300
    });
}


function toggleBlikCodeField() {
    const blikSelected = document.getElementById('blik').checked;
    const blikContainer = document.getElementById('blikCodeContainer');
    blikContainer.style.display = blikSelected ? 'block' : 'none';
}

(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    document.getElementById('vatUE').addEventListener('change', showVatOption);
    document.addEventListener('keydown', keyboardEvent);

    document.querySelectorAll('input[name="paymentMethod"]').forEach((elem) => {
        elem.addEventListener('change', toggleBlikCodeField);
    });

    populateCountryCodes();
    fetchAndFillCountries();
    toggleBlikCodeField();

    window.addEventListener('DOMContentLoaded', () => {
        setupFormValidation();
    });
})()
