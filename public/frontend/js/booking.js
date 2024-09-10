document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    // Extract query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('first-name');
    const lastName = urlParams.get('last-name');
    const email = urlParams.get('email');
    const service = urlParams.get('service');
    const bathroom = urlParams.get('bathroom');
    const frequency = urlParams.get('frequency');

    // Set form values if query parameters are present
    if (firstName) document.getElementById('first-name').value = firstName;
    if (lastName) document.getElementById('last-name').value = lastName;
    if (email) document.getElementById('email').value = email;
    if (service) document.getElementById('service').value = service;
    if (bathroom) document.getElementById('bathroom').value = bathroom;
    if (frequency) {
        document.querySelector(`input[name="frequency"][value="${frequency}"]`).checked = true;
    }

    const servicePrices = {
        "Studio or 1 Bedroom": 0,
        "2 Bedroom": 25,
        "3 Bedroom": 50,
        "4 Bedroom": 75,
        "5 Bedroom": 100,
        "6 Bedroom": 125,
        "7 Bedroom": 150,
        "8 Bedroom": 175,
        "9 Bedroom": 200,
        "10 Bedroom": 225,
        "11 Bedroom": 250
    };

    const endOfLeaseServicePrices = {
        "Studio or 1 Bedroom": 0,
        "2 Bedroom": 50,
        "3 Bedroom": 100,
        "4 Bedroom": 150,
        "5 Bedroom": 200,
        "6 Bedroom": 250,
        "7 Bedroom": 300,
        "8 Bedroom": 350,
        "9 Bedroom": 400,
        "10 Bedroom": 450,
        "11 Bedroom": 500
    };

    const bathroomPrices = {
        "1 Bathroom": 0,
        "2 Bathroom": 25,
        "3 Bathroom": 50,
        "4 Bathroom": 75,
        "5 Bathroom": 90,
        "6 Bathroom": 115,
        "7 Bathroom": 130
    };

    const storeyPrices = {
        "Single storey home": 0,
        "Double storey home": 35,
        "Triple storey home": 70
    };

    const typeOfServicePrices = {
        "General Cleaning": 130,
        "Deep Cleaning": 220,
        "End of Lease Cleaning": 400,
        "Organisation by the Hour": 0
    };

    const frequencyDiscounts = {
        "Weekly": 0.15,
        "Fortnightly": 0.10,
        "Monthly": 0.05,
        "One-time": 0
    };

    const deepCleaningExtras = [
        "High Dusting",
        "I Have Pets"
    ];

    const endOfLeaseExtras = [
        "Oven Cleaning",
        "Refrigerator Cleaning Full",
        "Dishwasher Cleaning",
        "Inside Cupboards Empty",
        "Window Cleaning",
        "Blind Cleaning",
        "High Dusting",
        "I Have Pets"
    ];

    const organisationByTheHourExtras = [
        "Oven Cleaning",
        "Refrigerator Cleaning Empty",
        "Refrigerator Cleaning Full",
        "Dishwasher Cleaning",
        "Inside Cupboards Empty",
        "Window Cleaning",
        "Sliding Door Window",
        "Blind Cleaning",
        "High Dusting",
        "Garage Cleaning",
        "Balcony Cleaning Small",
        "Balcony Cleaning Large",
        "Change Sheets",
        "Shed/Pool House",
        "I Have Pets",
        "Organisation By the Hour $80/2 hours"
    ];

    const freeAddOnsForDeepCleaning = [
        "High Dusting",
        "I Have Pets"
    ];

    const freeAddOnsForEndOfLeaseCleaning = [
        "Oven Cleaning",
        "Refrigerator Cleaning Full",
        "Dishwasher Cleaning",
        "Inside Cupboards Empty",
        "Window Cleaning",
        "Blind Cleaning",
        "High Dusting",
        "I Have Pets"
    ];

    const freeAddOnsForOrganisationByTheHour = [
        "Oven Cleaning",
        "Refrigerator Cleaning Empty",
        "Refrigerator Cleaning Full",
        "Dishwasher Cleaning",
        "Inside Cupboards Empty",
        "Window Cleaning",
        "Sliding Door Window",
        "Blind Cleaning",
        "High Dusting",
        "Garage Cleaning",
        "Balcony Cleaning Small",
        "Balcony Cleaning Large",
        "Change Sheets",
        "Shed/Pool House",
        "I Have Pets"
    ];

    let discountCode = '';
    let discountAmount = 0;

    const calculateTotal = () => {
        let total = 0;
        let extrasTotal = 0; // Total for selected extras

        const serviceElement = document.getElementById('service');
        const bathroomElement = document.getElementById('bathroom');
        const storeyElement = document.getElementById('storey');
        const typeOfServiceElement = document.getElementById('type-of-service');

        if (!serviceElement || !bathroomElement || !storeyElement || !typeOfServiceElement) {
            console.error('One or more elements are not found.');
            return;
        }

        const service = serviceElement.value;
        const bathroom = bathroomElement.value;
        const storey = storeyElement.value;
        const typeOfService = typeOfServiceElement.value;

        if (typeOfService === "End of Lease Cleaning") {
            total += endOfLeaseServicePrices[service] || 0;
        } else {
            total += servicePrices[service] || 0;
        }

        total += bathroomPrices[bathroom] || 0;
        total += storeyPrices[storey] || 0;
        total += typeOfServicePrices[typeOfService] || 0;

        document.getElementById('cleaning-plan-details').textContent = `${service}, ${bathroom}, ${storey}`;
        document.getElementById('service-cost').textContent = `${typeOfService}: $${typeOfServicePrices[typeOfService]}`;

        console.log('Base total:', total);

        const selectedExtras = document.querySelectorAll('.extra-item.highlighted');
        const extrasList = document.getElementById('selected-extras');
        extrasList.innerHTML = '';

        const extraCounts = {};

        selectedExtras.forEach(extra => {
            const price = parseFloat(extra.getAttribute('data-price'));
            const label = extra.querySelector('label').textContent.split(' $')[0];
            const counter = extra.querySelector('.counter');
            const count = counter ? parseInt(counter.textContent) || 1 : 1;

            if (extraCounts[label]) {
                extraCounts[label].count += count;
            } else {
                extraCounts[label] = { price, count };
            }
        });

        for (let label in extraCounts) {
            const item = extraCounts[label];
            let itemTotal = item.price * item.count;

            if (typeOfService === "Deep Cleaning" && freeAddOnsForDeepCleaning.includes(label)) {
                itemTotal = 0; // Make it free
            } else if (typeOfService === "End of Lease Cleaning" && freeAddOnsForEndOfLeaseCleaning.includes(label)) {
                itemTotal = 0; // Make it free
            } else if (typeOfService === "Organisation by the Hour" && freeAddOnsForOrganisationByTheHour.includes(label)) {
                itemTotal = 0; // Make it free
            }

            total += itemTotal;
            extrasTotal += itemTotal; // Add to extras total

            const listItem = document.createElement('li');
            if (item.count > 1) {
                listItem.textContent = `${label} x${item.count}`;
            } else {
                listItem.textContent = `${label}`;
            }
            extrasList.appendChild(listItem);
        }

        // Update the displayed total for selected extras
        document.getElementById('extras-total').textContent = `$${extrasTotal.toFixed(2)}`;

        console.log('Total after extras:', total);

        const frequencyDiscount = document.querySelector('input[name="frequency"]:checked');
        if (frequencyDiscount) {
            const discount = frequencyDiscounts[frequencyDiscount.value];
            const frequencyDiscountAmount = total * discount;
            total -= frequencyDiscountAmount;
            document.getElementById('frequency-discount').textContent = `Frequency Discount: -$${frequencyDiscountAmount.toFixed(2)}`;
        } else {
            document.getElementById('frequency-discount').textContent = '';
        }

        // Apply discount code
        if (discountCode === 'WELCOME10%') {
            discountAmount = total * 0.10;
            document.getElementById('discount-amount').textContent = `Discount (10%): -$${discountAmount.toFixed(2)}`;
        } else {
            discountAmount = 0;
            document.getElementById('discount-amount').textContent = '';
        }

        total -= discountAmount;

        document.getElementById('total').textContent = total.toFixed(2);
    };

    const applyDiscountCode = () => {
        console.log('Apply Code button clicked');
        const inputCode = document.querySelector('.discount-code-input').value.trim().toUpperCase();
        console.log('Entered Discount Code:', inputCode);
        if (inputCode === 'WELCOME10%') {
            discountCode = inputCode;
            alert('Discount code applied successfully!');
        } else {
            discountCode = '';  // Clear the code if it doesn't match
            alert('Invalid discount code');
        }
        calculateTotal();
    };

    const resetAllAddOns = () => {
        document.querySelectorAll('.extra-item').forEach(extra => {
            extra.classList.remove('highlighted');
            extra.classList.remove('always-visible');
            extra.style.pointerEvents = 'auto';
            const counter = extra.querySelector('.counter');
            if (counter) counter.textContent = '';
        });
    };

    const handleTypeOfServiceChange = () => {
        const typeOfServiceElement = document.getElementById('type-of-service');
        const typeOfService = typeOfServiceElement.value;

        resetAllAddOns(); // Reset all add-ons to be selectable

        document.querySelectorAll('.extra-item').forEach(extra => {
            const label = extra.querySelector('label').textContent.split(' $')[0];
            const counter = extra.querySelector('.counter');
            const increaseButton = extra.querySelector('.increase');
            const decreaseButton = extra.querySelector('.decrease');

            if (typeOfService === "Deep Cleaning") {
                if (deepCleaningExtras.includes(label)) {
                    extra.classList.add('highlighted');
                    extra.style.pointerEvents = 'none';
                }
            } else if (typeOfService === "End of Lease Cleaning") {
                if (endOfLeaseExtras.includes(label)) {
                    extra.classList.add('highlighted');
                    extra.style.pointerEvents = 'none';
                }
            } else if (typeOfService === "Organisation by the Hour") {
                if (label === "Organisation By the Hour $80/2 hours") {
                    extra.classList.add('highlighted');
                    extra.classList.add('always-visible');
                    counter.textContent = '1';
                    increaseButton.style.display = 'inline-block';
                    decreaseButton.style.display = 'inline-block';
                    decreaseButton.style.pointerEvents = 'none';

                    if (!document.getElementById('select-hours-note')) {
                        const note = document.createElement('div');
                        note.id = 'select-hours-note';
                        note.textContent = 'Please Select Hours';
                        note.style.color = 'red';
                        extra.appendChild(note);
                    }
                } else if (organisationByTheHourExtras.includes(label)) {
                    extra.classList.add('highlighted');
                    extra.style.pointerEvents = 'none';
                }
            }
        });

        calculateTotal();
    };

    const setupEventListeners = () => {
        document.querySelectorAll('select, input[name="frequency"]').forEach(element => {
            element.addEventListener('change', calculateTotal);
        });

        document.querySelectorAll('.extra-item').forEach(extra => {
            if (extra.classList.contains('walls-interior-windows')) {
                const counter = extra.querySelector('.counter');
                let count = parseInt(counter.textContent) || 0;

                const increaseButton = extra.querySelector('.increase');
                const decreaseButton = extra.querySelector('.decrease');

                increaseButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    count += 1;
                    counter.textContent = count;
                    extra.classList.add('highlighted');
                    decreaseButton.style.pointerEvents = count > 0 ? 'auto' : 'none';
                    calculateTotal();
                });

                decreaseButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (count > 0) {
                        count -= 1;
                        counter.textContent = count;
                        if (count === 0) {
                            extra.classList.remove('highlighted');
                            counter.textContent = "";
                        }
                        decreaseButton.style.pointerEvents = count > 0 ? 'auto' : 'none';
                        calculateTotal();
                    }
                });
            } else {
                extra.addEventListener('click', () => {
                    extra.classList.toggle('highlighted');
                    calculateTotal();
                });
            }
        });

        document.getElementById('type-of-service').addEventListener('change', handleTypeOfServiceChange);
        document.querySelector('.apply-discount-button').addEventListener('click', applyDiscountCode);
        document.getElementById('complete-booking-button').addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Complete Booking button clicked');

            // Custom validation for "Organisation by the Hour" service
            const typeOfService = document.getElementById('type-of-service').value;
            const organisationAddon = document.querySelector('.extra-item[data-price="80"]');
            const organisationCounter = organisationAddon.querySelector('.counter');

            if (typeOfService === 'Organisation by the Hour' && (!organisationAddon.classList.contains('highlighted') || !organisationCounter.textContent || parseInt(organisationCounter.textContent) < 1)) {
                alert('Please select "Organisation by the Hour $80/2 hours" quantity.');
                return; // Prevent form submission
            }

            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server
                    stripeTokenHandler(result.token);
                }
            });
        });
    };

    setupEventListeners();

    // Set initial values
    if (service) {
        document.getElementById('service').value = service;
    } else {
        document.getElementById('service').value = "Studio or 1 Bedroom";
    }
    if (bathroom) {
        document.getElementById('bathroom').value = bathroom;
    } else {
        document.getElementById('bathroom').value = "1 Bathroom";
    }
    document.getElementById('storey').value = "Single storey home";
    document.getElementById('type-of-service').value = "General Cleaning";
    calculateTotal();
});

