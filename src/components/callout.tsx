import { cn } from "@/lib/utils"

export function Callout({
  title,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  title?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div
      data-slot="callout"
      className={cn(
        "not-prose my-[1.25em] flex gap-3 rounded-xl bg-surface p-4 text-sm text-surface-foreground inset-ring-1 inset-ring-border/64",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mt-0.5 shrink-0 text-muted-foreground [&>svg]:size-4">
          {icon}
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1">
        {title && <p className="font-medium [&_a]:link-underline">{title}</p>}
        <div className="text-surface-foreground/80 [&_a]:link-underline [&_strong]:font-medium">
          {children}
        </div>
      </div>
    </div>
  )
}
