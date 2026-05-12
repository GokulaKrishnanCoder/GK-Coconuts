import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Products = () => {
  const { products, loading } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchCat = cat === "all" || p.category === cat;
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">The Grove</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">All Products</h1>
          <p className="text-muted-foreground text-lg">
            Fresh coconuts, cold-pressed oils, and pure coconut goodness.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search coconuts, oil, milk..."
              className="pl-11 h-12 rounded-full bg-muted/50 border-border/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <Button
                key={c}
                onClick={() => setCat(c)}
                variant={cat === c ? "default" : "outline"}
                className={cn("rounded-full capitalize", cat === c && "shadow-soft")}
                size="sm"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-lg">🥥 No coconuts match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
