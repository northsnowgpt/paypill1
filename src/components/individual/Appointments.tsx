'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Plus, Clock, MapPin, Video, CheckCircle2, XCircle,
  ChevronRight, Search, Filter, Stethoscope
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockAppointments, mockProviders } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function Appointments() {
  const { appointments, addAppointment } = useAppStore();
  const [showBooking, setShowBooking] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const allAppointments = appointments.length > 0 ? appointments : mockAppointments;

  const filtered = allAppointments.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    if (filter === 'upcoming') return date >= now;
    if (filter === 'past') return date < now;
    return true;
  });

  const bookAppointment = () => {
    if (!selectedProvider) return;
    const provider = mockProviders.find(p => p.id === selectedProvider);
    if (!provider) return;

    const newAppt = {
      id: 'new-' + Date.now(),
      userId: 'u1',
      providerId: provider.id,
      providerName: provider.name,
      specialty: provider.specialty,
      date: '2026-05-10',
      time: '10:00 AM',
      type: 'in-person' as const,
      status: 'scheduled' as const,
      reason: 'Follow-up consultation',
    };
    addAppointment(newAppt);
    setShowBooking(false);
    setSelectedProvider(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500 mt-1">Schedule and manage your medical appointments</p>
        </div>
        <button 
          onClick={() => setShowBooking(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'upcoming', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f 
                ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.map((appt, i) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white border border-slate-200 card-hover"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs text-primary-600 font-medium uppercase">
                  {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-xl font-bold text-primary-700">
                  {new Date(appt.date).getDate()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{appt.providerName}</h3>
                    <p className="text-sm text-slate-500">{appt.specialty} • {appt.reason}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                    ${appt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 
                      appt.status === 'confirmed' ? 'bg-primary-50 text-primary-700' :
                      appt.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                      'bg-amber-50 text-amber-700'}`}>
                    {appt.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {appt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    {appt.type === 'telemedicine' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {appt.type === 'telemedicine' ? 'Telemedicine' : 'In-person'}
                  </span>
                </div>
                {appt.notes && (
                  <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {appt.notes}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Book Appointment</h3>
              <button onClick={() => setShowBooking(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  className="input-medical pl-10"
                  placeholder="Search providers by name or specialty..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Available Providers</p>
              {mockProviders.filter(p => p.type !== 'facility').map(provider => (
                <div 
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === provider.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-slate-200 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{provider.name}</p>
                        <p className="text-sm text-slate-500">{provider.specialty} • {provider.hospitalAffiliation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{provider.distance} mi</p>
                      <p className="text-xs text-slate-400">{provider.availability}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowBooking(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={bookAppointment}
                disabled={!selectedProvider}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
