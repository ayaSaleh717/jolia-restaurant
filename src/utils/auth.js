// Lightweight localStorage-backed "auth backend" so Register/Login work
// fully client-side, with no server required. Passwords are hashed with a
// simple non-cryptographic digest purely so raw passwords are never sitting
// in localStorage in plain text — this is a demo auth layer, not a
// production-grade security implementation.

const USERS_KEY = "plateful_users";
const SESSION_KEY = "plateful_session";

const hash = (value) => {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  }
  return `h${Math.abs(h)}`;
};

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setSessionUser = (user) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const registerUser = ({ name, email, password }) => {
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    return { success: false, message: "Please fill in every field." };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: "Enter a valid email address." };
  }
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters." };
  }

  const users = readUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const newUser = { name: cleanName, email: cleanEmail, passwordHash: hash(password) };
  users.push(newUser);
  writeUsers(users);

  const publicUser = { name: newUser.name, email: newUser.email };
  setSessionUser(publicUser);
  return { success: true, user: publicUser };
};

export const loginUser = ({ email, password }) => {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, message: "Please enter your email and password." };
  }

  const users = readUsers();
  const found = users.find((u) => u.email === cleanEmail);
  if (!found || found.passwordHash !== hash(password)) {
    return { success: false, message: "Incorrect email or password." };
  }

  const publicUser = { name: found.name, email: found.email };
  setSessionUser(publicUser);
  return { success: true, user: publicUser };
};

export const logoutUser = () => {
  setSessionUser(null);
};
