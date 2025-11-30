import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const tools = [
    {
      name: 'Notes',
      icon: 'logo.png',
      path: '/notes',
      color: 'from-amber-500 to-orange-600',
      description: 'Quick notes & ideas'
    },
    {
      name: 'Calculator',
      icon: 'log.png',
      path: '/calculator',
      color: 'from-blue-500 to-purple-600',
      description: 'Math & calculations'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col gap-6 px-6 py-12 bg-dark-900">
      {/* Logo/Title */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-30 h-30 rounded-2xl mb-6">
          <img 
            src="main-logo.png" 
            alt="App Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">MyApp</h1>
        <p className="text-dark-400 text-lg">My personal dashboard</p>
      </div>

      {/* Tool Buttons */}
      <div className='h-full flex flex-col justify-center items-center gap-3 mt-20' >
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm sm:max-w-lg">
        {tools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => navigate(tool.path)}
            className="group flex-1 relative rounded bg-dark-800 border border-dark-700 hover:border-dark-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative flex flex-row sm:flex-col items-center gap-4 sm:gap-3 p-5 sm:p-8">
              {/* Icon Container */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <img 
                  src={tool.icon} 
                  alt={tool.name}
                  className="w-full h-full sm:w-full sm:h-full object-contain"
                />
              </div>
              
              {/* Text */}
              <div className="text-left sm:text-center">
                <span className="block text-xl font-semibold text-white mb-1">
                  {tool.name}
                </span>
                <span className="block text-sm text-dark-400">
                  {tool.description}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Footer */}
      <p className="mt-16 text-dark-500 text-sm">
        Tap a tool to get started
      </p>
      </div>
    </div>
  )
}

export default Home