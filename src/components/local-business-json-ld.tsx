import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { buildLocalBusinessSchema } from "@/lib/local-business-schema";
import { resolvePublicStore } from "@/lib/store";
import { DEFAULTS, fetchContent, fetchLocations } from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";

type Props = { siteUrl?: string };

export function LocalBusinessJsonLd({ siteUrl }: Props) {
  const cmsReady = usePublicContentReady();
  const { contact } = useContactContent();
  const { data: seo = DEFAULTS.seo } = useQuery({
    queryKey: ["content", "seo"],
    queryFn: () => fetchContent("seo"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.seo,
  });
  const { data: stores = [] } = useQuery({
    queryKey: ["locations", "public"],
    queryFn: () => fetchLocations(false),
    enabled: cmsReady,
  });

  const origin =
    siteUrl ??
    (typeof window !== "undefined" ? window.location.origin : "");

  const store = useMemo(() => resolvePublicStore(stores, contact), [stores, contact]);

  const schema = useMemo(
    () =>
      origin
        ? buildLocalBusinessSchema({
            siteUrl: origin,
            contact,
            store,
            description: seo.description,
            image: seo.og_image,
          })
        : null,
    [origin, contact, store, seo.description, seo.og_image],
  );

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
