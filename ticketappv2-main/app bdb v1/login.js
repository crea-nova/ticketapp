document.getElementById("login-btn").addEventListener("click", function () {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Simulation d'un compte utilisateur (à remplacer par un backend plus tard)
    let storedUser = localStorage.getItem("user");
    
    if (storedUser) {
        storedUser = JSON.parse(storedUser);
    } else {
        // Simuler un premier utilisateur par défaut
        storedUser = { username: "admin", password: "1234" };
        localStorage.setItem("user", JSON.stringify(storedUser));
    }

    if (username === storedUser.username && password === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html"; // Redirige vers la page principale
    } else {
        document.getElementById("error-message").classList.remove("hidden");
    }
});

// Vérifier si l'utilisateur est déjà connecté
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
}

// A SUPPRIMER FAUX COMPTE LOGIN
document.getElementById("login-btn").addEventListener("click", function () {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // ✅ Faux compte temporaire (facile à supprimer pour le backend)
    let storedUser = {
        username: "bdb",
        password: "okok"
    };

    // Vérification des identifiants
    if (username === storedUser.username && password === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html"; // Redirection après connexion
    } else {
        document.getElementById("error-message").classList.remove("hidden");
    }
});

document.getElementById("username").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("login-btn").click();
    }
});
document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("login-btn").click();
    }
});

// ✅ Vérifier si l'utilisateur est déjà connecté
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
}
