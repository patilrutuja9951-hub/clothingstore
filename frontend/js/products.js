let products = [];

const BACKEND_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : 'https://clothingstore-2-smeg.onrender.com';
/* =========================
   LOCAL FALLBACK IMAGES
========================= */

const localProductImageMap = {
  "STREETSTYLE LEATHER JACKET": "images/leatherjacket.png",
  "URBAN CARGO PANTS": "images/cargo.png",
  "MINIMAL WHITE TEE": "images/whitetee.png",
  "STREET HOODIE": "images/hoodie.png",
  "CHIC BOW TOP": "images/rmbow top.png",
  "SUMMER BREEZE DRESS": "images/summerbg.png",
  "RED LEATHER STREET JACKET": "images/red-removebg-preview.png",
  "OVERSIZED GRAPHIC TEE": "images/graphictee.png",
  "LOOSE FIT SHIRT": "images/loose shirt.png"
};

function getLocalImage(name) {
  return localProductImageMap[name] || "images/blacktee1.png";
}

/* =========================
   PAGE + CATEGORY DETECTION
========================= */

const currentPage = window.location.pathname.toLowerCase();

const category =
  new URLSearchParams(window.location.search).get("category") ||
  (currentPage.includes("women.html") ? "Women" :
   currentPage.includes("men.html") ? "Men" :
   currentPage.includes("oversized.html") ? "Oversized" :
   null);

/* =========================
   BUILD API URL
========================= */

let apiUrl = `${BACKEND_URL}/api/products/`;

if (category) {
  apiUrl += `?category=${encodeURIComponent(category)}`;
}

/* =========================
   FETCH PRODUCTS
========================= */

async function loadProducts() {

  try {

    console.log("Fetching:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    /* =========================
       HOMEPAGE DETECTION
    ========================= */

    const isHomePage =
      currentPage.endsWith("index.html") ||
      currentPage === "/" ||
      currentPage === "";

    console.log("Current Page:", currentPage);
    console.log("Is Homepage:", isHomePage);
    console.log("Products Count:", data.length);

    const limitedData = isHomePage
      ? data.slice(0, 4)
      : data;

    /* =========================
       STORE PRODUCTS
    ========================= */

    products = limitedData.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.image || getLocalImage(item.name),
      desc: item.description
    }));

    console.log("Loaded Products:", products);

    renderProducts();

  } catch (error) {

    console.error("Failed loading products:", error);

  }
}

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const container = document.getElementById("product-container");

  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `
    
      <div class="product-card" onclick="openDetail(${product.id})">

        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='images/blacktee1.png';"
        >

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

        <div class="product-actions">

          <button
            class="add-btn"
            onclick="addToCart(${product.id}, event)">
            Add To Cart
          </button>

          <button
            class="fav-btn"
            onclick="toggleFav(event, ${product.id})">

            <i class="fa-regular fa-heart"></i>

          </button>

        </div>

      </div>
    `;
  });

  checkFavIcons();
}

/* =========================
   PRODUCT DETAIL PAGE
========================= */

function openDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

/* =========================
   ADD TO CART
========================= */

function addToCart(id, event) {

  if (event) event.stopPropagation();

  const product = products.find(p => p.id == id);

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id == id);

  if (existing) {

    existing.qty += 1;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert("Added To Cart 🛒");
}

/* =========================
   TOGGLE FAVOURITES
========================= */

function toggleFav(event, id) {

  event.stopPropagation();

  const product = products.find(p => p.id === id);

  if (!product) return;

  let favourites =
    JSON.parse(localStorage.getItem("favourites")) || [];

  const index =
    favourites.findIndex(item => item.id === id);

  const icon =
    event.currentTarget.querySelector("i");

  if (index === -1) {

    favourites.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img
    });

    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");

    icon.style.color = "red";

  } else {

    favourites.splice(index, 1);

    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");

    icon.style.color = "white";
  }

  localStorage.setItem(
    "favourites",
    JSON.stringify(favourites)
  );

  updateFavCount();
}

/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const total =
    cart.reduce((sum, item) => sum + item.qty, 0);

  const cartCount =
    document.getElementById("cart-count");

  if (cartCount) {
    cartCount.innerText = total;
  }
}

/* =========================
   UPDATE FAV COUNT
========================= */

function updateFavCount() {

  let favourites =
    JSON.parse(localStorage.getItem("favourites")) || [];

  const favCount =
    document.getElementById("fav-count");

  if (favCount) {
    favCount.innerText = favourites.length;
  }
}

/* =========================
   CHECK FAV ICONS
========================= */

function checkFavIcons() {

  let favourites =
    JSON.parse(localStorage.getItem("favourites")) || [];

  document.querySelectorAll(".fav-btn").forEach(button => {

    const onclickAttr =
      button.getAttribute("onclick");

    const match =
      onclickAttr.match(/toggleFav\(event,\s*(\d+)\)/);

    if (!match) return;

    const id = match[1];

    const exists =
      favourites.find(item => item.id == id);

    const icon = button.querySelector("i");

    if (exists) {

      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");

      icon.style.color = "red";

    } else {

      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");

      icon.style.color = "white";
    }
  });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  updateFavCount();

  updateCartCount();

  loadProducts();

});