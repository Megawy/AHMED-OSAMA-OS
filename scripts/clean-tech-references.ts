// Cleans project.technologies arrays: removes references to technology docs
// that no longer exist (deleted duplicates / stale auto-ids).
// Run: npx tsx scripts/clean-tech-references.ts
import { db } from './lib';

async function main(): Promise<void> {
  const techSnap = await db.collection('technologies').get();
  const validIds = new Set(techSnap.docs.map((d) => d.id));
  // Also accept references stored as technology names (case-insensitive).
  const validNames = new Set(
    techSnap.docs.map((d) => String(d.data().name ?? '').trim().toLowerCase()),
  );

  const projectsSnap = await db.collection('projects').get();
  let cleaned = 0;

  for (const project of projectsSnap.docs) {
    const techs: string[] = project.data().technologies ?? [];
    const kept = techs.filter((t) => validIds.has(t) || validNames.has(t.toLowerCase()));
    const removed = techs.filter((t) => !kept.includes(t));

    if (removed.length) {
      await project.ref.set({ technologies: kept }, { merge: true });
      cleaned++;
      console.log(`  ✓ ${project.data().title} (${project.id})`);
      console.log(`      removed: ${removed.join(', ')}`);
    }
  }

  console.log(
    cleaned
      ? `✓ Cleaned stale technology references in ${cleaned} project(s)`
      : '✓ No stale technology references found',
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ Cleanup failed:', e);
  process.exit(1);
});
