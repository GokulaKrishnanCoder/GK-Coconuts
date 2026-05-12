import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back within a day. 🥥");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 600);
  };

  return (
    <Layout>
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Say hello</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-3">Let's talk coconuts.</h1>
          <p className="text-lg text-muted-foreground">Wholesale, farm visits, or just a question — we love hearing from you.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, title: "Email", text: "hello@gkcoconuts.in" },
              { icon: Phone, title: "Phone", text: "+91 98765 43210" },
              { icon: MapPin, title: "Grove", text: "Pollachi, Tamil Nadu, India" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl gradient-card border border-border/40 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-leaf flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-semibold">{item.title}</div>
                  <div className="text-muted-foreground">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="lg:col-span-3 space-y-5 p-8 rounded-2xl gradient-card border border-border/40 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} maxLength={100} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-lg" />
            </div>
            <Button type="submit" disabled={sending} className="rounded-full gap-2 w-full sm:w-auto h-11 px-6">
              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
