import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  listAll,
  type FirebaseStorage,
  type StorageError,
} from 'firebase/storage';

import { firebaseApp } from './firebase.config';

export interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
}

const MAX_RETRIES = 3;

/** Errors that will never succeed on retry (permissions / config). */
const NON_RETRYABLE_CODES = new Set([
  'unauthorized',
  'unauthenticated',
  'quota-exceeded',
  'bucket-not-found',
  'project-not-found',
  'invalid-argument',
]);

function isRetryable(err: unknown): boolean {
  const code = (err as StorageError)?.code?.replace(/^storage\//, '');
  if (code && NON_RETRYABLE_CODES.has(code)) return false;
  // Network-level failures (ERR_HTTP2_PROTOCOL_ERROR, connection resets, ...)
  // surface as 'storage/unknown' or generic errors — safe to retry.
  return true;
}

/** Maps Firebase Storage error codes to actionable messages. */
function describeUploadError(err: unknown): string {
  const storageErr = err as StorageError;
  const code = storageErr?.code ?? 'unknown';
  switch (code.replace(/^storage\//, '')) {
    case 'unauthorized':
    case 'unauthenticated':
      return 'Upload denied by security rules — make sure you are signed in as an active admin.';
    case 'quota-exceeded':
      return 'Storage quota exceeded — check the Firebase billing plan.';
    case 'bucket-not-found':
      return 'Storage bucket not found — run: npm run provision-storage';
    case 'canceled':
      return 'Upload was canceled.';
    case 'retry-limit-expired':
      return 'Upload failed after several retries — check your network connection.';
    default:
      return storageErr?.message ?? 'Upload failed due to a network error. Please try again.';
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly storage: FirebaseStorage = getStorage(firebaseApp);

  async uploadFile(file: File, folder: string): Promise<UploadedFile> {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${timestamp}_${safeName}`;
    const storageRef = ref(this.storage, path);

    // Transient transport errors (e.g. ERR_HTTP2_PROTOCOL_ERROR) are common on
    // flaky networks — retry with exponential backoff before giving up.
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return {
          name: file.name,
          url,
          path,
          size: file.size,
          type: file.type,
        };
      } catch (err) {
        lastError = err;
        const code = (err as StorageError)?.code ?? 'unknown';
        console.error(`[StorageService] upload attempt ${attempt}/${MAX_RETRIES} failed`, {
          code,
          path,
          message: (err as Error)?.message,
        });
        if (attempt < MAX_RETRIES && isRetryable(err)) {
          await wait(500 * 2 ** (attempt - 1));
          continue;
        }
        throw new Error(describeUploadError(lastError));
      }
    }
    throw new Error(describeUploadError(lastError));
  }

  async deleteFile(path: string): Promise<void> {
    await deleteObject(ref(this.storage, path));
  }

  async getDownloadUrl(path: string): Promise<string> {
    return getDownloadURL(ref(this.storage, path));
  }

  async listFolder(folder: string): Promise<UploadedFile[]> {
    const folderRef = ref(this.storage, folder);
    const result = await listAll(folderRef);

    const items = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url,
          path: item.fullPath,
          size: 0,
          type: '',
        } as UploadedFile;
      }),
    );

    return items;
  }
}
