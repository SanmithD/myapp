import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookService } from '../services/BookService';
import { PasswordService } from '../services/PasswordService';
import { SettingsService } from '../services/SettingsService';
import Toolbar from '../components/Toolbar';
import PasswordDialog from '../components/PasswordDialog';
import { BOOK_BASE } from '../src/basePath';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [index, setIndex] = useState(0);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [showLockDialog, setShowLockDialog] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    BookService.getFullBook(id).then((b) => {
      setBook(b);
      const lastIdx = b?.pages.findIndex((p) => p.page_id === b.last_page);
      setIndex(lastIdx && lastIdx >= 0 ? lastIdx : 0);
    });
  }, [id]);

  const persist = useCallback(async (updatedBook) => {
    setSaveState('saving');
    const saved = await BookService.saveBook(updatedBook);
    setBook(saved);
    setSaveState('saved');
    setTimeout(() => setSaveState((s) => (s === 'saved' ? 'idle' : s)), 1500);
  }, []);

  function scheduleSave(nextBook) {
    setBook(nextBook);
    clearTimeout(debounceRef.current);
    const { autoSaveSeconds } = SettingsService.get();
    debounceRef.current = setTimeout(() => persist(nextBook), (autoSaveSeconds || 2) * 1000);
  }

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        clearTimeout(debounceRef.current);
        if (book) persist(book);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book, persist]);

  if (!book) {
    return (
      <div className="app-shell">
        <Toolbar title="Loading…" onBack={() => navigate(`${BOOK_BASE}`)} />
      </div>
    );
  }

  const page = book.pages[index];

  function updatePage(patch) {
    const pages = [...book.pages];
    pages[index] = { ...pages[index], ...patch };
    scheduleSave({ ...book, pages, last_page: pages[index].page_id });
  }

  function addPage() {
    const newPage = BookService.newPage(book);
    const pages = [...book.pages, newPage];
    const next = { ...book, pages };
    persist(next);
    setIndex(pages.length - 1);
  }

  async function deletePage() {
    if (book.pages.length <= 1) return;
    if (!confirm('Delete this page? This cannot be undone.')) return;
    const pages = book.pages.filter((_, i) => i !== index);
    const next = { ...book, pages };
    await persist(next);
    setIndex((i) => Math.max(0, Math.min(pages.length - 1, i)));
  }

  async function handleLockToggle() {
    if (book.locked) {
      const confirmed = confirm('Remove password protection from this book?');
      if (!confirmed) return;
      PasswordService.clearPassword(book.id);
      await persist({ ...book, locked: false });
    } else {
      setShowLockDialog(true);
    }
  }

  async function handleSetPassword(password) {
    await PasswordService.setPassword(book.id, password);
    await persist({ ...book, locked: true });
    setShowLockDialog(false);
  }

  return (
    <div className="app-shell mt-12">
      <Toolbar
        title={book.title}
        subtitle={saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : `Page ${index + 1} of ${book.pages.length}`}
        onBack={() => navigate(`${BOOK_BASE}/reader/${id}`)}
        right={
          <>
            <button className="icon-btn" onClick={handleLockToggle} aria-label="Lock">
              {book.locked ? '🔒' : '🔓'}
            </button>
          </>
        }
      />

      <div className="container editor-body">
        <div className="page-tabs">
          {book.pages.map((p, i) => (
            <button
              key={p.page_id}
              className={`page-tab ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              {p.pin ? '📌 ' : ''}{p.title || p.page_id}
            </button>
          ))}
          <button className="page-tab add" onClick={addPage}>+ Page</button>
        </div>

        <div className="field">
          <label>Page Title</label>
          <input
            value={page.title || ''}
            onChange={(e) => updatePage({ title: e.target.value })}
            placeholder="Untitled page"
          />
        </div>

        <div className="field" style={{ flex: 1 }}>
          <label>Content</label>
          <textarea
            value={page.content || ''}
            onChange={(e) => updatePage({ content: e.target.value })}
            placeholder="Once upon a time…"
            rows={14}
            style={{ resize: 'vertical', minHeight: '38vh' }}
          />
        </div>

        <div className="field">
          <label>Tags (comma separated)</label>
          <input
            value={(page.tags || []).join(', ')}
            onChange={(e) =>
              updatePage({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
            }
            placeholder="dragon, war"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
          <button
            className="wooden-btn ghost"
            onClick={() => updatePage({ pin: !page.pin })}
            style={{ flex: 1 }}
          >
            {page.pin ? '📌 Pinned' : '📍 Pin Page'}
          </button>
          <button className="wooden-btn danger" onClick={deletePage} disabled={book.pages.length <= 1} style={{ flex: 1 }}>
            Delete Page
          </button>
        </div>
      </div>

      {showLockDialog && (
        <PasswordDialog mode="set" onSubmit={handleSetPassword} onClose={() => setShowLockDialog(false)} />
      )}

      <style>{`
        .editor-body { padding-top: 20px; display: flex; flex-direction: column; }
        .page-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 10px;
          -webkit-overflow-scrolling: touch;
        }
        .page-tab {
          flex-shrink: 0;
          font-family: var(--font-ui);
          font-size: 0.8rem;
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--wood-light);
          color: var(--paper-shadow);
          border-radius: 20px;
          padding: 8px 14px;
          cursor: pointer;
          white-space: nowrap;
        }
        .page-tab.active {
          background: var(--gold);
          color: var(--wood-dark);
          border-color: var(--gold-bright);
          font-weight: 700;
        }
        .page-tab.add { color: var(--gold); border-style: dashed; }
      `}</style>
    </div>
  );
}
