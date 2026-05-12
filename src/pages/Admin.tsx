import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Loader2, Package, ShoppingBag, Users, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getProductImage } from "@/lib/productImages";
import type { Product } from "@/components/shop/ProductCard";

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address: string;
  phone: string | null;
  created_at: string;
}

const emptyForm: Omit<Product, "id"> = {
  name: "", description: "", price: 0, image_url: "tender", category: "fresh", stock: 0, featured: false,
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { products, loading, refetch } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as Order[]) || []);
      setOrdersLoading(false);
    });
  }, [isAdmin]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
    return {
      revenue,
      orderCount: orders.length,
      productCount: products.length,
      pending: orders.filter((o) => o.status === "pending").length,
    };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      days[d.toLocaleDateString("en", { weekday: "short" })] = 0;
    }
    orders.forEach((o) => {
      const day = new Date(o.created_at).toLocaleDateString("en", { weekday: "short" });
      if (day in days) days[day] += Number(o.total);
    });
    return Object.entries(days).map(([day, sales]) => ({ day, sales }));
  }, [orders]);

  if (authLoading) return <Layout><div className="container py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div></Layout>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Layout><div className="container py-20 text-center"><h1 className="font-display text-3xl">🚫 Admin access only</h1><p className="text-muted-foreground mt-2">Ask an admin to grant you the role.</p></div></Layout>;

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Product updated" : "Product created");
    setOpen(false);
    refetch();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refetch();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Order updated");
  };

  return (
    <Layout>
      <section className="container py-10">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Admin</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Dashboard</h1>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: "Revenue", value: `₹${stats.revenue.toFixed(0)}` },
            { icon: ShoppingBag, label: "Orders", value: stats.orderCount },
            { icon: Package, label: "Products", value: stats.productCount },
            { icon: Users, label: "Pending", value: stats.pending },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl gradient-card border border-border/40 shadow-soft p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full gradient-leaf flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <div className="font-display text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl gradient-card border border-border/40 shadow-soft p-6 mb-8">
          <h2 className="font-display text-xl font-bold mb-4">Sales — last 7 days</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="rounded-full">
            <TabsTrigger value="products" className="rounded-full">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-5">
            <div className="flex justify-end mb-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> New Product</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "New"} Product</DialogTitle></DialogHeader>
                  <form onSubmit={save} className="space-y-3">
                    <div><Label>Name</Label><Input value={form.name} maxLength={120} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                    <div><Label>Description</Label><Textarea value={form.description} maxLength={500} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Price (₹)</Label><Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required /></div>
                      <div><Label>Stock</Label><Input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Category</Label><Input value={form.category} maxLength={40} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
                      <div><Label>Image key</Label>
                        <select value={form.image_url || "tender"} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                          {["tender","mature","oil","flakes","water","milk"].map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                      <span className="text-sm">Featured</span>
                    </label>
                    <DialogFooter><Button type="submit" className="rounded-full">Save</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : products.map((p) => (
                <div key={p.id} className="rounded-2xl gradient-card border border-border/40 shadow-soft overflow-hidden">
                  <img src={getProductImage(p.image_url)} alt={p.name} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-display font-semibold">{p.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">₹{Number(p.price).toFixed(0)}</span>
                      <span className="text-xs text-muted-foreground">stock {p.stock}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="flex-1 rounded-full"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => del(p.id)} className="rounded-full text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-5">
            {ordersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-2xl gradient-card border border-border/40 shadow-soft p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                          <Badge variant="secondary" className="capitalize">{o.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                        <p className="text-sm mt-1 line-clamp-1">{o.shipping_address}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold">₹{Number(o.total).toFixed(0)}</div>
                        <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="mt-2 h-9 rounded-md border border-input bg-background px-2 text-sm">
                          {["pending","processing","shipped","delivered","cancelled"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default Admin;
