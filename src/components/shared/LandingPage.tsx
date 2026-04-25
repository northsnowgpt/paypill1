'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Shield, Brain, Users, Building2, Landmark,
  ChevronRight, Activity, Lock, MessageSquare, Globe,
  Stethoscope, Pill, Calendar, TrendingUp, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { UserRole } from '@/types';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { setUser, setRole } = useAppStore();

  const handleLogin = (role: UserRole) => {
    setUser({
      id: 'demo-user',
      role,
      email: 'demo@paypill.com',
      firstName: 'Demo',
      lastName: 'User',
      termsAccepted: true,
      createdAt: new Date().toISOString(),
    });
    setRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">PayPill</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setShowAuth(true); setAuthMode('login'); }}
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => { setShowAuth(true); setAuthMode('register'); }}
              className="btn-primary text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8">
              <SparkleIcon />
              <span>AI-Powered Healthcare Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Healthcare that{' '}
              <span className="bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
                thinks ahead
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              PayPill connects individuals, employers, and insurers through intelligent 
              medication management, AI-driven insights, and seamless care coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => { setShowAuth(true); setAuthMode('register'); }}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Your Journey
                <ChevronRight className="inline w-5 h-5 ml-2" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '$12M', label: 'Cost Savings' },
              { value: '94%', label: 'Adherence Rate' },
              { value: '3.2K', label: 'Provider Network' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Three Tiers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Three Tiers. One Platform.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Whether you're managing your own health, a workforce, or an insurance portfolio — 
              PayPill adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TierCard 
              icon={<Users className="w-8 h-8" />}
              title="Individual"
              subtitle="Personal Health Intelligence"
              description="AI-powered medication recommendations, provider matching, and health tracking with encrypted record storage."
              features={[
                'Smart medication reminders',
                'AI health insights & research',
                'Nearby provider discovery',
                'Secure messaging with doctors',
                'Appointment scheduling',
              ]}
              color="primary"
              onClick={() => handleLogin('individual')}
            />
            <TierCard 
              icon={<Building2 className="w-8 h-8" />}
              title="Employer"
              subtitle="Workforce Health Management"
              description="Bulk employee onboarding, anonymized health analytics, and cost-saving tracking for your organization."
              features={[
                'Bulk employee onboarding',
                'Anonymized health dashboards',
                'Adherence tracking',
                'Cost-saving analytics',
                'Compliance reporting',
              ]}
              color="teal"
              onClick={() => handleLogin('employer')}
            />
            <TierCard 
              icon={<Landmark className="w-8 h-8" />}
              title="Insurance"
              subtitle="Member Outcome Portal"
              description="Fixed-fee contract management, generic drug savings tracking, and direct payment routing."
              features={[
                'Fixed-fee contract tracking',
                'Generic savings monitoring',
                'Member outcome analytics',
                'Financial routing logic',
                'Risk assessment tools',
              ]}
              color="slate"
              onClick={() => handleLogin('insurance')}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for Modern Healthcare
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain className="w-6 h-6" />, title: 'AI Health Insights', desc: 'Gemini-powered analysis of your health data with research-backed recommendations' },
              { icon: <Pill className="w-6 h-6" />, title: 'Generic Savings', desc: 'Automatic detection of generic alternatives with real-time price comparisons' },
              { icon: <Shield className="w-6 h-6" />, title: 'Encrypted Records', desc: 'Military-grade encryption for all health data with zero-knowledge architecture' },
              { icon: <MessageSquare className="w-6 h-6" />, title: 'Secure Messaging', desc: 'HIPAA-compliant messaging between patients and healthcare providers' },
              { icon: <Calendar className="w-6 h-6" />, title: 'Smart Scheduling', desc: 'AI-optimized appointment booking based on proximity and availability' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Outcome Tracking', desc: 'Real-time monitoring of health adherence and cost-saving metrics' },
              { icon: <Lock className="w-6 h-6" />, title: 'Blockchain Ready', desc: 'Future-proof smart contract sharing for immutable health records' },
              { icon: <Globe className="w-6 h-6" />, title: 'Provider Network', desc: 'Connected network of 3,200+ verified healthcare providers and pharmacies' },
              { icon: <Activity className="w-6 h-6" />, title: 'Vital Monitoring', desc: 'Continuous tracking of vitals with automated anomaly detection' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-100 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button 
                onClick={() => setShowAuth(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="input-medical" placeholder="you@company.com" defaultValue="demo@paypill.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" className="input-medical" placeholder="••••••••" defaultValue="password" />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['individual', 'employer', 'insurance'] as UserRole[]).map(role => (
                      <button key={role} className="p-3 rounded-xl border border-slate-200 text-sm font-medium capitalize hover:bg-primary-50 hover:border-primary-200 transition-colors">
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => handleLogin('individual')}
                className="w-full btn-primary mt-2"
              >
                {authMode === 'login' ? 'Sign In' : 'Get Started'}
              </button>

              <p className="text-center text-sm text-slate-500">
                {authMode === 'login' ? (
                  <>Don't have an account? <button onClick={() => setAuthMode('register')} className="text-primary-600 font-medium">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-primary-600 font-medium">Sign in</button></>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PayPill</span>
            </div>
            <p className="text-sm">Intelligent healthcare management for the modern world.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>Individual Portal</li>
              <li>Employer Dashboard</li>
              <li>Insurance Management</li>
              <li>Provider Network</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Security</li>
              <li>Compliance</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>HIPAA Compliance</li>
              <li>Data Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-sm text-center">
          © 2026 PayPill Health Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function TierCard({ icon, title, subtitle, description, features, color, onClick }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  color: string;
  onClick: () => void;
}) {
  const colorClasses = {
    primary: 'from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
    teal: 'from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800',
    slate: 'from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover"
    >
      <div className={`p-6 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
      <div className="p-6">
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <button 
          onClick={onClick}
          className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} transition-all active:scale-[0.98]`}
        >
          Access {title} Portal
        </button>
      </div>
    </motion.div>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.582a.5.5 0 0 1 0 .962l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
    </svg>
  );
}
