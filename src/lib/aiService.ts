'use client';

import type { HealthRecord, AIRecommendation, HealthcareProvider } from '@/types';
import { generateId } from '@/lib/utils';
import { mockProviders } from './data/mockData';

// Simulated Gemini API integration
// In production, replace with actual Google Generative AI SDK calls
export async function analyzeHealthData(record: HealthRecord): Promise<AIRecommendation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  const recommendations: AIRecommendation[] = [];

  // Medication optimization recommendations
  if (record.medications?.length > 0) {
    record.medications.forEach(med => {
      if (med.isActive && med.name !== med.genericName) {
        const brandPrice = Math.floor(Math.random() * 100) + 30;
        const genericPrice = Math.floor(brandPrice * 0.25);

        recommendations.push({
          id: generateId(),
          type: 'medication',
          title: `Switch to Generic ${med.name}`,
          description: `Based on your current ${med.name} prescription and insurance coverage, switching to the generic equivalent could save approximately $${brandPrice - genericPrice}/month while maintaining identical therapeutic efficacy.`,
          confidence: 0.9 + Math.random() * 0.09,
          basis: ['Current medication profile', 'Insurance formulary analysis', 'Generic bioequivalence data'],
          alternatives: [`${med.genericName} (immediate release)`, `${med.genericName} (extended release)`],
          genericOptions: [`${med.genericName} - $${genericPrice}/month`, `${med.genericName} ER - $${genericPrice + 5}/month`],
          costComparison: {
            brand: brandPrice,
            generic: genericPrice,
            savings: brandPrice - genericPrice,
          },
          nearbyProviders: findNearbyPharmacies(record),
          safetyChecks: [
            'No known drug interactions with current regimen',
            'Same active ingredient verified',
            'FDA bioequivalent approval confirmed',
          ],
          createdAt: new Date().toISOString(),
        });
      }
    });
  }

  // Provider proximity recommendations
  if (record.conditions?.length > 0) {
    record.conditions.forEach(condition => {
      if (condition.isActive && condition.managingDoctor) {
        const relevantProviders = findRelevantProviders(condition.category, record);
        if (relevantProviders.length > 0) {
          recommendations.push({
            id: generateId(),
            type: 'provider',
            title: `${condition.condition} Follow-up Recommended`,
            description: `Based on your active ${condition.condition} diagnosis, ${relevantProviders[0].name} (${relevantProviders[0].distance} miles away) has availability. Your last visit was ${getMonthsSince(condition.dateDiagnosed)} months ago.`,
            confidence: 0.85 + Math.random() * 0.1,
            basis: ['Condition severity assessment', 'Provider proximity analysis', 'Appointment availability'],
            nearbyProviders: relevantProviders.slice(0, 3),
            safetyChecks: ['Provider accepts your insurance', 'In-network verification completed'],
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
  }

  // Lifestyle recommendations based on vitals and habits
  if (record.vitals?.bloodPressureSystolic && record.vitals.bloodPressureSystolic > 120) {
    recommendations.push({
      id: generateId(),
      type: 'lifestyle',
      title: 'DASH Diet for Blood Pressure',
      description: `Your blood pressure (${record.vitals.bloodPressureSystolic}/${record.vitals.bloodPressureDiastolic}) is slightly elevated. The DASH diet could reduce systolic BP by 8-14 mmHg based on clinical studies.`,
      confidence: 0.87,
      basis: ['Blood pressure reading', 'DASH diet clinical evidence', 'Current diet assessment'],
      createdAt: new Date().toISOString(),
    });
  }

  if (record.lifestyle?.sleepDuration && record.lifestyle.sleepDuration < 7) {
    recommendations.push({
      id: generateId(),
      type: 'lifestyle',
      title: 'Sleep Hygiene Optimization',
      description: `Your reported ${record.lifestyle.sleepDuration} hours of sleep is below the recommended 7-9 hours. Improving sleep could enhance medication adherence and glucose control.`,
      confidence: 0.83,
      basis: ['Sleep duration assessment', 'Sleep quality data', 'Diabetes management correlation'],
      createdAt: new Date().toISOString(),
    });
  }

  // Screening recommendations
  if (record.conditions.some(c => c.category === 'Endocrine and Metabolic' && c.isActive)) {
    recommendations.push({
      id: generateId(),
      type: 'screening',
      title: 'Diabetic Eye Exam Due',
      description: 'As a diabetic patient, annual retinopathy screening is recommended. Your last screening was over 12 months ago.',
      confidence: 0.92,
      basis: ['ADA guidelines', 'Diabetes duration', 'Last screening date'],
      nearbyProviders: mockProviders.filter(p => p.type === 'facility').slice(0, 2),
      createdAt: new Date().toISOString(),
    });
  }

  return recommendations;
}

function findNearbyPharmacies(record: HealthRecord): HealthcareProvider[] {
  return mockProviders
    .filter(p => p.specialty === 'Pharmacy')
    .sort((a, b) => (a.distance || 999) - (b.distance || 999))
    .slice(0, 3);
}

function findRelevantProviders(category: string, record: HealthRecord): HealthcareProvider[] {
  const specialtyMap: Record<string, string[]> = {
    'Cardiovascular': ['Cardiology', 'General Practice'],
    'Endocrine and Metabolic': ['Endocrinology', 'General Practice'],
    'Kidney and Urinary': ['Nephrology', 'General Practice'],
    'Respiratory': ['Pulmonology', 'General Practice'],
    'Neurological': ['Neurology', 'General Practice'],
    'Mental Health': ['Psychiatry', 'General Practice'],
    'Gastrointestinal': ['Gastroenterology', 'General Practice'],
    'Musculoskeletal': ['Orthopedic', 'Physiotherapy'],
  };

  const relevantSpecialties = specialtyMap[category] || ['General Practice'];
  return mockProviders
    .filter(p => relevantSpecialties.includes(p.specialty) || p.type === 'primary')
    .sort((a, b) => (a.distance || 999) - (b.distance || 999))
    .slice(0, 3);
}

function getMonthsSince(dateString?: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}

export async function searchMedicalLiterature(query: string): Promise<string[]> {
  // Simulated literature search
  await new Promise(resolve => setTimeout(resolve, 1500));

  const papers = [
    'Generic vs Brand-Name Drugs: A Systematic Review (JAMA, 2025)',
    'Cost-Effectiveness of Generic Medications in Diabetes Management (Lancet Diabetes, 2024)',
    'Proximity-Based Provider Selection and Health Outcomes (NEJM, 2025)',
    'Adherence Patterns in Fixed-Fee vs Per-Visit Healthcare Models (Health Affairs, 2026)',
    'AI-Driven Medication Recommendations: Accuracy and Safety (Nature Medicine, 2025)',
  ];

  return papers.filter(p => 
    query.toLowerCase().split(' ').some(term => p.toLowerCase().includes(term))
  ).slice(0, 3);
}
