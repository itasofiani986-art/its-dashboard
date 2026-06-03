import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface TOTPSetup {
  secret: string
  qrCode: string
}

export async function generateTOTPSecret(
  username: string
): Promise<TOTPSetup> {
  const secret = speakeasy.generateSecret({
    name: `ITS Dashboard (${username})`,
    issuer: 'ITS Dashboard',
    length: 32,
  })

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: secret.base32,
    qrCode,
  }
}

export function verifyTOTPToken(
  secret: string,
  token: string
): boolean {
  try {
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2,
    })
    return verified !== undefined && verified !== false
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

export function generateTOTPToken(secret: string): string {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32',
  })
}
