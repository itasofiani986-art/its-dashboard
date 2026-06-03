'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/authContext'
import { getUserByUsername, verifyPassword, createUser } from '@/app/lib/auth'
import { generateTOTPSecret } from '@/app/lib/totp'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = getUserByUsername(username)
      
      if (!user) {
        setError('Username tidak ditemukan')
        return
      }

      const passwordValid = await verifyPassword(password, user.passwordHash)
      
      if (!passwordValid) {
        setError('Password salah')
        return
      }

      if (user.twoFAEnabled && user.twoFASecret) {
        sessionStorage.setItem('temp_username', username)
        router.push('/auth/verify-2fa')
      } else {
        login(username)
        router.push('/')
      }
    } catch (err) {
      setError('Error saat login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        setError('Password tidak cocok')
        return
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter')
        return
      }

      const existingUser = getUserByUsername(username)
      if (existingUser) {
        setError('Username sudah digunakan')
        return
      }

      createUser(username, password)
      
      const totpSetup = await generateTOTPSecret(username)
      sessionStorage.setItem('temp_username', username)
      sessionStorage.setItem('temp_totp_secret', totpSetup.secret)
      sessionStorage.setItem('temp_totp_qr', totpSetup.qrCode)
      
      router.push('/auth/setup-2fa')
    } catch (err) {
      setError('Error saat register')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-yellow-500 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          ITS DASHBOARD
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setMode('login')
              setError('')
              setUsername('')
              setPassword('')
              setConfirmPassword('')
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              mode === 'login'
                ? 'bg-yellow-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register')
              setError('')
              setUsername('')
              setPassword('')
              setConfirmPassword('')
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              mode === 'register'
                ? 'bg-yellow-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={mode === 'login' ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none transition"
            required
          />

          {mode === 'register' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none transition"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-400">
            💡 <strong>Demo Account:</strong> Register akun baru atau login dengan akun yang sudah dibuat.
          </p>
        </div>
      </div>
    </div>
  )
}
