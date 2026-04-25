'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, Lock, Bell, Moon, Globe, 
  Smartphone, Fingerprint, Key, ChevronRight, AlertTriangle,
  Link2, Database, FileCheck, Eye, EyeOff
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('security');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'blockchain', label: 'Blockchain Sharing', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account, security, and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white border border-slate-200"
          >
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'preferences' && <PreferenceSettings />}
            {activeTab === 'blockchain' && <BlockchainSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-500" />
        Security & Privacy
      </h3>

      <div className="space-y-4">
        <SettingCard
          icon={<Lock className="w-5 h-5 text-primary-500" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          action={<Toggle enabled={true} />}
        />
        <SettingCard
          icon={<Fingerprint className="w-5 h-5 text-primary-500" />}
          title="Biometric Login"
          description="Use fingerprint or face recognition to sign in"
          action={<Toggle enabled={false} />}
        />
        <SettingCard
          icon={<Key className="w-5 h-5 text-primary-500" />}
          title="Change Password"
          description="Last changed 3 months ago"
          action={<button className="text-sm text-primary-600 font-medium">Update</button>}
        />
        <SettingCard
          icon={<Eye className="w-5 h-5 text-primary-500" />}
          title="Data Encryption"
          description="All health records are encrypted at rest and in transit"
          action={<span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">Active</span>}
        />
        <SettingCard
          icon={<FileCheck className="w-5 h-5 text-primary-500" />}
          title="HIPAA Compliance Mode"
          description="Enhanced audit logging and access controls"
          action={<Toggle enabled={true} />}
        />
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Privacy Notice</p>
            <p className="text-sm text-amber-600 mt-1">
              Your health data is protected under HIPAA. We never share your information with third parties 
              without your explicit consent. All data is stored with AES-256 encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary-500" />
        Notification Preferences
      </h3>

      <div className="space-y-4">
        <SettingCard
          icon={<Pill className="w-5 h-5 text-teal-500" />}
          title="Medication Reminders"
          description="Daily reminders for scheduled medications"
          action={<Toggle enabled={true} />}
        />
        <SettingCard
          icon={<Calendar className="w-5 h-5 text-primary-500" />}
          title="Appointment Alerts"
          description="Reminders 24 hours and 1 hour before appointments"
          action={<Toggle enabled={true} />}
        />
        <SettingCard
          icon={<Brain className="w-5 h-5 text-amber-500" />}
          title="AI Insights"
          description="New recommendations and health alerts"
          action={<Toggle enabled={true} />}
        />
        <SettingCard
          icon={<MessageSquare className="w-5 h-5 text-primary-500" />}
          title="Provider Messages"
          description="Notifications for new secure messages"
          action={<Toggle enabled={true} />}
        />
        <SettingCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          title="Health Reports"
          description="Weekly and monthly health summaries"
          action={<Toggle enabled={false} />}
        />
      </div>
    </div>
  );
}

function PreferenceSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary-500" />
        Application Preferences
      </h3>

      <div className="space-y-4">
        <SettingCard
          icon={<Moon className="w-5 h-5 text-slate-500" />}
          title="Dark Mode"
          description="Switch between light and dark themes"
          action={<Toggle enabled={false} />}
        />
        <SettingCard
          icon={<Globe className="w-5 h-5 text-primary-500" />}
          title="Language"
          description="Select your preferred language"
          action={
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          }
        />
        <SettingCard
          icon={<Smartphone className="w-5 h-5 text-primary-500" />}
          title="Compact View"
          description="Reduce spacing for more content on screen"
          action={<Toggle enabled={false} />}
        />
      </div>
    </div>
  );
}

function BlockchainSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Blockchain Smart Contract Sharing</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Coming Soon</span>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
        <p className="text-sm text-purple-800 leading-relaxed">
          Future feature: Share encrypted health records via immutable blockchain smart contracts. 
          Grant time-limited access to providers with automatic revocation. All access logged 
          on-chain for complete auditability.
        </p>
      </div>

      <div className="space-y-4">
        <SettingCard
          icon={<Link2 className="w-5 h-5 text-purple-500" />}
          title="Enable Blockchain Sharing"
          description="Activate smart contract-based record sharing"
          action={<Toggle enabled={false} />}
        />
        <SettingCard
          icon={<Database className="w-5 h-5 text-purple-500" />}
          title="Preferred Network"
          description="Select blockchain network for smart contracts"
          action={
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white" disabled>
              <option>Ethereum (Mainnet)</option>
              <option>Polygon</option>
              <option>Hyperledger Fabric</option>
            </select>
          }
        />
        <SettingCard
          icon={<Shield className="w-5 h-5 text-purple-500" />}
          title="Zero-Knowledge Proofs"
          description="Share verified health claims without revealing full records"
          action={<Toggle enabled={false} />}
        />
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">How it works</h4>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            Encrypt health record with patient-controlled key
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            Deploy smart contract defining access rules and duration
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            Provider requests access via on-chain transaction
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            Automatic revocation when contract expires
          </li>
        </ol>
      </div>
    </div>
  );
}

function SettingCard({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description: string; action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium text-slate-800 text-sm">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button className={`w-11 h-6 rounded-full transition-colors relative ${
      enabled ? 'bg-primary-500' : 'bg-slate-300'
    }`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

// Import missing icons
import { Pill, Calendar, Brain, MessageSquare, TrendingUp } from 'lucide-react';
