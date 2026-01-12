import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { HIPAAService, UserProfile, UserRole, Permission } from '@/services/hipaaService';
import { toast } from 'sonner';

interface HIPAAAuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  validateSession: () => Promise<boolean>;
}

const HIPAAAuthContext = createContext<HIPAAAuthContextType | undefined>(undefined);

interface HIPAAAuthProviderProps {
  children: ReactNode;
}

export function HIPAAAuthProvider({ children }: HIPAAAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile
          try {
            const userProfile = await HIPAAService.getUserProfile(session.user.id);
            setProfile(userProfile);

            // Log successful authentication
            await HIPAAService.logAudit({
              action: 'AUTH_SUCCESS',
              resource_type: 'authentication',
              details: { event, user_id: session.user.id }
            });

            // Update last login time
            await HIPAAService.updateUserProfile(session.user.id, {
              last_login: new Date().toISOString()
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load user profile');
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        HIPAAService.getUserProfile(session.user.id)
          .then(setProfile)
          .catch(console.error);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-validate session periodically
  useEffect(() => {
    if (session) {
      const interval = setInterval(async () => {
        const isValid = await validateSession();
        if (!isValid) {
          toast.error('Session expired. Please log in again.');
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log failed authentication attempt
        await HIPAAService.logAudit({
          action: 'AUTH_FAILED',
          resource_type: 'authentication',
          details: { email, error: error.message }
        });
        
        return { error };
      }

      toast.success('Signed in successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      setLoading(true);

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        await HIPAAService.logAudit({
          action: 'SIGNUP_FAILED',
          resource_type: 'authentication',
          details: { email, error: error.message }
        });
        
        return { error };
      }

      if (data.user) {
        // Create user profile
        const profileData = {
          user_id: data.user.id,
          email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'patient' as UserRole,
          department: userData.department,
          license_number: userData.license_number,
          phone: userData.phone,
          is_active: true,
          mfa_enabled: false,
          session_timeout_minutes: 30
        };

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError };
        }

        // Log successful signup
        await HIPAAService.logAudit({
          action: 'SIGNUP_SUCCESS',
          resource_type: 'authentication',
          details: { email, role: userData.role }
        });
      }

      toast.success('Account created successfully. Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await HIPAAService.logAudit({
          action: 'SIGNOUT',
          resource_type: 'authentication',
          details: { user_id: user.id }
        });
      }

      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!profile) return false;
    
    // Super admin has all permissions
    if (profile.role === 'super_admin') return true;
    
    // Check specific role permissions (this would typically be cached)
    // For now, we'll implement basic role-based logic
    const rolePermissions: Record<UserRole, Permission[]> = {
      super_admin: ['read_all_patients', 'write_all_patients', 'manage_appointments', 'manage_billing', 'manage_pharmacy', 'manage_lab_results', 'manage_radiology', 'view_reports', 'manage_users', 'audit_access'],
      admin: ['read_all_patients', 'write_all_patients', 'manage_appointments', 'manage_billing', 'view_reports', 'manage_users'],
      doctor: ['read_all_patients', 'write_all_patients', 'manage_appointments', 'manage_pharmacy', 'manage_lab_results', 'view_reports'],
      nurse: ['read_own_patients', 'write_own_patients', 'manage_appointments'],
      pharmacist: ['read_own_patients', 'manage_pharmacy'],
      lab_technician: ['read_own_patients', 'manage_lab_results'],
      radiologist: ['read_own_patients', 'manage_radiology'],
      billing_staff: ['read_own_patients', 'manage_billing'],
      receptionist: ['read_own_patients', 'manage_appointments'],
      patient: ['read_own_patients']
    };

    return rolePermissions[profile.role]?.includes(permission) || false;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedProfile = await HIPAAService.updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const validateSession = async (): Promise<boolean> => {
    if (!session) return false;
    
    try {
      return await HIPAAService.validateSession();
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const contextValue: HIPAAAuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    updateProfile,
    validateSession
  };

  return (
    <HIPAAAuthContext.Provider value={contextValue}>
      {children}
    </HIPAAAuthContext.Provider>
  );
}

export function useHIPAAAuth() {
  const context = useContext(HIPAAAuthContext);
  if (context === undefined) {
    throw new Error('useHIPAAAuth must be used within a HIPAAAuthProvider');
  }
  return context;
}