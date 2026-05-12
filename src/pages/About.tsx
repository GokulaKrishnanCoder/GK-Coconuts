import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/hero-farm.jpg";
import { Leaf, Heart, Sun } from "lucide-react";

const About = () => (
  <Layout>
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1] text-balance">
          A family grove,<br/>
          <span className="italic text-primary">three generations strong.</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
        <div className="rounded-3xl overflow-hidden shadow-elegant aspect-[4/3]">
          <img src={heroImg} alt="Our coconut grove" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>
            <span className="font-display text-foreground text-xl">It started in 1962</span>{" "}
            when our grandfather planted his first 50 coconut saplings along the breezy Kerala coast.
            What began as a humble family plot has grown into a 200-acre regenerative grove tended by
            the same hands — now in their third generation.
          </p>
          <p>
            We don't rush nature. Coconuts are hand-picked at peak ripeness, oils are cold-pressed in
            small batches, and every product reaches you within days of harvest.
          </p>
          <p>
            <span className="text-foreground font-medium">No shortcuts. No fillers. Just coconuts, the way they should be.</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Leaf, title: "Regenerative", text: "Soil-first farming with zero synthetic chemicals." },
          { icon: Sun, title: "Sun-Ripened", text: "Picked only when nature says they're ready." },
          { icon: Heart, title: "Family-Run", text: "Every order is packed by people we know by name." },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl p-7 gradient-card border border-border/40 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-leaf mb-4">
              <v.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">{v.title}</h3>
            <p className="text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
