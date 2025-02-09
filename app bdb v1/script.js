if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("menu").classList.toggle("show");
    });
});

function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}

function loadTickets() {
    return JSON.parse(localStorage.getItem("tickets")) || [];
}

document.addEventListener("click", function (event) {
    let menu = document.getElementById("menu");
    let toggle = document.getElementById("menu-toggle");

    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove("show");
    }
});



function addTicket() {
    let amountInput = document.getElementById("amount");
    let amount = parseFloat(amountInput.value);
    let type = document.getElementById("type").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please, enter un valid amount.");
        return;
    }

    let ticket = { type, amount };
    tickets.push(ticket);
    saveTickets();

    updateTable();

    amountInput.value = "";
}

function updateTable() {
    let tbody = document.getElementById("ticket-list");
    tbody.innerHTML = "";

    let total = 0, totalLocaux = 0, totalInvites = 0;
    let countLocaux = 0, countInvites = 0, totalTickets = tickets.length;

    tickets.forEach((ticket, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${ticket.type}</td><td>${ticket.amount} €</td>
                         <td><button onclick="deleteTicket(${index})">🗑️</button></td>`;
        tbody.appendChild(row);

        total += ticket.amount;
        if (ticket.type === "Locals") {
            totalLocaux += ticket.amount;
            countLocaux++;
        } else {
            totalInvites += ticket.amount;
            countInvites++;
        }
    });

    let averageTicket = totalTickets > 0 ? (total / totalTickets).toFixed(2) : 0;
    let averageTicketLocals = countLocaux > 0 ? (totalLocaux / countLocaux).toFixed(2) : 0;
    let averageTicketGuests = countInvites > 0 ? (totalInvites / countInvites).toFixed(2) : 0;

    document.getElementById("total").innerText = total;
    document.getElementById("total-locals").innerText = totalLocaux;
    document.getElementById("total-guests").innerText = totalInvites;
    document.getElementById("total-tickets").innerText = totalTickets;
    document.getElementById("average-ticket").innerText = averageTicket;
    document.getElementById("average-ticket-locals").innerText = averageTicketLocals;
    document.getElementById("average-ticket-guests").innerText = averageTicketGuests;
}


function deleteTicket(index) {
    tickets.splice(index, 1); // Supprime l'élément à l'index donné
    saveTickets(); // Met à jour le stockage local
    updateTable(); // Rafraîchit le tableau
}

document.getElementById("toggle-stats").addEventListener("click", function() {
    let stats = document.getElementById("stats-container");
    if (stats.classList.contains("hidden")) {
        stats.classList.remove("hidden");
        this.innerText = "Masquer les Stats 🔼";
    } else {
        stats.classList.add("hidden");
        this.innerText = "Afficher les Stats 📊";
    }
});
 

function resetTable() {
    tickets = [];
    localStorage.removeItem("tickets");
    updateTable();
}
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Type,Montant (€)\n";
    tickets.forEach(ticket => {
        csvContent += `${ticket.type},${ticket.amount}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("amount").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche le rechargement de la page
        addTicket(); // Appelle la fonction d'ajout de ticket
    }
});

// Charger les données au démarrage
updateTable();

function showConfirmationMessage() {
    let message = document.createElement("div");
    message.innerText = "Ticket ajouté avec succès ! ✅";
    message.classList.add("confirmation-message");
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 20000);
}

function addTicket() {
    let amountInput = document.getElementById("amount");
    let amount = parseFloat(amountInput.value);
    let type = document.getElementById("type").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
    }

    let ticket = { type, amount };
    tickets.push(ticket);
    saveTickets();

    updateTable();
    showConfirmationMessage(); // Affiche le message de confirmation
    amountInput.value = "";
}


document.getElementById("dark-mode-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    this.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Appliquer le mode sombre au chargement
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("dark-mode-toggle").innerText = "☀️";
}


// Vérifie si le mode sombre est activé au chargement
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("dark-mode-toggle").innerText = "☀️";
}



// A SUPPRIMER
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
});
