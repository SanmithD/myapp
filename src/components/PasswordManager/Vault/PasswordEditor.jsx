import { Eye, EyeOff, Save, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PasswordEditor({
  initialData,
  onSave,
  onDelete,
  onClose,
}) {
  const [site, setSite] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSite(initialData.site || '')
      setEmail(initialData.email || '')
      setUsername(initialData.username || '')
      setPassword(initialData.password || '')
      setNotes(initialData.notes || '')
    }
  }, [initialData])

  const save = () => {
    if (!site || !password) return alert('Site & password required bhai')
    onSave({
      id: initialData?.id || crypto.randomUUID(),
      site,
      email,
      username,
      password,
      notes,
      createdAt: initialData?.createdAt || Date.now(),
      updatedAt: Date.now(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-md rounded-xl shadow-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-700 pb-2">
          <h2 className="text-white text-lg font-semibold">
            {initialData ? 'Edit Password' : 'New Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            className="w-full p-3 bg-dark-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-dark-400"
            placeholder="Website / App"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
          <input
            className="w-full p-3 bg-dark-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-dark-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 bg-dark-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-dark-400"
            placeholder="Username / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-2">
            <input
              type={showPass ? 'text' : 'password'}
              className="flex-1 p-3 bg-dark-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-dark-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="flex items-center justify-center px-3 rounded-md bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <textarea
            className="w-full p-3 bg-dark-700 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-dark-400"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t border-dark-700">
          {initialData && (
            <button
              onClick={() => onDelete(initialData.id)}
              className="flex items-center gap-1 text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash size={16} />
              Delete
            </button>
          )}

          <button
            onClick={save}
            className="ml-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-500 transition-colors px-5 py-2 rounded-md text-white font-medium"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
