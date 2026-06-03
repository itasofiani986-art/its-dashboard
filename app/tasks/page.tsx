"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/app/components/DashboardLayout"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: string
}

const STORAGE_KEY = "its_tasks"

const priorityColors = {
  low: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  high: "text-red-400 bg-red-400/10",
}

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load tasks", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  const addTask = () => {
    if (!title.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    setTitle("")
    setDescription("")
    setPriority("medium")
  }

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  }

  return (
    <DashboardLayout
      title="📊 Tasks"
      description="Organize and track your projects"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 rounded-xl border border-yellow-500 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              New Task
            </h2>

            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition"
            />

            <textarea
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 mb-4 focus:border-yellow-500 focus:outline-none transition resize-none"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white mb-4 focus:border-yellow-500 focus:outline-none transition"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button
              onClick={addTask}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition"
            >
              Create Task
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 space-y-3">
            <div className="bg-zinc-900 border border-yellow-500 rounded-lg p-4">
              <p className="text-zinc-400 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.total}</p>
            </div>
            <div className="bg-zinc-900 border border-green-500 rounded-lg p-4">
              <p className="text-zinc-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="bg-zinc-900 border border-blue-500 rounded-lg p-4">
              <p className="text-zinc-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-blue-400">{stats.active}</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2">
          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p className="text-lg">No tasks</p>
                <p className="text-sm">
                  {filter === "completed"
                    ? "You haven't completed any tasks yet"
                    : "Create your first task to get started"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-zinc-900 border rounded-xl p-6 transition ${
                    task.completed
                      ? "border-zinc-700 opacity-60"
                      : "border-yellow-500 hover:border-yellow-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 cursor-pointer rounded accent-yellow-500"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold mb-2 ${
                          task.completed
                            ? "text-zinc-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-zinc-400 text-sm mb-3">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
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
