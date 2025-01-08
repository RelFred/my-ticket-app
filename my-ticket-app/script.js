document.addEventListener('DOMContentLoaded', () => {
    const shows = {
        show1: generateSeats(),
        show2: generateSeats(),
        show3: generateSeats()
    };

    const seatsContainer = document.querySelector('.seats');
    const reservationForm = document.getElementById('reservation-form');
    let selectedSeat = null;
    let selectedShow = 'show1';

    const showsDropdown = document.getElementById('shows');
    showsDropdown.addEventListener('change', (event) => {
        selectedShow = event.target.value;
        displaySeats(shows[selectedShow]);
    });

    function generateSeats() {
        const seats = [];
        for (let row = 1; row <= 5; row++) {
            for (let number = 1; number <= 5; number++) {
                seats.push({ row, number, isAvailable: true });
            }
        }
        return seats;
    }

    function displaySeats(seats) {
        seatsContainer.innerHTML = '';
        seats.forEach((seat, index) => {
            if (index === Math.floor(seats.length / 2)) {
                const separator = document.createElement('div');
                separator.classList.add('separator');
                seatsContainer.appendChild(separator);
            }
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat', seat.isAvailable ? 'available' : 'unavailable');
            seatDiv.textContent = `${seat.row}-${seat.number}`;
            seatDiv.addEventListener('click', () => {
                if (seat.isAvailable) {
                    selectedSeat = seat;
                    reservationForm.style.display = 'block';
                }
            });
            seatsContainer.appendChild(seatDiv);
        });
    }

    reservationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (selectedSeat) {
            const name = document.getElementById('name').value;
            selectedSeat.isAvailable = false;
            displaySeats(shows[selectedShow]);
            reservationForm.style.display = 'none';
            alert(`Paiement pour le siège ${selectedSeat.row}-${selectedSeat.number} par ${name} réussi!`);
            generateReceipt(name, selectedSeat);
        }
    });

    function generateReceipt(name, seat) {
        const receiptWindow = window.open('', 'Receipt', 'width=800,height=600');
        const receiptContent = `
            <html>
                <head>
                    <title>Reçu de réservation</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
                </head>
                <body>
                    <h2>Reçu de réservation</h2>
                    <p>Nom: ${name}</p>
                    <p>Siège: ${seat.row}-${seat.number}</p>
                    <p>Spectacle: ${selectedShow}</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                    <div id="qrcode"></div>
                    <p>Merci pour votre réservation!</p>
                    <script>
                        const qrData = "Nom: ${name}, Siège: ${seat.row}-${seat.number}, Spectacle: ${selectedShow}, Date: ${new Date().toLocaleDateString()}";
                        new QRCode(document.getElementById("qrcode"), qrData);
                    </script>
                </body>
            </html>
        `;
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
    }

    // Afficher les sièges du spectacle sélectionné au chargement de la page
    displaySeats(shows[selectedShow]);
});