import { motion } from 'framer-motion';

export default function BookCard({ book, onOpen, onDelete }) {
  return (
    <motion.div
      className="book-card"
      whileTap={{ scale: 0.98 }}
      layout
    >
      <button className="book-card-main" onClick={() => onOpen(book)}>
        <div className="book-cover" style={book.cover ? { backgroundImage: `url(${book.cover})` } : undefined}>
          {!book.cover && <span className="book-cover-glyph">{book.locked ? '🔒' : '📖'}</span>}
        </div>
        <div className="book-info">
          <h3>{book.title}</h3>
          <p className="book-intro">{book.intro}</p>
          <div className="book-meta">
            <span>{book.total_pages} page{book.total_pages === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>{new Date(book.updated_at).toLocaleDateString()}</span>
            {book.locked && <span className="lock-tag">Locked</span>}
          </div>
        </div>
      </button>
      <button className="icon-btn book-delete" onClick={() => onDelete(book)} aria-label="Delete book">
        ✕
      </button>

      <style>{`
        .book-card {
          position: relative;
          display: flex;
          align-items: stretch;
          background: linear-gradient(180deg, var(--wood-mid), var(--coffee));
          border: 1px solid var(--gold);
          border-radius: var(--radius);
          box-shadow: var(--shadow-soft);
          overflow: hidden;
        }
        .book-card-main {
          flex: 1;
          display: flex;
          gap: 14px;
          text-align: left;
          background: none;
          border: none;
          color: inherit;
          padding: 14px;
          cursor: pointer;
          min-height: 44px;
        }
        .book-cover {
          flex-shrink: 0;
          width: 56px;
          height: 76px;
          border-radius: 4px;
          background: linear-gradient(160deg, var(--leather), var(--wood-dark));
          border: 1px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-position: center;
        }
        .book-cover-glyph { font-size: 1.6rem; }
        .book-info { min-width: 0; flex: 1; }
        .book-info h3 {
          font-size: 1.15rem;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .book-intro {
          font-size: 0.95rem;
          color: var(--paper-shadow);
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .book-meta {
          display: flex;
          gap: 6px;
          font-family: var(--font-ui);
          font-size: 0.75rem;
          color: var(--gold);
          align-items: center;
        }
        .lock-tag {
          background: rgba(0,0,0,0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .book-delete {
          align-self: center;
          margin-right: 10px;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }
      `}</style>
    </motion.div>
  );
}
