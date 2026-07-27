export default function PageNavigation({ pages, currentIndex, onJump, onClose }) {
  const pinned = pages.filter((p) => p.pin);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h2 style={{ marginBottom: 14 }}>Go to Page</h2>

        <input
          type="range"
          min={0}
          max={pages.length - 1}
          value={currentIndex}
          onChange={(e) => onJump(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 8, accentColor: 'var(--gold)' }}
        />
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--gold)', marginBottom: 18 }}>
          Page {currentIndex + 1} of {pages.length}
          {pages[currentIndex]?.title ? ` — ${pages[currentIndex].title}` : ''}
        </p>

        {pinned.length > 0 && (
          <>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--gold)' }}>📌 Pinned Pages</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {pinned.map((p) => {
                const idx = pages.findIndex((x) => x.page_id === p.page_id);
                return (
                  <button
                    key={p.page_id}
                    className="wooden-btn ghost"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => onJump(idx)}
                  >
                    {p.title || p.page_id}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <button className="wooden-btn ghost" onClick={onClose} style={{ width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  );
}
