export const metaTags = {
  title: 'Token Station',
  description: 'Launch a Token on Injective'
}

export const nuxtMetaTags = [
  {
    hid: 'og:url',
    property: 'og:url',
    content: `${process.env.VITE_BASE_URL}`
  },
  { hid: 'description', name: 'description', content: metaTags.description },
  {
    hid: 'og:description',
    property: 'og:description',
    content: metaTags.description
  },
  {
    hid: 'twitter:card',
    property: 'twitter:card',
    content: 'summary_large_image'
  },
  {
    hid: 'twitter:description',
    property: 'twitter:description',
    content: metaTags.description
  },
  {
    hid: 'twitter:title',
    property: 'twitter:title',
    content: metaTags.title
  },
  { hid: 'og:title', property: 'og:title', content: metaTags.title },
  { hid: 'og:site_name', property: 'og:site_name', content: metaTags.title },
  { hid: 'title', property: 'title', content: metaTags.title }
]

export const pwaMetaTags = {
  name: metaTags.title,
  description: metaTags.description,
  ogSiteName: metaTags.title,
  ogTitle: metaTags.title,
  ogDescription: metaTags.description
}

export const manifestMetaTags = {
  name: metaTags.title,
  description: metaTags.description
}
