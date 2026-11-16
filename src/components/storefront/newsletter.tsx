"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

// TODO: wire to a real subscription endpoint; this only acknowledges locally.
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p role="status" className="text-body">
        Thank you. You&rsquo;ll hear from us soon.
      </p>
    );
  }

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="min-h-12 flex-1 border border-line-strong bg-paper px-4 text-body placeholder:text-subtle focus-visible:outline-offset-0"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
