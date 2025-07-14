import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuthToken } from '@/lib/auth'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token) {
    const user = verifyAuthToken(token)
    if (user) {
      // ✅ already logged in → redirect
      redirect('/')
    }
  }

  // ✅ not logged in → render client login form
  return <LoginForm />
}
