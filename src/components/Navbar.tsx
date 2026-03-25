import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Menu, X, ShieldCheck, ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Our Team", path: "/team" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-heading text-xl font-bold tracking-wider text-foreground">
          🍽️ FoodServe
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center border border-border rounded-full px-3 py-1.5">
            <input
              type="text"
              placeholder="Search Here..."
              className="bg-transparent text-sm outline-none w-32 placeholder:text-muted-foreground"
            />
            <Search className="w-4 h-4 text-primary" />
          </div>
          <Link
            to="/order-confirmation"
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Order Status"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
          <Link
            to="/admin"
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Admin Panel"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
          <Link
            to="/signin"
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/signin"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-primary"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
