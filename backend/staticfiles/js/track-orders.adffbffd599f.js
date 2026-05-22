const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");
const orderIdInput = document.getElementById("order-id");
const emailInput = document.getElementById("track-email");

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    localStorage.removeItem("orders");
    return [];
  }
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

  const placedTime = new Date(order.placedAt).getTime();
  const daysPassed = Math.floor((Date.now() - placedTime) / 86400000);

  return stages[Math.min(daysPassed, stages.length - 1)];
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

  const currentIndex = steps.indexOf(currentStatus);

  return steps.map((step, index) => {

    const active = index <= currentIndex;

    return `
      <div class="status-step" style="opacity:${active ? 1 : 0.45}">
        <strong>${step}</strong>
        <span>${active ? "Completed" : "Pending"}</span>
      </div>
    `;
  }).join("");
}

function renderOrder(order) {

  const status = getOrderStatus(order);
  const css = statusClass(status);
  const formattedDate = new Date(order.placedAt).toLocaleString();

  return `
    <h2>Order ${order.id}</h2>

    <p><strong>Placed:</strong> ${formattedDate}</p>
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Email:</strong> ${order.email}</p>
    <p><strong>Payment:</strong> ${order.payment}</p>
    <p><strong>Total:</strong> ₹${Number(order.total || 0).toFixed(2)}</p>

    <div class="status-pill ${css}">
      ${status}
    </div>

    <div class="track-items">
      <h3>Items</h3>

      ${order.items.map(item => `
        <div style="margin-bottom:10px;">
          <strong>${item.name}</strong> × ${item.qty || 1}
          <div style="font-size:14px; color:#bbb;">
            ₹${Number(item.price || 0).toFixed(2)}
          </div>
        </div>
      `).join("")}
    </div>

    ${renderStatusSteps(status)}
  `;
}

function showMessage(msg) {
  trackResult.innerHTML = `<p>${msg}</p>`;
}

function findOrder(orderId, email) {

  const orders = getOrders();

  return orders.find(order =>
    order &&
    order.id?.toLowerCase() === orderId.toLowerCase() &&
    order.email?.toLowerCase() === email.toLowerCase()
  );
}

function handleTrack(event) {

  if (event) event.preventDefault();

  const orderId = orderIdInput.value.trim();
  const email = emailInput.value.trim();

  if (!orderId || !email) {
    showMessage("Please provide Order ID and Email.");
    return;
  }

  const order = findOrder(orderId, email);

  if (!order) {
    showMessage("Order not found. Please check your details.");
    return;
  }

  trackResult.innerHTML = renderOrder(order);
}

trackForm?.addEventListener("submit", handleTrack);

// ================= URL AUTO FILL =================

const params = new URLSearchParams(window.location.search);

const queryOrder = params.get("order");
const queryEmail = params.get("email");

if (queryOrder) orderIdInput.value = queryOrder;
if (queryEmail) emailInput.value = queryEmail;

if (queryOrder && queryEmail) {
  handleTrack();
}