import { redirect } from 'next/navigation';

export default function HomePage() {
  // Simple redirect to login - auth check happens there
  redirect('/login');
}
