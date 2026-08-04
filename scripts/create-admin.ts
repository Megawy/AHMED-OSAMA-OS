import { auth, db, FieldValue, requireEnv } from './lib';

const email = requireEnv('ADMIN_EMAIL');
const password = requireEnv('ADMIN_PASSWORD');
const name = process.env.ADMIN_NAME ?? 'Admin';

async function main(): Promise<void> {
  console.log(`▶ Bootstrapping admin: ${email}`);

  try {
    await auth.getUserByEmail(email);
    console.log('  ✓ auth user exists');
  } catch {
    await auth.createUser({ email, password, displayName: name });
    console.log('  ✓ auth user created');
  }

  const ref = db.collection('admins').doc(email);
  const now = FieldValue.serverTimestamp();
  const exists = (await ref.get()).exists;

  await ref.set(
    exists
      ? { displayName: name, role: 'super_admin', active: true, updatedAt: now }
      : {
          email,
          displayName: name,
          role: 'super_admin',
          active: true,
          createdAt: now,
          updatedAt: now,
        },
    { merge: true },
  );

  console.log(`✓ Admin document ready: admins/${email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('✗ create-admin failed:', e);
  process.exit(1);
});
