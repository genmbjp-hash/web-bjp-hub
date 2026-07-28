import { Entity } from '../types';

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

export function updateMetaTags(data: {
  title: string;
  description: string;
  image?: string;
  url?: string;
}) {
  document.title = data.title;

  const setMeta = (attr: string, value: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${value}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, value);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Description
  setMeta('name', 'description', data.description);

  // Open Graph
  setMeta('property', 'og:title', data.title);
  setMeta('property', 'og:description', data.description);
  setMeta('property', 'og:type', 'website');
  if (data.image) {
    setMeta('property', 'og:image', data.image);
  }
  if (data.url) {
    setMeta('property', 'og:url', data.url);
  }

  // Twitter Card
  setMeta('name', 'twitter:card', data.image ? 'summary_large_image' : 'summary');
  setMeta('name', 'twitter:title', data.title);
  setMeta('name', 'twitter:description', data.description);
  if (data.image) {
    setMeta('name', 'twitter:image', data.image);
  }
}

export function resetMetaTags() {
  const defaultTitle = 'Portal BJP HUB - Bintara Jaya Permai (RW 11)';
  const defaultDesc =
    'Website Portal Informasi Kegiatan & Entitas Warga Komplek Bintara Jaya Permai (RW 11) Bekasi';
  document.title = defaultTitle;
  updateMetaTags({
    title: defaultTitle,
    description: defaultDesc,
    url: window.location.origin + window.location.pathname,
  });
}

export function setEntityMetaTags(entity: Entity) {
  const cleanDesc = stripHtml(entity.description);
  const snippet = cleanDesc.length > 150 ? cleanDesc.slice(0, 150) + '...' : cleanDesc;
  const directUrl = `${window.location.origin}${window.location.pathname}?entity=${entity.id}`;
  
  // Pick image thumbnail: product photo > fallback image
  const thumbnail =
    entity.productPhotos && entity.productPhotos.length > 0
      ? entity.productPhotos[0]
      : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

  updateMetaTags({
    title: `${entity.name} - BJP HUB Bintara Jaya Permai`,
    description: `${entity.category} | ${snippet}`,
    image: thumbnail,
    url: directUrl,
  });
}
