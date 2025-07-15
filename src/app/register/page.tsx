import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuthToken } from '@/lib/auth'
import RegisterForm from './RegisterForm'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token) {
    const user = verifyAuthToken(token)
    if (user) {
      // ✅ already logged in → redirect
      redirect('/admin')
    }
  }

  // ✅ not logged in → render client login form
  return <RegisterForm />
}
