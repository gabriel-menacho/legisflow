import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  disabled,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const styles =
    variant === "primary"
      ? "bg-primary-container text-on-primary-container hover:bg-primary"
      : "border border-primary-container text-primary-container hover:bg-primary-container/10";

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
