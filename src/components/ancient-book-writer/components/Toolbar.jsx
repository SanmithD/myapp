import { useNavigate } from 'react-router-dom';

export default function Toolbar({ title, subtitle, onBack, right }) {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onBack || (() => navigate('/'))} aria-label="Back">
        ←
      </button>
      <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 8px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--paper-shadow)' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{right}</div>
    </div>
  );
}
