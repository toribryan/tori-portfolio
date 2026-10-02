"use client"

import { useState, type ReactNode } from "react"
import {
  BellIcon,
  BookmarkIcon,
  CircleHelpIcon,
  CompassIcon,
  HouseIcon,
  RabbitIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import {
  FloatingNav,
  type FloatingNavItem,
} from "@/components/fibo/floating-nav"

const ITEMS: FloatingNavItem[] = [
  { value: "home", label: "Home", icon: <HouseIcon /> },
  { value: "explore", label: "Explore", icon: <CompassIcon /> },
  { value: "saved", label: "Saved", icon: <BookmarkIcon /> },
  { value: "profile", label: "Profile", icon: <UserIcon /> },
]

// The bar is fixed to the viewport. A transform makes this frame its
// containing block, so it floats at the bottom of the phone instead of the
// page, as in fibo's stories.
function Phone({
  children,
  feed = true,
}: {
  children: ReactNode
  feed?: boolean
}) {
  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-[22rem] [transform:translateZ(0)] overflow-hidden rounded-[2.5rem] border border-line bg-background">
      {feed ? <Feed /> : null}
      {children}
    </div>
  )
}

function Feed() {
  return (
    <div className="flex flex-col gap-4 p-5 pt-8">
      <span className="text-lg font-medium">Today</span>
      {["Golden section", "Seed heads", "Pixel rabbits"].map((title) => (
        <div
          key={title}
          className="flex flex-col gap-2 rounded-2xl border border-line p-4"
        >
          <span className="h-20 rounded-xl bg-muted" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      ))}
    </div>
  )
}

export function Default() {
  return (
    <Phone>
      <FloatingNav aria-label="Example" items={ITEMS} defaultValue="home" />
    </Phone>
  )
}

export function AlwaysLabelled() {
  return (
    <Phone>
      <FloatingNav
        aria-label="Example"
        items={ITEMS}
        defaultValue="home"
        labels="always"
      />
    </Phone>
  )
}

export function Compact() {
  return (
    <Phone>
      <FloatingNav
        aria-label="Example"
        items={ITEMS}
        defaultValue="home"
        size="sm"
      />
    </Phone>
  )
}

export function Static() {
  return (
    <FloatingNav
      aria-label="Example"
      items={ITEMS}
      defaultValue="explore"
      position="static"
    />
  )
}

export function ControlledLinks() {
  const [value, setValue] = useState("search")
  const items: FloatingNavItem[] = [
    { value: "home", label: "Home", icon: <HouseIcon />, href: "#home" },
    { value: "search", label: "Search", icon: <SearchIcon />, href: "#search" },
    { value: "about", label: "About", icon: <RabbitIcon />, href: "#about" },
  ]
  return (
    <Phone feed={false}>
      <div className="flex flex-col gap-2 p-5 pt-8">
        <span className="text-lg font-medium">
          {items.find((item) => item.value === value)?.label}
        </span>
        <span className="text-sm text-muted-foreground">
          Links route through the app&apos;s own router, so the page never
          reloads.
        </span>
      </div>
      <FloatingNav
        aria-label="Sections"
        items={items}
        value={value}
        onValueChange={(next, event) => {
          event.preventDefault()
          setValue(next)
        }}
      />
    </Phone>
  )
}

export function DoFew() {
  return (
    <FloatingNav
      aria-label="Example"
      position="static"
      size="sm"
      defaultValue="home"
      items={[
        { value: "home", label: "Home", icon: <HouseIcon /> },
        { value: "explore", label: "Explore", icon: <CompassIcon /> },
        { value: "profile", label: "Profile", icon: <UserIcon /> },
      ]}
    />
  )
}

export function DontCrowd() {
  return (
    <FloatingNav
      aria-label="Example"
      position="static"
      size="sm"
      defaultValue="home"
      items={[
        ...ITEMS,
        { value: "settings", label: "Settings", icon: <SettingsIcon /> },
        { value: "alerts", label: "Alerts", icon: <BellIcon /> },
        { value: "help", label: "Help", icon: <CircleHelpIcon /> },
      ]}
    />
  )
}
