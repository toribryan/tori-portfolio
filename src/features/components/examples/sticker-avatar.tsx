"use client"

import { Badge } from "@/components/fibo/badge"
import {
  StickerAvatar,
  StickerAvatarCount,
  StickerAvatarGroup,
  type StickerAvatarStatus,
} from "@/components/fibo/sticker-avatar"

import { BONZO, STATUS_NAMES, useRabbit } from "./sticker-avatar-data"

export function Default() {
  return <StickerAvatar name="Bonzo" src={BONZO} size={96} status="present" />
}

export function Sizes() {
  const rabbit = useRabbit()
  return (
    <div className="flex items-end gap-8">
      {[24, 32, 40, 64, 96].map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <StickerAvatar
            name={`fibo at ${size}`}
            src={rabbit}
            pixelated
            size={size}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  )
}

const STATUSES: StickerAvatarStatus[] = ["present", "away", "offline"]

export function Statuses() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {STATUSES.map((status) => (
        <div key={status} className="flex flex-col items-center gap-4">
          <StickerAvatar name="Bonzo" src={BONZO} size={64} status={status} />
          {/* The sticker already says its status to screen readers. */}
          <Badge variant="outline" aria-hidden="true">
            {STATUS_NAMES[status]}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export function Shapes() {
  const rabbit = useRabbit()
  return (
    <div className="flex items-center gap-8">
      <StickerAvatar name="fibo" src={rabbit} pixelated size={72} />
      <StickerAvatar name="Bonzo" src={BONZO} size={72} />
      <StickerAvatar name="Tori Bryan" size={72} />
    </div>
  )
}

export function DirectMessages() {
  const rabbit = useRabbit()
  const people: {
    name: string
    src?: string
    pixelated?: boolean
    status: StickerAvatarStatus
  }[] = [
    { name: "Bonzo", src: BONZO, status: "away" },
    { name: "fibo", src: rabbit, pixelated: true, status: "present" },
    { name: "Ana Ruiz", status: "offline" },
    { name: "Kofi Mensah", status: "present" },
  ]
  return (
    <nav
      aria-label="Direct messages"
      className="flex w-72 flex-col gap-0.5 rounded-xl border border-line bg-background p-2"
    >
      {people.map((person) => (
        // group/sticker lifts the sticker when the whole row is hovered.
        <button
          key={person.name}
          type="button"
          className="group/sticker flex items-center gap-3.5 rounded-md px-2.5 py-2 text-left text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring-subtle"
        >
          <StickerAvatar
            aria-hidden="true"
            name={person.name}
            src={person.src}
            pixelated={person.pixelated}
            size={32}
            status={person.status}
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-medium">{person.name}</span>
            <span className="text-xs">{STATUS_NAMES[person.status]}</span>
          </span>
        </button>
      ))}
    </nav>
  )
}

export function Group() {
  const rabbit = useRabbit()
  return (
    <StickerAvatarGroup aria-label="In this party: fibo, Bonzo, Ana Ruiz, Kofi Mensah and 3 others">
      <StickerAvatar
        aria-hidden="true"
        name="fibo"
        src={rabbit}
        pixelated
        size={56}
      />
      <StickerAvatar aria-hidden="true" name="Bonzo" src={BONZO} size={56} />
      <StickerAvatar aria-hidden="true" name="Ana Ruiz" size={56} />
      <StickerAvatar aria-hidden="true" name="Kofi Mensah" size={56} />
      <StickerAvatarCount aria-hidden="true" count={3} size={56} />
    </StickerAvatarGroup>
  )
}

export function Straight() {
  return (
    <StickerAvatar
      name="Bonzo"
      src={BONZO}
      size={96}
      status="present"
      tilt={false}
      lift={false}
    />
  )
}

export function DoDefaultEdge() {
  return <StickerAvatar name="Bonzo" src={BONZO} size={64} />
}

export function DontThickEdge() {
  return <StickerAvatar name="Bonzo" src={BONZO} size={64} edge={12} />
}
