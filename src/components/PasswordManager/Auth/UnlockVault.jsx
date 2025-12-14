import { useState } from 'react'
import { decryptData } from '../../../crypto/crypto'
import { loadVault } from '../../../utils/db'

export default function UnlockVault({ onUnlock }) {
  const [password, setPassword] = useState('')

  const unlock = async () => {
    try {
      const encryptedVault = await loadVault()
      const decrypted = await decryptData(encryptedVault, password)
      onUnlock(decrypted, password)
    } catch {
      alert('Wrong password bhai 😬')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Unlock Vault</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <button
        onClick={unlock}
        className="bg-green-600 px-4 py-2 text-white"
      >
        Unlock
      </button>
    </div>
  )
}
