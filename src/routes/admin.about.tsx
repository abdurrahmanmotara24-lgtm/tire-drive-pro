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
import { toast } from "sonner";

export const Route = createFileRoute("/admin/about")({ component: AboutAdmin });

function AboutAdmin() {
  const qc = useQueryClient();
  const { data: aboutData } = useQuery({ queryKey: ["content", "about"], queryFn: () => fetchContent("about") });
  const { data: processData } = useQuery({ queryKey: ["content", "process"], queryFn: () => fetchContent("process") });
  const [about, setAbout] = useState<AboutContent>(DEFAULTS.about);
  const [process, setProcess] = useState<ProcessStep[]>(DEFAULTS.process);
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

  return (
    <div>
      <h1 className="text-2xl font-bold">About & Process</h1>
      <Card className="mt-6 space-y-4 p-6">
        <div>
          <Label>Headline</Label>
          <Input value={about.headline} onChange={(e) => setAbout({ ...about, headline: e.target.value })} />
        </div>
        <div>
          <Label>Intro</Label>
          <Input value={about.intro} onChange={(e) => setAbout({ ...about, intro: e.target.value })} />
        </div>
        <div>
          <Label>Story</Label>
          <Textarea rows={5} value={about.story} onChange={(e) => setAbout({ ...about, story: e.target.value })} />
        </div>
        <p className="text-sm font-medium">Values</p>
        {about.values.map((v, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Title"
              value={v.title}
              onChange={(e) => {
                const values = [...about.values];
                values[i] = { ...v, title: e.target.value };
                setAbout({ ...about, values });
              }}
            />
            <Input
              placeholder="Text"
              value={v.text}
              onChange={(e) => {
                const values = [...about.values];
                values[i] = { ...v, text: e.target.value };
                setAbout({ ...about, values });
              }}
            />
          </div>
        ))}
        <p className="pt-4 text-sm font-medium">Process steps</p>
        {process.map((s, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-3">
            <Input
              placeholder="Step"
              value={s.step}
              onChange={(e) => {
                const next = [...process];
                next[i] = { ...s, step: e.target.value };
                setProcess(next);
              }}
            />
            <Input
              placeholder="Title"
              value={s.title}
              onChange={(e) => {
                const next = [...process];
                next[i] = { ...s, title: e.target.value };
                setProcess(next);
              }}
            />
            <Input
              placeholder="Description"
              value={s.desc}
              onChange={(e) => {
                const next = [...process];
                next[i] = { ...s, desc: e.target.value };
                setProcess(next);
              }}
            />
          </div>
        ))}
        <AdminSaveBar busy={busy} isDirty={isDirty} onSave={submit} />
      </Card>
    </div>
  );
}
