async function loadParking() {

    const response = await fetch("http://localhost:3000/api/parking");
    const data = await response.json();

    const grid = document.querySelector(".parking-grid");

    grid.innerHTML = "";

    data.forEach(p => {

        const card = `
        <div class="parking-card">
            <div class="card-image"></div>
            <div class="card-content">
                <h3>${p.name}</h3>
                <p class="location">${p.address}</p>
                <p class="price">₹${p.price_per_hour} / hour</p>
                <span class="badge available">Available: ${p.available_slots}</span>
                <button onclick="book(${p.location_id})">Book Now</button>
            </div>
        </div>
        `;

        grid.innerHTML += card;
    });

}

function book(id){
    window.location.href = `booking.html?location=${id}`;
}

loadParking();

window.onload = function () {

    const now = new Date();

    const dateInput = document.getElementById("date");
    const fromTimeInput = document.getElementById("fromTime");
    const toTimeInput = document.getElementById("toTime");

    const today = formatDate(now);
    const currentTime24 = formatTime24(now);

    dateInput.value = today;
    dateInput.min = today;

    fromTimeInput.value = currentTime24;
    fromTimeInput.min = currentTime24;

    // Set default toTime = +1 hour
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    toTimeInput.value = formatTime24(nextHour);

    updateDisplayTime(currentTime24);
};



// Format date YYYY-MM-DD
function formatDate(date) {

    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, '0') + "-" +
        String(date.getDate()).padStart(2, '0');

}



// Format time HH:MM (24hr)
function formatTime24(date) {

    return String(date.getHours()).padStart(2, '0') + ":" +
           String(date.getMinutes()).padStart(2, '0');

}



// Convert to 12 hour format
function convertTo12Hour(time24) {

    let [hours, minutes] = time24.split(":");

    hours = parseInt(hours);

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) hours = 12;

    return hours + ":" + minutes + " " + ampm;

}



// Show 12 hour display
function updateDisplayTime(time24) {

    document.getElementById("displayTime").innerText =
        convertTo12Hour(time24);

}



// Prevent selecting past time
document.getElementById("fromTime").addEventListener("change", function () {

    const selectedTime = this.value;

    const selectedDate =
        document.getElementById("date").value;

    const now = new Date();

    const today = formatDate(now);
    const currentTime = formatTime24(now);

    // If today and selected time is past
    if (selectedDate === today && selectedTime < currentTime) {

        alert("Cannot select past time");

        this.value = currentTime;

        updateDisplayTime(currentTime);

        return;
    }

    updateDisplayTime(selectedTime);

});



// Prevent past date selection
document.getElementById("date").addEventListener("change", function () {

    const selectedDate = this.value;

    const now = new Date();

    const today = formatDate(now);

    const currentTime = formatTime24(now);

    const fromTimeInput = document.getElementById("fromTime");

    if (selectedDate === today) {

        fromTimeInput.min = currentTime;

        if (fromTimeInput.value < currentTime) {

            fromTimeInput.value = currentTime;

            updateDisplayTime(currentTime);

        }

    } else {

        fromTimeInput.min = "00:00";

    }

});

//3rd edit
// When From Time changes
document.getElementById("fromTime").addEventListener("change", function () {

    const fromTime = this.value;
    const toTimeInput = document.getElementById("toTime");

    if (!fromTime) return;

    // Convert From Time to Date object
    const [hours, minutes] = fromTime.split(":").map(Number);

    const fromDate = new Date();
    fromDate.setHours(hours, minutes, 0);

    // Add 1 hour
    const toDate = new Date(fromDate.getTime() + 60 * 60 * 1000);

    const toHours = String(toDate.getHours()).padStart(2, '0');
    const toMinutes = String(toDate.getMinutes()).padStart(2, '0');

    const newToTime = `${toHours}:${toMinutes}`;

    // Set To Time value
    toTimeInput.value = newToTime;

    // Set minimum allowed To Time
    toTimeInput.min = newToTime;

});

document.getElementById("toTime").addEventListener("change", function () {

    const fromTime =
        document.getElementById("fromTime").value;

    const toTime = this.value;

    if (toTime <= fromTime) {

        alert("To Time must be greater than From Time");

        // Reset to valid time
        const [hours, minutes] = fromTime.split(":").map(Number);

        const newDate = new Date();
        newDate.setHours(hours, minutes, 0);
        newDate.setHours(newDate.getHours() + 1);

        const validHours =
            String(newDate.getHours()).padStart(2, '0');

        const validMinutes =
            String(newDate.getMinutes()).padStart(2, '0');

        this.value = `${validHours}:${validMinutes}`;
    }

});