import { upsert } from './lib';
import { EXPERIENCE, MEDIA, PROJECTS, SKILLS, TECHNOLOGIES } from './seed-data';

async function main(): Promise<void> {
  console.log('▶ Seeding demo content…');
  await upsert('projects', PROJECTS, true);
  await upsert('technologies', TECHNOLOGIES, false);
  await upsert('skills', SKILLS, false);
  await upsert('experience', EXPERIENCE, true);
  await upsert('media', MEDIA, false);
  console.log('✓ Demo data complete');
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ Demo seed failed:', e);
  process.exit(1);
});
