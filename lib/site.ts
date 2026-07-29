import type { SiteConfig, SiteKey } from './site-config'
import { sanjogConfig } from '@/sites/sanjog'
import { artiConfig } from '@/sites/arti'

const SITES: Record<SiteKey, SiteConfig> = {
  sanjog: sanjogConfig,
  arti: artiConfig,
}

/** Active site, selected at build time via the SITE env var. Defaults to
 *  'sanjog' so the existing deploy is completely unaffected. */
function resolveSiteKey(): SiteKey {
  const key = process.env.SITE
  return key === 'arti' ? 'arti' : 'sanjog'
}

export const site: SiteConfig = SITES[resolveSiteKey()]

export function getSiteKey(): SiteKey {
  return site.key
}
