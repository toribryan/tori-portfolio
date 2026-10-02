import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"

export function IntroItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-4 font-mono text-sm", className)}
      {...props}
    />
  )
}

export function IntroItemContent({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-balance", className)} {...props} />
}

export function IntroItemLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn("link", className)}
      target="_blank"
      rel="noopener"
      {...props}
    />
  )
}

/**
 * The shared icon tile, restyled to match the outline icon buttons of the
 * social links right above the overview.
 */
export function IntroItemIcon({
  className,
  ...props
}: React.ComponentProps<typeof IconTile>) {
  return (
    <IconTile
      className={cn(
        "size-8 rounded-[min(var(--radius-lg),10px)] border-border bg-popover text-foreground/80 ring-0 ring-offset-0",
        "dark:border-input dark:bg-input/30 dark:ring-0",
        "[&_svg:not([class*='size-'])]:size-4.5",
        className
      )}
      {...props}
    />
  )
}
