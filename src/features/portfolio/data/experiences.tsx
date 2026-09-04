import {
  CodeIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
  LayoutGridIcon,
  PaletteIcon,
  PenToolIcon,
} from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

/**
 * Start of the design career, used for the "N yrs" stamp on the Experience
 * panel. Dated from the first full-time design role, not freelance work.
 */
export const DESIGN_CAREER_START = "06.2021"

export const EXPERIENCES: Experience[] = [
  {
    id: "tbds",
    companyName: "Tori Bryan Design Services",
    location: "United States",
    locationType: "Remote",
    positions: [
      {
        id: "tbds-design-engineer",
        title: "Design Engineer",
        employmentPeriod: {
          start: "08.2026",
        },
        employmentType: "Self-employed",
        icon: <CodeIcon />,
        skills: [
          "Design Systems",
          "Design Engineering",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Storybook",
          "Claude Code",
        ],
      },
      {
        id: "tbds-product-designer",
        title: "Product Designer",
        employmentPeriod: {
          start: "02.2023",
          end: "07.2026",
        },
        employmentType: "Self-employed",
        icon: <PenToolIcon />,
        description: `- Independent practice partnering with SLV Technologies to deliver web and product design for their clients, alongside direct clients including Proctorio, Hydra Endura, and Mincredo.
- Contracted with Proctorio as a design system contributor and product designer: designed the Review Center video player, internal tools and dashboards, and 12+ documented design system components.
- Redesigned Proctorio's multi-audience help center from scratch for students, administrators, and IT admins, with article taxonomy and role-based content visibility.
- Built brand identities for Hydra Endura and Mincredo: logo, brand guidelines, core UI components, and social strategy.`,
        skills: [
          "Design Systems",
          "Product Design",
          "Web Design",
          "Information Architecture",
          "Wireframing",
          "Brand Design",
          "UX Writing",
          "Figma",
        ],
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "proctorio",
    companyName: "Proctorio",
    companyWebsite: "https://proctorio.com",
    location: "Scottsdale, Arizona",
    positions: [
      {
        id: "proctorio-staff",
        title: "Staff Product Designer",
        employmentPeriod: {
          start: "09.2025",
          end: "08.2026",
        },
        employmentType: "Full-time",
        icon: <DraftingCompassIcon />,
        description: `- Owned the multi-brand design system, its governance, and the technical design standards the design team and the engineering org build from, while leading design across three products.
- Led a legacy [design system overhaul](/work/design-system-overhaul) with two engineers: 37 components, MVP in 60 days, button variants down 59% (1,160 → 480) and card variants down 94% (587 → 32). v2 Card shipped in 1.5 days against 2 weeks for v1.
- Rebuilt design-to-engineering handoff around [agentic tooling](/work/agentic-design-system) and prototype-forward delivery: spec production dropped from 3 days–2 weeks to under 30 minutes, returning ~80 hours per cycle to design work, with 100% team adoption.
- Authored the shared Claude Code skill framework behind it and the hooks that cascade prototype changes into specs and release notes automatically.
- Shipped features for a customer-facing review product used by three distinct user types (instructors, administrators, and proctoring agents), each opening the same session recording for a different reason.
- Shipped [Proctor Coverage](/work/proctor-coverage), embedded analytics that turn proctor coverage from an assumption into evidence, and redesigned the [Support Agent Dashboard](/work/support-agent-dashboard) so agents arrive at in-exam chats already holding session context.
- Made the case for reintroducing usability testing and put it back in the workflow; partnered with PM and engineering on framing, success metrics, and trade-offs from discovery through launch.`,
        skills: [
          "Design Systems",
          "Design System Governance",
          "Token Architecture",
          "DesignOps",
          "End-to-end Product Design",
          "Data-dense Interfaces",
          "Prototyping",
          "Usability Testing",
          "Accessibility",
          "Figma",
          "Claude Code",
          "Azure DevOps",
        ],
      },
      {
        id: "proctorio-visual-designer",
        title: "Visual Designer",
        employmentPeriod: {
          start: "2022",
          end: "08.2023",
        },
        employmentType: "Full-time",
        icon: <PaletteIcon />,
        description: `- Led the full Proctorio rebrand (logo, color palette, visual language, and asset library), grounded in user personas, market strategy, and research across the EdTech space.
- Designed ProctorioX conference branding and managed material production across departments and attendees.
- Shifted into product UI: contributed components and screens to the product design system, designed guide sites reaching thousands of test-takers and institutions, and built interfaces for internal tools and dashboards.`,
        skills: [
          "Brand Design",
          "Visual Design",
          "Design Systems",
          "UI Design",
          "Web Design",
          "User Research",
          "Figma",
        ],
      },
      {
        id: "proctorio-multimedia-intern",
        title: "Multimedia Design Intern",
        employmentPeriod: {
          start: "06.2021",
          end: "2022",
        },
        employmentType: "Internship",
        icon: <GraduationCapIcon />,
        description: `- First full-time design intern, helping kickstart Proctorio's design internship program.
- Designed landing pages for conferences and sales, print and conference collateral, and the digital brand template system, managing production vendors end to end.`,
        skills: [
          "Graphic Design",
          "Print Design",
          "Template Systems",
          "Adobe Creative Suite",
        ],
      },
    ],
  },
  {
    id: "modern-care-homes",
    companyName: "Modern Care Homes",
    companyWebsite: "https://www.moderncarehomes.com/",
    locationType: "Remote",
    positions: [
      {
        id: "mch-product-designer",
        title: "Product Designer",
        employmentPeriod: {
          start: "2024",
        },
        employmentType: "Contract",
        icon: <LayoutGridIcon />,
        description: `- Via SLV Technologies: defined the design system for the agent platform and redesigned the [senior living search and discovery marketplace](/work/modern-care-homes), partnering with engineering.
- Own the visual language end to end: type scale, colour, components, and page templates.`,
        skills: [
          "Design Systems",
          "Product Design",
          "Web Design",
          "Marketplace UX",
          "Figma",
        ],
      },
    ],
  },
  {
    id: "iron-diamond-media",
    companyName: "Iron Diamond Media",
    companyWebsite: "https://azbridemag.com/",
    locationType: "Remote",
    positions: [
      {
        id: "idm-web-designer",
        title: "Web Designer",
        employmentPeriod: {
          start: "2023",
        },
        employmentType: "Contract",
        icon: <LayoutGridIcon />,
        description: `- Via SLV Technologies: partnered with engineering on a redesign of the editorial website and vendor platform across seven sister brands, starting with [Arizona Bride](/work/arizona-bride) and Minnesota Bride.
- Built a custom design system for both flagship brands and shipped front-end styling and markup.`,
        skills: [
          "Design Systems",
          "Web Design",
          "Editorial Design",
          "Multi-brand Theming",
          "HTML / CSS",
          "Figma",
        ],
      },
    ],
  },
]
