// app/admin/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuthToken } from '@/lib/auth'  // adjust to your actual auth check

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token || !verifyAuthToken(token)) {
    // not authenticated → redirect to /
    redirect('/login')
  }

  // authenticated → redirect to dashboard
  redirect('/admin/dashboard')
}
