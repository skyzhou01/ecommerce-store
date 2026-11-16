import type { ReactNode } from "react";

import { PlusIcon } from "@/components/storefront/icons";

/** Native <details> disclosure with hairline separators and a +/× toggle. */
export function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 eyebrow [&::-webkit-details-marker]:hidden">
        {title}
        <PlusIcon className="text-base transition-transform duration-(--duration-base) ease-luxe group-open:rotate-45" />
      </summary>
      <div className="pb-6 text-body text-muted">{children}</div>
    </details>
  );
}
