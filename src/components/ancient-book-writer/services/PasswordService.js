// PasswordService.js
// Hashes book passwords with SHA-256 (Web Crypto API) and stores only the
// hash in localStorage. Plaintext passwords are never persisted.

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function storageKey(bookId) {
  return `book_password_${bookId}`;
}

export const PasswordService = {
  async setPassword(bookId, password) {
    const hash = await sha256(password);
    localStorage.setItem(storageKey(bookId), hash);
  },

  async verifyPassword(bookId, password) {
    const stored = localStorage.getItem(storageKey(bookId));
    if (!stored) return false;
    const hash = await sha256(password);
    return hash === stored;
  },

  clearPassword(bookId) {
    localStorage.removeItem(storageKey(bookId));
  },

  hasPassword(bookId) {
    return !!localStorage.getItem(storageKey(bookId));
  },
};
