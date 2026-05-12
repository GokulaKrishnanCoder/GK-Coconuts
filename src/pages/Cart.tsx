import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProductImage } from "@/lib/productImages";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  shipping_address: z.string().trim().min(5, "Address required").max(500),
  phone: z.string().trim().min(7, "Phone required").max(20),
});

const Cart = () => {
  const { items, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ shipping_address: "", phone: "" });
  const [placing, setPlacing] = useState(false);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      return navigate("/auth");
    }
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setPlacing(true);
    const orderTotal = total();
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: orderTotal,
        shipping_address: form.shipping_address,
        phone: form.phone,
        status: "pending",
      })
      .select()
      .single();

    if (error || !order) {
      setPlacing(false);
      return toast.error(error?.message || "Failed to place order");
    }

    const lineItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      product_name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
    }));
    const { error: itemErr } = await supabase.from("order_items").insert(lineItems);
    setPlacing(false);
    if (itemErr) return toast.error(itemErr.message);

    toast.success("Order placed! 🥥 We'll be in touch shortly.");
    clear();
    setShowCheckout(false);
    navigate("/");
  };

  return (
    <Layout>
      <section className="container py-12 md:py-16 max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty.</p>
            <Button onClick={() => navigate("/products")} className="rounded-full">Browse Products</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl gradient-card border border-border/40 shadow-soft">
                  <img src={getProductImage(item.image_url)} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">₹{item.price.toFixed(0)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full ml-auto text-destructive" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="text-right font-display font-bold text-lg">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl gradient-leaf shadow-elegant p-6 text-primary-foreground sticky top-24">
                <h2 className="font-display text-2xl font-bold mb-4">Summary</h2>
                <div className="flex justify-between mb-2 text-primary-foreground/80">
                  <span>Subtotal</span><span>₹{total().toFixed(0)}</span>
                </div>
                <div className="flex justify-between mb-4 text-primary-foreground/80">
                  <span>Shipping</span><span>{total() >= 500 ? "Free" : "₹50"}</span>
                </div>
                <div className="border-t border-primary-foreground/20 pt-4 flex justify-between font-display text-2xl font-bold mb-6">
                  <span>Total</span><span>₹{(total() + (total() >= 500 ? 0 : 50)).toFixed(0)}</span>
                </div>
                {!showCheckout ? (
                  <Button onClick={() => user ? setShowCheckout(true) : navigate("/auth")} variant="secondary" className="w-full rounded-full h-11">
                    {user ? "Proceed to Checkout" : "Sign in to Checkout"}
                  </Button>
                ) : (
                  <form onSubmit={placeOrder} className="space-y-3">
                    <div>
                      <Label className="text-primary-foreground">Shipping Address</Label>
                      <Textarea required value={form.shipping_address} maxLength={500} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" />
                    </div>
                    <div>
                      <Label className="text-primary-foreground">Phone</Label>
                      <Input required value={form.phone} maxLength={20} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" />
                    </div>
                    <Button type="submit" disabled={placing} variant="secondary" className="w-full rounded-full h-11">
                      {placing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Place Order
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
