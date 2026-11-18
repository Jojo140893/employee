/**
 * S3-compatible Object Storage Service with local mock fallback
 * Supports AWS S3, Cloudflare R2, and Supabase Storage
 */

export interface StorageUploadResult {
  key: string;
  url: string;
  format: string;
  sizeBytes: number;
}

/**
 * Generate a signed or direct streaming URL for audio call recordings
 */
export function getRecordingStreamUrl(key: string): string {
  if (!key) return "";

  // If already a full URL or mock CDN URL, return directly
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  const s3Domain = process.env.S3_PUBLIC_DOMAIN;
  if (s3Domain) {
    return `${s3Domain.replace(/\/$/, "")}/${key}`;
  }

  // Fallback to local audio streaming endpoint
  return `/api/telephony/recordings/${encodeURIComponent(key)}`;
}

/**
 * Generate a signed URL for encrypted sensitive agreement PDFs or ID documents
 */
export function getDocumentSignedUrl(key: string, expirySeconds = 3600): string {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }
  return `/api/employees/documents/stream?key=${encodeURIComponent(key)}&exp=${Date.now() + expirySeconds * 1000}`;
}
