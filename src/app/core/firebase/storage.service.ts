import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  listAll,
  type FirebaseStorage,
} from 'firebase/storage';

import { firebaseApp } from './firebase.config';

export interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
}

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

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return {
      name: file.name,
      url,
      path,
      size: file.size,
      type: file.type,
    };
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
