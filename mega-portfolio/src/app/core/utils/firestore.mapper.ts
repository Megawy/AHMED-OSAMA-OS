import { Timestamp } from 'firebase/firestore';

const DATE_FIELDS = ['createdAt', 'updatedAt'] as const;

export function mapFirestoreDoc<T extends Record<string, unknown>>(
  data: Record<string, unknown>
): T {
  const mapped: Record<string, unknown> = { ...data };

  for (const field of DATE_FIELDS) {
    const value = mapped[field];
    if (value instanceof Timestamp) {
      mapped[field] = value.toDate();
    }
  }

  return mapped as T;
}

export function mapFirestoreDocs<T extends Record<string, unknown>>(
  docs: { id: string; data: () => Record<string, unknown> }[]
): (T & { id: string })[] {
  return docs.map((doc) => ({
    id: doc.id,
    ...mapFirestoreDoc<T>(doc.data()),
  }));
}
