let products = [];

const BACKEND_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : "https://clothingstore-2-smeg.onrender.com";

const localProductImageMap = {
  "STREETSTYLE LEATHER JACKET":  "/static/images/leatherjacket.png",
  "URBAN CARGO PANTS":           "/static/images/cargo.png",
  "MINIMAL WHITE TEE":           "/static/images/whitetee.png",
  "STREET HOODIE":               "/static/images/hoodie.png",
  "CHIC BOW TOP":                "/static/images/rmbow_top.png",
  "SUMMER BREEZE DRESS":         "/static/images/summerbg.png",
  "RED LEATHER STREET JACKET":   "/static/images/red-removebg-preview.png",
  "OVERSIZED GRAPHIC TEE":       "/static/images/graphictee.png",
  "LOOSE FIT SHIRT":             "/static/images/loose_shirt.png",
  "OVERSIZED BLACK TEE":         "/static/images/blacktee1.png"
};

function getLocalImage(name) {
  // BUG FIX 1: trim + uppercase to ensure name matching works reliably
  const key = (name || "").trim().toUpperCase();
  return localProductImageMap[key] || "/static/images/blacktee1.png";
}

const currentPage = window.location.pathname.toLowerCase();

const category =
  new URLSearchParams(window.location.search).get("category")
  ||
  (
    currentPage.includes("/women")       ? "Women"
    : currentPage.includes("/men")       ? "Men"
    : currentPage.includes("/oversized") ? "Oversized"
    : null
  );

const isHomePage =
  currentPage === "/" ||
  currentPage === "" ||
  currentPage.endsWith("/index.html") ||
  currentPage.endsWith("/index");

// BUG FIX 2: Proper template literal (was broken — missing backticks around the whole string)
let apiUrl = `${BACKEND_URL}/api/products/`;

if (category) {
  apiUrl += `?category=${encodeURIComponent(category)}`;
}

async function loadProducts() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    const limitedData = isHomePage ? data.slice(0, 4) : data;
    products = limitedData.map(item => ({
      id:    item.id,
      name:  item.name,
      price: item.price,
      // BUG FIX 3: item.image from the API was always falsy (empty string / null),
      // so we always call getLocalImage. Now we also pass item.name uppercased
      // to match the keys in localProductImageMap.
      img:   (item.image && item.image.trim() !== "") ? item.image : getLocalImage(item.name),
      desc:  item.description
    }));
    renderProducts();
  } catch (error) {
    console.error("Failed loading products:", error);
  }
}

function renderProducts() {
  const container = document.getElementById("product-container");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(product => {
    // BUG FIX 4: Restored proper backtick template literal for the card HTML
    container.innerHTML += `
      <div class="product-card" onclick="openDetail(${product.id})">
        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='/static/images/blacktee1.png';"
        >
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <div class="product-actions">
          <button class="add-btn" onclick="addToCart(${product.id}, event)">Add To Cart</button>
          <button class="fav-btn" onclick="toggleFav(event, ${product.id})">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
      </div>
    `;
  });
  checkFavIcons();
}

function openDetail(id) {
  // BUG FIX 5: Restored proper backtick template literal for redirect URL
  window.location.href = `/product-detail/?id=${id}`;
}

function addToCart(id, event) {
  if (event) event.stopPropagation();
  const product = products.find(p => p.id == id);
  if (!product) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id == id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added To Cart 🛒");
}

function toggleFav(event, id) {
  event.stopPropagation();
  const product = products.find(p => p.id === id);
  if (!product) return;
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const index = favourites.findIndex(item => item.id === id);
  const icon = event.currentTarget.querySelector("i");
  if (index === -1) {
    favourites.push({ id: product.id, name: product.name, price: product.price, img: product.img });
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    icon.style.color = "red";
  } else {
    favourites.splice(index, 1);
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    icon.style.color = "white";
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  updateFavCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.innerText = total;
}

function updateFavCount() {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const favCount = document.getElementById("fav-count");
  if (favCount) favCount.innerText = favourites.length;
}

function checkFavIcons() {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  document.querySelectorAll(".fav-btn").forEach(button => {
    const onclickAttr = button.getAttribute("onclick");
    const match = onclickAttr.match(/toggleFav\(event,\s*(\d+)\)/);
    if (!match) return;
    const id = match[1];
    const exists = favourites.find(item => item.id == id);
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

document.addEventListener("DOMContentLoaded", () => {
  updateFavCount();
  updateCartCount();
  loadProducts();
});