// Toggle FAQ dropdowns
document.querySelectorAll('.question-item h3').forEach(questionHeader => {
    questionHeader.addEventListener('click', () => {
        const icon = questionHeader.querySelector('.toggle-icon');
        const content = questionHeader.nextElementSibling;

        if (content.style.display === 'block') {
            content.style.display = 'none';
            icon.textContent = '+';
        } else {
            content.style.display = 'block';
            icon.textContent = '-';
        }
    });
});

// Stripe setup
var stripe = Stripe('pk_test_51Pg0xxIpCrzhTk3noCRQZEZezn6SM20Ihj5XxT9edh6t13AdAdc8R2DYGnVm2eq9CBW8q5831OefWCwQsO97XLzs00cjIlsJPV'); // Replace with your Stripe public key
var elements = stripe.elements();
var style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create a card element without the ZIP/postal code field
var card = elements.create('card', {
    style: style,
    hidePostalCode: true
});

card.mount('#card-element');

card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

var form = document.getElementById('payment-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Custom validation for "Organisation by the Hour" service
    const typeOfService = document.getElementById('type-of-service').value;
    const organisationAddon = document.querySelector('.extra-item[data-price="80"]');
    const organisationCounter = organisationAddon.querySelector('.counter');

    if (typeOfService === 'Organisation by the Hour' && (!organisationAddon.classList.contains('highlighted') || !organisationCounter.textContent || parseInt(organisationCounter.textContent) < 1)) {
        alert('Please select "Organisation by the Hour $80/2 hours" quantity.');
        return; // Prevent form submission
    }

    stripe.createToken(card).then(function (result) {
        if (result.error) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server
            stripeTokenHandler(result.token);
        }
    });
});

function stripeTokenHandler(token) {
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
}

// Assuming you already have the dateInput variable
var dateInput = document.getElementById('day');

// Get today's date and set the minimum selectable date to be the next day
var today = new Date();
today.setDate(today.getDate() + 1); // Move to the next day

var yyyy = today.getFullYear();
var mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
var dd = String(today.getDate()).padStart(2, '0');

var minDate = yyyy + '-' + mm + '-' + dd; // Format the date as YYYY-MM-DD

// Set the minimum date attribute for the input element
dateInput.setAttribute('min', minDate);

// Blocked dates array
var blockedDates = [
    '2024-08-25', // Example blocked date
];

// Function to check if the selected date is blocked
dateInput.addEventListener('input', function () {
    var selectedDate = dateInput.value;
    if (blockedDates.includes(selectedDate)) {
        alert('This date is not available for booking.');
        dateInput.value = ''; // Clear the input value
    }
});