import { ensureAdmin, upsert } from './lib';
import {
  ANALYTICS,
  EXPERIENCE,
  MEDIA,
  MESSAGES,
  PROJECTS,
  SETTINGS,
  SKILLS,
  TECHNOLOGIES,
} from './seed-data';

async function main(): Promise<void> {
  console.log('▶ Seeding all collections (skip existing, use --update to overwrite)…');
  await ensureAdmin();
  await upsert('settings', SETTINGS, true);
  await upsert('analytics', ANALYTICS, true);
  await upsert('projects', PROJECTS, true);
  await upsert('technologies', TECHNOLOGIES, false);
  await upsert('skills', SKILLS, false);
  await upsert('experience', EXPERIENCE, true);
  await upsert('messages', MESSAGES, true);
  await upsert('media', MEDIA, false);
  console.log('✓ Seed complete');
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ Seed failed:', e);
  process.exit(1);
});
