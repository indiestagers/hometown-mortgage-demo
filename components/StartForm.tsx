"use client";

import { useId, useState } from "react";
import { Button } from "./primitives";
import { site } from "@/site.config";

type Stage = "goal" | "timing" | "contact" | "done";

const GOALS = [
  { id: "buy-first", label: "Buying my first home" },
  { id: "buy-next", label: "Buying my next home" },
  { id: "refi", label: "Refinancing" },
  { id: "explore", label: "Just figuring out my options" },
] as const;

const TIMING = [
  { id: "now", label: "Under contract / making offers" },
  { id: "3mo", label: "Within 3 months" },
  { id: "6mo", label: "3–6 months out" },
  { id: "unsure", label: "Not sure yet" },
] as const;

/**
 * Three questions before the ask. The live site offers only a full off-site
 * 1003 application, so every not-yet-ready visitor is lost entirely.
 *
 * DEMO: submission is local-only. Wire `onSubmit` to a real CRM/ESP endpoint
 * before launch — do not ship a form that silently drops leads.
 */
export function StartForm() {
  const uid = useId();
  const [stage, setStage] = useState<Stage>("goal");
  const [goal, setGoal] = useState<string | null>(null);
  const [timing, setTiming] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = { goal: 1, timing: 2, contact: 3, done: 3 }[stage];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");

    setSubmitting(true);
    try {
      // DEMO ONLY — replace with a real submission endpoint.
      const payload = { goal, timing, name, email, phone };
      console.info("[demo] lead captured (not transmitted):", payload);
      await new Promise((r) => setTimeout(r, 600));
      setStage("done");
    } catch {
      setError(
        `Something went wrong. Please call Josh directly at ${site.loanOfficer.phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "done") {
    return (
      <div
        className="rounded-[2px] border border-rule bg-paper p-8 md:p-10"
        role="status"
      >
        <h3 className="text-[30px]">Got it, {name.split(" ")[0]}.</h3>
        <p className="measure mt-3 text-ink-muted">
          Josh will call you personally — usually same day, always within one
          business day. Not a call center, not an automated drip.
        </p>
        <p className="mt-6 text-[14px] text-ink-faint">
          Need him sooner?{" "}
          <a
            href={site.loanOfficer.phoneHref}
            className="text-brick underline underline-offset-4"
          >
            {site.loanOfficer.phone}
          </a>
        </p>
        <p className="mt-8 rounded-[2px] border border-brass/40 bg-paper-sunk px-4 py-3 text-[12px] text-ink-faint">
          Demo note: this form is not yet connected to a CRM. Wire it up before
          launch.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2px] border border-rule bg-paper p-7 md:p-9">
      <div className="mb-7 flex items-center gap-3">
        <span className="tnum text-[12px] text-ink-faint">
          {stepIndex}/3
        </span>
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-px flex-1 ${i <= stepIndex ? "bg-brick" : "bg-rule"}`}
            />
          ))}
        </div>
      </div>

      {stage === "goal" && (
        <Choice
          legend="What are you working on?"
          name={`${uid}-goal`}
          options={GOALS}
          onPick={(id) => {
            setGoal(id);
            setStage("timing");
          }}
        />
      )}

      {stage === "timing" && (
        <>
          <Choice
            legend="What's your timeline?"
            name={`${uid}-timing`}
            options={TIMING}
            onPick={(id) => {
              setTiming(id);
              setStage("contact");
            }}
          />
          <BackButton onClick={() => setStage("goal")} />
        </>
      )}

      {stage === "contact" && (
        <form onSubmit={handleSubmit} noValidate>
          <h3 className="text-[26px]">Where should Josh reach you?</h3>
          <p className="mt-2 text-[14px] text-ink-muted">
            No credit pull, no application. Just a conversation.
          </p>

          <div className="mt-6 grid gap-4">
            <Field
              id={`${uid}-name`}
              label="Name"
              value={name}
              onChange={setName}
              autoComplete="name"
              required
            />
            <Field
              id={`${uid}-email`}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <Field
              id={`${uid}-phone`}
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={setPhone}
              autoComplete="tel"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-[2px] border border-brick/40 bg-brick/5 px-4 py-3 text-[14px] text-brick-deep"
            >
              {error}
            </p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send to Josh"}
          </Button>

          <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
            Your information goes to Josh directly. It is never sold or shared
            with lead aggregators.
          </p>

          <BackButton onClick={() => setStage("timing")} />
        </form>
      )}
    </div>
  );
}

function Choice({
  legend,
  name,
  options,
  onPick,
}: {
  legend: string;
  name: string;
  options: readonly { id: string; label: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-5 font-display text-[26px] leading-tight">
        {legend}
      </legend>
      <div className="grid gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            name={name}
            onClick={() => onPick(o.id)}
            className="group flex items-center justify-between rounded-[2px] border border-rule px-5 py-4 text-left text-[15px] transition-colors duration-[160ms] hover:border-ink hover:bg-paper-sunk"
          >
            {o.label}
            <span
              aria-hidden="true"
              className="text-ink-faint transition-colors group-hover:text-brick"
            >
              →
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-[2px] border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-[160ms] focus:border-ink"
      />
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 text-[13px] text-ink-faint underline underline-offset-4 hover:text-ink"
    >
      ← Back
    </button>
  );
}
