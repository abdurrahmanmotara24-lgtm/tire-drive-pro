import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { ContactContent } from "@/lib/site-content";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "pinterest"
  | "other";

export type SocialAccount = {
  platform: SocialPlatform;
  url: string;
  /** Optional display label (used for "other" or custom text) */
  label?: string;
};

export const SOCIAL_PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
  { value: "other", label: "Other" },
];

const PLATFORM_ICONS: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Link2,
  linkedin: Linkedin,
  pinterest: Link2,
  other: Link2,
};

export function getSocialPlatformLabel(platform: SocialPlatform, customLabel?: string): string {
  if (platform === "other" && customLabel?.trim()) return customLabel.trim();
  return SOCIAL_PLATFORM_OPTIONS.find((o) => o.value === platform)?.label ?? "Link";
}

export function getSocialIcon(platform: SocialPlatform): LucideIcon {
  return PLATFORM_ICONS[platform] ?? Link2;
}

function normalizeAccount(raw: Partial<SocialAccount>): SocialAccount | null {
  const url = raw.url?.trim() ?? "";
  if (!url) return null;
  const platform = (raw.platform ?? "other") as SocialPlatform;
  const label = raw.label?.trim() || undefined;
  return { platform, url, label };
}

/** Pull legacy facebook / instagram / twitter fields into account rows. */
function legacyAccounts(contact: Partial<ContactContent>): SocialAccount[] {
  const rows: SocialAccount[] = [];
  if (contact.facebook?.trim()) rows.push({ platform: "facebook", url: contact.facebook.trim() });
  if (contact.instagram?.trim()) rows.push({ platform: "instagram", url: contact.instagram.trim() });
  if (contact.twitter?.trim()) rows.push({ platform: "twitter", url: contact.twitter.trim() });
  return rows;
}

/** Resolved list for display — prefers `social_accounts`, falls back to legacy fields. */
export function resolveSocialAccounts(contact: Partial<ContactContent> | null | undefined): SocialAccount[] {
  const fromArray = Array.isArray(contact?.social_accounts)
    ? contact!.social_accounts!.map(normalizeAccount).filter((a): a is SocialAccount => a !== null)
    : [];

  if (fromArray.length > 0) return fromArray;
  return legacyAccounts(contact ?? {});
}

/** Normalize contact for admin editing — ensures `social_accounts` is populated. */
export function contactWithSocialAccounts(contact: ContactContent): ContactContent {
  const social_accounts = resolveSocialAccounts(contact);
  return { ...contact, social_accounts };
}

/** Sync legacy URL fields from accounts (keeps older data paths working). */
export function syncLegacySocialFields(contact: ContactContent): ContactContent {
  const accounts = resolveSocialAccounts(contact);
  const pick = (platform: SocialPlatform) =>
    accounts.find((a) => a.platform === platform)?.url.trim() ?? "";

  return {
    ...contact,
    social_accounts: accounts,
    facebook: pick("facebook"),
    instagram: pick("instagram"),
    twitter: pick("twitter"),
  };
}

export type ResolvedSocialLink = SocialAccount & { icon: LucideIcon; displayLabel: string };

export function toSocialLinks(contact: Partial<ContactContent> | null | undefined): ResolvedSocialLink[] {
  return resolveSocialAccounts(contact).map((account) => ({
    ...account,
    icon: getSocialIcon(account.platform),
    displayLabel: getSocialPlatformLabel(account.platform, account.label),
  }));
}
