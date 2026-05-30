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
  Tag,
  Snowflake,
  Disc2,
  type LucideIcon,
} from "lucide-react";
import { BrakePad } from "@/components/icons/brake-pad-icon";
import { resolveServiceIcon, type ServiceItem } from "@/lib/site-content";

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
  Tag,
  Snowflake,
  BrakePad,
  Disc2,
};

const ALIASES: Record<string, keyof typeof MAP> = {
  "brake pad": "BrakePad",
  "brake pads": "BrakePad",
  "brakepad": "BrakePad",
  "brake pads & discs": "BrakePad",
  "brake pads and discs": "BrakePad",
};

export function getIcon(name: string): LucideIcon {
  const trimmed = name.trim();
  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias) return MAP[alias];
  if (MAP[trimmed]) return MAP[trimmed];
  const match = Object.keys(MAP).find((k) => k.toLowerCase() === trimmed.toLowerCase());
  return match ? MAP[match] : Wrench;
}

export function getServiceIcon(service: ServiceItem): LucideIcon {
  return getIcon(resolveServiceIcon(service).icon);
}
