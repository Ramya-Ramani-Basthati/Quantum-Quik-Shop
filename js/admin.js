/* ===========================
   Admin Protection
=========================== */

if (!requireAdmin()) {
  throw new Error("Access denied");
}

/* ===========================
   Logout
=========================== */

function logout() {
  logoutUser();
  window.location.href = "index.html";
}

/* ===========================
   Show Registered Users
=========================== */

function renderUsers() {
  const container = document.getElementById("users-list");
  const users = JSON.parse(localStorage.getItem("qqs_users") || "[]");

  container.innerHTML = "";

  if (users.length === 0) {
    container.innerHTML = "<p>No users found.</p>";
    return;
  }

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${user.name}</strong><br>
      Email: ${user.email}<br>
      Role: ${user.role || "customer"}<br>
      Joined: ${new Date(user.createdAt).toLocaleString()}
    `;

    container.appendChild(div);
  });
}

/* ===========================
   Show Feedback
=========================== */

function renderAdminFeedback() {
  const container = document.getElementById("admin-feedback-list");
  const feedbacks = JSON.parse(localStorage.getItem("qqs_feedback") || "[]");

  container.innerHTML = "";

  if (feedbacks.length === 0) {
    container.innerHTML = "<p>No feedback available.</p>";
    return;
  }

  feedbacks.slice().reverse().forEach(f => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${f.name}</strong><br>
      <small>${f.date}</small>
      <p>${f.message}</p>
      <button class="delete-btn" onclick="deleteFeedback(${f.id})">
        Delete
      </button>
    `;

    container.appendChild(div);
  });
}

/* ===========================
   Delete Feedback
=========================== */

function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;

  let feedbacks = JSON.parse(localStorage.getItem("qqs_feedback") || "[]");
  feedbacks = feedbacks.filter(f => f.id !== id);
  localStorage.setItem("qqs_feedback", JSON.stringify(feedbacks));

  renderAdminFeedback();
}

/* ===========================
   Initialize
=========================== */

document.addEventListener("DOMContentLoaded", function () {
  renderUsers();
  renderAdminFeedback();
});
