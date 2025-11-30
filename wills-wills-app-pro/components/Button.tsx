import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
};

export default function Button({ href, children, variant = "solid" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium transition-all";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:opacity-90 shadow-sm"
      : "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
