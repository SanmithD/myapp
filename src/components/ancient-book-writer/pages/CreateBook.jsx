import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import Toolbar from '../components/Toolbar';
import { BookService } from '../services/BookService';
import { BOOK_BASE } from '../src/basePath';

const STEPS = ['Title', 'Description', 'Cover', 'Create'];

export default function CreateBook() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);
  const [creating, setCreating] = useState(false);

  function next() {
    if (step === 0 && !title.trim()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    if (step === 0) navigate(`${BOOK_BASE}`);
    else setStep((s) => s - 1);
  }

  function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleCreate() {
    setCreating(true);
    const book = await BookService.createBook({ title, description, cover });
    setCreating(false);
    navigate(`${BOOK_BASE}/editor/${book.id}`);
  }

  return (
    <div className="app-shell">
      <Toolbar title="New Book" subtitle={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} onBack={back} />

      <div className="container" style={{ paddingTop: 30, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1 }}
          >
            {step === 0 && (
              <div>
                <h2 style={{ marginBottom: 18 }}>What is your book called?</h2>
                <div className="field">
                  <label>Book Title</label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dragon Kingdom"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ marginBottom: 18 }}>Describe your story</h2>
                <div className="field">
                  <label>Description (optional)</label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A kingdom lost in fire…"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ marginBottom: 18 }}>Choose a cover</h2>
                <div className="cover-preview">
                  {cover ? (
                    <img src={cover} alt="cover preview" />
                  ) : (
                    <span style={{ fontSize: '2.4rem' }}>📕</span>
                  )}
                </div>
                <label className="wooden-btn" style={{ display: 'inline-block', marginTop: 16, cursor: 'pointer' }}>
                  Upload Cover Image
                  <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                </label>
                {cover && (
                  <button className="wooden-btn ghost" style={{ marginLeft: 10 }} onClick={() => setCover(null)}>
                    Use Default Cover
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ marginBottom: 18 }}>Ready to begin</h2>
                <div className="summary-card">
                  <p><strong>Title:</strong> {title}</p>
                  {description && <p><strong>Description:</strong> {description}</p>}
                  <p><strong>Cover:</strong> {cover ? 'Custom image' : 'Default ancient cover'}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', gap: 10, paddingBottom: 20 }}>
          <button className="wooden-btn ghost" style={{ flex: 1 }} onClick={back}>
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="wooden-btn primary" style={{ flex: 1 }} onClick={next} disabled={step === 0 && !title.trim()}>
              Next
            </button>
          ) : (
            <button className="wooden-btn primary" style={{ flex: 1 }} onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating…' : 'Create Book'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .cover-preview {
          width: 120px;
          height: 168px;
          border-radius: 6px;
          border: 1px solid var(--gold);
          background: linear-gradient(160deg, var(--leather), var(--wood-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .summary-card {
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--wood-light);
          border-radius: var(--radius);
          padding: 16px;
        }
        .summary-card p { margin: 0 0 8px 0; }
      `}</style>
    </div>
  );
}
