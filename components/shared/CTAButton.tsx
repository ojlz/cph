import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export default function CTAButton({
  href,
  variant = "primary",
  children,
  className,
  external,
  ...props
}: CTAButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-10 py-5 text-base font-medium transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
    outline:
      "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
    ghost: "text-muted-foreground hover:text-foreground",
  };

  const classes = cn(base, variants[variant], className);

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
