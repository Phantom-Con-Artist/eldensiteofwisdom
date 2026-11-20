import { v2 as cloudinary } from 'cloudinary';

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || '';

if (import.meta.env.CLOUDINARY_URL) {
  // Server-side / build-time SDK configuration via CLOUDINARY_URL
  cloudinary.config({
    secure: true,
  });
}

export interface CloudinaryMediaOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}

/**
 * Generates an optimized Cloudinary delivery URL for an image or video public ID.
 * Falls back to a placeholder string if PUBLIC_CLOUDINARY_CLOUD_NAME is not yet set.
 */
export function getCloudinaryUrl(
  publicId: string,
  resourceType: 'image' | 'video' = 'image',
  options: CloudinaryMediaOptions = {}
): string {
  if (!cloudName) {
    return `https://res.cloudinary.com/demo/${resourceType}/upload/f_auto,q_auto/${publicId}`;
  }

  const transforms = [
    `f_${options.format ?? 'auto'}`,
    `q_${options.quality ?? 'auto'}`,
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
  ]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transforms}/${publicId}`;
}

export { cloudinary };
