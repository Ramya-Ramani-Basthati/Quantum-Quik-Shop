// js/auth.js
// Improved Client-side Auth System (NOT secure for production)

/* ===========================
   Storage Keys
=========================== */

const USERS_KEY = 'qqs_users';
const CURRENT_USER_KEY = 'qqs_current_user';
const RETURN_TO_KEY = 'qqs_return_to';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

/* ===========================
   Utility Functions
=========================== */

function safeParse(data, fallback) {
  try {
    return JSON.parse(data) || fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return password.length >= 6;
}

/* ===========================
   User Storage
=========================== */

function _getUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), []);
}

function _saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ===========================
   DEFAULT ADMIN AUTO CREATE
=========================== */

(function createDefaultAdmin() {
  const users = _getUsers();
  const adminExists = users.some(u => u.role === "admin");

  if (!adminExists) {
    users.push({
      name: "Admin",
      email: "admin@qqs.com",
      password: "admin123",
      role: "admin",
      createdAt: Date.now()
    });
    _saveUsers(users);
    console.log("Default admin created");
  }
})();

/* ===========================
   Registration
=========================== */

function registerUser(name, email, password) {
  email = email.toLowerCase().trim();

  if (!name.trim()) {
    return { ok: false, error: 'Name is required' };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: 'Invalid email address' };
  }

  if (!isStrongPassword(password)) {
    return { ok: false, error: 'Password must be at least 6 characters' };
  }

  const users = _getUsers();

  if (users.find(u => u.email === email)) {
    return { ok: false, error: 'Email already registered' };
  }

  users.push({
    name: name.trim(),
    email,
    password, // ⚠ plain text (client only)
    role: "customer",
    createdAt: Date.now()
  });

  _saveUsers(users);

  return { ok: true };
}

/* ===========================
   Login
=========================== */

function loginUser(email, password) {
  email = email.toLowerCase().trim();

  const users = _getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return { ok: false, error: 'Invalid email or password' };
  }

  const session = {
    email: user.email,
    name: user.name,
    role: user.role || "customer",
    loginTime: Date.now()
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));

  return { ok: true, user: session };
}

/* ===========================
   Logout
=========================== */

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/* ===========================
   Get Current User (with expiry)
=========================== */

function getCurrentUser() {
  const user = safeParse(localStorage.getItem(CURRENT_USER_KEY), null);

  if (!user) return null;

  if (Date.now() - user.loginTime > SESSION_DURATION) {
    logoutUser();
    return null;
  }

  return user;
}

/* ===========================
   Route Protection
=========================== */

function requireLogin(returnTo = null) {
  const user = getCurrentUser();

  if (!user) {
    if (returnTo) {
      localStorage.setItem(RETURN_TO_KEY, returnTo);
    }
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

/* ===========================
   Admin Protection
=========================== */

function requireAdmin() {
  const user = getCurrentUser();

  if (!user || user.role !== "admin") {
    alert("Access denied. Admin only.");
    window.location.href = "index.html";
    return false;
  }

  return true;
}

/* ===========================
   Redirect After Login
=========================== */

function redirectAfterLogin(defaultUrl = 'index.html') {
  const returnTo = localStorage.getItem(RETURN_TO_KEY);

  if (returnTo) {
    localStorage.removeItem(RETURN_TO_KEY);
    window.location.href = returnTo;
  } else {
    window.location.href = defaultUrl;
  }
}

/* ===========================
   Header Rendering
=========================== */

function renderAuthHeader(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const user = getCurrentUser();

  if (user) {

    let adminLink = "";
    if (user.role === "admin") {
      adminLink = `<a href="admin.html">Admin</a> · `;
    }

    container.innerHTML = `
      <span>Welcome, ${escapeHtml(user.name)}</span> ·
      ${adminLink}
      <a href="cart.html">Cart</a> ·
      <button id="qqs-logout-btn" class="link-button">Logout</button>
    `;

    document
      .getElementById('qqs-logout-btn')
      .addEventListener('click', () => {
        logoutUser();
        window.location.reload();
      });

  } else {
    container.innerHTML = `
      <a href="login.html">Login</a> ·
      <a href="cart.html">Cart</a> ·
      <a href="become-seller.html">Become a Seller</a>
    `;
  }
}
