import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = ["gokulakrishnanoffl@gmail.com"];

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const checkIsAdmin = (userEmail: string | undefined) => {
  if (!userEmail) return false;
  if (ADMIN_EMAILS.includes(userEmail)) return true;
  return false;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Check if email is in admin list
        const emailAdmin = checkIsAdmin(sess.user.email);
        if (emailAdmin) {
          setIsAdmin(true);
        } else {
          // Otherwise check database
          setTimeout(() => {
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", sess.user.id)
              .eq("role", "admin")
              .maybeSingle()
              .then(({ data }) => setIsAdmin(!!data));
          }, 0);
        }
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // Check if email is in admin list
        const emailAdmin = checkIsAdmin(session.user.email);
        if (emailAdmin) {
          setIsAdmin(true);
        } else {
          // Otherwise check database
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle()
            .then(({ data }) => setIsAdmin(!!data));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
