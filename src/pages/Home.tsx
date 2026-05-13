import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import { useProducts } from "@/hooks/useProducts";
import heroImg from "@/assets/hero-farm.jpg";

const Home = () => {
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Coconut palm grove at golden hour"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="container relative py-28 md:py-40 lg:py-52">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-coconut/15 backdrop-blur-md px-4 py-1.5 text-coconut text-sm font-medium border border-coconut/20">
              <Sparkles className="h-3.5 w-3.5" />
              Farm-fresh, hand-picked daily
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-bold text-coconut leading-[0.95] text-balance">
              Tropical purity,<br/>
              <span className="italic text-accent">straight from the grove.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-coconut/85 max-w-xl">
              GK Coconuts brings you naturally sweet tender coconuts and
              cold-pressed coconut goodness — grown sustainably, delivered fresh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full text-base h-12 px-7 shadow-elegant">
                <Link to="/products">
                  Shop the Grove <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-base h-12 px-7 bg-coconut/10 backdrop-blur border-coconut/30 text-coconut hover:bg-coconut/20 hover:text-coconut">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border/40 bg-muted/40">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Leaf, label: "100% Organic" },
            { icon: Truck, label: "Free Delivery ₹500+" },
            { icon: ShieldCheck, label: "Quality Guaranteed" },
            { icon: Sparkles, label: "Hand-picked Daily" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-leaf shadow-soft">
                <item.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">From our trees<br/>to your table.</h2>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/products">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* STORY STRIP */}
      <section className="container py-16">
        <div className="rounded-3xl gradient-leaf shadow-elegant p-10 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-coconut/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              A Humble Grove
            </h2>
            <p className="text-primary-foreground/85 text-lg mb-6">
              Our journey began when my father leased a coconut grove with a simple vision —
              to bring fresh, naturally grown coconuts directly to people. What started as a
              small local business selling hand-picked coconuts has grown through hard work,
              consistency, and trust.
            </p>
            <Button asChild variant="secondary" size="lg" className="rounded-full">
              <Link to="/about">Read our story <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
