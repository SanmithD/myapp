import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const tools = [
    {
      name: "Notes",
      icon: "logo.png",
      path: "/notes",
      color: "from-amber-500 to-orange-600",
      description: "Quick notes and ideas"
    },
    {
      name: "Calculator",
      icon: "log.png",
      path: "/calculator",
      color: "from-blue-500 to-purple-600",
      description: "Math and calculations"
    },
    {
      name: "Voice",
      icon: "voice-logo.png",
      path: "/voice",
      color: "from-rose-500 to-pink-600",
      description: "Record audio"
    },
    {
      name: "Draw",
      icon: "draw-logo.jpg",
      path: "/draw",
      color: "from-rose-500 to-pink-600",
      description: "Show Creativity"
    },
    {
      name: "Password Manager",
      icon: "password-logo.png",
      path: "/password",
      color: "from-rose-500 to-pink-600",
      description: "Save password"
    },
    {
      name: "Trade Monitor",
      icon: "trade.png",
      path: "/trade",
      color: "from-rose-500 to-pink-600",
      description: "Observe the Trade"
    },
  ]

  return (
    <div className="h-screen mb-12 flex flex-col items-center bg-dark-900 px-6">
      {/* Header */}
      <div className="pt-8 text-center">
        <div className="w-28 h-28 mx-auto">
          <img
            src="main-logo.png"
            alt="App Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mt-2">MyApp</h1>
        <p className="text-dark-400 text-base">My personal dashboard</p>
      </div>

      {/* Tools */}
      <div className="flex flex-col justify-center flex-1 gap-6 w-full max-w-sm">
        {tools.map(tool => (
          <button
            key={tool.name}
            onClick={() => navigate(tool.path)}
            className="relative flex items-center gap-4 p-3 rounded bg-dark-800 border border-dark-700 group hover:border-dark-500 hover:shadow-lg transition"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition`} />

            <div className="w-14 h-14 flex items-center justify-center">
              <img
                src={tool.icon}
                alt={tool.name}
                className="w-full h-full rounded object-contain group-hover:scale-110 transition"
              />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-lg font-semibold text-white">{tool.name}</span>
              <span className="text-sm text-dark-400">{tool.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
