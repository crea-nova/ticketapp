if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", function () {
    updateStats();
    generateChart();
    generateCalendar();
});

function getTickets() {
    return JSON.parse(localStorage.getItem("tickets")) || [];
}

function updateStats() {
    let tickets = getTickets();

    let total = 0, totalLocals = 0, totalGuests = 0;
    let countLocals = 0, countGuests = 0, totalTickets = tickets.length;

    tickets.forEach(ticket => {
        total += ticket.amount;
        if (ticket.type === "Locals") {
            totalLocals += ticket.amount;
            countLocals++;
        } else {
            totalGuests += ticket.amount;
            countGuests++;
        }
    });

    let avgTicket = totalTickets > 0 ? (total / totalTickets).toFixed(2) : 0;
    let avgLocals = countLocals > 0 ? (totalLocals / countLocals).toFixed(2) : 0;
    let avgGuests = countGuests > 0 ? (totalGuests / countGuests).toFixed(2) : 0;

    document.getElementById("total").innerText = total;
    document.getElementById("total-locals").innerText = totalLocals;
    document.getElementById("total-guests").innerText = totalGuests;
    document.getElementById("total-tickets").innerText = totalTickets;
    document.getElementById("average-ticket").innerText = avgTicket;
    document.getElementById("average-ticket-locals").innerText = avgLocals;
    document.getElementById("average-ticket-guests").innerText = avgGuests;
}



// document.addEventListener("DOMContentLoaded", generateChart);
// let chartGenerated = false; 

let chartGenerated = false;
let chartInstance = null;

document.getElementById("toggle-chart").addEventListener("click", function () {
    let chartContainer = document.getElementById("chart-container");
    let chartCanvas = document.getElementById("ticketChart");

    if (chartContainer.classList.contains("hidden")) {
        chartContainer.classList.remove("hidden");
        this.innerText = "📊 Masquer le Graphique";

        // Générer le graphique uniquement s'il n'a jamais été créé
        if (!chartGenerated) {
            setTimeout(() => {
                generateChart();
                chartGenerated = true;
            }, 300); // Délai pour s'assurer que l'élément est bien rendu
        }
    } else {
        chartContainer.classList.add("hidden");
        this.innerText = "📊 Afficher le Graphique";
    }
});

function generateChart() {
    let tickets = getTickets();
    let chartCanvas = document.getElementById("ticketChart");

    if (!chartCanvas) {
        console.error("Canvas ticketChart non trouvé !");
        return;
    }

    let ctx = chartCanvas.getContext("2d");

    let totalLocals = tickets.filter(t => t.type === "Locals").reduce((sum, t) => sum + t.amount, 0);
    let totalGuests = tickets.filter(t => t.type === "Guests").reduce((sum, t) => sum + t.amount, 0);

    // Supprime l'ancien graphique s'il existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Crée un nouveau graphique
    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Locals", "Guests"],
            datasets: [{
                data: [totalLocals, totalGuests],
                backgroundColor: ["#0047BA", "#7ED321"]
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            return `${label}: ${value} €`;
                        }
                    }
                }
            }
        }
    });
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calendar-view").addEventListener("change", generateCalendar);
    generateCalendar();
});

function generateCalendar() {
    let viewMode = document.getElementById("calendar-view").value;
    let tickets = getTickets();
    let calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Nettoyage avant affichage

    if (viewMode === "monthly") {
        generateMonthlyCalendar(tickets);
    } else if (viewMode === "weekly") {
        generateWeeklyCalendar(tickets);
    } else if (viewMode === "yearly") {
        generateYearlyCalendar(tickets);
    }
}

// 📅 Vue Mensuelle
function generateMonthlyCalendar(tickets) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = getTicketDataByDate(tickets);

    let html = "<table class='calendar-table'><tr>";
    let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let day of weekDays) {
        html += `<th>${day}</th>`;
    }
    html += "</tr><tr>";

    for (let i = 0; i < firstDay - 1; i++) {
        html += "<td ></td>";
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        let amount = days[date] || 0;
        let classList = amount > 0 ? "highlight-day" : "";
        if (i === today.getDate()) {
            classList += " today";
        }

        html += `<td class="${classList.trim()}">
                    <span>${i}</span><br>
                    <strong   class='days'>${amount} €</strong>
                 </td>`;

        if ((i + firstDay - 1) % 7 === 0) {
            html += "</tr><tr>";
        }
    }
    html += "</tr></table>";
    calendar.innerHTML = html;
}

