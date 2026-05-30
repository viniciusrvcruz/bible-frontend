import { BOOKS } from './book'

type SitemapEntryMeta = {
  loc: string
  changefreq: 'weekly' | 'monthly'
  priority: number
}

export function buildSitemapEntries(): SitemapEntryMeta[] {
  const entries: SitemapEntryMeta[] = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/help', changefreq: 'monthly', priority: 0.7 },
  ]

  for (const [abbr, , chapters] of BOOKS) {
    for (let chapter = 1; chapter <= chapters; chapter++) {
      entries.push({
        loc: `/bible/${abbr}.${chapter}`,
        changefreq: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
