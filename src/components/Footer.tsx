import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-3">🍽️ FoodServe</h3>
          <p className="text-sm text-muted-foreground">
            You'll wonder how you ever lived without us.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Open Hours */}
        <div>
          <h4 className="font-heading text-lg font-bold text-foreground mb-3 italic">Open Hours</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4 text-primary" />
            Mon-Thurs: 9am – 10pm
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            Fri-Sun: 11am – 10pm
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-heading text-lg font-bold text-foreground mb-3 italic">Links</h4>
          <div className="flex flex-col gap-2">
            {["Home", "About", "Our Team"].map((link) => (
              <Link key={link} to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-heading text-lg font-bold text-foreground mb-3 italic">Company</h4>
          <div className="flex flex-col gap-2">
            {["Terms & Conditions", "Privacy Policy", "Cookie Policy"].map((link) => (
              <Link key={link} to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © 2025 FoodServe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
