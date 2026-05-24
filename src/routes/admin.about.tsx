import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContent, saveContent, DEFAULTS, type AboutContent, type ProcessStep } from "@/lib/site-content";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSaveBar } from "@/components/admin/admin-save-bar";
import { useDirtyGuard, useSaveShortcut } from "@/hooks/use-admin-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/about")({ component: AboutAdmin });

type Tab = "about" | "process";

function AboutAdmin() {
  const qc = useQueryClient();
  const { data: aboutData } = useQuery({ queryKey: ["content", "about"], queryFn: () => fetchContent("about") });
  const { data: processData } = useQuery({ queryKey: ["content", "process"], queryFn: () => fetchContent("process") });
  const [about, setAbout] = useState<AboutContent>(DEFAULTS.about);
  const [process, setProcess] = useState<ProcessStep[]>(DEFAULTS.process);
  const [tab, setTab] = useState<Tab>("about");
  const [busy, setBusy] = useState(false);
  const baselineRef = useRef("");

  useEffect(() => {
    if (aboutData && processData && !baselineRef.current) {
      setAbout(aboutData);
      setProcess(processData);
      baselineRef.current = JSON.stringify({ about: aboutData, process: processData });
    }
  }, [aboutData, processData]);

  const isDirty = baselineRef.current !== "" && JSON.stringify({ about, process }) !== baselineRef.current;

  const submit = useCallback(async () => {
    setBusy(true);
    try {
      await saveContent("about", about);
      await saveContent("process", process);
      baselineRef.current = JSON.stringify({ about, process });
      await qc.invalidateQueries({ queryKey: ["content"] });
      toast.success("Saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [about, process, qc]);

  useDirtyGuard(isDirty);
  useSaveShortcut(() => void submit(), isDirty && !busy);

  const bulletsText = about.story_bullets.join("\n");

  return (
    <div>
      <h1 className="text-2xl font-bold">About & Process</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        About page copy, values, and homepage process steps. Upload story photos under Site Images.
      </p>

      <div className="mt-6 flex gap-2 border-b border-border">
        {(["about", "process"] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-semibold capitalize transition-colors",
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="mt-4 space-y-4 p-6">
        {tab === "about" && (
          <>
            <div>
              <Label>Page headline</Label>
              <Input value={about.headline} onChange={(e) => setAbout({ ...about, headline: e.target.value })} />
            </div>
            <div>
              <Label>Intro (subtitle under headline)</Label>
              <Textarea
                rows={2}
                value={about.intro}
                onChange={(e) => setAbout({ ...about, intro: e.target.value })}
              />
            </div>
            <div>
              <Label>Story paragraph</Label>
              <Textarea rows={5} value={about.story} onChange={(e) => setAbout({ ...about, story: e.target.value })} />
            </div>
            <div>
              <Label>Story bullets (one per line)</Label>
              <Textarea
                rows={4}
                value={bulletsText}
                placeholder={"Passenger, truck, and mag wheels\nLaser alignment on every job"}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    story_bullets: e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <p className="text-sm font-medium">Values</p>
            {about.values.map((v, i) => (
              <div key={i} className="space-y-2 rounded-md border border-border p-4">
                <Input
                  placeholder="Title"
                  value={v.title}
                  onChange={(e) => {
                    const values = [...about.values];
                    values[i] = { ...v, title: e.target.value };
                    setAbout({ ...about, values });
                  }}
                />
                <Textarea
                  rows={2}
                  placeholder="Description"
                  value={v.text}
                  onChange={(e) => {
                    const values = [...about.values];
                    values[i] = { ...v, text: e.target.value };
                    setAbout({ ...about, values });
                  }}
                />
              </div>
            ))}
          </>
        )}

        {tab === "process" && (
          <>
            <p className="text-sm text-muted-foreground">
              Shown on the homepage and About page. Keep four steps for the timeline layout.
            </p>
            {process.map((s, i) => (
              <div key={i} className="space-y-2 rounded-md border border-border p-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs">Step number</Label>
                    <Input
                      value={s.step}
                      onChange={(e) => {
                        const next = [...process];
                        next[i] = { ...s, step: e.target.value };
                        setProcess(next);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={s.title}
                      onChange={(e) => {
                        const next = [...process];
                        next[i] = { ...s, title: e.target.value };
                        setProcess(next);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    rows={2}
                    value={s.desc}
                    onChange={(e) => {
                      const next = [...process];
                      next[i] = { ...s, desc: e.target.value };
                      setProcess(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
      </Card>
    </div>
  );
}
