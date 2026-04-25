import { useMemo, memo } from 'react'

interface SEOHeadProps {
  title: string
  description?: string
  url?: string
  cover?: string
  publishedTime?: string
  type?: 'article' | 'website'
  tags?: string[]
  breadcrumb?: { name: string; url: string }[]
}

export default memo(function SEOHead({
  title,
  description,
  url,
  cover,
  publishedTime,
  type = 'article',
  tags = [],
  breadcrumb = []
}: SEOHeadProps) {
  const jsonLdArticle = useMemo(
    () =>
      type === 'article'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            datePublished: publishedTime,
            image: cover ? [cover] : undefined
          }
        : null,
    [type, title, publishedTime, cover]
  )

  const jsonLdBreadcrumb = useMemo(
    () =>
      breadcrumb.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumb.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: b.name,
              item: b.url
            }))
          }
        : null,
    [breadcrumb]
  )

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {cover && <meta property="og:image" content={cover} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {cover && <meta name="twitter:image" content={cover} />}
      {jsonLdArticle && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      )}
      {jsonLdBreadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      )}
      {tags.length > 0 && <meta name="keywords" content={tags.join(',')} />}
    </>
  )
})
