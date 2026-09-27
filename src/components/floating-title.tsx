import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FloatingTitle({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <header className="relative rounded-title bg-surface p-6 shadow-float">
      <div
        className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <h1 className="pr-14 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {title}
      </h1>
      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">
        {subtitle}
      </p>
    </header>
  );
}

export function Surface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card bg-surface p-5 shadow-card", className)}>
      {children}
    </div>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6 pb-12">
      {children}
    </div>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted">{children}</p>;
}
