import { useState } from 'react';
import { User, KeyRound, BrainCircuit, Bell, Palette } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

type SettingsTab = 'profile' | 'api-keys' | 'llm' | 'notifications' | 'appearance';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: KeyRound },
  { id: 'llm', label: 'LLM Configuration', icon: BrainCircuit },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({ name: user?.fullName ?? '', email: user?.email ?? '', role: user?.role ?? 'DevOps Engineer' });
  const [apiKeys, setApiKeys] = useState({ openai: '', anthropic: '', github: '', qdrant: '' });
  const [llmConfig, setLlmConfig] = useState({ provider: 'Anthropic', model: 'claude-sonnet-4-6', temperature: 0.3, maxTokens: 2048 });
  const [notifications, setNotifications] = useState({ emailAlerts: true, criticalIssueAlerts: true, weeklyDigest: false, productUpdates: true });
  const [appearance, setAppearance] = useState({ darkMode: true, compactMode: false, reducedMotion: false });

  const handleSave = (message: string) => {
    // TODO(flask-integration): persist these settings via the future /settings endpoints.
    showToast({ variant: 'success', title: 'Saved', description: message });
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, API keys, and platform preferences." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-bg-surface p-1.5 lg:flex-col lg:overflow-visible" aria-label="Settings sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                activeTab === tab.id ? 'bg-primary-muted text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="card p-6">
          {activeTab === 'profile' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">Profile</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-semibold text-white">
                  {profile.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <button type="button" className="btn-secondary text-xs">Change avatar</button>
              </div>
              <div>
                <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-text-secondary">Name</label>
                <input id="profile-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label htmlFor="profile-email" className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
                <input id="profile-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label htmlFor="profile-role" className="mb-1.5 block text-xs font-medium text-text-secondary">Role</label>
                <input id="profile-role" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="input-field" />
              </div>
              <button type="button" onClick={() => handleSave('Your profile has been updated.')} className="btn-primary">Save changes</button>
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">API Keys</h2>
              <p className="text-xs text-text-secondary">Keys are stored securely and never displayed in full once saved.</p>
              {[
                { label: 'OpenAI API key', value: apiKeys.openai, key: 'openai' as const, placeholder: 'sk-••••••••••••••••' },
                { label: 'Anthropic API key', value: apiKeys.anthropic, key: 'anthropic' as const, placeholder: 'sk-ant-••••••••••••••••' },
                { label: 'GitHub token', value: apiKeys.github, key: 'github' as const, placeholder: 'ghp_••••••••••••••••' },
                { label: 'Qdrant API key', value: apiKeys.qdrant, key: 'qdrant' as const, placeholder: 'qdrant-••••••••••••••••' },
              ].map((field) => (
                <div key={field.key}>
                  <label htmlFor={field.key} className="mb-1.5 block text-xs font-medium text-text-secondary">{field.label}</label>
                  <input
                    id={field.key}
                    type="password"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => setApiKeys({ ...apiKeys, [field.key]: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleSave('API keys saved securely.')} className="btn-primary">Save keys</button>
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">LLM Configuration</h2>
              <div>
                <label htmlFor="llm-provider" className="mb-1.5 block text-xs font-medium text-text-secondary">Provider</label>
                <select id="llm-provider" value={llmConfig.provider} onChange={(e) => setLlmConfig({ ...llmConfig, provider: e.target.value })} className="input-field">
                  <option value="Anthropic">Anthropic</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Local">Local</option>
                </select>
              </div>
              <div>
                <label htmlFor="llm-model" className="mb-1.5 block text-xs font-medium text-text-secondary">Model</label>
                <input id="llm-model" value={llmConfig.model} onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })} className="input-field font-mono text-sm" />
              </div>
              <div>
                <label htmlFor="temperature" className="mb-1.5 flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Temperature</span>
                  <span className="font-mono text-text-primary">{llmConfig.temperature.toFixed(1)}</span>
                </label>
                <input
                  id="temperature"
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={llmConfig.temperature}
                  onChange={(e) => setLlmConfig({ ...llmConfig, temperature: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label htmlFor="max-tokens" className="mb-1.5 block text-xs font-medium text-text-secondary">Max tokens</label>
                <input
                  id="max-tokens"
                  type="number"
                  value={llmConfig.maxTokens}
                  onChange={(e) => setLlmConfig({ ...llmConfig, maxTokens: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <button type="button" onClick={() => handleSave('LLM configuration updated.')} className="btn-primary">Save configuration</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">Notification Settings</h2>
              {[
                { key: 'emailAlerts' as const, label: 'Email alerts', description: 'Receive an email when an analysis completes.' },
                { key: 'criticalIssueAlerts' as const, label: 'Critical issue alerts', description: 'Get notified immediately for critical severity issues.' },
                { key: 'weeklyDigest' as const, label: 'Weekly digest', description: 'A weekly summary of debugging activity.' },
                { key: 'productUpdates' as const, label: 'Product updates', description: 'News about new DevOpsGPT features.' },
              ].map((item) => (
                <label key={item.key} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-bg-elevated p-3.5">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border bg-bg-elevated accent-primary"
                  />
                </label>
              ))}
              <button type="button" onClick={() => handleSave('Notification preferences saved.')} className="btn-primary">Save preferences</button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>
              {[
                { key: 'darkMode' as const, label: 'Dark theme', description: 'DevOpsGPT is optimized for dark mode.' },
                { key: 'compactMode' as const, label: 'Compact mode', description: 'Reduce spacing for denser information display.' },
                { key: 'reducedMotion' as const, label: 'Reduced motion', description: 'Minimize animations and transitions.' },
              ].map((item) => (
                <label key={item.key} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-bg-elevated p-3.5">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={appearance[item.key]}
                    disabled={item.key === 'darkMode'}
                    onChange={(e) => setAppearance({ ...appearance, [item.key]: e.target.checked })}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border bg-bg-elevated accent-primary disabled:opacity-60"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
