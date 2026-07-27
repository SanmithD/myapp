// BookService.js
// Mirrors the SRD's Books/index.json + Books/BOOK_xxx/book.json split:
// - the "index" store holds only lightweight metadata (fast home screen loads)
// - the "full" store holds the complete book with all pages (loaded on open only)

import { idb, STORES } from './db';

function makeId() {
  return 'BOOK_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function nowIso() {
  return new Date().toISOString();
}

function excerpt(text, len = 90) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > len ? clean.slice(0, len) + '…' : clean;
}

export const BookService = {
  /** Home screen: paginated, metadata-only list, newest first. */
  async listBooks({ page = 0, pageSize = 5 } = {}) {
    const all = await idb.getAll(STORES.BOOKS_INDEX);
    all.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    const start = page * pageSize;
    const slice = all.slice(start, start + pageSize);
    return {
      books: slice,
      total: all.length,
      hasMore: start + pageSize < all.length,
    };
  },

  async mostRecentBook() {
    const all = await idb.getAll(STORES.BOOKS_INDEX);
    if (!all.length) return null;
    all.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return all[0];
  },

  /** Full book, including all pages. Only called when a book is opened. */
  async getFullBook(id) {
    return idb.get(STORES.BOOKS_FULL, id);
  },

  async createBook({ title, description = '', cover = null }) {
    const id = makeId();
    const timestamp = nowIso();
    const fullBook = {
      id,
      title: title.trim(),
      author: 'Me',
      description,
      created: timestamp,
      updated: timestamp,
      locked: false,
      cover,
      pages: [
        { page_id: 'P1', title: 'Beginning', content: '', pin: false, tags: [] },
      ],
    };
    const indexEntry = {
      id,
      title: fullBook.title,
      cover,
      intro: excerpt(description) || 'A new story begins…',
      total_pages: 1,
      updated_at: timestamp,
      locked: false,
      last_page: 'P1',
    };
    await idb.put(STORES.BOOKS_FULL, fullBook);
    await idb.put(STORES.BOOKS_INDEX, indexEntry);
    return fullBook;
  },

  async saveBook(book) {
    const updated = { ...book, updated: nowIso() };
    await idb.put(STORES.BOOKS_FULL, updated);

    const firstPageWithContent = updated.pages.find((p) => p.content) || updated.pages[0];
    const indexEntry = {
      id: updated.id,
      title: updated.title,
      cover: updated.cover,
      intro: excerpt(updated.description) || excerpt(firstPageWithContent?.content) || '…',
      total_pages: updated.pages.length,
      updated_at: updated.updated,
      locked: updated.locked,
      last_page: updated.last_page || updated.pages[0]?.page_id,
    };
    await idb.put(STORES.BOOKS_INDEX, indexEntry);
    return updated;
  },

  async deleteBook(id) {
    await idb.delete(STORES.BOOKS_FULL, id);
    await idb.delete(STORES.BOOKS_INDEX, id);
  },

  async setLocked(id, locked) {
    const book = await this.getFullBook(id);
    if (!book) return null;
    book.locked = locked;
    return this.saveBook(book);
  },

  /** Search page content across a single open book. */
  searchInBook(book, query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return book.pages
      .filter((p) => (p.content || '').toLowerCase().includes(q) || (p.title || '').toLowerCase().includes(q))
      .map((p) => ({
        page_id: p.page_id,
        title: p.title || p.page_id,
        snippet: excerpt(p.content, 60),
      }));
  },

  newPage(book) {
    const num = book.pages.length + 1;
    return {
      page_id: 'P' + num,
      title: '',
      content: '',
      pin: false,
      tags: [],
    };
  },
};
