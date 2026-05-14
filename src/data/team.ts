import type { ImageMetadata } from "astro"

import maxPhoto from "@/assets/sands-max-cropped.jpg"
import hugoPhoto from "@/assets/barberis-hugo-cropped.jpeg"

export type SocialKind =
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "website"
  | "email"

export interface Social {
  kind: SocialKind
  href: string
}

export interface Member {
  slug: string
  img: string | ImageMetadata
  /** Tailwind class applied to the team card image (e.g. "scale-90"). */
  imgClass?: string
  /** Tailwind class applied to the team card content wrapper (e.g. "pl-[6%]"). */
  contentClass?: string
  name: string
  role: string
  /** Short tagline shown under the role on the bio page. */
  tagline?: string
  /** Bio sections rendered on /team/{slug}. */
  bio: {
    professionalExperience: string[]
    personalBackground: string[]
  }
  socials: Social[]
}

export const SOCIAL_LABEL: Record<SocialKind, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter / X",
  instagram: "Instagram",
  website: "Personal website",
  email: "Email",
}

// 24×24 viewBox path content. Render via <svg ... set:html={SOCIAL_PATHS[kind]} />.
export const SOCIAL_PATHS: Record<SocialKind, string> = {
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  github:
    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  twitter:
    '<path d="M18 4h3l-7.5 8.6L22.5 22h-6.6l-5.2-6.8L4.7 22H1.7l8-9.2L1 4h6.8l4.7 6.2L18 4z"/>',
  instagram:
    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  website:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  email:
    '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
}

export const team: Member[] = [
  {
    slug: "max-sands",
    img: maxPhoto,
    name: "Max Sands",
    role: "Co-founder, co-CEO, & CTO",
    tagline: "Handling the data, application, and technology layer for Vental.",
    bio: {
      professionalExperience: [
        "Max's background is in software engineering, finance, and data science. He received his Bachelor's from McGill University in Finance with a minor in Accounting and Statistics. He taught himself software engineering and data science in his spare time while working as an Investment Analyst at a Wealth Management firm in Boston.",
        "For Vental's day-to-day, Max leads the product and engineering teams, and is responsible for the technical architecture of Vental's platform and applications.",
      ],
      personalBackground: [
        "Max is originally from Northern New Jersey, and is now based in Boston. When he's not working on Vental, Max is traveling, weightlifing, rock climbing, playing guitar, or reading.",
      ],
    },
    socials: [
      { kind: "website", href: "https://max-sands.com/" },
      { kind: "linkedin", href: "https://www.linkedin.com/in/maxsands/" },
      { kind: "github", href: "https://github.com/maxsands700" },
      { kind: "twitter", href: "https://x.com/Max_Sands_7" },
      { kind: "instagram", href: "https://www.instagram.com/max_sands_7/" },
      { kind: "email", href: "mailto:hello@vental.ai" },
    ],
  },
  {
    slug: "hugo-barberis",
    img: hugoPhoto,
    imgClass: "scale-90",
    contentClass: "pl-[6%]",
    name: "Hugo Barberis",
    role: "Co-founder, co-CEO, & COO",
    tagline: "Leading Vental's strategic initiatives, sales, and customer relationships.",
    bio: {
      professionalExperience: [
        "Hugo's background is in finance and commercial real estate. He received his Bachelor's from McGill University in Finance. He then worked as a Real Estate Analyst, building deep domain experience in commercial real estate underwriting, valuation, and the workflows that drive property tax assessment.",
        "For Vental's day-to-day, Hugo leads Strategic Initiatives and Sales, and brings the commercial real estate domain experience that anchors Vental in the realities of how tax estimation actually gets done.",
      ],
      personalBackground: [
        "Hugo is originally from Massachusetts, and is now based in Miami, Florida. When he's not working on Vental, Hugo is weightlifting, running, reading, or spending time with friends.",
      ],
    },
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/hugobarberis/" },
      { kind: "twitter", href: "https://x.com/hugofbarberis" },
      { kind: "instagram", href: "https://www.instagram.com/hugofbarberis/" },
      { kind: "email", href: "mailto:hello@vental.ai" },
    ],
  },
]
