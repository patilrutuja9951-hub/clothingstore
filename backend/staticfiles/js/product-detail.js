/* =========================
   LOCAL FALLBACK IMAGES
========================= */

const localProductImageMap = {
  "STREETSTYLE LEATHER JACKET": "/static/images/leatherjacket.png",
  "URBAN CARGO PANTS": "/static/images/cargo.png",
  "MINIMAL WHITE TEE": "/static/images/whitetee.png",
  "STREET HOODIE": "/static/images/hoodie.png",
  "CHIC BOW TOP": "/static/images/rmbow_top.png",
  "SUMMER BREEZE DRESS": "/static/images/summerbg.png",
  "RED LEATHER STREET JACKET": "/static/images/red-removebg-preview.png",
  "OVERSIZED GRAPHIC TEE": "/static/images/graphictee.png",
  "LOOSE FIT SHIRT": "/static/images/loose_shirt.png",
  "OVERSIZED BLACK TEE": "/static/images/blacktee1.png"
};

function getLocalImage(name) {
  const key = (name || "").trim().toUpperCase();
  return localProductImageMap[key] || "/static/images/blacktee1.png";
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
   SIZE SELECTOR
========================= */

function selectSize(el) {
  document.querySelectorAll(".sizes span")
    .forEach(s => s.classList.remove("selected"));

  el.classList.add("selected");
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

    if (!response.ok) throw new Error(response.status);

    const item = await response.json();

    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      img: (item.image && item.image.trim() !== "")
        ? `${BACKEND_URL}${item.image.startsWith("/") ? item.image : "/" + item.image}`
        : getLocalImage(item.name),
      desc: item.description || "Premium streetwear piece."
    };

    const container = document.getElementById("detail-container");

    container.dataset.product = JSON.stringify(product);

    const favourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    const isFav = favourites.some(f => f.id === product.id);

    container.innerHTML = `
      <div class="detail-image">
        <img src="${product.img}" alt="${product.name}"
          onerror="this.onerror=null;this.src='/static/images/blacktee1.png';">
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

          <button class="add-btn" onclick="addToCartFromDetail()">
            Add To Cart 🛒
          </button>

          <button class="fav-btn" id="fav-detail-btn" onclick="toggleFavDetail()">
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"
              style="color:${isFav ? "red" : "white"}"></i>
          </button>

        </div>

        <button class="back-btn" onclick="history.back()">
          ← Back
        </button>

      </div>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("detail-container").innerHTML =
      "<p>Failed to load product.</p>";
  }
}

/* =========================
   ADD TO CART
========================= */

function addToCartFromDetail() {

  const container = document.getElementById("detail-container");
  const product = JSON.parse(container.dataset.product);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);

  if (existing) existing.qty += detailQty;
  else cart.push({ ...product, qty: detailQty });

  localStorage.setItem("cart", JSON.stringify(cart));

  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cart-count").innerText = total;

  alert("Added to Cart 🛒");
}

/* =========================
   TOGGLE FAV
========================= */

function toggleFavDetail() {

  const container = document.getElementById("detail-container");
  const product = JSON.parse(container.dataset.product);

  let fav = JSON.parse(localStorage.getItem("favourites")) || [];

  const index = fav.findIndex(i => i.id === product.id);

  const btn = document.getElementById("fav-detail-btn");
  const icon = btn.querySelector("i");

  if (index === -1) {
    fav.push(product);
    icon.className = "fa-solid fa-heart";
    icon.style.color = "red";
  } else {
    fav.splice(index, 1);
    icon.className = "fa-regular fa-heart";
    icon.style.color = "white";
  }

  localStorage.setItem("favourites", JSON.stringify(fav));
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", loadProductDetail);