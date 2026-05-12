import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, ShoppingCart, Menu, X, Leaf, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const count = useCart((s) => s.count());
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-leaf shadow-soft group-hover:scale-110 transition-smooth">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            GK <span className="text-primary">Coconuts</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-smooth",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")} aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 rounded-full bg-accent text-accent-foreground border-0">
                {count}
              </Badge>
            )}
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} aria-label="Admin">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="hidden sm:inline-flex">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} className="hidden sm:inline-flex rounded-full" size="sm">
              Sign In
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background animate-fade-up">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-lg font-medium",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Button onClick={() => { navigate("/auth"); setOpen(false); }} className="mt-2 rounded-full">
                Sign In
              </Button>
            )}
            {user && (
              <Button variant="outline" onClick={() => { signOut(); setOpen(false); }} className="mt-2 rounded-full">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
