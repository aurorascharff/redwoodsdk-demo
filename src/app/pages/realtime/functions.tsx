'use server';

import { env } from 'cloudflare:workers';
import type { Theme } from '@/types/reaction';

export const getReactions = async () => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  return reactionsDO.getReactions();
};

export const addReaction = async (emoji: string) => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  await reactionsDO.addReaction(emoji);
};

export const getThemeState = async () => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  return reactionsDO.getThemeState();
};

export const setTheme = async (theme: Theme) => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  await reactionsDO.setTheme(theme);
};
