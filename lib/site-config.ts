import type { Metadata } from 'next'
import type { PostFrontmatter } from './posts'

export type SiteKey = 'sanjog' | 'arti'

/** The four brand slots. Injected as CSS variables so all `brand-*` Tailwind
 *  classes re-theme per site with zero component changes.
 *  Semantic roles: cream = page background, charcoal = primary text/headings,
 *  rust = primary accent (links, CTAs), olive = secondary accent (tags). */
export interface ThemeColors {
  cream: string
  charcoal: string
  olive: string
  rust: string
}

export interface Clinic {
  name: string
  location: string
}

/** One column in the footer + a source for schema. */
export interface PracticeLocation {
  /** Column heading, e.g. "Dubai" / "Bengaluru". */
  label: string
  entries: { name: string; detail?: string }[]
  phone?: string
  /** e.g. "DHA Licence: 24430721" or "KMC Reg. No.: 109317". */
  regLine?: string
}

export interface NavLink {
  label: string
  href: string
  external?: boolean
  /** Hidden below the `sm` breakpoint (matches Sanjog's original FAQ link). */
  hideOnMobile?: boolean
}

export interface SiteConfig {
  key: SiteKey
  /** Absolute site URL, e.g. https://blog.drsanjog.com (no trailing slash). */
  url: string

  /** Author identity — superset of the old AUTHOR constant. */
  author: {
    name: string
    credentials: string
    credentialsFull: string
    specialty: string
    /** e.g. "Plastic and Reconstructive Surgeon" — schema jobTitle. */
    jobTitle: string
    /** e.g. "surgeon" / "gynaecologist" — used in disclaimer copy. */
    practitionerNoun: string
    siteUrl: string
    instagram: string
    instagramHandle: string
    linkedin?: string
    training: readonly string[]
    knowsAbout: readonly string[]
    /** Credential categories for schema, e.g. ['MBBS','MS','DNB']. */
    credentialCategories: readonly string[]
    /** Full name of the professional body, e.g. APSI. */
    membershipOrg?: string
    /** Short membership line shown in the footer + author bio. */
    membershipLine?: string
    /** Medical-council registrations shown in the author bio. */
    registrations?: { label: string; value: string }[]
  }

  theme: ThemeColors

  /** UI strings that were previously hardcoded to Dr. Sanjog. */
  ui: {
    headerName: string
    headerTagline: string
    homeH1: string
    homeSubtitle: string
    externalSiteLabel: string
    consultCtaLabel: string
    /** OG image host label, e.g. "blog.drsanjog.com". */
    ogHost: string
    /** OG image footer line. */
    ogSubtitle: string
    /** OG background gradient endpoints. */
    ogGradientFrom: string
    ogGradientTo: string
  }

  /** Root layout <head> metadata (values only — key order does not affect output). */
  metadata: Metadata
  /** /blog listing page metadata. */
  blogListMetadata: Metadata

  headerNav: NavLink[]
  footer: {
    locations: PracticeLocation[]
    links: NavLink[]
  }

  sitemapStaticPages: {
    path: string
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }[]

  /** JSON-LD blocks rendered in <head> on every page (verbatim per site). */
  layoutSchemas: Record<string, unknown>[]

  /** Author-identity JSON-LD for a post page (article + person). */
  postAuthorSchemas: (fm: PostFrontmatter, url: string) => Record<string, unknown>[]

  /** Recognising authority for MedicalProcedure schema (ISAPS for plastic surgery). */
  recognizingAuthority?: { name: string; url: string }

  /** llms.txt body, given the post list. */
  llmsBody: (
    posts: { slug: string; frontmatter: PostFrontmatter }[]
  ) => string
}
