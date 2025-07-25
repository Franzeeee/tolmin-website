// app/admin/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuthToken } from '@/lib/auth'
import TeamsPage from './TeamsPage';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token || !verifyAuthToken(token)) {
    redirect('/login');
  }

  // If here, user is authenticated
  return <TeamsPage />;
}
