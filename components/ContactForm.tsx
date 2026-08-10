"use client";

import { useId, useState } from "react";
import { Button } from "./primitives";
import { site, forms } from "@/site.config";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form. Posts to a Google Apps Script Web App bound to a Sheet.
 *
 * Apps Script is used deliberately over a form SaaS: it is free, it has no
 * row cap, the data lands in a Sheet Josh already knows how to use, and it
 * adds no third-party processor to a form that collects names, emails and
 * phone numbers.
 *
 * The request is sent as `text/plain` with a JSON body ON PURPOSE. Apps Script
 * endpoints do not answer CORS preflight, so any header that would trigger one
 * (including `Content-Type: application/json`) makes the request fail in the
 * browser. text/plain is a CORS-safelisted value, so the POST goes straight
 * through; the script parses the body itself.
 *
 * Setup instructions live in docs/GOOGLE-SHEETS.md. Until the endpoint is set
 * the form stays disabled and says so, rather than silently accepting leads
 * and dropping them — which is exactly the failure the audit criticises on the
 * current live site.
 */
export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const endpoint = forms.contactEndpoint;
  const configured = Boolean(endpoint);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");
    if (!message.trim()) return setError("Please add a short message.");
    if (!configured) return setError("This form is not connected yet.");

    setStatus("sending");
    try {
      const res = await fetch(endpoint as string, {
        method: "POST",
        // text/plain avoids a CORS preflight Apps Script cannot answer.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          form: "contact",
          name,
          email,
          phone,
          message,
          page: typeof window !== "undefined" ? window.location.href : "",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
      setError(
        `Could not send. Please call Josh directly at ${site.loanOfficer.phone}.`,
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-[2px] border border-rule bg-paper p-7 md:p-9"
        role="status"
      >
        <h3 className="text-[24px]">Thanks, {name.split(" ")[0]}.</h3>
        <p className="measure mt-3 text-ink-muted">
          That came straight to Josh. He answers his own messages — usually the
          same day.
        </p>
        <a
          href={site.loanOfficer.phoneHref}
          className="tnum mt-6 inline-block text-[20px] hover:text-brick"
        >
          {site.loanOfficer.phone}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[2px] border border-rule bg-paper p-7 md:p-9"
    >
      <h3 className="text-[24px]">Send Josh a message</h3>

      <div className="mt-6 grid gap-4">
        <Field id={`${uid}-n`} label="Name" value={name} onChange={setName} autoComplete="name" required />
        <Field id={`${uid}-e`} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field id={`${uid}-p`} label="Phone (optional)" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
        <div>
          <label htmlFor={`${uid}-m`} className="block text-[13px] font-medium text-ink-muted">
            What can he help with?
          </label>
          <textarea
            id={`${uid}-m`}
            rows={4}
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full resize-y rounded-[2px] border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-[160ms] focus:border-ink"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[2px] border border-brick/40 bg-brick/5 px-4 py-3 text-[15px] text-brick-deep"
        >
          {error}
        </p>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={status === "sending" || !configured}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
        Goes to Josh directly. Never sold or shared with lead aggregators.
      </p>

      {!configured && (
        <p className="mt-5 rounded-[2px] border border-brass/40 bg-paper-sunk px-4 py-3 text-[13px] text-ink-faint">
          <strong className="font-medium text-ink-muted">Demo build.</strong> Not
          connected to a spreadsheet yet, so the button is disabled rather than
          quietly dropping messages. See <code>docs/GOOGLE-SHEETS.md</code> —
          it is a five-minute setup and one line in <code>site.config.ts</code>.
        </p>
      )}
    </form>
  );
}

function Field({
  id, label, value, onChange, type = "text", required, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; autoComplete?: string;
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
        className="mt-2 w-full rounded-[2px] border border-rule bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-[160ms] focus:border-ink"
      />
    </div>
  );
}
