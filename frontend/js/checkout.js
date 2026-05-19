document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
        localStorage.removeItem("cart");
        cart = [];
    }

    const itemsContainer = document.getElementById("checkout-items");
    const totalDisplay = document.getElementById("checkout-total");
    const form = document.getElementById("checkout-form");

    // Safety check
    if (!itemsContainer || !totalDisplay || !form) {
        console.error("Checkout elements missing");
        return;
    }

    let total = 0;

    /* =========================
       EMPTY CART
    ========================= */

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
        totalDisplay.innerText = "₹0";
        return;
    }

    /* =========================
       DISPLAY ITEMS
    ========================= */

    cart.forEach(item => {

        const price = parseFloat(item.price) || 0;
        const qty = item.qty || 1;

        const itemTotal = price * qty;
        total += itemTotal;

        const div = document.createElement("div");
        div.classList.add("checkout-item");

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="checkout-info">
                <p>${item.name} (x${qty})</p>
                <p>₹${itemTotal.toFixed(2)}</p>
            </div>
        `;

        itemsContainer.appendChild(div);

    });

    /* =========================
       SHIPPING
    ========================= */

    const shipping = 50;
    total += shipping;

    totalDisplay.innerText = "₹" + total.toFixed(2);

    /* =========================
       ORDER SUBMIT
    ========================= */

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const pincode = document.getElementById("pincode").value.trim();
        const payment = Array.from(document.querySelectorAll("input[name='payment']"))
            .find(radio => radio.checked)?.nextElementSibling?.innerText || "Unknown";

        const orderId = `MH${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
        const placedAt = new Date().toISOString();
        const shipping = 50;

        const orderTotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = item.qty || 1;
            return sum + price * qty;
        }, 0) + shipping;

        const order = {
            id: orderId,
            placedAt,
            name,
            email,
            phone,
            address,
            city,
            pincode,
            payment,
            shipping,
            total: orderTotal,
            items: cart,
            status: "Order Received"
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.setItem("lastOrderId", orderId);

        alert(`Order placed successfully 🎉\nYour order ID is ${orderId}`);

        localStorage.removeItem("cart");

        setTimeout(() => {
            window.location.href = `track-orders.html?order=${orderId}`;
        }, 500);

    });

});