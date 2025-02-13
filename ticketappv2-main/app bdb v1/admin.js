document.addEventListener("DOMContentLoaded", function () {
    initializeAdmin();
    loadUsers();
});

function initializeAdmin() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Ajoute un premier admin s'il n'existe pas
    let adminExists = users.some(user => user.role === "admin");
    if (!adminExists) {
        users.push({
            username: "andre",
            password: "okok",
            role: "admin",
            restaurants: ["all"]
        });
        localStorage.setItem("users", JSON.stringify(users));
        console.log("✅ Premier admin 'andre' ajouté !");
    }
}

document.getElementById("create-user-btn").addEventListener("click", function () {
    let username = document.getElementById("new-username").value.trim();
    let password = document.getElementById("new-password").value.trim();
    let role = document.getElementById("new-role").value;
    let restaurantOptions = document.getElementById("new-restaurants").selectedOptions;
    
    let restaurants = Array.from(restaurantOptions).map(option => option.value);

    if (!username || !password || restaurants.length === 0) {
        alert("Tous les champs sont requis !");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, password, role, restaurants });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Utilisateur créé avec succès !");
    loadUsers();
});

function loadUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userTable = document.getElementById("user-table");
    userTable.innerHTML = "";

    users.forEach((user, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.restaurants.join(", ")}</td>
            <td><button class="delete-user" onclick="deleteUser(${index})">❌ Supprimer</button></td>
        `;
        userTable.appendChild(row);
    });
}

function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
}
