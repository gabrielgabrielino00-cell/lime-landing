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
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-transform duration-200 hover:scale-[1.02]",
        variant === "primary" &&
          "bg-accent font-semibold text-bg-primary hover:bg-accent-soft",
        variant === "ghost" &&
          "border border-bg-surface bg-transparent text-text-primary hover:border-accent/40",
        glow && "glow-cta",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}