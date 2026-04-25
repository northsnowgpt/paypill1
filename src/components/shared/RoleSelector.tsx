'use client';

import { motion } from 'framer-motion';
import { Users, Building2, Landmark, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { UserRole } from '@/types';

export default function RoleSelector() {
  const { setRole, currentUser } = useAppStore();

  const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'individual',
      title: 'Individual',
      description: 'Manage your personal health, medications, and appointments',
      icon: <Users className="w-8 h-8" />,
      color: 'primary',
    },
    {
      id: 'employer',
      title: 'Employer',
      description: 'Manage workforce health programs and track outcomes',
      icon: <Building2 className="w-8 h-8" />,
      color: 'teal',
    },
    {
      id: 'insurance',
      title: 'Insurance Payor',
      description: 'Monitor contracts, savings, and member outcomes',
      icon: <Landmark className="w-8 h-8" />,
      color: 'slate',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome, {currentUser?.firstName || 'User'}
          </h1>
          <p className="text-slate-500">Select your portal to continue</p>
        </motion.div>

        <div className="space-y-4">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              onClick={() => setRole(role.id)}
              className="w-full p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                  ${role.color === 'primary' ? 'bg-primary-50 text-primary-600' : 
                    role.color === 'teal' ? 'bg-teal-50 text-teal-600' : 
                    'bg-slate-100 text-slate-600'}`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-500">{role.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
