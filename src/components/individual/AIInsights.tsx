'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, Pill, Stethoscope, Dumbbell, Shield,
  ChevronRight, MapPin, Phone, DollarSign, AlertTriangle,
  CheckCircle2, Loader2, BookOpen, ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { analyzeHealthData, searchMedicalLiterature } from '@/lib/aiService';
import { formatCurrency } from '@/lib/utils';
import { mockHealthRecord, mockRecommendations } from '@/data/mockData';

export default function AIInsights() {
  const { healthRecord, recommendations, setRecommendations, setAnalyzing, isAnalyzing } = useAppStore();
  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  const [literature, setLiterature] = useState<string[]>([]);
  const [showLiterature, setShowLiterature] = useState(false);

  const record = healthRecord || mockHealthRecord;
  const recs = recommendations.length > 0 ? recommendations : mockRecommendations;

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const newRecs = await analyzeHealthData(record);
      setRecommendations(newRecs);
    } finally {
      setAnalyzing(false);
    }
  };

  const viewLiterature = async (query: string) => {
    setShowLiterature(true);
    const papers = await searchMedicalLiterature(query);
    setLiterature(papers);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary-600" />
            AI Health Insights
          </h1>
          <p className="text-slate-500 mt-1">
            Gemini-powered analysis of your health data with research-backed recommendations
          </p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="btn-primary flex items-center gap-2"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Run Analysis</>
          )}
        </button>
      </div>

      {/* Analysis Status */}
      <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-primary-800">AI Analysis Active</p>
            <p className="text-sm text-primary-600">
              Analyzing {record.conditions?.length || 0} conditions, {record.medications?.length || 0} medications, and {record.labHistory?.length || 0} lab results
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {recs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer ${
              selectedRec === rec.id ? 'border-primary-400 shadow-lg' : 'border-slate-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                  ${rec.type === 'medication' ? 'bg-teal-50 text-teal-600' : 
                    rec.type === 'provider' ? 'bg-primary-50 text-primary-600' :
                    rec.type === 'lifestyle' ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'}`}>
                  {rec.type === 'medication' ? <Pill className="w-6 h-6" /> :
                   rec.type === 'provider' ? <Stethoscope className="w-6 h-6" /> :
                   rec.type === 'lifestyle' ? <Dumbbell className="w-6 h-6" /> :
                   <Shield className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {rec.type}
                  </span>
                  <h3 className="font-semibold text-slate-800 mt-1">{rec.title}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">{Math.round(rec.confidence * 100)}%</div>
                <div className="text-xs text-slate-400">confidence</div>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">{rec.description}</p>

            {/* Basis Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {rec.basis?.map((b, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-500">
                  {b}
                </span>
              ))}
            </div>

            {/* Cost Comparison */}
            {rec.costComparison && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-800 font-medium">Cost Comparison</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-400 line-through text-sm">{formatCurrency(rec.costComparison.brand)}/mo</span>
                      <span className="text-emerald-700 font-bold">{formatCurrency(rec.costComparison.generic)}/mo</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-700">{formatCurrency(rec.costComparison.savings)}</div>
                    <div className="text-xs text-emerald-600">monthly savings</div>
                  </div>
                </div>
              </div>
            )}

            {/* Nearby Providers */}
            {rec.nearbyProviders && rec.nearbyProviders.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Nearby Providers
                </p>
                {rec.nearbyProviders.map((provider, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{provider.name}</p>
                      <p className="text-xs text-slate-500">{provider.specialty} • {provider.distance} miles away</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {provider.telemedicineAvailable && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">Telehealth</span>
                      )}
                      <span className="text-xs text-slate-400">{provider.priceRange}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Safety Checks */}
            {rec.safetyChecks && (
              <div className="space-y-1 mb-4">
                {rec.safetyChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {check}
                  </div>
                ))}
              </div>
            )}

            {/* Literature Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); viewLiterature(rec.title); }}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View supporting research
              <ExternalLink className="w-3 h-3" />
            </button>

            {selectedRec === rec.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-slate-100"
              >
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary text-sm py-2">
                    Accept Recommendation
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    Ask Provider
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Literature Modal */}
      {showLiterature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Supporting Research
              </h3>
              <button onClick={() => setShowLiterature(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              {literature.length > 0 ? literature.map((paper, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm text-slate-700">{paper}</p>
                </div>
              )) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                  <span className="ml-2 text-slate-500">Searching literature...</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
