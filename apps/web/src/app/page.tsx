import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard or login based on auth status
  // This is handled client-side in a real app
  redirect('/dashboard');
}
