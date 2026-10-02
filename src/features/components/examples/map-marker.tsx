"use client"

import { useState, type ReactNode } from "react"
import {
  BookOpenIcon,
  CoffeeIcon,
  FlowerIcon,
  ImageIcon,
  MusicIcon,
} from "lucide-react"

import { Button } from "@/components/fibo/button"
import { MapMarker } from "@/components/fibo/map-marker"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
import {
  PHOTO,
  Pin,
  PLACES,
  PreviewHeldOpen,
  StandInMap,
} from "./map-marker-data"

const cafe = PLACES[0]!

export function Default() {
  return (
    <StandInMap>
      <Pin place={cafe}>
        <MapMarker
          label={cafe.label}
          image={{ src: PHOTO, alt: "The café's front, with a striped awning" }}
          meta={cafe.meta}
          title={cafe.label}
          description={cafe.description}
        />
      </Pin>
    </StandInMap>
  )
}

export function LabelMarkers() {
  return (
    <StandInMap>
      {PLACES.map((place) => (
        <Pin key={place.id} place={place}>
          <MapMarker
            type="label"
            label={place.label}
            text={place.price}
            meta={place.meta}
            title={place.label}
            description={place.description}
          />
        </Pin>
      ))}
    </StandInMap>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "default"] as const).map((size) => (
        <div key={size} className="flex items-center gap-5">
          <MapMarker label={`Dot, ${size}`} size={size} />
          <MapMarker
            label={`Icon, ${size}`}
            type="icon"
            icon={<CoffeeIcon />}
            size={size}
          />
          <MapMarker
            label={`Label, ${size}`}
            type="label"
            text="$120"
            size={size}
          />
        </div>
      ))}
    </div>
  )
}

const ICONS: Record<string, ReactNode> = {
  cafe: <CoffeeIcon />,
  books: <BookOpenIcon />,
  park: <FlowerIcon />,
  studio: <ImageIcon />,
}

export function IconMarkers() {
  return (
    <StandInMap>
      {PLACES.map((place) => (
        <Pin key={place.id} place={place}>
          <MapMarker
            type="icon"
            icon={ICONS[place.id]}
            label={place.label}
            meta={place.meta}
            title={place.label}
            description={place.description}
          />
        </Pin>
      ))}
    </StandInMap>
  )
}

// Colour only carries meaning: here, whether each place is open right now.
const STATUS: Record<
  string,
  {
    variant: "success" | "warning" | "destructive" | "info"
    status: string
  }
> = {
  cafe: { variant: "success", status: "Open now" },
  books: { variant: "warning", status: "Closes in 20 min" },
  park: { variant: "info", status: "Concert at 7pm" },
  studio: { variant: "destructive", status: "Closed today" },
}

export function Colours() {
  return (
    <StandInMap>
      {PLACES.map((place) => (
        <Pin key={place.id} place={place}>
          <MapMarker
            type="icon"
            variant={STATUS[place.id]!.variant}
            icon={place.id === "park" ? <MusicIcon /> : ICONS[place.id]}
            label={`${place.label}, ${STATUS[place.id]!.status}`}
            meta={STATUS[place.id]!.status}
            title={place.label}
            description={place.description}
          />
        </Pin>
      ))}
    </StandInMap>
  )
}

export function LabelsWithIcons() {
  return (
    <StandInMap>
      {PLACES.map((place) => (
        <Pin key={place.id} place={place}>
          <MapMarker
            type="label"
            variant={STATUS[place.id]!.variant}
            icon={ICONS[place.id]}
            label={`${place.label}, ${STATUS[place.id]!.status}`}
            text={place.price}
            meta={STATUS[place.id]!.status}
            title={place.label}
            description={place.description}
          />
        </Pin>
      ))}
    </StandInMap>
  )
}

export function CustomContent() {
  const books = PLACES[1]!
  return (
    <StandInMap>
      <Pin place={books}>
        <MapMarker
          label={books.label}
          meta={books.meta}
          title={books.label}
          description={books.description}
        >
          <div className="flex gap-2">
            <Button size="sm">Directions</Button>
            <Button size="sm" variant="outline">
              Save
            </Button>
          </div>
        </MapMarker>
      </Pin>
    </StandInMap>
  )
}

export function Controlled() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <ul className="m-0 flex list-none flex-col gap-1 p-0 sm:w-48">
        {PLACES.map((place) => (
          <li key={place.id}>
            <button
              type="button"
              aria-pressed={openId === place.id}
              onClick={() => setOpenId(place.id)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring-subtle aria-pressed:bg-muted aria-pressed:font-medium"
            >
              {place.label}
            </button>
          </li>
        ))}
      </ul>
      <StandInMap>
        {PLACES.map((place) => (
          <Pin key={place.id} place={place}>
            <MapMarker
              label={place.label}
              meta={place.meta}
              title={place.label}
              description={place.description}
              open={openId === place.id}
              onOpenChange={(open) =>
                setOpenId((current) =>
                  open ? place.id : current === place.id ? null : current
                )
              }
            />
          </Pin>
        ))}
      </StandInMap>
    </div>
  )
}

export function WithoutPreview() {
  return (
    <StandInMap>
      {PLACES.map((place) => (
        <Pin key={place.id} place={place}>
          <MapMarker label={place.label} />
        </Pin>
      ))}
    </StandInMap>
  )
}

export function DoShortLabels() {
  return (
    <div className="flex items-center gap-3">
      <MapMarker type="label" label="Blue Bottle Coffee" text="$6" />
      <MapMarker type="label" label="Golden Ratio Books" text="$18" />
    </div>
  )
}

export function DontLongLabels() {
  return (
    <div className="flex items-center gap-3">
      <MapMarker type="label" label="Blue Bottle Coffee" />
      <MapMarker type="label" label="Golden Ratio Books" />
    </div>
  )
}

const PARTS: Callout[] = [
  { label: "Marker", side: "left", find: slot("map-marker") },
  { label: "Image", side: "right", find: slot("map-marker-image") },
  { label: "Meta", side: "left", find: slot("map-marker-meta") },
  { label: "Title", side: "right", find: slot("map-marker-title") },
  { label: "Description", side: "left", find: slot("map-marker-description") },
  { label: "Content", side: "right", find: slot("map-marker-content") },
]

/** A marker with its card held open, with each part of the card labelled. */
export function Anatomy() {
  const [ready, setReady] = useState(false)
  return (
    <AnatomyMap
      callouts={PARTS}
      subject={slot("map-marker-preview")}
      measureKey={ready}
    >
      <div className="flex justify-center px-6 py-6">
        <PreviewHeldOpen onReady={() => setReady(true)}>
          <MapMarker
            label={cafe.label}
            image={{
              src: PHOTO,
              alt: "The café's front, with a striped awning",
            }}
            meta={cafe.meta}
            title={cafe.label}
            description={cafe.description}
          >
            <Button size="sm">Directions</Button>
          </MapMarker>
        </PreviewHeldOpen>
      </div>
    </AnatomyMap>
  )
}
