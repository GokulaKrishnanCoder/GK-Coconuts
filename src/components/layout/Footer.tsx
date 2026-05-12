import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/40 bg-muted/40 mt-20">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-leaf">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">GK Coconuts</span>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground max-w-md">
          Farm-fresh coconuts and pure coconut products, harvested with care
          from our family-run grove. From our trees to your table.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Shop</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
          <li><Link to="/products?cat=fresh" className="hover:text-primary">Fresh Coconuts</Link></li>
          <li><Link to="/products?cat=oil" className="hover:text-primary">Coconut Oil</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-primary">Our Story</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} GK Coconuts. Grown with sunshine. 🌴
    </div>
  </footer>
);

export default Footer;
