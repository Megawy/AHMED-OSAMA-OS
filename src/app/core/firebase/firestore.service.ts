import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Firestore,
  DocumentData,
} from 'firebase/firestore';

import { mapFirestoreDoc } from '../utils/firestore.mapper';
import { firebaseApp } from './firebase.config';

export interface QueryOptions {
  where?: { field: string; op: string; value: unknown }[];
  orderBy?: { field: string; direction?: 'asc' | 'desc' }[];
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  readonly db: Firestore = getFirestore(firebaseApp);

  async getCollection<T>(path: string, options?: QueryOptions): Promise<T[]> {
    const constraints = this.buildConstraints(options);
    return this.query<T>(path, ...constraints);
  }

  async query<T>(path: string, ...constraints: QueryConstraint[]): Promise<T[]> {
    const ref = collection(this.db, path);
    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...mapFirestoreDoc<Record<string, unknown>>(d.data()),
    })) as T[];
  }

  async getDocument<T>(path: string): Promise<T> {
    const snapshot = await getDoc(doc(this.db, path));

    if (!snapshot.exists()) {
      throw new Error(`Document not found: ${path}`);
    }

    return {
      id: snapshot.id,
      ...mapFirestoreDoc<Record<string, unknown>>(snapshot.data()),
    } as T;
  }

  create(path: string, data: DocumentData) {
    return addDoc(collection(this.db, path), data);
  }

  update(path: string, id: string, data: Partial<DocumentData>) {
    return updateDoc(doc(this.db, `${path}/${id}`), data);
  }

  delete(path: string, id: string) {
    return deleteDoc(doc(this.db, `${path}/${id}`));
  }

  private buildConstraints(options?: QueryOptions): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (options?.where) {
      for (const w of options.where) {
        constraints.push(where(w.field, w.op as Parameters<typeof where>[1], w.value));
      }
    }

    if (options?.orderBy) {
      for (const o of options.orderBy) {
        constraints.push(orderBy(o.field, o.direction ?? 'asc'));
      }
    }

    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    return constraints;
  }
}

export { where, orderBy, limit };
