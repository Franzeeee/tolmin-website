import jwt from 'jsonwebtoken'

export function verifyAuthToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    return decoded
  } catch (err) {
    console.error('❌ Invalid token:', err)
    return null
  }
}
