/* eslint-disable no-undef */
import { DurableObject } from 'cloudflare:workers';

export interface Reaction {
  emoji: string;
  id: string;
  timestamp: number;
}

export type Theme = 'lasvegas' | 'react';

export interface ThemeState {
  currentTheme: Theme;
  lastChanged: number;
}

export class ReactionsDurableObject extends DurableObject {
  private reactions: Reaction[] = [];
  private themeState: ThemeState | undefined = undefined;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async getReactions(): Promise<Reaction[]> {
    if (this.reactions.length === 0) {
      const stored = await this.ctx.storage.get<Reaction[]>('reactions');
      this.reactions = stored || [{ emoji: '⚛️', id: 'initial', timestamp: Date.now() }];
    }
    return this.reactions;
  }

  async addReaction(emoji: string): Promise<void> {
    const reaction: Reaction = {
      emoji,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    this.reactions.push(reaction);
    await this.ctx.storage.put('reactions', this.reactions);
  }

  async getThemeState(): Promise<ThemeState> {
    if (!this.themeState) {
      const stored = await this.ctx.storage.get<ThemeState>('themeState');
      this.themeState = stored || { currentTheme: 'react', lastChanged: 0 };
    }
    return this.themeState;
  }

  async setTheme(theme: Theme): Promise<{ success: boolean; remainingCooldown?: number }> {
    const currentState = await this.getThemeState();
    const now = Date.now();
    const cooldownDuration = 10 * 1000; // 10 seconds
    const timeSinceLastChange = now - currentState.lastChanged;

    if (timeSinceLastChange < cooldownDuration) {
      const remainingCooldown = Math.ceil((cooldownDuration - timeSinceLastChange) / 1000);
      return { remainingCooldown, success: false };
    }

    this.themeState = {
      currentTheme: theme,
      lastChanged: now,
    };

    await this.ctx.storage.put('themeState', this.themeState);
    return { success: true };
  }
}
