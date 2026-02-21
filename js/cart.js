// ===== QUANTUMQUIK SHOP CART SYSTEM =====

function getCart() {
  return JSON.parse(localStorage.getItem("qqs_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("qqs_cart", JSON.stringify(cart));
}

function addToCart(name, price, img) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name,
      price,
      img: img || "images/no-image.png",
      quantity: 1
    });
  }

  saveCart(cart);
  alert(name + " added to cart!");
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity += 1;
  saveCart(cart);
  renderCart();
}

function decreaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item && item.quantity > 1) item.quantity -= 1;
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <img src="${item.img}" style="height:100px;">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <p>
        <button onclick="decreaseQty(${item.id})">-</button>
        ${item.quantity}
        <button onclick="increaseQty(${item.id})">+</button>
      </p>
      <p><strong>₹${item.price * item.quantity}</strong></p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;

    container.appendChild(div);
  });

  totalElement.textContent = total;
}

document.addEventListener("DOMContentLoaded", renderCart);
