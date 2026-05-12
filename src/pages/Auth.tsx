import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Leaf, Loader2 } from "lucide-react";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({ name: "", email: "", password: "" });

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const e1 = emailSchema.safeParse(signIn.email);
    const p1 = passwordSchema.safeParse(signIn.password);
    if (!e1.success) return toast.error(e1.error.issues[0].message);
    if (!p1.success) return toast.error(p1.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: signIn.email, password: signIn.password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back! 🥥");
    navigate("/");
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const e1 = emailSchema.safeParse(signUp.email);
    const p1 = passwordSchema.safeParse(signUp.password);
    if (!signUp.name.trim()) return toast.error("Please enter your name");
    if (!e1.success) return toast.error(e1.error.issues[0].message);
    if (!p1.success) return toast.error(p1.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUp.email,
      password: signUp.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: signUp.name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Welcome to the grove. 🌴");
    navigate("/");
  };

  return (
    <Layout>
      <section className="container py-16 md:py-24 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full gradient-leaf shadow-elegant mb-4">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold">Welcome</h1>
            <p className="text-muted-foreground mt-2">Sign in to track orders & save favorites.</p>
          </div>
          <div className="rounded-2xl border border-border/40 gradient-card shadow-elegant p-6">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="signin" className="rounded-full">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={onSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" type="email" value={signIn.email} onChange={(e) => setSignIn({ ...signIn, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pw">Password</Label>
                    <Input id="si-pw" type="password" value={signIn.password} onChange={(e) => setSignIn({ ...signIn, password: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={onSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Name</Label>
                    <Input id="su-name" value={signUp.name} maxLength={80} onChange={(e) => setSignUp({ ...signUp, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" value={signUp.email} onChange={(e) => setSignUp({ ...signUp, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pw">Password</Label>
                    <Input id="su-pw" type="password" value={signUp.password} onChange={(e) => setSignUp({ ...signUp, password: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
