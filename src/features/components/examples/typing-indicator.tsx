"use client"

import { useState, type ReactNode } from "react"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/fibo/button"
import {
  TypingIndicator,
  type TypingFormatter,
  type TypingPerson,
} from "@/components/fibo/typing-indicator"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"

const ME = "me"

const TEAM: TypingPerson[] = [
  { id: "ana", name: "Ana" },
  { id: "ben", name: "Ben" },
  { id: "cy", name: "Cy" },
  { id: "dara", name: "Dara" },
  { id: "eli", name: "Eli" },
  { id: "fen", name: "Fen" },
]

/** The width fibo's stories give it: a narrow conversation column. */
function Column({ children }: { children: ReactNode }) {
  return <div className="w-80 max-w-full">{children}</div>
}

export function Default() {
  return (
    <Column>
      <TypingIndicator
        currentUserId={ME}
        people={[...TEAM.slice(0, 2), { id: ME, name: "You" }]}
      />
    </Column>
  )
}

export function OnePerson() {
  return (
    <Column>
      <TypingIndicator people={TEAM.slice(0, 1)} />
    </Column>
  )
}

export function Three() {
  return (
    <Column>
      <TypingIndicator people={TEAM.slice(0, 3)} />
    </Column>
  )
}

export function Several() {
  return (
    <Column>
      <TypingIndicator people={TEAM.slice(0, 5)} />
    </Column>
  )
}

export function LongNames() {
  return (
    <Column>
      <TypingIndicator
        people={[
          { id: "a", name: "Maximiliana Cordelia Featherstonehaugh" },
          { id: "b", name: "Bartholomew Alistair Ravenscroft" },
        ]}
      />
    </Column>
  )
}

export function CustomIndicator() {
  const ana: TypingPerson = {
    id: "ana",
    name: "Ana",
    indicator: <PencilIcon className="size-3.5" />,
  }
  return (
    <Column>
      <div className="flex flex-col gap-2">
        <TypingIndicator people={[ana]} />
        <TypingIndicator people={[ana, TEAM[1]!]} />
      </div>
    </Column>
  )
}

// Spanish keeps one sentence per case and lets Intl.ListFormat supply "y".
const spanish: TypingFormatter = ({ count, names, list }) => {
  if (count === 0) return ""
  if (names.length === 0) return "Varias personas están escribiendo…"
  return count === 1
    ? `${list} está escribiendo…`
    : `${list} están escribiendo…`
}

export function Translated() {
  return (
    <Column>
      <div lang="es" className="flex flex-col gap-2">
        {[1, 3, 5].map((n) => (
          <TypingIndicator
            key={n}
            people={TEAM.slice(0, n)}
            format={spanish}
            locale="es"
          />
        ))}
      </div>
    </Column>
  )
}

const THREAD = [
  { id: 1, author: "Ana", text: "Pushed the new tokens to the branch." },
  { id: 2, author: "Ben", text: "Looking now. Is dark mode in there too?" },
  { id: 3, author: "Ana", text: "Both themes, and the drift check passes." },
]

function Thread({ typing }: { typing: TypingPerson[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-card p-4">
      <div role="log" aria-label="Messages" className="flex flex-col gap-3">
        {THREAD.map((message) => (
          <div key={message.id} className="flex flex-col text-sm">
            <span className="font-medium">{message.author}</span>
            <span className="text-muted-foreground">{message.text}</span>
          </div>
        ))}
      </div>
      <TypingIndicator people={typing} />
    </div>
  )
}

export function InAConversation() {
  const [typing, setTyping] = useState(2)
  return (
    <Column>
      <div className="flex flex-col gap-3">
        <Thread typing={TEAM.slice(0, typing)} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={typing === TEAM.length}
            onClick={() => setTyping((n) => n + 1)}
          >
            Someone starts
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={typing === 0}
            onClick={() => setTyping((n) => n - 1)}
          >
            Someone stops
          </Button>
        </div>
      </div>
    </Column>
  )
}

const FOUR = TEAM.slice(0, 4)

export function DoSeveral() {
  return <TypingIndicator className="w-56" people={FOUR} />
}

export function DontListEveryone() {
  return <TypingIndicator className="w-56" maxNames={5} people={FOUR} />
}

const WITH_ME: TypingPerson[] = [TEAM[0]!, { id: ME, name: "You" }]

export function DoLeaveMeOut() {
  return (
    <TypingIndicator className="w-56" people={WITH_ME} currentUserId={ME} />
  )
}

export function DontShowMe() {
  return <TypingIndicator className="w-56" people={WITH_ME} />
}

const PARTS: Callout[] = [
  { label: "Dots", side: "left", find: slot("typing-indicator-dots") },
  { label: "Sentence", side: "right", find: slot("typing-indicator-text") },
  {
    label: "Row",
    side: "right",
    find: slot("typing-indicator"),
    outline: true,
    point: (part) => ({ x: part.right + 4, y: part.bottom }),
  },
]

/** Two people typing, with each part labeled. */
export function Anatomy() {
  return (
    <AnatomyMap callouts={PARTS}>
      <div className="flex justify-center px-10 py-12">
        <div data-anatomy-subject>
          <TypingIndicator className="w-56" people={TEAM.slice(0, 2)} />
        </div>
      </div>
    </AnatomyMap>
  )
}
