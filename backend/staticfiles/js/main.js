document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     LOAD USER
  ========================= */

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Invalid user data");
    localStorage.removeItem("user");
  }

  const username = document.getElementById("username");

  if (username && user) {
    username.innerText = user.name || "User";
  }

  /* =========================
     UPDATE COUNTS
  ========================= */

  if (typeof updateCartCount === "function") updateCartCount();
  if (typeof updateFavCount === "function") updateFavCount();
  if (typeof checkFavIcons === "function") checkFavIcons();

  initNavbarHamburger();
  // sync counts into the mobile menubar badges
  if (typeof updateMobileCounts === "function") updateMobileCounts();

  /* =========================
     SEARCH HANDLING
  ========================= */

  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("search");

  if (searchQuery) {

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = searchQuery;

    // Delay search until products render
    setTimeout(() => {

      let productCards = document.querySelectorAll(".product-card");

      productCards.forEach(product => {

        let text = product.innerText.toLowerCase();

        if (text.includes(searchQuery.toLowerCase())) {
          product.style.display = "";
        } else {
          product.style.display = "none";
        }

      });

    }, 500); // wait for API load

  }

});


/* =========================
   SIZE SELECT
========================= */

function selectSize(el) {

  document.querySelectorAll(".sizes span")
    .forEach(s => s.classList.remove("active"));

  el.classList.add("active");

}

/* =========================
   MOBILE MENUBAR COUNTERS
========================= */
function updateMobileCounts() {
  // copy existing counter elements if present
  const cartCount = document.getElementById("cart-count");
  const favCount = document.getElementById("fav-count");
  const mmCart = document.getElementById("mm-cart-count");
  const mmFav = document.getElementById("mm-fav-count");

  if (mmCart) {
    if (cartCount) mmCart.innerText = cartCount.innerText.trim();
    else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      mmCart.innerText = (cart.length || 0).toString();
    }
  }

  if (mmFav) {
    if (favCount) mmFav.innerText = favCount.innerText.trim();
    else {
      const fav = JSON.parse(localStorage.getItem("favourites") || "[]");
      mmFav.innerText = (fav.length || 0).toString();
    }
  }
}


/* =========================
   NAVBAR USER LOAD
========================= */

function loadNavbarUser() {

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    localStorage.removeItem("user");
  }

  const navUser = document.getElementById("nav-user");

  if (user && navUser) {
    navUser.innerText = user.name;
  }

}

function initNavbarHamburger() {
  document.querySelectorAll(".navbar").forEach(navbar => {
    if (navbar.dataset.navbarHamburgerInit === "true") return;
    navbar.dataset.navbarHamburgerInit = "true";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "navbar-toggle";
    toggleButton.setAttribute("aria-label", "Toggle navigation");
    toggleButton.innerHTML = "<span></span><span></span><span></span>";

    const logoElement = navbar.querySelector(".nav-logo");
    if (logoElement) {
      logoElement.insertAdjacentElement("afterend", toggleButton);
    } else {
      navbar.insertBefore(toggleButton, navbar.firstChild);
    }

    toggleButton.addEventListener("click", () => {
      navbar.classList.toggle("navbar-open");
    });

    document.addEventListener("click", event => {
      if (!navbar.contains(event.target) && navbar.classList.contains("navbar-open")) {
        navbar.classList.remove("navbar-open");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", function () {
  const username = document.getElementById("username");
  if (username) {
    const user = JSON.parse(localStorage.getItem("user"));
    username.innerText = user?.name || "Guest";
  }
});