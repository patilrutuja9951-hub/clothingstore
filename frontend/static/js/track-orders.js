const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");
const orderIdInput = document.getElementById("order-id");
const emailInput = document.getElementById("track-email");

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function getOrderStatus(order) {
    const stages = [
        "Order Received",
        "Processing",
        "Shipped",
        "Out for delivery",
        "Delivered"
    ];

    if (!order?.placedAt) return stages[0];

    const placed = new Date(order.placedAt).getTime();
    const days = Math.floor((Date.now() - placed) / 86400000);
    return stages[Math.min(days, stages.length - 1)];
}

function statusClass(status) {
    return {
        "Order Received": "status-received",
        "Processing": "status-processing",
        "Shipped": "status-shipped",
        "Out for delivery": "status-out",
        "Delivered": "status-delivered"
    }[status] || "status-received";
}

function renderStatusSteps(currentStatus) {
    const steps = [
        "Order Received",
        "Processing",
        "Shipped",
        "Out for delivery",
        "Delivered"
    ];

    return steps.map(step => {
        const active = steps.indexOf(step) <= steps.indexOf(currentStatus);
        return `
            <div class="status-step" style="opacity:${active ? 1 : 0.45};">
                <strong>${step}</strong>
                ${active ? "<span>Completed</span>" : "<span>Pending</span>"}
            </div>
        `;
    }).join("\n");
}

function renderOrder(order) {
    const status = getOrderStatus(order);
    const statusCss = statusClass(status);
    const formattedDate = new Date(order.placedAt).toLocaleString();

    return `
        <h2>Order ${order.id}</h2>
        <p><strong>Placed:</strong> ${formattedDate}</p>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <div class="status-pill ${statusCss}">${status}</div>
        <div class="track-items">
            <h3>Items</h3>
            ${order.items.map(item => `
                <div style="margin-bottom: 10px;">
                    <strong>${item.name}</strong> &times; ${item.qty || 1}
                    <div style="font-size: 14px; color: #bbb;">₹${(parseFloat(item.price) || 0).toFixed(2)}</div>
                </div>
            `).join("")}
        </div>
        ${renderStatusSteps(status)}
    `;
}

function showMessage(message) {
    trackResult.innerHTML = `<p>${message}</p>`;
}

function findOrder(orderId, email) {
    const orders = getOrders();
    return orders.find(order => {
        if (!order) return false;
        const matchId = order.id.toLowerCase() === orderId.toLowerCase();
        const matchEmail = order.email?.toLowerCase() === email.toLowerCase();
        return matchId && matchEmail;
    });
}

function handleTrack(event) {
    if (event) event.preventDefault();

    const orderId = orderIdInput.value.trim();
    const email = emailInput.value.trim();

    if (!orderId || !email) {
        showMessage("Please provide both your Order ID and email address.");
        return;
    }

    const order = findOrder(orderId, email);
    if (!order) {
        showMessage("No order found with that ID and email. Please check your details and try again.");
        return;
    }

    trackResult.innerHTML = renderOrder(order);
}

trackForm?.addEventListener("submit", handleTrack);

const params = new URLSearchParams(window.location.search);
const queryOrder = params.get("order");
const queryEmail = params.get("email");

if (queryOrder) {
    orderIdInput.value = queryOrder;
}

if (queryEmail) {
    emailInput.value = queryEmail;
}

if (queryOrder && queryEmail) {
    handleTrack();
}
