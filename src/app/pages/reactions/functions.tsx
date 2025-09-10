'use server';

import { env } from 'cloudflare:workers';
import { renderRealtimeClients } from 'rwsdk/realtime/worker';
import type { Reaction, ThemeState } from '@/reactionsDurableObject';
import type { Theme } from './EmojiPicker';

export const getReactions = async (): Promise<Reaction[]> => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  return reactionsDO.getReactions();
};

export const addReaction = async (emoji: string): Promise<void> => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  await reactionsDO.addReaction(emoji);

  await renderRealtimeClients({
    durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
    key: 'reactions',
  });
};

export const getThemeState = async (): Promise<ThemeState> => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  return reactionsDO.getThemeState();
};

export const setTheme = async (theme: Theme): Promise<{ remainingCooldown?: number; success: boolean }> => {
  const doId = env.REACTIONS_DURABLE_OBJECT.idFromName('reactions');
  const reactionsDO = env.REACTIONS_DURABLE_OBJECT.get(doId);
  const result = await reactionsDO.setTheme(theme);

  if (result.success) {
    await renderRealtimeClients({
      durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
      key: 'reactions',
    });
  }

  return result;
};
