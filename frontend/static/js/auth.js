/* ================= AUTH SYSTEM ================= */

function logout() {

  localStorage.removeItem("user");

  window.location.href = "signin.html";
}


/* ================= LOGOUT USER ================= */

function logoutUser() {

  logout();

}


/* ================= REGISTER USER ================= */

function registerUser() {

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();


  /* EMPTY CHECK */

  if (!name || !email || !password) {

    alert("Please fill all fields");

    return false;
  }


  /* GET USERS */

  const users =
    JSON.parse(localStorage.getItem("users")) || [];


  /* CHECK EXISTING USER */

  const existingUser =
    users.find(user => user.email === email);

  if (existingUser) {

    alert("User already exists");

    return false;
  }


  /* CREATE USER */

  const newUser = {

    name,
    email,
    password

  };


  /* SAVE */

  users.push(newUser);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  localStorage.setItem(
    "user",
    JSON.stringify(newUser)
  );


  /* SUCCESS */

  alert("Signup successful 🎉");

  window.location.href = "index.html";

  return false;
}


/* ================= LOGIN USER ================= */

function loginUser() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();


  /* GET USERS */

  const users =
    JSON.parse(localStorage.getItem("users")) || [];


  /* CHECK USER */

  const validUser =
    users.find(
      user =>
        user.email === email &&
        user.password === password
    );


  /* INVALID */

  if (!validUser) {

    alert("Invalid email or password ❌");

    return false;
  }


  /* SAVE LOGIN */

  localStorage.setItem(
    "user",
    JSON.stringify(validUser)
  );


  /* SUCCESS */

  alert("Login successful ✅");

  window.location.href = "index.html";

  return false;
}


/* ================= SHOW USERNAME ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const currentUser =
      JSON.parse(localStorage.getItem("user"));

    const username =
      document.getElementById("username");

    if (currentUser && username) {

      username.innerText =
        currentUser.name;
    }
  }
);