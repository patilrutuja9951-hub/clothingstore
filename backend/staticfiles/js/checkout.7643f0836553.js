document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       GET CART
    ========================= */

    let cart = [];

    try {

        cart =
            JSON.parse(localStorage.getItem("cart")) || [];

    } catch {

        localStorage.removeItem("cart");

        cart = [];

    }

    /* =========================
       ELEMENTS
    ========================= */

    const itemsContainer =
        document.getElementById("checkout-items");

    const totalDisplay =
        document.getElementById("checkout-total");

    const form =
        document.getElementById("checkout-form");

    /* =========================
       SAFETY CHECK
    ========================= */

    if (!itemsContainer || !totalDisplay || !form) {

        console.error("Checkout elements missing");

        return;

    }

    let total = 0;

    /* =========================
       EMPTY CART
    ========================= */

    if (cart.length === 0) {

        itemsContainer.innerHTML = `

            <p>Your cart is empty 🛒</p>

        `;

        totalDisplay.innerText = "₹0";

        return;

    }

    /* =========================
       DISPLAY CART ITEMS
    ========================= */

    cart.forEach(item => {

        const price =
            parseFloat(item.price) || 0;

        const qty =
            item.qty || 1;

        const itemTotal =
            price * qty;

        total += itemTotal;

        const div =
            document.createElement("div");

        div.classList.add("checkout-item");

        div.innerHTML = `

            <img
                src="${item.img}"
                alt="${item.name}">

            <div class="checkout-info">

                <p>
                    ${item.name} (x${qty})
                </p>

                <p>
                    ₹${itemTotal.toFixed(2)}
                </p>

            </div>

        `;

        itemsContainer.appendChild(div);

    });

    /* =========================
       SHIPPING CHARGE
    ========================= */

    const shipping = 50;

    total += shipping;

    totalDisplay.innerText =
        "₹" + total.toFixed(2);

    /* =========================
       PLACE ORDER
    ========================= */

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        /* CUSTOMER DETAILS */

        const name =
            document.getElementById("name")
            .value.trim();

        const email =
            document.getElementById("email")
            .value.trim();

        const phone =
            document.getElementById("phone")
            .value.trim();

        const address =
            document.getElementById("address")
            .value.trim();

        const city =
            document.getElementById("city")
            .value.trim();

        const pincode =
            document.getElementById("pincode")
            .value.trim();

        /* PAYMENT METHOD */

        const payment =
            Array.from(
                document.querySelectorAll(
                    "input[name='payment']"
                )
            )
            .find(radio => radio.checked)
            ?.nextElementSibling
            ?.innerText || "Unknown";

        /* ORDER ID */

        const orderId =
            `MH${Date.now()
                .toString()
                .slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

        const placedAt =
            new Date().toISOString();

        /* TOTAL */

        const orderTotal =
            cart.reduce((sum, item) => {

                const price =
                    parseFloat(item.price) || 0;

                const qty =
                    item.qty || 1;

                return sum + (price * qty);

            }, 0) + shipping;

        /* ORDER OBJECT */

        const order = {

            id: orderId,

            placedAt: placedAt,

            name: name,

            email: email,

            phone: phone,

            address: address,

            city: city,

            pincode: pincode,

            payment: payment,

            shipping: shipping,

            total: orderTotal,

            items: cart,

            status: "Order Received"

        };

        /* SAVE ORDERS */

        const orders =
            JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        localStorage.setItem(
            "lastOrderId",
            orderId
        );

        /* SUCCESS MESSAGE */

        alert(

            `Order placed successfully 🎉
Your order ID is ${orderId}`

        );

        /* CLEAR CART */

        localStorage.removeItem("cart");

        /* REDIRECT */

        setTimeout(() => {

            window.location.href =
                `track-orders.html?order=${orderId}`;

        }, 500);

    });

});