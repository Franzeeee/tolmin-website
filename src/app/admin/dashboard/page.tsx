import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuthToken } from '@/lib/auth'
import Content from './Content'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token || !verifyAuthToken(token)) {
    redirect('/login')
  }

  return <Content />
}
