/* eslint-disable no-undef */
import { DurableObject } from 'cloudflare:workers';
import type { ThemeState, Theme, Reaction } from './types/reaction';

export class ReactionsDurableObject extends DurableObject {
  private state: DurableObjectState;
  private reactions: Reaction[] = [];
  private themeState: ThemeState | undefined = undefined;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.state = state;
  }

  async getReactions(): Promise<Reaction[]> {
    if (this.reactions.length === 0) {
      const stored = await this.state.storage.get<Reaction[]>('reactions');
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
    await this.state.storage.put('reactions', this.reactions);
  }

  async getThemeState(): Promise<ThemeState> {
    if (!this.themeState) {
      const stored = await this.state.storage.get<ThemeState>('themeState');
      this.themeState = stored || { currentTheme: 'react', lastChanged: 0 };
    }

    const now = Date.now();
    const cooldownDuration = 10 * 1000; // 10 seconds
    const timeSinceLastChange = now - this.themeState.lastChanged;
    const remainingCooldown =
      timeSinceLastChange < cooldownDuration ? Math.ceil((cooldownDuration - timeSinceLastChange) / 1000) : 0;

    return {
      ...this.themeState,
      remainingCooldown,
    };
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

    await this.state.storage.put('themeState', this.themeState);
    return { success: true };
  }
}
