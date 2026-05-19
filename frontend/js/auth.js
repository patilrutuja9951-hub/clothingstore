/* ================= AUTH SYSTEM ================= */

function logout() {
  localStorage.removeItem("user");
  window.location.href = "signin.html";
}

function logoutUser() {
  logout();
}

function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return false;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(user => user.email === email)) {
    alert("User already exists");
    return false;
  }

  const newUser = { name, email, password };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("user", JSON.stringify(newUser));

  alert("Signup successful 🎉");
  window.location.href = "index.html";

  return false;
}

function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const valid = users.find(user => user.email === email && user.password === password);

  if (!valid) {
    alert("Invalid email or password ❌");
    return false;
  }

  localStorage.setItem("user", JSON.stringify(valid));

  alert("Login successful ✅");
  window.location.href = "index.html";

  return false;
}