import { defineScript } from 'rwsdk/worker';
import { getDb, setupDb } from '@/db';

export default defineScript(async ({ env }) => {
  await setupDb(env);

  await getDb().$executeRawUnsafe(`\
    DELETE FROM User;
    DELETE FROM sqlite_sequence;
  `);

  await getDb().user.create({
    data: {
      id: '1',
      username: 'testuser',
    },
  });

  console.log('🌱 Finished seeding');
});
