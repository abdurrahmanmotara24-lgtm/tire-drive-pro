import {
  Wrench,
  Gauge,
  ShieldCheck,
  Truck,
  Phone,
  Target,
  Heart,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Wrench,
  Gauge,
  ShieldCheck,
  Truck,
  Phone,
  Target,
  Heart,
  Users,
  Award,
};

export function getIcon(name: string): LucideIcon {
  return MAP[name] ?? Wrench;
}
