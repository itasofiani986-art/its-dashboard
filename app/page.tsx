"use client"

import { useRouter } from "next/navigation"

interface Card {
  id: string
  icon: string
  title: string
  description: string
  route?: string
}

const cards: Card[] = [
  {
    id: "ai",
    icon: "🤖",
    title: "AI Assistant",
    description: "Get help from AI with your tasks",
    route: "/ai"
  },
  {
    id: "notes",
    icon: "📝",
    title: "Notes",
    description: "Keep your thoughts organized",
    route: "/notes"
  },
  {
    id: "vault",
    icon: "🔑",
    title: "Password Vault",
    description: "Secure storage for your passwords",
    route: "/vault"
  },
  {
    id: "tasks",
    icon: "📊",
    title: "Tasks",
    description: "Manage and track your projects",
    route: "/tasks"
  }
]

export default function Home() {
  const router = useRouter()

  const handleCardClick = (route?: string) => {
    if (route) {
      router.push(route)
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-yellow-500 p-6 md:p-8">
        <h1 className="text-yellow-400 text-3xl md:text-2xl font-bold mb-8 tracking-tight">
          ITS DASHBOARD
        </h1>
        <nav className="hidden md:block space-y-4 text-sm text-zinc-400">
          <p className="text-yellow-500 font-semibold">Menu</p>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl">
          <h2 className="text-4xl md:text-3xl font-bold text-yellow-400 mb-2">
            Welcome Back
          </h2>
          <p className="text-zinc-400 mb-10">
            Manage all your tasks in one place
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                disabled={!card.route}
                className={`group relative p-6 rounded-xl border border-yellow-500 transition-all duration-300 ${
                  card.route
                    ? "cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:scale-105 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20"
                    : "cursor-not-allowed bg-zinc-900 opacity-75"
                }`}
              >
                <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 text-left">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-400 text-left group-hover:text-zinc-300 transition-colors">
                  {card.description}
                </p>
                {!card.route && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/40">
                    <span className="text-xs text-yellow-400 font-semibold">Coming Soon</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}