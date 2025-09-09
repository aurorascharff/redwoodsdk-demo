'use server';

import { env } from 'cloudflare:workers';
import { renderRealtimeClients } from 'rwsdk/realtime/worker';

export let REACTIONS = ['🤦‍♂️'];

export type Theme = 'lasvegas' | 'react';

export const themes = {
  lasvegas: {
    colors: 'from-yellow-400 to-red-600',
    description: 'What happens in Vegas...',
    emojis: ['🎰', '🎲', '🃏', '💎', '🎯', '🎊', '💸', '🏆', '🔥'],
    name: 'Las Vegas',
  },
  react: {
    colors: 'from-blue-400 to-cyan-600',
    description: 'Build amazing UIs',
    emojis: ['⚛️', '🚀', '💙', '🔥', '⚡', '🧪', '🎯', '💻', '🛠️'],
    name: 'React',
  },
} as const;

export function addReaction(reaction: string) {
  REACTIONS = [...REACTIONS, reaction];
}

export function getReactions() {
  return REACTIONS;
}

export async function resetActions() {
  REACTIONS = ['🤷‍♂️'];

  await renderRealtimeClients({
    durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
    key: 'redwood-realtime-client-key',
  });
}
