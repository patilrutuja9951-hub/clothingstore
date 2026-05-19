/* =========================
   UPDATE FAV COUNT
========================= */
function updateFavCount() {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const favCountEl = document.getElementById("fav-count");
  if (favCountEl) favCountEl.innerText = favourites.length;
  if (typeof updateMobileCounts === "function") updateMobileCounts();
}


/* =========================
   FAVOURITES PAGE
========================= */

const favContainer = document.querySelector(".favourites-container");

if (favContainer) {

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  favContainer.innerHTML = "";

  if (favourites.length === 0) {

    favContainer.innerHTML = `
      <div class="empty-cart-box">
        <h2>No Favourites Yet ❤️</h2>
        <a href="index.html">
          <button class="shop-btn">Shop Now</button>
        </a>
      </div>
    `;

  } else {

    favourites.forEach((item, index) => {

      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <div onclick="openDetail(${item.id})">
          <img src="${item.img}" alt="${item.name}"
               onerror="this.src='images/placeholder.png'">

          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>

        <div class="fav-buttons">
          <button onclick="addFavToCart(${item.id}); event.stopPropagation();">
            Add To Cart
          </button>

          <button onclick="removeFav(${index}); event.stopPropagation();">
            Remove
          </button>
        </div>
      `;

      favContainer.appendChild(div);
    });

  }
}


/* =========================
   REMOVE FAVOURITE
========================= */
function removeFav(index) {

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  favourites.splice(index, 1);

  localStorage.setItem("favourites", JSON.stringify(favourites));

  updateFavCount();
  location.reload();
}


/* =========================
   ADD FAV TO CART
========================= */
function addFavToCart(id) {

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = favourites.find(item => item.id == id);
  if (!product) return;

  const existing = cart.find(item => item.id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  if (typeof updateCartCount === "function") updateCartCount();

  alert("Added to Cart 🛒");
}


/* =========================
   TOGGLE FAVOURITE
========================= */
function toggleFav(e, id) {

  e.stopPropagation();

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const icon = e.target;

  const exists = favourites.find(item => item.id == id);

  if (exists) {

    favourites = favourites.filter(item => item.id != id);

    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    icon.style.color = "";

    alert("Removed from Favourites 💔");

  } else {

    if (typeof products === "undefined") {
      console.error("Products not loaded yet");
      return;
    }

    const product = products.find(p => p.id == id);
    if (!product) return;

    favourites.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img
    });

    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    icon.style.color = "red";

    alert("Added to Favourites ❤️");
  }

  localStorage.setItem("favourites", JSON.stringify(favourites));

  updateFavCount();
  checkFavIcons();
}


/* =========================
   SYNC ICONS
========================= */
function checkFavIcons() {

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  document.querySelectorAll(".fav-icon").forEach(icon => {

    const id = icon.getAttribute("data-id");
    const exists = favourites.find(item => item.id == id);

    if (exists) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
      icon.style.color = "red";
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      icon.style.color = "";
    }

  });
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  updateFavCount();
  checkFavIcons();
});