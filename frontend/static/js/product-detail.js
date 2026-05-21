const localProductImageMap = {
  "STREETSTYLE LEATHER JACKET": "/static/images/leatherjacket.png",
  "URBAN CARGO PANTS": "/static/images/cargo.png",
  "MINIMAL WHITE TEE": "/static/images/whitetee.png",
  "STREET HOODIE": "/static/images/hoodie.png",
  "CHIC BOW TOP": "/static/images/rmbow top.png",
  "SUMMER BREEZE DRESS": "/static/images/summerbg.png",
  "RED LEATHER STREET JACKET": "/static/images/red-removebg-preview.png",
  "OVERSIZED GRAPHIC TEE": "/static/images/graphictee.png",
  "LOOSE FIT SHIRT": "/static/images/loose shirt.png"
};

function getLocalImage(name) {
  return localProductImageMap[name] || "/static/images/blacktee1.png";
}

const BACKEND_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : "https://clothing-store-n0f6.onrender.com";

/* =========================
   LOAD PRODUCT
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  if (!window.location.href.includes("product-detail.html")) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError("Invalid product.");
    return;
  }

  try {

    // ✅ CORRECT DJANGO URL
    const res = await fetch(`${BACKEND_URL}/api/product/${id}/`);

    if (!res.ok) {
      throw new Error("Product not found");
    }

    const data = await res.json();

    const product = {
      id: data.id,
      name: data.name,
      price: data.price,
      img: data.image
        ? data.image
        : getLocalImage(data.name),
      desc: data.description
    };

    renderProduct(product);

  } catch (err) {
    console.error(err);
    showError("Failed to load product.");
  }

});


/* =========================
   RENDER PRODUCT
========================= */

function renderProduct(product) {

  const img = document.getElementById("detail-img");

  if (img) {
    img.src = product.img;
    img.alt = product.name;

    img.onerror = function () {
      this.src = "/static/images/blacktee1.png";
    };
  }

  const name = document.getElementById("detail-name");

  if (name) {
    name.innerText = product.name;
  }

  const price = document.getElementById("detail-price");

  if (price) {
    price.innerText = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(product.price);
  }

  const desc = document.getElementById("detail-desc");

  if (desc) {
    desc.innerText = product.desc;
  }

  // ✅ ADD TO CART BUTTON
  const addBtn = document.getElementById("detail-add-btn");

  if (addBtn) {
    addBtn.onclick = () => addToCartFromDetail(product);
  }

  // ✅ FAVOURITE BUTTON
  const favBtn = document.getElementById("detail-fav-btn");

  if (favBtn) {
    favBtn.onclick = () => toggleFavourite(product);
  }
}


/* =========================
   ERROR UI
========================= */

function showError(msg) {

  const page = document.querySelector(".product-detail-page");

  if (page) {
    page.innerHTML = `<p>${msg}</p>`;
  }
}


/* =========================
   SIZE SELECTION
========================= */

function selectSize(el) {

  document.querySelectorAll(".sizes span").forEach(size => {
    size.classList.remove("selected");
  });

  el.classList.add("selected");
}


/* =========================
   QUANTITY
========================= */

function changeQtyDetail(delta) {

  const qtyEl = document.getElementById("detail-qty");

  let qty = parseInt(qtyEl.innerText);

  qty = Math.max(1, qty + delta);

  qtyEl.innerText = qty;
}


/* =========================
   ADD TO CART
========================= */

function addToCartFromDetail(product) {

  const qty = parseInt(document.getElementById("detail-qty").innerText);

  const sizeEl = document.querySelector(".sizes span.selected");

  const size = sizeEl ? sizeEl.innerText : null;

  if (!size) {
    alert("Please select a size.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item =>
    item.id === product.id && item.size === size
  );

  if (existing) {

    existing.qty += qty;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: qty,
      size: size
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added To Bag 🛒");
}


/* =========================
   FAVOURITES
========================= */

function toggleFavourite(product) {

  const favIcon = document.getElementById("fav-icon");

  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  const index = favourites.findIndex(item => item.id === product.id);

  if (index === -1) {

    favourites.push(product);

    favIcon.classList.remove("fa-regular");
    favIcon.classList.add("fa-solid");

    alert("Added to favourites ❤️");

  } else {

    favourites.splice(index, 1);

    favIcon.classList.remove("fa-solid");
    favIcon.classList.add("fa-regular");

    alert("Removed from favourites");
  }

  localStorage.setItem("favourites", JSON.stringify(favourites));
}