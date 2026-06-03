'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/authContext'
import { updateUser, getUserByUsername } from '@/app/lib/auth'

export default function Setup2FAPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'scan' | 'verify'>('scan')

  useEffect(() => {
    const tempUsername = sessionStorage.getItem('temp_username')
    const tempSecret = sessionStorage.getItem('temp_totp_secret')
    const tempQR = sessionStorage.getItem('temp_totp_qr')

    if (!tempUsername || !tempSecret || !tempQR) {
      router.push('/auth/login')
      return
    }

    setSecret(tempSecret)
    setQrCode(tempQR)
  }, [router])

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { verifyTOTPToken } = await import('@/app/lib/totp')
      
      if (verificationToken.length !== 6 || !/^\d+$/.test(verificationToken)) {
        setError('Kode harus 6 digit')
        setLoading(false)
        return
      }

      const isValid = verifyTOTPToken(secret, verificationToken)
      if (!isValid) {
        setError('Kode salah. Pastikan waktu perangkat sinkron')
        setLoading(false)
        return
      }

      const tempUsername = sessionStorage.getItem('temp_username')
      if (!tempUsername) {
        setError('Session expired')
        setLoading(false)
        return
      }

      updateUser(tempUsername, {
        twoFASecret: secret,
        twoFAEnabled: true,
      })

      sessionStorage.removeItem('temp_username')
      sessionStorage.removeItem('temp_totp_secret')
      sessionStorage.removeItem('temp_totp_qr')

      login(tempUsername)
      router.push('/')
    } catch (err) {
      setError('Error saat setup 2FA')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!qrCode || !secret) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-yellow-500 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2 text-center">
          Setup 2FA
        </h1>
        <p className="text-zinc-400 text-center mb-8 text-sm">
          Scan QR code dengan Google Authenticator
        </p>

        {step === 'scan' && (
          <>
            <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
              <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-yellow-400 mb-2">
                <strong>Manual Key (jika QR tidak bisa scan):</strong>
              </p>
              <code className="text-yellow-400 font-mono text-sm break-all">
                {secret}
              </code>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition"
            >
              Sudah Scan QR Code
            </button>
          </>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndEnable} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Masukkan kode dari Google Authenticator:
              </label>
              <input
                type="text"
                placeholder="000000"
                value={verificationToken}
                onChange={(e) =>
                  setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                maxLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none transition text-center text-2xl tracking-widest font-mono"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationToken.length !== 6}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-2 rounded-lg transition"
            >
              {loading ? 'Verifying...' : 'Enable 2FA'}
            </button>

            <button
              type="button"
              onClick={() => setStep('scan')}
              className="w-full text-zinc-400 hover:text-zinc-300 text-sm transition"
            >
              Back to QR Code
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
