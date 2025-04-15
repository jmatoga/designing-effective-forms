function setError(input, message) {
    input.classList.add('is-invalid');
    let feedback = input.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
}

function clearError(input) {
    input.classList.remove('is-invalid');
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.remove();
    }
}

function validateForm() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const street = document.getElementById('street');
    const zipCodeInput = document.getElementById('zipCode');
    const city = document.getElementById('city');
    const phoneInput = document.getElementById('phoneNumber');

    const blikCode = document.getElementById('blikCode');
    const blikCodeContainer = document.getElementById('blikCodeContainer');

    const vatFields = document.getElementById('vatFields');
    const vatNumber = document.getElementById('vatNumber');
    const companyName = document.getElementById('companyName');
    const vatStreet = document.getElementById('vatStreet');
    const vatZipCode = document.getElementById('vatZipCode');
    const vatCity = document.getElementById('vatCity');

    let isValid = true;

    // Funkcja sprawdzająca minimalną długość 3 znaków
    function validateMinLength(input, fieldName) {
        if (input.value.trim().length < 3) {
            setError(input, `${fieldName} musi zawierać co najmniej 3 znaki.`);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    isValid &= validateMinLength(firstName, 'Imię');
    isValid &= validateMinLength(lastName, 'Nazwisko');
    isValid &= validateMinLength(street, 'Ulica');
    isValid &= validateMinLength(city, 'Miasto');

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        setError(emailInput, 'Niepoprawny format adresu email.');
        isValid = false;
    } else {
        clearError(emailInput);
    }

    // Hasło: min. 6 znaków, litera + cyfra
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(passwordInput.value)) {
        setError(passwordInput, 'Hasło musi mieć min. 6 znaków, zawierać literę i cyfrę.');
        isValid = false;
    } else {
        clearError(passwordInput);
    }

    // Kod pocztowy
    function validateZipCode(zipCode) {
        const zipRegex = /^\d{2}-\d{3}$/;
        if (!zipRegex.test(zipCode.value)) {
            setError(zipCode, 'Kod pocztowy musi być w formacie 00-000.');
            return false;
        } else {
            clearError(zipCode);
            return true;
        }
    }

    isValid &= validateZipCode(zipCodeInput);

    // Telefon
    const countryCode = document.getElementById('countryCode')?.value;
    const phoneRegex = phoneNumbers.find(num => num.numPrefix === countryCode)?.regex;
    if (!phoneRegex || !phoneRegex.test(phoneInput.value)) {
        setError(phoneInput, 'Niepoprawny numer telefonu.');
        isValid = false;
    } else {
        clearError(phoneInput);
    }

    // Kod Blik
    if (blikCodeContainer.style.display !== 'none') {
        const blikRegex = /^\d{6}$/;
        if (!blikRegex.test(blikCode.value)) {
            setError(blikCode, 'Kod blik musi mieć dokładnie 6 cyfr.');
            isValid = false;
        } else {
            clearError(blikCode);
        }
    }

    // VAT fields jeśli kontener widoczny
    if (vatFields.style.display !== 'none') {
        isValid &= validateMinLength(companyName, 'Nazwa firmy');
        isValid &= validateMinLength(vatStreet, 'Ulica');
        isValid &= validateMinLength(vatCity, 'Miasto');

        const nipRegex = /^\d{10}$/;
        if (!nipRegex.test(vatNumber.value)) {
            setError(vatNumber, 'NIP musi zawierać 10 cyfr i być w formacie 1234567890.');
            isValid = false;
        } else {
            clearError(vatNumber);
        }

        isValid &= validateZipCode(vatZipCode);
    }

    return Boolean(isValid);
}

// Obsługa formularza
function setupFormValidation() {
    document.getElementById('submitBtn').addEventListener('click', function(event) {
        event.preventDefault();

        if (validateForm()) {
            const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
            modal.show();
        } else {
            goToFirstInvalidField();
        }
    });
}


function goToFirstInvalidField() {
    const form = document.getElementById('form');
    form.addEventListener('submit', function (e) {
        const invalid = form.querySelector(':invalid');
        if (invalid) {
            invalid.focus();
            invalid.setAttribute('aria-invalid', 'true');
            e.preventDefault();
        }
    });
}
