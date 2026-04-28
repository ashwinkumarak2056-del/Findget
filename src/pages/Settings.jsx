import React, { useState } from 'react';
import { Moon, Sun, Monitor, User, Building2, Bell, Shield, Database, Save } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAppContext } from '../context/AppContext';

const Settings = () => {
  const { state, dispatch } = useAppContext();
  const { theme, userMode, profile } = state.settings;
  const [selectedTab, setSelectedTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: profile?.name || '', email: profile?.email || '' });

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme && newTheme !== 'system') {
      dispatch({ type: 'TOGGLE_THEME' });
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode !== userMode) {
      dispatch({ type: 'SET_USER_MODE', payload: newMode });
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Export', icon: Database },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Platform Settings</h2>
        <p className="text-[var(--text-muted)] text-sm">Manage your account, preferences, and enterprise features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-fin-primary/20 text-fin-primary font-medium'
                    : 'text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-2 space-y-6">
          {selectedTab === 'profile' && (
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Profile Information</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">Update your account details and public profile.</p>
              
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-fin-primary text-white rounded-xl hover:bg-fin-primary/90 transition-colors">
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {selectedTab === 'preferences' && (
            <>
              <GlassCard>
                <h3 className="text-lg font-bold mb-4">Platform Mode</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">Switch between Personal Finance and Enterprise Commercial modes.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleModeChange('personal')}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      userMode === 'personal' 
                        ? 'border-fin-primary bg-fin-primary/10' 
                        : 'border-[var(--border-color)] hover:border-fin-primary/50 bg-black/5 dark:bg-white/5'
                    }`}
                  >
                    <User size={32} className={`mb-3 ${userMode === 'personal' ? 'text-fin-primary' : 'text-[var(--text-muted)]'}`} />
                    <span className="font-bold">Personal Mode</span>
                    <span className="text-xs text-[var(--text-muted)] mt-1">Individual expense tracking</span>
                  </button>

                  <button 
                    onClick={() => handleModeChange('commercial')}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      userMode === 'commercial' 
                        ? 'border-fin-primary bg-fin-primary/10' 
                        : 'border-[var(--border-color)] hover:border-fin-primary/50 bg-black/5 dark:bg-white/5'
                    }`}
                  >
                    <Building2 size={32} className={`mb-3 ${userMode === 'commercial' ? 'text-fin-primary' : 'text-[var(--text-muted)]'}`} />
                    <span className="font-bold">Commercial Mode</span>
                    <span className="text-xs text-[var(--text-muted)] mt-1">Enterprise invoice & vendor tools</span>
                  </button>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-bold mb-4">Appearance</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">Customize the UI theme.</p>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleThemeChange('light')}
                    className={`flex-1 flex items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'light' ? 'border-fin-primary bg-fin-primary/10 text-fin-primary font-bold' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-black/5'
                    }`}
                  >
                    <Sun size={20} className="mr-2" /> Light
                  </button>
                  <button 
                    onClick={() => handleThemeChange('dark')}
                    className={`flex-1 flex items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'dark' ? 'border-fin-primary bg-fin-primary/10 text-fin-primary font-bold' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/5'
                    }`}
                  >
                    <Moon size={20} className="mr-2" /> Dark
                  </button>
                </div>
              </GlassCard>
            </>
          )}

          {selectedTab === 'notifications' && (
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Notifications</h3>
              <p className="text-sm text-[var(--text-muted)]">Configure how you receive alerts and updates.</p>
              <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center text-[var(--text-muted)] text-sm">
                No notification channels configured yet.
              </div>
            </GlassCard>
          )}

          {selectedTab === 'security' && (
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Security</h3>
              <p className="text-sm text-[var(--text-muted)]">Manage your password and security options.</p>
              <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center text-[var(--text-muted)] text-sm">
                Security settings are currently managed by your identity provider.
              </div>
            </GlassCard>
          )}

          {selectedTab === 'data' && (
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                  <div>
                    <h4 className="font-bold text-sm">Export All Data</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Download your expenses and settings as JSON/CSV.</p>
                  </div>
                  <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Export</button>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div>
                    <h4 className="font-bold text-sm text-red-500">Reset Account</h4>
                    <p className="text-xs text-red-400/80 mt-1">Permanently delete all your data and start fresh.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">
                    Reset Data
                  </button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
