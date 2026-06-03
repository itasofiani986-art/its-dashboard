'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/authContext'
import { verifyTOTPToken } from '@/app/lib/totp'
import { getUserByUsername } from '@/app/lib/auth'

export default function Verify2FAPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const tempUsername = sessionStorage.getItem('temp_username')
    if (!tempUsername) {
      router.push('/auth/login')
    }
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const tempUsername = sessionStorage.getItem('temp_username')
      if (!tempUsername) {
        setError('Session expired')
        return
      }

      if (token.length !== 6 || !/^\d+$/.test(token)) {
        setError('Kode harus 6 digit')
        return
      }

      const user = getUserByUsername(tempUsername)
      if (!user || !user.twoFASecret) {
        setError('Error saat verifikasi')
        return
      }

      const isValid = verifyTOTPToken(user.twoFASecret, token)
      if (!isValid) {
        setError('Kode 2FA salah atau expired')
        return
      }

      login(tempUsername)
      sessionStorage.removeItem('temp_username')
      router.push('/')
    } catch (err) {
      setError('Error saat verifikasi 2FA')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-yellow-500 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2 text-center">
          Verifikasi 2FA
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Masukkan kode dari Google Authenticator
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="000000"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none transition text-center text-2xl tracking-widest font-mono"
            autoFocus
            required
          />

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <button
          onClick={() => router.push('/auth/login')}
          className="w-full mt-4 text-zinc-400 hover:text-zinc-300 text-sm transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
