// One-shot dedupe: maps legacy auto-id technology docs to the slug-based docs
// from seed-data, rewrites project references, then deletes the duplicates.
// Run: npx tsx scripts/dedupe-technologies.ts
import { db } from './lib';

// legacy doc id -> canonical slug doc id
const MIGRATION: Record<string, string> = {};

async function main(): Promise<void> {
  const techSnap = await db.collection('technologies').get();
  const byName = new Map<string, { id: string; slugLike: boolean }>();

  for (const doc of techSnap.docs) {
    const name = String(doc.data().name ?? '').trim().toLowerCase();
    if (!name) continue;
    const slugLike = doc.id === name.replace(/\s+/g, '-') || !/^[A-Za-z0-9]{20}$/.test(doc.id);
    const existing = byName.get(name);
    if (!existing || (existing && slugLike && !existing.slugLike)) {
      byName.set(name, { id: doc.id, slugLike });
    }
  }

  // Second pass: auto-id docs whose name collides with a slug-like doc
  for (const doc of techSnap.docs) {
    const name = String(doc.data().name ?? '').trim().toLowerCase();
    const canonical = byName.get(name);
    if (canonical && canonical.id !== doc.id) {
      MIGRATION[doc.id] = canonical.id;
    }
  }

  if (!Object.keys(MIGRATION).length) {
    console.log('✓ No duplicate technologies found');
    process.exit(0);
  }
  console.log(`→ Duplicates to merge: ${JSON.stringify(MIGRATION, null, 2)}`);

  // Rewrite project references
  const projectsSnap = await db.collection('projects').get();
  let projectsUpdated = 0;
  for (const project of projectsSnap.docs) {
    const techs: string[] = project.data().technologies ?? [];
    const mapped = techs.map((t) => MIGRATION[t] ?? t);
    const unique = [...new Set(mapped)];
    if (unique.join('|') !== techs.join('|')) {
      await project.ref.set({ technologies: unique }, { merge: true });
      projectsUpdated++;
      console.log(`  ✓ rewired project: ${project.data().title} (${project.id})`);
    }
  }

  // Delete duplicate tech docs
  for (const oldId of Object.keys(MIGRATION)) {
    await db.collection('technologies').doc(oldId).delete();
    console.log(`  ✓ deleted duplicate tech doc: ${oldId}`);
  }

  const remaining = await db.collection('technologies').get();
  console.log(
    `✓ Done — duplicates removed: ${Object.keys(MIGRATION).length}, projects rewired: ${projectsUpdated}, total technologies now: ${remaining.size}`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ Dedupe failed:', e);
  process.exit(1);
});
