import { revalidatePath } from 'next/cache'
import type { CollectionConfig, GlobalConfig } from 'payload'

/** Rebuilds the cached pages. A no-op outside Next (e.g. the seed script). */
export const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* not running inside Next */
  }
}

const hook = () => {
  revalidateSite()
}

/** Any content change in the admin refreshes the site immediately; there is no timed refresh. */
export const withRevalidation = <T extends CollectionConfig>(c: T): T => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), hook],
    afterDelete: [...(c.hooks?.afterDelete ?? []), hook],
  },
})

export const withGlobalRevalidation = <T extends GlobalConfig>(g: T): T => ({
  ...g,
  hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), hook] },
})
