import { createFileRoute } from "@tanstack/react-router";

type LeadPayload = {
  type: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  vehicle?: string | null;
  tire_size?: string | null;
  message?: string | null;
};

export const Route = createFileRoute("/api/notify-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: LeadPayload & { notifyEmail?: string };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
        }

        const to = body.notifyEmail?.trim() || process.env.LEAD_NOTIFY_EMAIL?.trim();
        const resendKey = process.env.RESEND_API_KEY?.trim();

        if (!to) {
          return new Response(JSON.stringify({ ok: true, skipped: "no_recipient" }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!resendKey) {
          console.info("[notify-lead] LEAD_NOTIFY_EMAIL set but RESEND_API_KEY missing — configure Resend to send emails.");
          return new Response(JSON.stringify({ ok: true, skipped: "no_resend_key" }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const subject = body.type === "quote" ? `New quote: ${body.name}` : `New message: ${body.name}`;
        const lines = [
          `Type: ${body.type}`,
          `Name: ${body.name}`,
          body.phone && `Phone: ${body.phone}`,
          body.email && `Email: ${body.email}`,
          body.vehicle && `Vehicle: ${body.vehicle}`,
          body.tire_size && `Tire size: ${body.tire_size}`,
          body.message && `Message: ${body.message}`,
        ].filter(Boolean);

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM ?? "Tires Near You <onboarding@resend.dev>",
            to: [to],
            subject,
            text: lines.join("\n"),
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error("[notify-lead]", err);
          return new Response(JSON.stringify({ ok: false, error: "send_failed" }), { status: 502 });
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
