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
        if (attempt < MAX_RETRIES && isRetryable(err)) {
          await wait(500 * 2 ** (attempt - 1));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
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
