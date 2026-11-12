import { AttachmentMeta } from '../types';

/**
 * Tenant document storage.
 *
 * Production backend: Firebase Storage at
 *   tenants/{tenantId}/opportunities/{opportunityId}/documents/{fileName}
 * with metadata saved onto the opportunity record.
 *
 * Browser adapter (no Firebase configured): files are not uploaded to a bucket;
 * a `local://` URL and metadata are produced, and text-like files are read
 * client-side so their content can feed the AI analysis pipeline.
 */

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp'
];

export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.txt', '.png', '.jpg', '.jpeg', '.webp'];

export function storagePath(tenantId: string, opportunityId: string, fileName: string): string {
  return `tenants/${tenantId}/opportunities/${opportunityId}/documents/${encodeURIComponent(fileName)}`;
}

/** Read text content from text-like documents (txt/csv/md/json). */
export async function extractDocumentText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const isText =
    file.type.startsWith('text/') || /\.(txt|csv|md|json)$/.test(name);
  if (!isText) return '';
  try {
    return await file.text();
  } catch {
    return '';
  }
}

export interface UploadedDocument extends AttachmentMeta {
  /** Extracted text (text-like files only) for AI context. */
  text: string;
}

/**
 * Upload a single document. In production this uploads to Firebase Storage and
 * returns the public URL; here it returns a local URL plus extracted text.
 */
export async function uploadTenantDocument(
  tenantId: string,
  opportunityId: string,
  file: File
): Promise<UploadedDocument> {
  const id = `doc-${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = storagePath(tenantId, opportunityId, file.name);
  const text = await extractDocumentText(file);

  return {
    id,
    name: file.name,
    url: `local://${path}`,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    text
  };
}

export function isAcceptedFile(file: File): boolean {
  if (file.type && ACCEPTED_DOCUMENT_TYPES.includes(file.type)) return true;
  const lower = file.name.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}