function generateWeeklyCalendar(tickets) {
    let today = new Date();
    let currentDayOfWeek = today.getDay(); // Récupère le jour actuel (0 = Dimanche, 6 = Samedi)

    // Ajustement pour commencer la semaine le lundi tout en incluant dimanche précédent
    let currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1));

    let days = getTicketDataByDate(tickets);

    let html = "<table class='calendar-table'><tr>";
    let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let day of weekDays) {
        html += `<th>${day}</th>`;
    }
    html += "</tr><tr>";

    for (let i = 0; i < 7; i++) {
        let date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        let formattedDate = date.toISOString().split("T")[0];
        let amount = days[formattedDate] || 0;

        let classList = amount > 0 ? "highlight-day" : "";
        if (date.getDate() === new Date().getDate()) {
            classList += " today";
        }

        html += `<td class="${classList.trim()}">
                    <span>${date.getDate()}</span><br>
                    <strong>${amount} €</strong>
                 </td>`;
    }

    html += "</tr></table>";
    document.getElementById("calendar").innerHTML = html;
}


// 📆 Vue Annuelle
function generateYearlyCalendar(tickets) {
    let today = new Date();
    let year = today.getFullYear();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let days = getTicketDataByMonth(tickets);

    let html = "<table class='calendar-table'><tr>";
    for (let month of months) {
        html += `<th>${month}</th>`;
    }
    html += "</tr><tr>";

    for (let i = 0; i < 12; i++) {
        let monthKey = `${year}-${String(i + 1).padStart(2, "0")}`;
        let amount = days[monthKey] || 0;
        let classList = amount > 0 ? "highlight-day" : "";
        if (i === today.getMonth()) {
            classList += " today";
        }

        html += `<td class="${classList.trim()}">
                    <strong>${amount} €</strong>
                 </td>`;
    }

    html += "</tr></table>";
    calendar.innerHTML = html;
}

// 🔄 Fonction pour regrouper les tickets par date
function getTicketDataByDate(tickets) {
    let days = {};
    tickets.forEach(ticket => {
        let date = new Date().toISOString().split("T")[0]; // Remplace par la vraie date du ticket si dispo
        if (!days[date]) days[date] = 0;
        days[date] += ticket.amount;
    });
    return days;
}

// 🔄 Fonction pour regrouper les tickets par mois
function getTicketDataByMonth(tickets) {
    let months = {};
    tickets.forEach(ticket => {
        let date = new Date().toISOString().split("T")[0]; // Remplace par la vraie date du ticket si dispo
        let month = date.substring(0, 7);
        if (!months[month]) months[month] = 0;
        months[month] += ticket.amount;
    });
    return months;
}


document.addEventListener("DOMContentLoaded", generateCalendar);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("menu").classList.toggle("show");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("username-display").innerText = user.username;
    } else {
        document.getElementById("username-display").innerText = "Invité";
    }
});

function updateTicketCounts() {
    let tickets = getTickets();

    let totalTickets = tickets.length;
    let totalLocals = tickets.filter(t => t.type === "Locals").length;
    let totalGuests = tickets.filter(t => t.type === "Guests").length;

    document.getElementById("total-tickets").innerText = totalTickets;
    document.getElementById("total-locals-tickets").innerText = totalLocals;
    document.getElementById("total-guests-tickets").innerText = totalGuests;
}
function updateTicketCounts() {
    let tickets = getTickets();

    let totalTickets = tickets.length;
    let totalLocals = tickets.filter(t => t.type === "Locals").length;
    let totalGuests = tickets.filter(t => t.type === "Guests").length;

    let totalAmount = tickets.reduce((sum, t) => sum + t.amount, 0);
    let totalLocalsAmount = tickets.filter(t => t.type === "Locals").reduce((sum, t) => sum + t.amount, 0);
    let totalGuestsAmount = tickets.filter(t => t.type === "Guests").reduce((sum, t) => sum + t.amount, 0);

    let percentLocals = totalAmount > 0 ? ((totalLocalsAmount / totalAmount) * 100).toFixed(2) : 0;
    let percentGuests = totalAmount > 0 ? ((totalGuestsAmount / totalAmount) * 100).toFixed(2) : 0;

    document.getElementById("total-tickets").innerText = totalTickets;
    document.getElementById("total-locals-tickets").innerText = totalLocals;
    document.getElementById("total-guests-tickets").innerText = totalGuests;

    document.getElementById("percent-locals").innerText = `${percentLocals} %`;
    document.getElementById("percent-guests").innerText = `${percentGuests} %`;
}


// ✅ Mettre à jour les stats à chaque ajout/suppression de ticket
document.addEventListener("DOMContentLoaded", function () {
    updateTicketCounts();
});



// ✅ Mettre à jour les stats à chaque ajout/suppression de ticket
document.addEventListener("DOMContentLoaded", function () {
    updateTicketCounts();
});



// A SUPPRIMER
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
});
