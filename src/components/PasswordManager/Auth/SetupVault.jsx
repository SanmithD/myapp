import { useState } from 'react'
import { encryptData } from '../../../crypto/crypto'
import { saveVault } from '../../../utils/db'

export default function SetupVault({ onDone }) {
  const [password, setPassword] = useState('')

  const setup = async () => {
    if (password.length < 6) return alert('Password too short bro')

    const encrypted = await encryptData([], password)
    await saveVault(encrypted)
    onDone(password)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Create Master Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <button onClick={setup} className="bg-amber-600 px-4 py-2 text-white">
        Create Vault
      </button>
    </div>
  )
}
