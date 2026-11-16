import type { ComponentProps } from "react";

// Thin-stroke line icons sized by font-size (1em) so they track adjacent text.
function Icon({ children, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </Icon>
  );
}

export function UserIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </Icon>
  );
}

export function BagIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <path d="M4.5 8h15l-1 13h-13z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </Icon>
  );
}

export function MenuIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </Icon>
  );
}

export function CloseIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </Icon>
  );
}

export function ArrowRightIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <path d="M3 12h17m-6-6 6 6-6 6" />
    </Icon>
  );
}

export function PlusIcon(props: ComponentProps<"svg">) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}
