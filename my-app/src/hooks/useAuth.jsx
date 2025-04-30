import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          return 'user'; // Default to user role if there's an error
        }

        return data?.role || 'user';
      } catch (error) {
        console.error('Error in getUserRole:', error);
        return 'user';
      }
    };

    const setupUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user?.id) {
          const role = await getUserRole(session.user.id);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error in setupUser:', error);
      } finally {
        setLoading(false);
      }
    };

    setupUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(true);

      if (session?.user?.id) {
        const role = await getUserRole(session.user.id);
        setUserRole(role);
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, userRole };
} 