import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-extrabold text-primary-foreground">Tires Near You</h3>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Premium tires, expert fitment, and unbeatable service. Your trusted local tire centre.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-red">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-red">About</Link></li>
              <li><Link to="/locations" className="hover:text-brand-red">Locations</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/90">
              <li>New Tire Sales</li>
              <li>Wheel Alignment</li>
              <li>Wheel Balancing</li>
              <li>Puncture Repair</li>
              <li>Tire Rotation</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary-foreground">Get in Touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4" /> +1 (000) 000-0000</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4" /> hello@tiresnearyou.com</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> 123 Main Street, City</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4" /> Mon–Sat 8:00–18:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} Tires Near You. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
