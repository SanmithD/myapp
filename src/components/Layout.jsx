import { ArrowLeft, Home } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 my-4">
      {/* Header */}
      {!isHome && (
        <header className="sticky top-0 z-50 h-10 flex items-center bg-dark-800/95 backdrop-blur border-b border-dark-700">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold capitalize">
              {location.pathname.slice(1)}
            </h1>
            <button
              onClick={() => navigate('/')}
              className="ml-auto p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              <Home size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout