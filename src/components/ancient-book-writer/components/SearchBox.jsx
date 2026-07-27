import { useState } from 'react';
import { BookService } from '../services/BookService';

export default function SearchBox({ book, onJumpToPage, onClose }) {
  const [query, setQuery] = useState('');
  const results = BookService.searchInBook(book, query);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h2 style={{ marginBottom: 14 }}>Search this Book</h2>
        <div className="field">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, titles…"
          />
        </div>
        <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
          {query.trim() && results.length === 0 && (
            <p style={{ color: 'var(--paper-shadow)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
              No pages found.
            </p>
          )}
          {results.map((r) => (
            <button
              key={r.page_id}
              onClick={() => onJumpToPage(r.page_id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--wood-light)',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 8,
                color: 'var(--paper)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', color: 'var(--gold)', fontSize: '0.8rem' }}>
                {r.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--paper-shadow)' }}>{r.snippet}</div>
            </button>
          ))}
        </div>
        <button className="wooden-btn ghost" onClick={onClose} style={{ width: '100%', marginTop: 8 }}>
          Close
        </button>
      </div>
    </div>
  );
}
