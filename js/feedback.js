/* ===========================
   Feedback System
=========================== */

const FEEDBACK_KEY = "qqs_feedback";

/* Get all feedbacks */
function getFeedbacks() {
  return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
}

/* Save feedback list */
function saveFeedbacks(data) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(data));
}

/* Submit feedback */
function submitFeedback() {
  const messageInput = document.getElementById("feedback-message");
  const message = messageInput.value.trim();

  if (!message) {
    alert("Please enter your feedback.");
    return;
  }

  // Get logged-in user (if using auth.js)
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const feedbacks = getFeedbacks();

  feedbacks.push({
    id: Date.now(),
    name: user ? user.name : "Guest",
    email: user ? user.email : "guest",
    message,
    date: new Date().toLocaleString()
  });

  saveFeedbacks(feedbacks);

  alert("Thank you for your feedback!");

  messageInput.value = "";
  renderFeedbackList(); // Refresh list
}

/* Delete feedback (Admin only) */
function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;

  let feedbacks = getFeedbacks();
  feedbacks = feedbacks.filter(f => f.id !== id);
  saveFeedbacks(feedbacks);

  renderFeedbackList();
}

/* Render feedback list */
function renderFeedbackList() {
  const container = document.getElementById("feedback-list");
  if (!container) return;

  const feedbacks = getFeedbacks();
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  container.innerHTML = "";

  if (feedbacks.length === 0) {
    container.innerHTML = "<p>No feedback yet.</p>";
    return;
  }

  feedbacks
    .slice()
    .reverse()
    .forEach(f => {
      const div = document.createElement("div");
      div.className = "feedback-card";

      div.innerHTML = `
        <h4>${escapeHtml(f.name)}</h4>
        <small>${f.date}</small>
        <p>${escapeHtml(f.message)}</p>
        ${
          user && user.role === "admin"
            ? `<button onclick="deleteFeedback(${f.id})" class="delete-btn">Delete</button>`
            : ""
        }
      `;

      container.appendChild(div);
    });
}

/* Simple HTML escape (if auth.js not loaded) */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

/* Auto render when page loads */
document.addEventListener("DOMContentLoaded", renderFeedbackList);
