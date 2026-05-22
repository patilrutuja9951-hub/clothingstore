/* ================= SAFE GET CART ================= */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
}

/* ================= SAVE CART ================= */

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= OPEN PRODUCT DETAIL ================= */

function openDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

/* ================= LOAD CART PAGE ================= */

const cartContainer = document.querySelector(".cart-container");

if (cartContainer) {

  let cart = getCart();

  cartContainer.innerHTML = "";

  /* EMPTY CART */

  if (cart.length === 0) {

    cartContainer.innerHTML = `
      <div class="empty-cart-box">
        <h2>Your cart is empty 🛒</h2>
        <a href="index.html">
          <button class="shop-btn">Shop Now</button>
        </a>
      </div>
    `;

  }

  /* CART ITEMS */

  else {

    let total = 0;

    cart.forEach((item, index) => {

      const price = parseFloat(item.price) || 0;
      const qty = item.qty || 1;

      total += price * qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div class="cart-left">

          <img
            src="${item.img}"
            alt="${item.name}"
            onerror="this.src='static/images/placeholder.png'">

          <div>
            <h3>${item.name}</h3>
            <p>₹${price.toFixed(2)}</p>
            <p>Subtotal: ₹${(price * qty).toFixed(2)}</p>
          </div>

        </div>

        <div class="cart-right">

          <button onclick="changeQty(${index}, -1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
          <button onclick="removeCart(${index})">Remove</button>

        </div>
      `;

      cartContainer.appendChild(div);

    });

    /* TOTAL */

    const totalDisplay = document.getElementById("cart-total");

    if (totalDisplay) {
      totalDisplay.innerText = "₹" + total.toFixed(2);
    }

  }

}

/* ================= REMOVE ITEM ================= */

function removeCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  location.reload();
}

/* ================= CHANGE QUANTITY ================= */

function changeQty(index, change) {

  let cart = getCart();

  if (!cart[index]) return;

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
  location.reload();
}

/* ================= ADD TO CART ================= */

function addToCart(id, event) {

  if (event) event.stopPropagation();

  if (typeof products === "undefined") {
    console.error("Products not loaded yet");
    return;
  }

  const product = products.find(p => p.id == id);

  if (!product) return;

  let cart = getCart();

  const existing = cart.find(item => item.id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      img:   product.img,
      qty:   1
    });
  }

  saveCart(cart);
  updateCartCount();
  alert("Added to Cart 🛒");
}

/* ================= DETAIL PAGE QUANTITY ================= */

let detailQty = 1;

function changeQtyDetail(change) {

  detailQty = Math.max(1, detailQty + change);

  const qtyEl = document.getElementById("detail-qty");

  if (qtyEl) qtyEl.innerText = detailQty;
}

/* ================= ADD FROM DETAIL PAGE ================= */

function addToCartFromDetail() {

  if (typeof products === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p => p.id === id);

  if (!product) return;

  let cart = getCart();

  const existing = cart.find(item => item.id === id);

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

  saveCart(cart);
  updateCartCount();
  alert("Added to Cart 🛒");
}

/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {

  let cart = getCart();

  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartCount = document.getElementById("cart-count");

  if (cartCount) cartCount.innerText = total;

  if (typeof updateMobileCounts === "function") {
    updateMobileCounts();
  }
}

/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});