import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent } from "@/lib/site-content";

type Props = {
  title?: string;
  description?: string;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function SeoMeta({ title, description }: Props) {
  const { data: seo = DEFAULTS.seo } = useQuery({
    queryKey: ["content", "seo"],
    queryFn: () => fetchContent("seo"),
    placeholderData: DEFAULTS.seo,
    staleTime: 60_000,
  });

  const pageTitle = title ?? seo.title;
  const pageDescription = description ?? seo.description;

  useEffect(() => {
    document.title = pageTitle;
    setMeta("name", "description", pageDescription);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", pageDescription);
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", pageDescription);
    if (seo.og_image) {
      setMeta("property", "og:image", seo.og_image);
      setMeta("name", "twitter:image", seo.og_image);
    }
  }, [pageTitle, pageDescription, seo.og_image]);

  return null;
}
