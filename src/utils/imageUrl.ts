export function formatImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();

  if (trimmed.includes('drive.google.com')) {
    // Pattern 1: /file/d/FILE_ID
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
    }

    // Pattern 2: id=FILE_ID
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
    }
  }

  return trimmed;
}
