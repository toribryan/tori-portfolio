"use client"

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react"
import { CornerDownRightIcon, PencilIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/fibo/avatar"
import { Button } from "@/components/fibo/button"
import {
  ChatComposerAttachments,
  ChatComposerCommonActions,
  ChatComposerDropZone,
  ChatComposerFooter,
  ChatComposerFrame,
  ChatComposerHeader,
  ChatComposerInput,
  ChatComposerProvider,
  ChatComposerSubmit,
  LocalChatComposerProvider,
  type ChatComposerActions,
  type ChatComposerAttachment,
  type ChatComposerState,
} from "@/components/fibo/chat-composer"
import { Checkbox } from "@/components/fibo/checkbox"
import { Kbd } from "@/components/fibo/kbd"

// As wide as fibo's stories, so the composer reads at chat width.
function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-xl">{children}</div>
}

function Full({
  defaultValue,
  defaultAttachments,
  disabled,
}: {
  defaultValue?: string
  defaultAttachments?: ChatComposerAttachment[]
  disabled?: boolean
}) {
  return (
    <Frame>
      <LocalChatComposerProvider
        defaultValue={defaultValue}
        defaultAttachments={defaultAttachments}
        disabled={disabled}
      >
        <ChatComposerDropZone>
          <ChatComposerFrame>
            <ChatComposerHeader className="empty:hidden">
              <ChatComposerAttachments />
            </ChatComposerHeader>
            <ChatComposerInput placeholder="Message #design" />
            <ChatComposerFooter>
              <ChatComposerCommonActions />
              <ChatComposerSubmit />
            </ChatComposerFooter>
          </ChatComposerFrame>
        </ChatComposerDropZone>
      </LocalChatComposerProvider>
    </Frame>
  )
}

export function Default() {
  return <Full />
}

const FILES: ChatComposerAttachment[] = [
  { id: "a", name: "token-audit.pdf", size: 482_000 },
  { id: "b", name: "button-states.png", size: 1_830_000 },
]

export function WithAttachments() {
  return (
    <Full
      defaultValue="Both files from the review."
      defaultAttachments={FILES}
    />
  )
}

export function Minimal() {
  return (
    <Frame>
      <LocalChatComposerProvider>
        <ChatComposerFrame className="flex-row items-end">
          <ChatComposerInput placeholder="Ask anything" />
          <ChatComposerSubmit className="m-2 shrink-0" />
        </ChatComposerFrame>
      </LocalChatComposerProvider>
    </Frame>
  )
}

export function Disabled() {
  return <Full disabled defaultValue="Waiting for a connection" />
}

export function EditMessage() {
  const [editing, setEditing] = useState(true)
  // Focus only after someone asks to edit, never on load, where it would
  // scroll the page down to this example.
  const [reopened, setReopened] = useState(false)
  const [text, setText] = useState("The tokens land on Friday.")
  if (!editing)
    return (
      <Frame>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-sm">
          <span>{text}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditing(true)
              setReopened(true)
            }}
          >
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        </div>
      </Frame>
    )
  return (
    <Frame>
      <LocalChatComposerProvider
        defaultValue={text}
        onSubmit={(message) => {
          setText(message.value)
          setEditing(false)
        }}
      >
        <ChatComposerFrame>
          <ChatComposerHeader>
            <PencilIcon className="size-3.5" />
            Editing message
          </ChatComposerHeader>
          <ChatComposerInput
            aria-label="Edit message"
            autoFocus={reopened}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(false)
            }}
          />
          <ChatComposerFooter className="justify-end gap-2">
            <span className="mr-auto pl-1 text-xs text-muted-foreground">
              <Kbd>Esc</Kbd> to cancel
            </span>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <ChatComposerSubmit>Save</ChatComposerSubmit>
          </ChatComposerFooter>
        </ChatComposerFrame>
      </LocalChatComposerProvider>
    </Frame>
  )
}

export function ThreadReply() {
  const [alsoChannel, setAlsoChannel] = useState(false)
  return (
    <Frame>
      <LocalChatComposerProvider>
        <ChatComposerDropZone>
          <ChatComposerFrame>
            <ChatComposerHeader>
              <CornerDownRightIcon className="size-3.5" />
              Replying to Ada Lovelace
            </ChatComposerHeader>
            <ChatComposerInput placeholder="Reply…" />
            <ChatComposerFooter>
              <ChatComposerCommonActions />
              <label className="ml-auto flex items-center gap-2 pr-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={alsoChannel}
                  onCheckedChange={setAlsoChannel}
                />
                Also send to #design
              </label>
              <ChatComposerSubmit />
            </ChatComposerFooter>
          </ChatComposerFrame>
        </ChatComposerDropZone>
      </LocalChatComposerProvider>
    </Frame>
  )
}

export function SubmitOutsideTheFrame() {
  return (
    <Frame>
      {/* The forwarded message is the content, so an empty note can still send. */}
      <LocalChatComposerProvider canSubmit={() => true}>
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-background p-4 shadow-sm">
          <div className="text-sm font-semibold">Forward message</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To</span>
            <Avatar size="sm">
              <AvatarFallback>GH</AvatarFallback>
            </Avatar>
            Grace Hopper
          </div>
          <blockquote className="border-l-2 border-line pl-3 text-sm text-muted-foreground">
            The tokens land on Friday.
          </blockquote>
          <ChatComposerFrame>
            <ChatComposerInput placeholder="Add a note (optional)" />
          </ChatComposerFrame>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            {/* Outside the frame, still inside the provider. */}
            <ChatComposerSubmit>Forward</ChatComposerSubmit>
          </div>
        </div>
      </LocalChatComposerProvider>
    </Frame>
  )
}

