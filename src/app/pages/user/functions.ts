'use server';

import { requestInfo } from 'rwsdk/worker';
import { z } from 'zod';
import { db } from '@/db';
import { sessions } from '@/session/store';
import { slow } from '@/utils/slow';

const usernameSchema = z.string().min(3, 'Username must be at least 3 characters');

export async function register(username: string) {
  const validatedUsername = usernameSchema.parse(username);
  const { response } = requestInfo;

  await slow();

  const existingUser = await db.user.findFirst({
    where: {
      username: validatedUsername,
    },
  });

  if (existingUser) {
    return false;
  }

  const user = await db.user.create({
    data: {
      username: validatedUsername,
    },
  });

  await sessions.save(response.headers, {
    userId: user.id,
  });

  return true;
}

export async function login(username: string) {
  const validatedUsername = usernameSchema.parse(username);
  const { response } = requestInfo;

  await slow();

  const user = await db.user.findFirst({
    where: {
      username: validatedUsername,
    },
  });

  if (!user) {
    return false;
  }

  await sessions.save(response.headers, {
    userId: user.id,
  });

  return true;
}
