'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, Plus, Clock, AlertTriangle, CheckCircle2, 
  Calendar, User, ChevronRight, Filter
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockHealthRecord } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function Medications() {
  const { healthRecord } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedMed, setSelectedMed] = useState<string | null>(null);

  const record = healthRecord || mockHealthRecord;
  const medications = record.medications || [];

  const filteredMeds = medications.filter(m => {
    if (filter === 'active') return m.isActive;
    if (filter === 'inactive') return !m.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medications</h1>
          <p className="text-slate-500 mt-1">Manage your prescriptions and track adherence</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f 
                ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            {f === 'all' ? 'All Medications' : f === 'active' ? 'Active' : 'Inactive'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
          <Filter className="w-4 h-4" />
          {filteredMeds.length} medications
        </div>
      </div>

      {/* Medication Cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredMeds.map((med, i) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
              selectedMed === med.id ? 'border-primary-400 shadow-lg' : 'border-slate-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedMed(selectedMed === med.id ? null : med.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                  ${med.adherenceStatus === 'adherent' ? 'bg-emerald-50 text-emerald-600' : 
                    med.adherenceStatus === 'partial' ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'}`}>
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{med.name}</h3>
                  <p className="text-sm text-slate-500">{med.genericName || med.name}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                  ${med.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {med.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400">Dosage</p>
                <p className="text-sm font-medium text-slate-700">{med.dosage}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400">Frequency</p>
                <p className="text-sm font-medium text-slate-700">{med.frequency}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400">Route</p>
                <p className="text-sm font-medium text-slate-700 capitalize">{med.route}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Started {formatDate(med.startDate)}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  {med.prescribingProvider}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            {selectedMed === med.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-slate-100 space-y-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Indication</p>
                  <p className="text-sm text-slate-500">{med.indication || 'Not specified'}</p>
                </div>
                {med.sideEffects && med.sideEffects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Known Side Effects</p>
                    <div className="flex flex-wrap gap-2">
                      {med.sideEffects.map((se, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-700">Adherence:</p>
                  <span className={`text-sm font-medium capitalize
                    ${med.adherenceStatus === 'adherent' ? 'text-emerald-600' : 
                      med.adherenceStatus === 'partial' ? 'text-amber-600' :
                      'text-rose-600'}`}>
                    {med.adherenceStatus}
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 btn-primary text-sm py-2">Request Refill</button>
                  <button className="flex-1 btn-secondary text-sm py-2">Set Reminder</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
