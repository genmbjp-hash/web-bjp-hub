import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ENTITIES, INITIAL_ANNOUNCEMENTS } from './src/data/initialData';
import { formatImageUrl } from './src/utils/imageUrl';

function stripHtml(html: string = ''): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAbsoluteImageUrl(url: string | undefined | null, host?: string, protocol?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';
  const formatted = formatImageUrl(url);
  if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
    return formatted;
  }
  if (formatted.startsWith('/') && host) {
    const proto = protocol || 'https';
    return `${proto}://${host}${formatted}`;
  }
  return formatted;
}

function getMetaDataForQuery(query: Record<string, any>, host?: string, protocol?: string) {
  const entityId = (query.entity || query.id) as string | undefined;
  const annId = query.announcement as string | undefined;

  let title = 'Portal BJP HUB - Bintara Jaya Permai (RW 11)';
  let description = 'Website Portal Informasi Kegiatan & Entitas Warga Komplek Bintara Jaya Permai (RW 11) Bekasi';
  let image = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';

  if (entityId) {
    let found = INITIAL_ENTITIES.find((e) => e.id === entityId);
    if (!found) {
      found = INITIAL_ENTITIES.find(
        (e) =>
          e.id.toLowerCase() === entityId.toLowerCase() ||
          e.id.replace('ent-', '') === entityId.replace('ent-', '')
      );
    }
    if (!found && INITIAL_ENTITIES.length > 0) {
      found = INITIAL_ENTITIES.find((e) => e.id === 'ent-4') || INITIAL_ENTITIES[0];
    }

    if (found) {
      title = `${found.name} - BJP HUB Bintara Jaya Permai (RW 11)`;
      const clean = stripHtml(found.description);
      description = clean.length > 180 ? clean.slice(0, 180) + '...' : clean;
      const rawImg = found.image || (found.productPhotos && found.productPhotos[0]) || '';
      image = getAbsoluteImageUrl(rawImg, host, protocol);
    }
  } else if (annId) {
    let found = INITIAL_ANNOUNCEMENTS.find((a) => a.id === annId);
    if (!found && INITIAL_ANNOUNCEMENTS.length > 0) {
      found = INITIAL_ANNOUNCEMENTS[0];
    }
    if (found) {
      title = `${found.title} - Pengumuman BJP HUB (RW 11)`;
      const clean = stripHtml(found.content);
      description = clean.length > 180 ? clean.slice(0, 180) + '...' : clean;
      if (found.image) {
        image = getAbsoluteImageUrl(found.image, host, protocol);
      }
    }
  }

  return { title, description, image };
}

function injectMetaTags(html: string, meta: { title: string; description: string; image: string }): string {
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);
  const safeImg = escapeHtml(meta.image);

  let updated = html;

  updated = updated.replace(/<title>.*?<\/title>/gi, `<title>${safeTitle}</title>`);
  updated = updated.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${safeDesc}" />`);
  updated = updated.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${safeTitle}" />`);
  updated = updated.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${safeDesc}" />`);
  updated = updated.replace(/<meta property="og:image" content=".*?" \/>/gi, `<meta property="og:image" content="${safeImg}" />`);
  updated = updated.replace(/<meta property="og:image:secure_url" content=".*?" \/>/gi, `<meta property="og:image:secure_url" content="${safeImg}" />`);
  updated = updated.replace(/<meta name="twitter:title" content=".*?" \/>/gi, `<meta name="twitter:title" content="${safeTitle}" />`);
  updated = updated.replace(/<meta name="twitter:description" content=".*?" \/>/gi, `<meta name="twitter:description" content="${safeDesc}" />`);
  updated = updated.replace(/<meta name="twitter:image" content=".*?" \/>/gi, `<meta name="twitter:image" content="${safeImg}" />`);

  return updated;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Serve static files from public if it exists
  const publicPath = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const host = req.get('host');
        const protocol = req.protocol || 'https';
        const meta = getMetaDataForQuery(req.query, host, protocol);
        const finalHtml = injectMetaTags(template, meta);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.use('*', (req, res, next) => {
      try {
        const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const host = req.get('host');
        const protocol = req.protocol || 'https';
        const meta = getMetaDataForQuery(req.query, host, protocol);
        const finalHtml = injectMetaTags(template, meta);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
