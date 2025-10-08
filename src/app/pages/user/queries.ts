import { requestInfo } from 'rwsdk/worker';

export async function getCurrentUserId(): Promise<string> {
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }
  return ctx.user.id;
}

export async function getCurrentUser() {
  const { ctx } = requestInfo;
  return ctx.user;
}
