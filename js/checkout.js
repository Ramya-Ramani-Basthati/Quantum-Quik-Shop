function submitOrder() {

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !address || !phone) {
    alert("Please fill all fields!");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("qqs_cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  const order = {
    id: "ORD" + Date.now(),
    customer: name,
    address,
    phone,
    items: cart,
    total,
    date: new Date().toLocaleString(),
    status: "Placed"
  };

  const orders = JSON.parse(localStorage.getItem("qqs_orders")) || [];
  orders.push(order);
  localStorage.setItem("qqs_orders", JSON.stringify(orders));

  localStorage.removeItem("qqs_cart");

  alert(`Order Placed Successfully!\nOrder ID: ${order.id}`);
  window.location.href = "index.html";
}
