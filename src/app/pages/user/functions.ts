'use server';

import { requestInfo } from 'rwsdk/worker';
import { z } from 'zod';
import { db } from '@/db';

const usernameSchema = z.string().min(3, 'Username must be at least 3 characters');

export async function register(username: string) {
  const validatedUsername = usernameSchema.parse(username);
  const { response } = requestInfo;

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

  response.headers.set('Set-Cookie', `userId=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return true;
}

export async function login(username: string) {
  const validatedUsername = usernameSchema.parse(username);
  const { response } = requestInfo;

  const user = await db.user.findFirst({
    where: {
      username: validatedUsername,
    },
  });

  if (!user) {
    return false;
  }

  response.headers.set('Set-Cookie', `userId=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return true;
}
