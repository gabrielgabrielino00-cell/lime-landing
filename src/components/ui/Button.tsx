import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  glow?: boolean;
};

export default function Button({
  variant = "primary",
  glow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
        variant === "primary" &&
          "bg-accent font-semibold text-bg-primary hover:bg-accent-soft hover:shadow-[0_0_24px_var(--glow)]",
        variant === "ghost" &&
          "border border-white/[0.1] bg-white/[0.02] text-text-primary hover:border-accent-border/50 hover:bg-white/[0.04]",
        glow && "glow-cta",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}