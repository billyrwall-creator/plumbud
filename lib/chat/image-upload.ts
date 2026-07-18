const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ImageAttachmentFile = {
  name: string;
  type: string;
  size: number;
};

export function validateImageAttachment(file: ImageAttachmentFile) {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are supported.",
    } as const;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image size must be 10 MB or less.",
    } as const;
  }

  return { valid: true } as const;
}

export function buildStoragePath(userId: string, chatId: string, fileName: string) {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const timestamp = Date.now();
  return `${userId}/${chatId}/${timestamp}-${safeFileName}`;
}

export function getImageUploadLimitBytes() {
  return MAX_IMAGE_SIZE_BYTES;
}
