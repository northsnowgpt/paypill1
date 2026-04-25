'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Pill, Calendar, MessageSquare, Brain, 
  Settings, User, LogOut, ChevronLeft, ChevronRight, Shield,
  Sparkles, FileText, Heart
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Dashboard from './Dashboard';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import Medications from './Medications';
import Appointments from './Appointments';
import Messaging from './Messaging';
import AIInsights from './AIInsights';
import HealthRecords from './HealthRecords';
import SettingsPanel from './SettingsPanel';

export default function IndividualPortal() {
  const { 
    onboardingComplete, 
    sidebarOpen, 
    toggleSidebar, 
    activeTab, 
    setActiveTab,
    logout 
  } = useAppStore();

  const [showOnboarding, setShowOnboarding] = useState(!onboardingComplete);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'messaging', label: 'Messages', icon: MessageSquare },
    { id: 'records', label: 'Health Records', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (showOnboarding && !onboardingComplete) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-slate-800">PayPill</span>}
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100">
          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm text-slate-500">AI-Powered Health Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              HIPAA Compliant
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'medications' && <Medications />}
              {activeTab === 'appointments' && <Appointments />}
              {activeTab === 'ai-insights' && <AIInsights />}
              {activeTab === 'messaging' && <Messaging />}
              {activeTab === 'records' && <HealthRecords />}
              {activeTab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
