"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/app/components/DashboardLayout"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

const STORAGE_KEY = "its_notes"

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setNotes(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load notes", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoaded])

  const addNote = () => {
    if (!title.trim() || !content.trim()) return

    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content, createdAt: new Date().toISOString() }
            : note
        )
      )
      setEditingId(null)
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
    }

    setTitle("")
    setContent("")
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const editNote = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note.id)
  }

  const cancelEdit = () => {
    setTitle("")
    setContent("")
    setEditingId(null)
  }

  return (
    <DashboardLayout
      title="📝 Notes"
      description="Create and manage your notes"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 rounded-xl border border-yellow-500 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              {editingId ? "Edit Note" : "New Note"}
            </h2>

            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={addNote}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="lg:col-span-2 space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <p className="text-lg">No notes yet</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 hover:border-yellow-400 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex-1">
                    {note.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editNote(note)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap mb-3">
                  {note.content}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