/*
 * A stand-in for a store that syncs the draft across devices. Anything with
 * a subscribe and a snapshot works the same way.
 */
function createDraftStore() {
  let state: ChatComposerState = { value: "", attachments: [] }
  const listeners = new Set<() => void>()
  const set = (next: Partial<ChatComposerState>) => {
    state = { ...state, ...next }
    listeners.forEach((listener) => listener())
  }
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    get: () => state,
    set,
  }
}

function SyncedChatComposerProvider({
  store,
  children,
}: {
  store: ReturnType<typeof createDraftStore>
  children: ReactNode
}) {
  const state = useSyncExternalStore(store.subscribe, store.get, store.get)
  const actions = useMemo<ChatComposerActions>(
    () => ({
      setValue: (value) => store.set({ value }),
      addAttachments: (files) =>
        store.set({
          attachments: [
            ...store.get().attachments,
            ...files.map((file) => ({
              id: crypto.randomUUID(),
              name: file.name,
              size: file.size,
            })),
          ],
        }),
      removeAttachment: (id) =>
        store.set({
          attachments: store.get().attachments.filter((a) => a.id !== id),
        }),
      submit: () => {
        const { value, attachments } = store.get()
        if (!value.trim() && !attachments.length) return
        store.set({ value: "", attachments: [] })
      },
    }),
    [store]
  )
  return (
    <ChatComposerProvider state={state} actions={actions}>
      {children}
    </ChatComposerProvider>
  )
}

export function SyncedDraft() {
  const [store] = useState(createDraftStore)
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {["Laptop", "Phone"].map((device) => (
        <div key={device} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {device}
          </span>
          <SyncedChatComposerProvider store={store}>
            <ChatComposerFrame>
              <ChatComposerHeader className="empty:hidden">
                <ChatComposerAttachments />
              </ChatComposerHeader>
              <ChatComposerInput
                aria-label={`Message from ${device.toLowerCase()}`}
                placeholder="Type on either one"
              />
              <ChatComposerFooter>
                <ChatComposerCommonActions />
                <ChatComposerSubmit />
              </ChatComposerFooter>
            </ChatComposerFrame>
          </SyncedChatComposerProvider>
        </div>
      ))}
    </div>
  )
}

type Message = { id: number; author: string; text: string; files: string[] }

export function InAChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "Ada Lovelace",
      text: "Is the composer ready to try?",
      files: [],
    },
  ])
  return (
    <Frame>
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-background p-4">
        <ol aria-label="Messages" className="flex flex-col gap-3">
          {messages.map((message) => (
            <li key={message.id} className="flex items-start gap-2.5">
              <Avatar size="sm">
                <AvatarFallback>
                  {message.author
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium">{message.author}</span>
                <span className="whitespace-pre-wrap text-muted-foreground">
                  {message.text}
                </span>
                {message.files.map((name, index) => (
                  <span key={index} className="text-xs text-muted-foreground">
                    {name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <LocalChatComposerProvider
          onSubmit={async (message) => {
            // A pretend round trip, so the send button shows its busy state.
            await new Promise((resolve) => setTimeout(resolve, 600))
            setMessages((current) => [
              ...current,
              {
                id: current.length + 1,
                author: "You",
                text: message.value,
                files: message.attachments.map((file) => file.name),
              },
            ])
          }}
        >
          <ChatComposerDropZone>
            <ChatComposerFrame>
              <ChatComposerHeader className="empty:hidden">
                <ChatComposerAttachments />
              </ChatComposerHeader>
              <ChatComposerInput placeholder="Reply to Ada" />
              <ChatComposerFooter>
                <ChatComposerCommonActions />
                <ChatComposerSubmit />
              </ChatComposerFooter>
            </ChatComposerFrame>
          </ChatComposerDropZone>
        </LocalChatComposerProvider>
      </div>
    </Frame>
  )
}

export function DoComposeVariant() {
  return (
    <LocalChatComposerProvider>
      <ChatComposerFrame className="w-72">
        <ChatComposerHeader>Editing message</ChatComposerHeader>
        <ChatComposerInput aria-label="Edit message" />
        <ChatComposerFooter className="justify-end">
          <ChatComposerSubmit>Save</ChatComposerSubmit>
        </ChatComposerFooter>
      </ChatComposerFrame>
    </LocalChatComposerProvider>
  )
}

export function DontAddFlags() {
  return (
    <code className="rounded-md bg-muted px-2 py-1 text-xs">
      {"<Composer isEditing isThread hideAttach />"}
    </code>
  )
}

export function DoSendLast() {
  return (
    <LocalChatComposerProvider>
      <ChatComposerFrame className="w-72">
        <ChatComposerInput placeholder="Message #design" />
        <ChatComposerFooter>
          <ChatComposerCommonActions />
          <ChatComposerSubmit />
        </ChatComposerFooter>
      </ChatComposerFrame>
    </LocalChatComposerProvider>
  )
}

export function DontMoveSend() {
  return (
    <LocalChatComposerProvider>
      <ChatComposerFrame className="w-72">
        <ChatComposerFooter>
          <ChatComposerSubmit />
          <ChatComposerCommonActions />
        </ChatComposerFooter>
        <ChatComposerInput placeholder="Message #design" />
      </ChatComposerFrame>
    </LocalChatComposerProvider>
  )
}
