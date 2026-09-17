import { cn } from "@/lib/utils"

type ChipColor = "default" | "accent" | "success" | "danger"
type ChipSize = "sm" | "md" | "lg"
type ChipVariant = "primary" | "secondary" | "tertiary" | "soft" | "dot"

const sizeClasses: Record<ChipSize, { base: string; content: string }> = {
  sm: { base: "h-6 px-1 text-xs", content: "px-1" },
  md: { base: "h-7 px-1 text-sm", content: "px-2" },
  lg: { base: "h-8 px-2 text-base", content: "px-2" },
}

const variantClasses: Record<ChipVariant, Record<ChipColor, string>> = {
  primary: {
    default: "bg-primary text-primary-foreground",
    accent: "bg-info text-white",
    success: "bg-success text-white",
    danger: "bg-destructive text-white",
  },
  secondary: {
    default: "bg-muted text-foreground",
    accent: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
    danger: "bg-destructive/15 text-destructive",
  },
  tertiary: {
    default: "border border-border bg-transparent text-foreground",
    accent: "border border-info/40 bg-transparent text-info",
    success: "border border-success/40 bg-transparent text-success",
    danger: "border border-destructive/40 bg-transparent text-destructive",
  },
  soft: {
    default: "bg-surface-warm text-muted-foreground",
    accent: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    danger: "bg-destructive/10 text-destructive",
  },
  dot: {
    default: "border border-border bg-background text-foreground",
    accent: "border border-border bg-background text-foreground",
    success: "border border-border bg-background text-foreground",
    danger: "border border-border bg-background text-foreground",
  },
}

const dotClasses: Record<ChipColor, string> = {
  default: "bg-muted-foreground",
  accent: "bg-info",
  success: "bg-success",
  danger: "bg-destructive",
}

export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: ChipColor
  size?: ChipSize
  variant?: ChipVariant
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

/**
 * A small labelled pill. `dot` puts a colour marker before the label;
 * `startContent` replaces it with anything, such as a swatch.
 */
export function Chip({
  children,
  className,
  color = "default",
  size = "md",
  variant = "secondary",
  startContent,
  endContent,
  ...props
}: ChipProps) {
  const hasStart = Boolean(startContent) || variant === "dot"
  const hasEnd = Boolean(endContent)

  return (
    <span
      className={cn(
        "relative box-border inline-flex max-w-fit min-w-min items-center justify-between rounded-full font-normal whitespace-nowrap transition-colors",
        sizeClasses[size].base,
        variantClasses[variant][color],
        className
      )}
      data-slot="chip"
      {...props}
    >
      {variant === "dot" && !startContent ? (
        <span
          className={cn("ml-1 size-2 rounded-full", dotClasses[color])}
          data-slot="chip-dot"
        />
      ) : (
        startContent
      )}
      <span
        className={cn(
          "flex-1 text-inherit",
          sizeClasses[size].content,
          hasStart && (size === "sm" ? "pl-0.5" : "pl-1"),
          hasEnd && (size === "sm" ? "pr-0.5" : "pr-1")
        )}
        data-slot="chip-label"
      >
        {children}
      </span>
      {endContent}
    </span>
  )
}
