import { buildSitemapEntries } from '~/utils/bible/sitemapUrls'

export default defineSitemapEventHandler(() => {
  return buildSitemapEntries().map(entry => asSitemapUrl(entry))
})
