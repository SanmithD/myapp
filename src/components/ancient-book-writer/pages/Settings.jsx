import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsService } from '../services/SettingsService';
import { idb, STORES } from '../services/db';
import Toolbar from '../components/Toolbar';
import { BOOK_BASE } from '../src/basePath';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(SettingsService.get());
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);

  function update(patch) {
    const merged = SettingsService.save(patch);
    setSettings(merged);
  }

  async function handleBackup() {
    const index = await idb.getAll(STORES.BOOKS_INDEX);
    const full = await idb.getAll(STORES.BOOKS_FULL);
    const payload = { exportedAt: new Date().toISOString(), index, full };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ancient-library-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Backup downloaded.');
  }

  function handleRestoreClick() {
    fileInputRef.current?.click();
  }

  async function handleRestoreFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      for (const entry of payload.index || []) await idb.put(STORES.BOOKS_INDEX, entry);
      for (const entry of payload.full || []) await idb.put(STORES.BOOKS_FULL, entry);
      setStatus(`Restored ${payload.full?.length || 0} book(s).`);
    } catch (err) {
      console.log(err);
      setStatus('Could not read that backup file.');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <div className="app-shell mt-12">
      <Toolbar title="Settings" onBack={() => navigate(`${BOOK_BASE}`)} />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <section className="settings-section">
          <h3>Writing</h3>

          <div className="setting-row">
            <label>Auto Save Interval</label>
            <select
              value={settings.autoSaveSeconds}
              onChange={(e) => update({ autoSaveSeconds: Number(e.target.value) })}
            >
              <option value={1}>1 second</option>
              <option value={2}>2 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Font Size</label>
            <select value={settings.fontSize} onChange={(e) => update({ fontSize: e.target.value })}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Page Width</label>
            <select value={settings.pageWidth} onChange={(e) => update({ pageWidth: e.target.value })}>
              <option value="narrow">Narrow</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h3>Experience</h3>

          <div className="setting-row">
            <label>Page Turn Animation Speed</label>
            <select value={settings.animationSpeed} onChange={(e) => update({ animationSpeed: e.target.value })}>
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Ambient Sound</label>
            <button
              className={`wooden-btn ${settings.soundEnabled ? 'primary' : 'ghost'}`}
              onClick={() => update({ soundEnabled: !settings.soundEnabled })}
            >
              {settings.soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h3>Library Backup</h3>
          <p style={{ color: 'var(--paper-shadow)', fontSize: '0.9rem', marginBottom: 14 }}>
            Everything lives only on this device. Export a backup to keep it safe, or restore one
            from another device.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="wooden-btn primary" onClick={handleBackup}>Export Backup</button>
            <button className="wooden-btn ghost" onClick={handleRestoreClick}>Restore Backup</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleRestoreFile}
            />
          </div>
          {status && <p style={{ color: 'var(--gold)', marginTop: 10, fontSize: '0.85rem' }}>{status}</p>}
        </section>
      </div>

      <style>{`
        .settings-section {
          margin-bottom: 28px;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--wood-light);
          border-radius: var(--radius);
          padding: 16px;
        }
        .settings-section h3 {
          font-size: 1rem;
          margin-bottom: 14px;
          color: var(--gold-bright);
        }
        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: var(--font-ui);
          font-size: 0.9rem;
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-row select {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--wood-light);
          color: var(--paper);
          border-radius: 6px;
          padding: 6px 10px;
        }
      `}</style>
    </div>
  );
}
