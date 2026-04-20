import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import AiChatModal from '@/components/AiChatModal';
import PageTransition from '@/components/PageTransition';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Ensure profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      current_streak: 0,
      longest_streak: 0,
    });
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent' }}>
      <TopBar email={user.email} />
      <main className="main-content" style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 100px' }}>
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
      <AiChatModal />
    </div>
  );
}
