import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-tny py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-primary-foreground">Tires Near You</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
              Premium tires, expert fitment, unbeatable service.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">Quick Links</h4>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link to="/" className="text-primary-foreground/80 transition-colors hover:text-brand-red">Home</Link></li>
              <li><Link to="/about" className="text-primary-foreground/80 transition-colors hover:text-brand-red">About</Link></li>
              <li><Link to="/locations" className="text-primary-foreground/80 transition-colors hover:text-brand-red">Locations</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/80 transition-colors hover:text-brand-red">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">Services</h4>
            <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/80">
              <li>New Tire Sales</li>
              <li>Wheel Alignment</li>
              <li>Wheel Balancing</li>
              <li>Puncture Repair</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">Get in Touch</h4>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/85">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><span>+1 (000) 000-0000</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><span>hello@tiresnearyou.com</span></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span>123 Main Street, City</span></li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /><span>Mon&ndash;Sat 8:00&ndash;18:00</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/15 pt-4 text-center text-xs text-primary-foreground/65">
          © {new Date().getFullYear()} Tires Near You. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
