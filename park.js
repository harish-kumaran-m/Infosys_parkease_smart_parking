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