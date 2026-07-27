import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { BookService } from '../services/BookService';
import { PasswordService } from '../services/PasswordService';
import Toolbar from '../components/Toolbar';
import PasswordDialog from '../components/PasswordDialog';
import SearchBox from '../components/SearchBox';
import PageNavigation from '../components/PageNavigation';
import { BOOK_BASE } from '../src/basePath';

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    BookService.getFullBook(id).then((b) => {
      setBook(b);
      if (b && !b.locked) setUnlocked(true);
    });
  }, [id]);

  const goTo = useCallback(
    (i) => {
      if (!book) return;
      const clamped = Math.max(0, Math.min(book.pages.length - 1, i));
      setDirection(clamped > index ? 1 : -1);
      setIndex(clamped);
    },
    [book, index]
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setShowSearch(true); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); setShowNav(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo]);

  async function togglePin() {
    const updated = { ...book };
    updated.pages[index] = { ...updated.pages[index], pin: !updated.pages[index].pin };
    const saved = await BookService.saveBook(updated);
    setBook(saved);
  }

  async function handleUnlock(password) {
    const ok = await PasswordService.verifyPassword(id, password);
    if (ok) {
      setUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Wrong password. Try again.');
    }
  }

  if (!book) {
    return (
      <div className="app-shell">
        <Toolbar title="Loading…" onBack={() => navigate(`${BOOK_BASE}`)} />
      </div>
    );
  }

  if (book.locked && !unlocked) {
    return (
      <div className="app-shell">
        <Toolbar title={book.title} onBack={() => navigate(`${BOOK_BASE}`)} />
        <PasswordDialog mode="unlock" onSubmit={handleUnlock} onClose={() => navigate(`${BOOK_BASE}`)} error={passwordError} />
      </div>
    );
  }

  const page = book.pages[index];

  const variants = {
    enter: (dir) => ({ rotateY: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { rotateY: 0, opacity: 1 },
    exit: (dir) => ({ rotateY: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="app-shell mt-12">
      <Toolbar
        title={book.title}
        subtitle={`Page ${index + 1} of ${book.pages.length}`}
        onBack={() => navigate(`${BOOK_BASE}`)}
        right={
          <>
            <button className="icon-btn" onClick={() => setShowSearch(true)} aria-label="Search">🔍</button>
            <button className="icon-btn" onClick={togglePin} aria-label="Bookmark">
              {page.pin ? '📌' : '📍'}
            </button>
            <button className="icon-btn" onClick={() => navigate(`${BOOK_BASE}/editor/${id}`)} aria-label="Edit">✎</button>
          </>
        }
      />

      <div className="reader-stage">
        <div className="book-frame" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page.page_id}
              className="page-sheet"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {page.title && <h2 className="page-title">{page.title}</h2>}
              <div className="page-body">
                {page.content ? page.content : <span style={{ opacity: 0.5 }}>This page is empty.</span>}
              </div>
              <div className="page-number">{index + 1}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="reader-controls">
        <button className="wooden-btn ghost" disabled={index === 0} onClick={() => goTo(index - 1)}>
          ‹ Previous
        </button>
        <button className="wooden-btn ghost" onClick={() => setShowNav(true)}>
          Go to Page
        </button>
        <button className="wooden-btn ghost" disabled={index === book.pages.length - 1} onClick={() => goTo(index + 1)}>
          Next ›
        </button>
      </div>

      {showSearch && (
        <SearchBox
          book={book}
          onClose={() => setShowSearch(false)}
          onJumpToPage={(pageId) => {
            const i = book.pages.findIndex((p) => p.page_id === pageId);
            if (i >= 0) goTo(i);
            setShowSearch(false);
          }}
        />
      )}

      {showNav && (
        <PageNavigation
          pages={book.pages}
          currentIndex={index}
          onJump={(i) => { goTo(i); setShowNav(false); }}
          onClose={() => setShowNav(false)}
        />
      )}

      <style>{`
        .reader-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .book-frame {
          width: 100%;
          max-width: 620px;
        }
        .page-sheet {
          background: linear-gradient(160deg, var(--paper), var(--paper-shadow));
          color: var(--ink);
          border-radius: 4px;
          border: 1px solid var(--paper-burn);
          box-shadow: var(--shadow-deep);
          padding: 32px 26px;
          min-height: 50vh;
          position: relative;
          transform-style: preserve-3d;
        }
        .page-title {
          font-family: var(--font-display);
          color: var(--ink);
          font-size: 1.3rem;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--paper-burn);
          padding-bottom: 8px;
        }
        .page-body {
          font-family: var(--font-body);
          font-size: 1.15rem;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .page-number {
          position: absolute;
          bottom: 12px;
          right: 16px;
          font-family: var(--font-ui);
          font-size: 0.75rem;
          color: var(--ink-soft);
        }
        .reader-controls {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 14px 16px calc(16px + env(safe-area-inset-bottom));
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
