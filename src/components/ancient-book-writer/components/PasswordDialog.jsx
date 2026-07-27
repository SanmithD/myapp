import { useState } from 'react';

/**
 * mode: 'set' (create a new password, needs confirmation)
 *       'unlock' (enter existing password)
 */
export default function PasswordDialog({ mode, onSubmit, onClose, error }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'set') {
      if (password.length < 4) {
        setLocalError('Use at least 4 characters.');
        return;
      }
      if (password !== confirm) {
        setLocalError('Passwords do not match.');
        return;
      }
    }
    setLocalError('');
    onSubmit(password);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: 16 }}>{mode === 'set' ? 'Lock this Book' : 'Enter Password'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>
          {mode === 'set' && (
            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••"
              />
            </div>
          )}
          {(localError || error) && (
            <p style={{ color: '#e08a70', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', marginTop: -8, marginBottom: 12 }}>
              {localError || error}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="wooden-btn ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="wooden-btn primary" style={{ flex: 1 }}>
              {mode === 'set' ? 'Lock Book' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
