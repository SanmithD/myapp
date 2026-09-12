import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Notes",
      icon: "logo.png",
      path: "/notes",
      color: "from-amber-500 to-orange-600",
      description: "Quick notes and ideas",
    },
    {
      name: "Calculator",
      icon: "log.png",
      path: "/calculator",
      color: "from-blue-500 to-purple-600",
      description: "Math and calculations",
    },
    {
      name: "Voice",
      icon: "voice-logo.png",
      path: "/voice",
      color: "from-rose-500 to-pink-600",
      description: "Record audio",
    },
    {
      name: "Tasks",
      icon: "task.png",
      path: "/tasks",
      color: "from-purple-500 to-indigo-600",
      description: "Manage your daily tasks",
    },
    {
      name: "Password Manager",
      icon: "password-logo.png",
      path: "/password",
      color: "from-red-500 to-pink-600",
      description: "Save passwords securely",
    },
    {
      name: "Draw",
      icon: "draw-logo.jpg",
      path: "/draw",
      color: "from-emerald-500 to-green-600",
      description: "Show Creativity",
    },
    {
      name: "Books",
      icon: "book.png",
      path: "/book_home",
      color: "from-yellow-600 to-amber-700",
      description: "Write your thoughts",
    },
    {
      name: "Focus",
      icon: "time.png",
      path: "/focus_timer",
      color: "from-violet-500 to-purple-600",
      description: "Focus on one goal",
    },
  ];

  return (
    <div className="h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="flex flex-col items-center px-6 pt-8 pb-6 shrink-0">
        <img
          src="main-logo.png"
          alt="App Logo"
          className="w-24 h-24 object-contain"
        />

        <h1 className="mt-3 text-3xl font-bold text-white">MyApp</h1>

        <p className="mt-1 text-dark-400">My Personal Dashboard</p>
      </header>

      {/* Tools */}
      <main className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="max-w-md mx-auto space-y-4">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => navigate(tool.path)}
              className="group relative w-full overflow-hidden rounded-xl border border-dark-700 bg-dark-800 p-4 transition-all duration-300 hover:border-dark-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${tool.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              />

              <div className="relative flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-dark-700">
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="h-11 w-11 rounded-md object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 text-left">
                  <h2 className="text-lg font-semibold text-white">
                    {tool.name}
                  </h2>

                  <p className="mt-1 text-sm text-dark-400">
                    {tool.description}
                  </p>
                </div>

                <div className="text-2xl text-dark-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
