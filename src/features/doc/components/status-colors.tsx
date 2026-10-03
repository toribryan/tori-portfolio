"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react"

import { BeforeAfterToggle } from "./before-after-toggle"
import { Plate } from "./fibo-blocks"

/*
 * The old palette's reds, written out because they no longer exist as
 * tokens. Each one was a reasonable pick for an error, and nothing said which.
 */
const OLD_REDS = [
  { name: "red/cherry", hex: "#D2042D" },
  { name: "red/ruby", hex: "#E0115F" },
  { name: "red/brick", hex: "#B22222" },
  { name: "red/scarlet", hex: "#FF2400" },
  { name: "red/coral", hex: "#F05454" },
]
const red = (name: string) => OLD_REDS.find((r) => r.name === name)!.hex

type Paint = {
  /** What the token is called, shown beside the part it colors. */
  token: string
  /** The color itself: an old hex, or one of the site's status tokens. */
  style: CSSProperties
}

const before = {
  border: { token: "red/scarlet", style: { borderColor: red("red/scarlet") } },
  message: { token: "red/cherry", style: { color: red("red/cherry") } },
  badge: {
    token: "red/coral",
    style: {
      color: red("red/coral"),
      backgroundColor: `color-mix(in oklch, ${red("red/coral")} 14%, transparent)`,
    },
  },
  alert: {
    token: "red/ruby",
    style: {
      color: red("red/ruby"),
      borderColor: red("red/ruby"),
      backgroundColor: `color-mix(in oklch, ${red("red/ruby")} 8%, transparent)`,
    },
  },
  button: {
    token: "red/brick",
    style: { backgroundColor: red("red/brick"), color: "white" },
  },
} satisfies Record<string, Paint>

const after = {
  border: {
    token: "status-danger",
    style: { borderColor: "var(--color-destructive)" },
  },
  message: {
    token: "status-danger",
    style: { color: "var(--color-destructive)" },
  },
  badge: {
    token: "status-danger-subtle",
    style: {
      color: "var(--color-destructive)",
      backgroundColor: "var(--color-destructive-subtle)",
    },
  },
  alert: {
    token: "status-danger-subtle",
    style: {
      color: "var(--color-destructive)",
      borderColor: "var(--color-destructive)",
      backgroundColor: "var(--color-destructive-subtle)",
    },
  },
  button: {
    token: "status-danger",
    style: {
      backgroundColor: "var(--color-destructive)",
      color: "var(--color-destructive-foreground)",
    },
  },
} satisfies Record<keyof typeof before, Paint>

function Token({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] leading-4 text-muted-foreground">
      {children}
    </span>
  )
}

/** One place an error shows up in the product, labeled with its token. */
function Spot({
  label,
  tokens,
  children,
}: {
  label: string
  tokens: string[]
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-line bg-background p-3">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex min-h-16 items-center">{children}</div>
      <div className="flex flex-wrap gap-x-3">
        {tokens.map((token, i) => (
          <Token key={i}>{token}</Token>
        ))}
      </div>
    </div>
  )
}

/**
 * The same four error states under the old palette and under status roles.
 * Before, each one was colored by whoever built it with whichever red looked
 * right; after, they all ask for danger.
 */
export function StatusColors() {
  const [isAfter, setAfter] = useState(false)
  const paint = isAfter ? after : before
  return (
    <Plate
      background="none"
      meta={
        <BeforeAfterToggle
          label="Status colors"
          isAfter={isAfter}
          onChange={setAfter}
        />
      }
      caption={
        isAfter
          ? "After: every error asks for danger. The role picks the red, so the field, the badge, the alert and the button match without anyone choosing."
          : "Before: five reds and no rule for which one an error gets. Each part was colored with whichever red its builder picked, so one screen showed four of them."
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {isAfter ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="size-4 rounded-sm bg-destructive" />
                <Token>status-danger</Token>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-4 rounded-sm border border-line bg-destructive-subtle" />
                <Token>status-danger-subtle</Token>
              </span>
            </>
          ) : (
            OLD_REDS.map(({ name, hex }) => (
              <span key={name} className="flex items-center gap-1.5">
                <span
                  className="size-4 rounded-sm"
                  style={{ backgroundColor: hex }}
                />
                <Token>{name}</Token>
              </span>
            ))
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Spot
            label="Field with an error"
            tokens={[
              `border ${paint.border.token}`,
              `message ${paint.message.token}`,
            ]}
          >
            <div className="flex w-full flex-col gap-1">
              <span
                className="flex h-8 items-center rounded-md border bg-background px-2.5 text-sm text-foreground"
                style={paint.border.style}
              >
                ana@
              </span>
              <span
                className="flex items-center gap-1 text-xs"
                style={paint.message.style}
              >
                <CircleAlertIcon aria-hidden className="size-3.5" />
                Enter a full email address.
              </span>
            </div>
          </Spot>

          <Spot label="Status badge" tokens={[paint.badge.token]}>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={paint.badge.style}
            >
              Failed
            </span>
          </Spot>

          <Spot label="Alert" tokens={[paint.alert.token]}>
            <span
              className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-xs"
              style={paint.alert.style}
            >
              <TriangleAlertIcon aria-hidden className="size-3.5 shrink-0" />3
              sessions couldn&apos;t be uploaded.
            </span>
          </Spot>

          <Spot label="Destructive action" tokens={[paint.button.token]}>
            <span
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={paint.button.style}
            >
              Delete exam
            </span>
          </Spot>
        </div>
      </div>
    </Plate>
  )
}
