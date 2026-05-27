// ================= LOAD USER =================

let user = null;

try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    localStorage.removeItem("user");
}


// ================= CHECK LOGIN =================

if (!user) {

    alert("Please login first");

    window.location.href = "signin.html";

} else {

    const profileName = document.getElementById("profile-name");
    const profileEmail = document.getElementById("profile-email");
    const profilePhone = document.getElementById("profile-phone");
    const profileAddress = document.getElementById("profile-address");

    if (profileName) {
        profileName.innerText = user.name || "User";
    }

    if (profileEmail) {
        profileEmail.innerText = user.email || "No Email";
    }

    if (profilePhone) {
        profilePhone.innerText = user.phone || "Not set";
    }

    if (profileAddress) {
        profileAddress.innerText = user.address || "Not set";
    }
}


// ================= LOGOUT =================

function logoutUser() {

    localStorage.removeItem("user");

    alert("Logged out successfully");

    window.location.href = "signin.html";
}

function logout() {
    logoutUser();
}