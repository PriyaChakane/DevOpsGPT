export interface ProfileSettings {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface ApiKeySettings {
  openaiApiKey: string;
  anthropicApiKey: string;
  githubToken: string;
  qdrantApiKey: string;
}

export interface LlmConfiguration {
  provider: 'OpenAI' | 'Anthropic' | 'Local';
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  criticalIssueAlerts: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
}

export interface AppearanceSettings {
  darkMode: boolean;
  compactMode: boolean;
  reducedMotion: boolean;
}
