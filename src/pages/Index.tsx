import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { AuthModal } from '@/components/AuthModal';
import { MyneLoader } from '@/components/MyneLoader';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MyneLoader size="lg" text="Loading Myne7x Store..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        user={user} 
        onAuthClick={() => setAuthModalOpen(true)} 
      />
      
      <Home 
        user={user} 
        onAuthClick={() => setAuthModalOpen(true)} 
      />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
