
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useUserRole = () => {
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserAndRole = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching user role:', error);
                    setRole(null);
                } else if (data) {
                    setRole(data.role);
                }
            } else {
                setRole(null);
                setUser(null);
            }
            setIsLoading(false);
        };

        fetchUserAndRole();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserAndRole();
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const isModerator = role === 'moderator' || role === 'admin';

    return { role, isModerator, user, isLoading };
};
