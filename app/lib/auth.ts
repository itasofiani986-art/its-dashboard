import { hash, compare } from 'bcryptjs'

// Simple user database (in production, use real database)
const USERS_STORAGE_KEY = 'its_users'

export interface User {
  username: string
  passwordHash: string
  twoFASecret?: string
  twoFAEnabled: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  username: string | null
  requiresTwoFA: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash)
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find((u) => u.username === username)
}

export function createUser(username: string, password: string): User {
  const bcrypt = require('bcryptjs')
  const passwordHash = bcrypt.hashSync(password, 10)
  const newUser: User = {
    username,
    passwordHash,
    twoFAEnabled: false,
  }
  const users = getUsers()
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function updateUser(username: string, updates: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.username === username)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    saveUsers(users)
  }
}
