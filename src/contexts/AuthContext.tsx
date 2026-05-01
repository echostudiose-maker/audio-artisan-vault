import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, Subscription, AppRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  subscription: Subscription | null;
  userRole: AppRole | null;
  isLoading: boolean;
  isSubscribed: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    // Fetch each independently so one failure doesn't block others

    // Fetch profile
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) console.error('Profile fetch error:', profileError);
      if (profileData) setProfile(profileData as UserProfile);
    } catch (e) {
      console.error('Profile fetch exception:', e);
    }

    // Fetch subscription
    try {
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (subError) console.error('Subscription fetch error:', subError);
      if (subscriptionData) setSubscription(subscriptionData as Subscription);
    } catch (e) {
      console.error('Subscription fetch exception:', e);
    }

    // Fetch user role
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) console.error('Role fetch error:', roleError);
      if (roleData) setUserRole(roleData.role as AppRole);
    } catch (e) {
      console.error('Role fetch exception:', e);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Redirect to reset password form when recovery or signup confirmation link is clicked
        if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') &&
            window.location.hash.includes('type=signup') &&
            window.location.pathname !== '/auth') {
          window.location.href = '/auth?mode=reset';
          return;
        }
        if (event === 'PASSWORD_RECOVERY' && window.location.pathname !== '/auth') {
          window.location.href = '/auth?mode=reset';
          return;
        }

        if (session?.user) {
          // Defer data fetching to avoid deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setSubscription(null);
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/auth?mode=reset`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription(null);
    setUserRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const isSubscribed = subscription?.status === 'active' && 
    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());
  
  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        subscription,
        userRole,
        isLoading,
        isSubscribed,
        isAdmin,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
