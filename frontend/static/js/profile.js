// ================= LOAD USER =================

const user = JSON.parse(localStorage.getItem("user"));


// ================= CHECK LOGIN =================

if (!user) {

    alert("Please login first");

    window.location.href = "signin.html";

} else {

    const profileName = document.getElementById("profile-name");
    const profileEmail = document.getElementById("profile-email");
    const profilePhone = document.getElementById("profile-phone");
    const profileAddress = document.getElementById("profile-address");

    if (profileName) profileName.innerText = user.name || "";
    if (profileEmail) profileEmail.innerText = user.email || "";
    if (profilePhone) profilePhone.innerText = user.phone || "Not set";
    if (profileAddress) profileAddress.innerText = user.address || "Not set";

    // SHOW USER DATA
}


// ================= LOGOUT =================

function logoutUser() {
    localStorage.removeItem("user");
    window.location.href = "signin.html";
}

function logout() {
    logoutUser();
}