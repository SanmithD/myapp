import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BookService } from "../services/BookService";
import BookCard from "../components/BookCard";
import { BOOK_BASE } from "../src/basePath";

const PAGE_SIZE = 5;

export default function BookHome() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async (p) => {
    setLoading(true);
    const result = await BookService.listBooks({
      page: p,
      pageSize: PAGE_SIZE,
    });
    setBooks(result.books);
    setHasMore(result.hasMore);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(page);
  }, [page, load]);

  useEffect(() => {
    BookService.mostRecentBook().then(setRecent);
  }, []);

  function openBook(book) {
    navigate(`${BOOK_BASE}/reader/${book.id}`);
  }

  async function handleDelete(book) {
    await BookService.deleteBook(book.id);
    setConfirmDelete(null);
    load(page);
    BookService.mostRecentBook().then(setRecent);
  }

  return (
    <div className="app-shell mt-12">
      <div className="topbar">
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <img
            src="/book_reader.png"
            alt="Ancient Book Writer"
            className="object-contain rounded h-12 md:h-20"
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="icon-btn"
            onClick={() => navigate(`${BOOK_BASE}/settings`)}
            aria-label="Settings"
          >
            ⚙
          </button>
          <button
            className="wooden-btn primary"
            onClick={() => navigate(`${BOOK_BASE}/create`)}
          >
            + New Book
          </button>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: 20, paddingBottom: 40, flex: 1 }}
      >
        {recent && (
          <div className="continue-card" onClick={() => openBook(recent)}>
            <div>
              <div className="continue-label">Continue Writing</div>
              <div className="continue-title">{recent.title}</div>
            </div>
            <span style={{ fontSize: "1.4rem" }}>→</span>
          </div>
        )}

        {loading && (
          <p style={{ color: "var(--paper-shadow)" }}>Opening the shelves…</p>
        )}

        {!loading && total === 0 && (
          <div className="empty-shelf">
            <p style={{ fontSize: "2.5rem", marginBottom: 8 }}>🕯️</p>
            <h3 style={{ marginBottom: 6 }}>The shelves are empty</h3>
            <p style={{ color: "var(--paper-shadow)", marginBottom: 16 }}>
              Begin your first story and it will find a home here.
            </p>
            <button
              className="wooden-btn primary"
              onClick={() => navigate(`${BOOK_BASE}/create`)}
            >
              + New Book
            </button>
          </div>
        )}

        <AnimatePresence>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={openBook}
                onDelete={(b) => setConfirmDelete(b)}
              />
            ))}
          </div>
        </AnimatePresence>

        {total > 0 && (
          <div className="pager">
            <button
              className="wooden-btn ghost"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              ‹ Prev
            </button>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gold)",
                fontSize: "0.85rem",
              }}
            >
              Page {page + 1}
            </span>
            <button
              className="wooden-btn ghost"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <motion.div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 style={{ marginBottom: 10 }}>Burn this Book?</h2>
            <p style={{ color: "var(--paper-shadow)", marginBottom: 20 }}>
              "{confirmDelete.title}" will be permanently removed. This cannot
              be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="wooden-btn ghost"
                style={{ flex: 1 }}
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="wooden-btn danger"
                style={{ flex: 1 }}
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .continue-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(120deg, var(--leather), var(--wood-dark));
          border: 1px solid var(--gold);
          border-radius: var(--radius);
          padding: 16px;
          margin-bottom: 22px;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
        }
        .continue-label {
          font-family: var(--font-ui);
          font-size: 0.75rem;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .continue-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--paper);
        }
        .empty-shelf {
          text-align: center;
          padding: 60px 20px;
        }
        .pager {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
