import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";

type Props = { callHref?: string; hours?: string };

export function FinalCta({ callHref, hours }: Props) {
  return (
    <section id="final-cta" className="bg-accent-gradient py-14">
      <div className="container-tny flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">Need tires today?</h2>
          <p className="mt-2 text-primary-foreground/85">
            {hours ? `${hours} · ` : ""}
            Call or visit your nearest branch.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {callHref && (
            <a
              href={callHref}
              className="hover-btn-primary hover-icon-bump inline-flex items-center gap-2 rounded-sm bg-background px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary"
            >
              <Phone className="icon-bump h-4 w-4" /> Call now
            </a>
          )}
          <Link
            to="/locations"
            className="hover-btn-outline hover-icon-bump inline-flex items-center gap-2 rounded-sm border border-primary-foreground/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            Find a branch <ArrowRight className="icon-bump h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
