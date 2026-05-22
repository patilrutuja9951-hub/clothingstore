const currentUser =
    JSON.parse(localStorage.getItem("user"));

/* =========================
   CHECK LOGIN
========================= */

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "signin.html";

}

/* =========================
   USER EXISTS
========================= */

else {

    /* INPUTS */

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");

    const addressInput =
        document.getElementById("address");

    const profileForm =
        document.getElementById("profile-form");

    /* LOAD USER DATA */

    if (nameInput) {

        nameInput.value =
            currentUser.name || "";

    }

    if (emailInput) {

        emailInput.value =
            currentUser.email || "";

    }

    if (phoneInput) {

        phoneInput.value =
            currentUser.phone || "";

    }

    if (addressInput) {

        addressInput.value =
            currentUser.address || "";

    }

    /* =========================
       SAVE PROFILE
    ========================= */

    function saveProfile(event) {

        event.preventDefault();

        const updatedName =
            nameInput.value.trim();

        const updatedPhone =
            phoneInput.value.trim();

        const updatedAddress =
            addressInput.value.trim();

        /* VALIDATION */

        if (!updatedName) {

            alert("Please enter your name.");

            return;

        }

        /* UPDATED USER */

        const updatedUser = {

            ...currentUser,

            name: updatedName,

            phone: updatedPhone,

            address: updatedAddress,

        };

        /* UPDATE USERS ARRAY */

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const updatedUsers =
            users.map(user => {

                if (user.email === currentUser.email) {

                    return {

                        ...user,

                        name: updatedName,

                        phone: updatedPhone,

                        address: updatedAddress,

                    };

                }

                return user;

            });

        /* SAVE */

        localStorage.setItem(
            "users",
            JSON.stringify(updatedUsers)
        );

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        /* SUCCESS */

        alert("Profile updated successfully.");

        window.location.href =
            "profile.html";

    }

    /* =========================
       FORM SUBMIT
    ========================= */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            saveProfile
        );

    }

}