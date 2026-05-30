import { describe, expect, it } from 'vitest'
import { buildSitemapEntries } from '~/utils/bible/sitemapUrls'

describe('buildSitemapEntries', () => {
  it('includes static pages and chapter URLs for all books', () => {
    const locations = buildSitemapEntries().map(entry => entry.loc)

    expect(locations).toContain('/')
    expect(locations).toContain('/help')
    expect(locations).toContain('/bible/gen.1')
    expect(locations).toContain('/bible/rev.22')
  })

  it('generates one URL per chapter across all books', () => {
    const chapterUrlCount = buildSitemapEntries().filter(entry =>
      entry.loc.startsWith('/bible/'),
    ).length

    expect(chapterUrlCount).toBe(1189)
  })
})
