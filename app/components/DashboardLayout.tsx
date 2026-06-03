import Link from "next/link"
import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export default function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-yellow-500 p-6 md:p-8">
        <Link
          href="/"
          className="text-yellow-400 text-3xl md:text-2xl font-bold mb-8 tracking-tight block hover:text-yellow-300 transition"
        >
          ITS DASHBOARD
        </Link>

        <nav className="space-y-3">
          <NavLink href="/" icon="🏠" label="Home" />
          <NavLink href="/notes" icon="📝" label="Notes" />
          <NavLink href="/vault" icon="🔑" label="Password Vault" />
          <NavLink href="/tasks" icon="📊" label="Tasks" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl">
          <h1 className="text-4xl md:text-3xl font-bold text-yellow-400 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-zinc-400 mb-8">{description}</p>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-300 hover:bg-yellow-500 hover:bg-opacity-20 hover:text-yellow-400 transition-all duration-200"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}
