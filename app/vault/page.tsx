"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/app/components/DashboardLayout"

interface Password {
  id: string
  name: string
  username: string
  password: string
  url?: string
  notes?: string
  createdAt: string
}

const STORAGE_KEY = "its_vault"

export default function VaultPage() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [url, setUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load passwords from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPasswords(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load passwords", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords))
    }
  }, [passwords, isLoaded])

  const addPassword = () => {
    if (!name.trim() || !username.trim() || !password.trim()) return

    const newPassword: Password = {
      id: Date.now().toString(),
      name,
      username,
      password,
      url,
      notes,
      createdAt: new Date().toISOString(),
    }
    setPasswords([newPassword, ...passwords])
    setName("")
    setUsername("")
    setPassword("")
    setUrl("")
    setNotes("")
  }

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter((p) => p.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredPasswords = passwords.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout
      title="🔑 Password Vault"
      description="Securely store and manage your passwords"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Password Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 rounded-xl border border-yellow-500 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              Add Password
            </h2>

            <input
              type="text"
              placeholder="Service name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <input
              type="text"
              placeholder="Username/Email..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <input
              type="url"
              placeholder="Website URL (optional)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <textarea
              placeholder="Notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition resize-none"
            />

            <button
              onClick={addPassword}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition"
            >
              Save Password
            </button>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⚠️ Note: Passwords are stored in browser memory only and will be lost on refresh.
              </p>
            </div>
          </div>
        </div>

        {/* Passwords List */}
        <div className="lg:col-span-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-yellow-500 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-6 focus:border-yellow-400 focus:outline-none transition"
          />

          {/* Passwords */}
          <div className="space-y-4">
            {filteredPasswords.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p className="text-lg">
                  {searchTerm ? "No passwords found" : "No passwords saved yet"}
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try a different search term"
                    : "Add your first password to get started"}
                </p>
              </div>
            ) : (
              filteredPasswords.map((pwd) => (
                <div
                  key={pwd.id}
                  className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 hover:border-yellow-400 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{pwd.name}</h3>
                    <button
                      onClick={() => deletePassword(pwd.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Username */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Username</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white font-mono">{pwd.username}</p>
                        <button
                          onClick={() => copyToClipboard(pwd.username)}
                          className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Password</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white font-mono">
                          {showPassword === pwd.id
                            ? pwd.password
                            : "•".repeat(pwd.password.length)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setShowPassword(
                                showPassword === pwd.id ? null : pwd.id
                              )
                            }
                            className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition"
                          >
                            {showPassword === pwd.id ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => copyToClipboard(pwd.password)}
                            className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* URL */}
                    {pwd.url && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Website</p>
                        <a
                          href={pwd.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 text-sm break-all"
                        >
                          {pwd.url}
                        </a>
                      </div>
                    )}

                    {/* Notes */}
                    {pwd.notes && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Notes</p>
                        <p className="text-zinc-300 text-sm">{pwd.notes}</p>
                      </div>
                    )}

                    <p className="text-xs text-zinc-600 pt-2 border-t border-zinc-700">
                      Added {new Date(pwd.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
