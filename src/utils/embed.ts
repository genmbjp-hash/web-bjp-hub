/**
 * Utility helper to safely format YouTube, Instagram, and TikTok video embed URLs
 */

export function getSocialEmbedUrl(url: string): { embedUrl: string; platform: 'youtube' | 'instagram' | 'tiktok' | 'other' } {
  if (!url) return { embedUrl: '', platform: 'other' };

  const cleanUrl = url.trim();

  // YouTube Watch or Shorts or Youtu.be
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    let videoId = '';
    if (cleanUrl.includes('youtube.com/watch')) {
      const match = cleanUrl.match(/[?&]v=([^&]+)/);
      if (match) videoId = match[1];
    } else if (cleanUrl.includes('youtu.be/')) {
      const parts = cleanUrl.split('youtu.be/');
      if (parts[1]) videoId = parts[1].split('?')[0];
    } else if (cleanUrl.includes('youtube.com/shorts/')) {
      const parts = cleanUrl.split('youtube.com/shorts/');
      if (parts[1]) videoId = parts[1].split('?')[0];
    }

    if (videoId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
        platform: 'youtube',
      };
    }
  }

  // Instagram Reel or Post
  if (cleanUrl.includes('instagram.com')) {
    let embedPath = cleanUrl;
    // Ensure standard embed path ends with /embed
    if (!embedPath.endsWith('/')) {
      embedPath += '/';
    }
    if (!embedPath.endsWith('embed/')) {
      embedPath += 'embed/';
    }
    return {
      embedUrl: embedPath,
      platform: 'instagram',
    };
  }

  // TikTok
  if (cleanUrl.includes('tiktok.com')) {
    return {
      embedUrl: cleanUrl,
      platform: 'tiktok',
    };
  }

  return { embedUrl: cleanUrl, platform: 'other' };
}
