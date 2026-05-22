/* =========================
   BACKEND URL
========================= */

const BACKEND_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : "https://clothingstore-2-smeg.onrender.com";


/* =========================
   LOCAL FALLBACK IMAGES
========================= */

const localProductImageMap = {
  "STREETSTYLE LEATHER JACKET":  "static/images/leatherjacket.png",
  "URBAN CARGO PANTS":           "static/images/cargo.png",
  "MINIMAL WHITE TEE":           "static/images/whitetee.png",
  "STREET HOODIE":               "static/images/hoodie.png",
  "CHIC BOW TOP":                "static/images/rmbow_top.png",
  "SUMMER BREEZE DRESS":         "static/images/summerbg.png",
  "RED LEATHER STREET JACKET":   "static/images/red-removebg-preview.png",
  "OVERSIZED GRAPHIC TEE":       "static/images/graphictee.png",
  "LOOSE FIT SHIRT":             "static/images/loose_shirt.png"
};

function getLocalImage(name) {
  return localProductImageMap[name] || "static/images/blacktee1.png";
}


/* =========================
   QUANTITY CONTROL
========================= */

let detailQty = 1;

function changeQtyDetail(change) {
  detailQty = Math.max(1, detailQty + change);
  const qtyEl = document.getElementById("detail-qty");
  if (qtyEl) qtyEl.innerText = detailQty;
}


/* =========================
   ADD TO CART FROM DETAIL
========================= */

function addToCartFromDetail(product) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += detailQty;
  } else {
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      img:   product.img,
      qty:   detailQty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = total;
  }

  alert("Added to Cart 🛒");
}


/* =========================
   TOGGLE FAV FROM DETAIL
========================= */

function toggleFavDetail(product) {

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  const index = favourites.findIndex(item => item.id === product.id);

  const btn = document.getElementById("fav-detail-btn");
  const icon = btn?.querySelector("i");

  if (index === -1) {
    favourites.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      img:   product.img
    });
    if (icon) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
      icon.style.color = "red";
    }
    alert("Added to Favourites ❤️");
  } else {
    favourites.splice(index, 1);
    if (icon) {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      icon.style.color = "white";
    }
    alert("Removed from Favourites");
  }

  localStorage.setItem("favourites", JSON.stringify(favourites));

  const favCount = document.getElementById("fav-count");
  if (favCount) favCount.innerText = favourites.length;
}


/* =========================
   LOAD PRODUCT DETAIL
========================= */

async function loadProductDetail() {

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  if (!id) {
    document.getElementById("detail-container").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  try {

    const response = await fetch(`${BACKEND_URL}/api/product/${id}/`);

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const item = await response.json();

    const product = {
      id:    item.id,
      name:  item.name,
      price: item.price,
      img:   item.image ? item.image : getLocalImage(item.name),
      desc:  item.description || "Premium streetwear piece from MH24 Collection."
    };

    /* CHECK IF ALREADY IN FAVOURITES */

    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const isFav = favourites.some(f => f.id === product.id);

    /* RENDER */

    const container = document.getElementById("detail-container");

    if (!container) return;

    container.innerHTML = `
      <div class="detail-image">
        <img
          src="${product.img}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='static/images/blacktee1.png';"
        >
      </div>

      <div class="detail-info">

        <h1>${product.name}</h1>

        <p class="detail-price">₹${product.price}</p>

        <p class="detail-desc">${product.desc}</p>

        <div class="sizes">
          <span onclick="selectSize(this)">S</span>
          <span onclick="selectSize(this)">M</span>
          <span onclick="selectSize(this)">L</span>
          <span onclick="selectSize(this)">XL</span>
          <span onclick="selectSize(this)">XXL</span>
        </div>

        <div class="detail-qty-control">
          <button onclick="changeQtyDetail(-1)">−</button>
          <span id="detail-qty">1</span>
          <button onclick="changeQtyDetail(1)">+</button>
        </div>

        <div class="detail-actions">

          <button class="add-btn" onclick='addToCartFromDetail(${JSON.stringify(product)})'>
            Add To Cart 🛒
          </button>

          <button class="fav-btn" id="fav-detail-btn" onclick='toggleFavDetail(${JSON.stringify(product)})'>
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"
               style="color: ${isFav ? 'red' : 'white'}"></i>
          </button>

        </div>

        <button class="back-btn" onclick="history.back()">
          ← Back
        </button>

      </div>
    `;

  } catch (error) {
    console.error("Failed to load product:", error);
    document.getElementById("detail-container").innerHTML =
      "<p>Failed to load product. Please try again.</p>";
  }
}


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
});