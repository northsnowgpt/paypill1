'use client';

import { motion } from 'framer-motion';
import { 
  Heart, Activity, Pill, Calendar, TrendingUp, AlertCircle,
  Shield, Droplets, Wind, Thermometer, Brain, ChevronRight,
  Clock, MapPin, Phone
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate, getRiskColor, getAdherenceColor } from '@/lib/utils';
import { mockHealthRecord, mockAppointments, mockRecommendations } from '@/data/mockData';
import { useEffect } from 'react';

export default function Dashboard() {
  const { healthRecord, setHealthRecord, setAppointments, setRecommendations, recommendations } = useAppStore();

  useEffect(() => {
    // Load mock data for demo
    if (!healthRecord) {
      setHealthRecord(mockHealthRecord);
      setAppointments(mockAppointments);
      setRecommendations(mockRecommendations);
    }
  }, []);

  const record = healthRecord || mockHealthRecord;
  const vitals = record.vitals;
  const conditions = record.conditions || [];
  const medications = record.medications || [];
  const upcomingAppts = mockAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed');
  const activeRecs = recommendations.length > 0 ? recommendations : mockRecommendations;

  const healthScore = calculateHealthScore(record);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {record.profile?.firstName || 'User'}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's your health overview for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl ${getRiskColor(100 - healthScore)}`}>
          <div className="text-sm font-medium">Health Score</div>
          <div className="text-2xl font-bold">{healthScore}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          icon={<Pill className="w-5 h-5" />}
          label="Active Medications"
          value={medications.filter(m => m.isActive).length}
          subtitle={`${medications.filter(m => m.adherenceStatus === 'adherent').length} adherent`}
          color="primary"
        />
        <KPICard 
          icon={<AlertCircle className="w-5 h-5" />}
          label="Active Conditions"
          value={conditions.filter(c => c.isActive).length}
          subtitle={`${conditions.filter(c => c.controlled).length} controlled`}
          color="amber"
        />
        <KPICard 
          icon={<Calendar className="w-5 h-5" />}
          label="Upcoming Appointments"
          value={upcomingAppts.length}
          subtitle="Next: 3 days"
          color="teal"
        />
        <KPICard 
          icon={<Brain className="w-5 h-5" />}
          label="AI Recommendations"
          value={activeRecs.length}
          subtitle="2 urgent"
          color="rose"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Vitals Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              Vital Signs
            </h3>
            <span className="text-xs text-slate-400">Last updated: Today</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <VitalCard 
              icon={<Heart className="w-4 h-4 text-rose-500" />}
              label="Heart Rate"
              value={`${vitals?.restingHeartRate || '--'} bpm`}
              status={vitals?.restingHeartRate && vitals.restingHeartRate > 100 ? 'warning' : 'normal'}
            />
            <VitalCard 
              icon={<Activity className="w-4 h-4 text-primary-500" />}
              label="Blood Pressure"
              value={`${vitals?.bloodPressureSystolic || '--'}/${vitals?.bloodPressureDiastolic || '--'}`}
              status={vitals?.bloodPressureSystolic && vitals.bloodPressureSystolic > 130 ? 'warning' : 'normal'}
            />
            <VitalCard 
              icon={<Droplets className="w-4 h-4 text-teal-500" />}
              label="O₂ Saturation"
              value={`${vitals?.oxygenSaturation || '--'}%`}
              status="normal"
            />
            <VitalCard 
              icon={<Thermometer className="w-4 h-4 text-amber-500" />}
              label="Temperature"
              value={`${vitals?.bodyTemperature || '--'}°C`}
              status="normal"
            />
            <VitalCard 
              icon={<Wind className="w-4 h-4 text-slate-500" />}
              label="Respiratory Rate"
              value={`${vitals?.respiratoryRate || '--'} /min`}
              status="normal"
            />
            <VitalCard 
              icon={<TrendingUp className="w-4 h-4 text-rose-500" />}
              label="Blood Sugar"
              value={`${vitals?.bloodSugarBaseline || '--'} mg/dL`}
              status={vitals?.bloodSugarBaseline && vitals.bloodSugarBaseline > 126 ? 'warning' : 'normal'}
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickActionButton icon={<Calendar className="w-4 h-4" />} label="Book Appointment" />
            <QuickActionButton icon={<Pill className="w-4 h-4" />} label="Refill Medication" />
            <QuickActionButton icon={<Brain className="w-4 h-4" />} label="Get AI Insights" />
            <QuickActionButton icon={<Shield className="w-4 h-4" />} label="Share Records" />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-500" />
              AI Recommendations
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 font-medium">
              {activeRecs.length} Active
            </span>
          </div>
          <div className="space-y-3">
            {activeRecs.slice(0, 3).map((rec, i) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                        ${rec.type === 'medication' ? 'bg-teal-50 text-teal-700' : 
                          rec.type === 'provider' ? 'bg-primary-50 text-primary-700' :
                          rec.type === 'lifestyle' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'}`}>
                        {rec.type}
                      </span>
                      <span className="text-xs text-slate-400">{Math.round(rec.confidence * 100)}% confidence</span>
                    </div>
                    <h4 className="font-medium text-slate-800 group-hover:text-primary-700 transition-colors">{rec.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
                    {rec.costComparison && (
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-slate-400 line-through">${rec.costComparison.brand}</span>
                        <span className="text-emerald-600 font-semibold">${rec.costComparison.generic}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          Save ${rec.costComparison.savings}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Upcoming Appointments
            </h3>
          </div>
          <div className="space-y-3">
            {upcomingAppts.map((appt, i) => (
              <div key={appt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-teal-700">
                      {new Date(appt.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{appt.providerName}</h4>
                    <p className="text-sm text-slate-500">{appt.specialty} • {appt.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {appt.type === 'telemedicine' ? 'Telemedicine' : 'In-person'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Medication Adherence */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-white border border-slate-200"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary-500" />
          Medication Adherence
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {medications.filter(m => m.isActive).map(med => (
            <div key={med.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800 text-sm">{med.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                  ${med.adherenceStatus === 'adherent' ? 'bg-emerald-50 text-emerald-700' : 
                    med.adherenceStatus === 'partial' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'}`}>
                  {med.adherenceStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
              <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    med.adherenceStatus === 'adherent' ? 'bg-emerald-500 w-[92%]' : 
                    med.adherenceStatus === 'partial' ? 'bg-amber-500 w-[65%]' :
                    'bg-rose-500 w-[30%]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KPICard({ icon, label, value, subtitle, color }: {
  icon: React.ReactNode; label: string; value: number | string; subtitle: string; color: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 card-hover">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
    </div>
  );
}

function VitalCard({ icon, label, value, status }: {
  icon: React.ReactNode; label: string; value: string; status: 'normal' | 'warning' | 'critical';
}) {
  const statusColors = {
    normal: 'border-l-4 border-l-emerald-400',
    warning: 'border-l-4 border-l-amber-400',
    critical: 'border-l-4 border-l-rose-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-slate-50 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
  );
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function calculateHealthScore(record: any): number {
  let score = 70;

  if (record.vitals?.bloodPressureSystolic && record.vitals.bloodPressureSystolic < 120) score += 5;
  if (record.vitals?.bloodSugarBaseline && record.vitals.bloodSugarBaseline < 100) score += 5;
  if (record.lifestyle?.exercise && record.lifestyle.exercise !== 'none') score += 5;
  if (record.lifestyle?.smokingStatus === 'never') score += 5;
  if (record.lifestyle?.sleepDuration && record.lifestyle.sleepDuration >= 7) score += 5;

  const adherentMeds = record.medications?.filter((m: any) => m.adherenceStatus === 'adherent').length || 0;
  const totalMeds = record.medications?.filter((m: any) => m.isActive).length || 0;
  if (totalMeds > 0) {
    score += Math.round((adherentMeds / totalMeds) * 5);
  }

  return Math.min(100, Math.max(0, score));
}
