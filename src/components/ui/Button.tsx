// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-soft disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-dusty-rose text-pearl-white hover:bg-opacity-90 shadow-subtle hover:shadow-md active:scale-97",
    secondary:
      "bg-mint-soft text-taupe hover:bg-opacity-90 shadow-subtle hover:shadow-md",
    ghost: "text-taupe hover:bg-warm-ivory/50",
    outline: "bg-transparent border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
