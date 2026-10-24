// ============================================================================
// Sentinel AI — Gemini Settings & Configuration Manager
// ============================================================================

import { AISettings } from '../types';

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: AISettings = {
    aiTone: 'Professional',
    responseLength: 'Balanced',
    language: 'English',
    streamingEnabled: true,
    cachingEnabled: true,
    privacyMode: 'Strict (No External Logs)',
  };

  private constructor() {}

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  public getSettings(): AISettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<AISettings>): AISettings {
    this.settings = {
      ...this.settings,
      ...updates,
    };
    return this.getSettings();
  }

  public resetToDefaults(): AISettings {
    this.settings = {
      aiTone: 'Professional',
      responseLength: 'Balanced',
      language: 'English',
      streamingEnabled: true,
      cachingEnabled: true,
      privacyMode: 'Strict (No External Logs)',
    };
    return this.getSettings();
  }
}
