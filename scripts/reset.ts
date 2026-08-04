import { db } from './lib';

const COLLECTIONS = [
  'admins',
  'projects',
  'technologies',
  'skills',
  'experience',
  'messages',
  'settings',
  'media',
  'analytics',
];

async function deleteCollection(name: string): Promise<void> {
  const col = db.collection(name);
  let deleted = 0;
  let snapshot = await col.limit(100).get();
  while (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snapshot.size;
    snapshot = await col.limit(100).get();
  }
  console.log(`  ✓ ${name}: deleted=${deleted}`);
}

async function main(): Promise<void> {
  if (!process.argv.includes('--force')) {
    console.error('✗ Refusing to run: pass --force (npm run reset-db)');
    process.exit(1);
  }
  console.log('▶ Resetting database…');
  for (const name of COLLECTIONS) {
    await deleteCollection(name);
  }
  console.log('✓ Reset complete');
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ Reset failed:', e);
  process.exit(1);
});
