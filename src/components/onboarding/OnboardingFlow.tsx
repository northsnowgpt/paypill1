'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Check, User, Heart, Activity, 
  Pill, AlertTriangle, History, Dumbbell, Stethoscope, 
  Shield, Upload, Camera, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { generateId, calculateBMI, calculateAge } from '@/lib/utils';
import type { HealthRecord, UserProfile, PersonalDemographics, BodyMeasurements, Vitals, MedicalCondition, Medication, Allergy, LifestyleHabits, HealthcareProvider, InsuranceInfo, EmergencyContact } from '@/types';

const steps = [
  { id: 'welcome', title: 'Welcome & Profile', icon: User, required: true },
  { id: 'demographics', title: 'Personal Information', icon: Heart, required: true },
  { id: 'vitals', title: 'Vital Signs', icon: Activity, required: true },
  { id: 'conditions', title: 'Medical Conditions', icon: AlertTriangle, required: false },
  { id: 'medications', title: 'Current Medications', icon: Pill, required: false },
  { id: 'allergies', title: 'Allergies & History', icon: History, required: false },
  { id: 'lifestyle', title: 'Lifestyle & Habits', icon: Dumbbell, required: false },
  { id: 'providers', title: 'Healthcare Providers', icon: Stethoscope, required: false },
  { id: 'insurance', title: 'Insurance & Emergency', icon: Shield, required: true },
];

const conditionCategories = [
  'Cardiovascular', 'Endocrine and Metabolic', 'Kidney and Urinary', 'Respiratory',
  'Neurological', 'Mental Health', 'Gastrointestinal', 'Musculoskeletal',
  'Cancer / Oncology', 'Infectious Disease', 'Autoimmune / Immune', 'Women's Health',
  'Men's Health', 'Other'
];

const conditionOptions: Record<string, string[]> = {
  'Cardiovascular': ['Hypertension', 'Heart failure', 'Coronary artery disease', 'Arrhythmia', 'Stroke history', 'Peripheral vascular disease', 'High cholesterol'],
  'Endocrine and Metabolic': ['Type 1 diabetes', 'Type 2 diabetes', 'Prediabetes', 'Thyroid disorders', 'Obesity', 'Metabolic syndrome', 'Gout'],
  'Kidney and Urinary': ['Chronic kidney disease', 'Kidney stones', 'Nephrotic syndrome', 'Urinary tract disorders', 'Proteinuria', 'Dialysis history'],
  'Respiratory': ['Asthma', 'COPD', 'Tuberculosis history', 'Sleep apnea', 'Chronic bronchitis', 'Pulmonary fibrosis'],
  'Neurological': ['Epilepsy', 'Migraine', 'Parkinson's disease', 'Multiple sclerosis', 'Dementia', 'Neuropathy'],
  'Mental Health': ['Anxiety disorder', 'Depression', 'Bipolar disorder', 'PTSD', 'ADHD', 'Schizophrenia', 'Substance use disorder'],
  'Gastrointestinal': ['Peptic ulcer disease', 'GERD', 'IBS', 'Crohn's disease', 'Ulcerative colitis', 'Liver disease', 'Hepatitis'],
  'Musculoskeletal': ['Arthritis', 'Osteoporosis', 'Chronic back pain', 'Fibromyalgia', 'Lupus', 'Joint replacement history'],
};

const medicationClasses = [
  { name: 'Diabetes Medications', examples: ['Metformin', 'Insulin', 'Empagliflozin', 'Sitagliptin'] },
  { name: 'Blood Pressure Medications', examples: ['Labetalol', 'Amlodipine', 'Losartan', 'Lisinopril'] },
  { name: 'Heart and Cholesterol', examples: ['Atorvastatin', 'Simvastatin', 'Aspirin', 'Clopidogrel'] },
  { name: 'Respiratory', examples: ['Salbutamol', 'Budesonide', 'Montelukast', 'Prednisolone'] },
  { name: 'Pain and Inflammation', examples: ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Tramadol'] },
  { name: 'Mental Health', examples: ['Sertraline', 'Fluoxetine', 'Amitriptyline', 'Diazepam'] },
  { name: 'Gastrointestinal', examples: ['Omeprazole', 'Antacids', 'Laxatives', 'Anti-diarrheals'] },
  { name: 'Supplements', examples: ['Iron', 'Vitamin D', 'Calcium', 'Multivitamins'] },
];

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { setHealthRecord, setOnboardingComplete, currentUser } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Form data state
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: '',
    preferredName: '',
    preferredLanguage: 'English',
    communicationPreference: 'email',
  });

  const [demographics, setDemographics] = useState<Partial<PersonalDemographics>>({
    dateOfBirth: '',
    sexAssignedAtBirth: 'male',
  });

  const [measurements, setMeasurements] = useState<Partial<BodyMeasurements>>({
    height: 0,
    heightUnit: 'cm',
    weight: 0,
    weightUnit: 'kg',
  });

  const [vitals, setVitals] = useState<Partial<Vitals>>({});
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [lifestyle, setLifestyle] = useState<Partial<LifestyleHabits>>({});
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [insurance, setInsurance] = useState<Partial<InsuranceInfo>>({});
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishOnboarding = () => {
    const healthRecord: HealthRecord = {
      id: generateId(),
      userId: currentUser?.id || 'unknown',
      profile: currentUser || undefined,
      demographics: demographics as PersonalDemographics,
      measurements: measurements as BodyMeasurements,
      vitals: vitals as Vitals,
      conditions,
      medications,
      allergies,
      lifestyle: lifestyle as LifestyleHabits,
      providers,
      insurance: insurance as InsuranceInfo,
      emergencyContacts,
      familyHistory: [],
      surgicalHistory: [],
      immunizations: [],
      labHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setHealthRecord(healthRecord);
    setOnboardingComplete(true);
    onComplete();
  };

  const canProceed = () => {
    const step = steps[currentStep];
    if (!step.required) return true;

    switch (step.id) {
      case 'welcome':
        return profile.firstName && profile.lastName && profile.email;
      case 'demographics':
        return demographics.dateOfBirth && demographics.sexAssignedAtBirth;
      case 'vitals':
        return true;
      case 'insurance':
        return emergencyContacts.length > 0;
      default:
        return true;
    }
  };

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <CurrentStepIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{steps[currentStep].title}</h2>
                <p className="text-sm text-slate-500">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button 
              onClick={finishOnboarding}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip for now
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {steps.map((step, i) => (
              <div 
                key={step.id}
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  i <= currentStep ? 'bg-primary-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <WelcomeStep profile={profile} setProfile={setProfile} />}
              {currentStep === 1 && <DemographicsStep demographics={demographics} setDemographics={setDemographics} measurements={measurements} setMeasurements={setMeasurements} />}
              {currentStep === 2 && <VitalsStep vitals={vitals} setVitals={setVitals} />}
              {currentStep === 3 && <ConditionsStep conditions={conditions} setConditions={setConditions} />}
              {currentStep === 4 && <MedicationsStep medications={medications} setMedications={setMedications} />}
              {currentStep === 5 && <AllergiesStep allergies={allergies} setAllergies={setAllergies} />}
              {currentStep === 6 && <LifestyleStep lifestyle={lifestyle} setLifestyle={setLifestyle} />}
              {currentStep === 7 && <ProvidersStep providers={providers} setProviders={setProviders} />}
              {currentStep === 8 && <InsuranceStep insurance={insurance} setInsurance={setInsurance} emergencyContacts={emergencyContacts} setEmergencyContacts={setEmergencyContacts} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div 
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep ? 'bg-primary-500' : i < currentStep ? 'bg-primary-300' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="btn-primary"
          >
            {currentStep === steps.length - 1 ? (
              <>Complete <Check className="w-4 h-4 ml-1" /></>
            ) : (
              <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ profile, setProfile }: { profile: Partial<UserProfile>; setProfile: (p: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <Camera className="w-10 h-10 text-primary-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Let's set up your profile</h3>
        <p className="text-slate-500 mt-1">This information helps us personalize your healthcare experience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
          <input 
            type="text" 
            className="input-medical" 
            value={profile.firstName}
            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
          <input 
            type="text" 
            className="input-medical" 
            value={profile.lastName}
            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Name</label>
          <input 
            type="text" 
            className="input-medical" 
            value={profile.preferredName}
            onChange={e => setProfile({ ...profile, preferredName: e.target.value })}
            placeholder="Johnny"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input 
            type="email" 
            className="input-medical" 
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            placeholder="john@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            className="input-medical" 
            value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Language</label>
          <select 
            className="input-medical"
            value={profile.preferredLanguage}
            onChange={e => setProfile({ ...profile, preferredLanguage: e.target.value })}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Chinese</option>
            <option>Arabic</option>
            <option>Hindi</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Communication Preference</label>
          <div className="flex gap-3">
            {(['email', 'sms', 'push'] as const).map(pref => (
              <button
                key={pref}
                onClick={() => setProfile({ ...profile, communicationPreference: pref })}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                  profile.communicationPreference === pref 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pref === 'push' ? 'Push Notification' : pref}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-start gap-3">
          <Upload className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700">Profile Photo</p>
            <p className="text-xs text-slate-500 mt-1">Optional. You can add this later.</p>
            <button className="mt-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemographicsStep({ demographics, setDemographics, measurements, setMeasurements }: any) {
  const bmi = measurements.height && measurements.weight 
    ? calculateBMI(measurements.height, measurements.weight) 
    : undefined;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
          <input 
            type="date" 
            className="input-medical"
            value={demographics.dateOfBirth}
            onChange={e => {
              const dob = e.target.value;
              setDemographics({ 
                ...demographics, 
                dateOfBirth: dob,
                age: dob ? calculateAge(dob) : undefined
              });
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input 
            type="number" 
            className="input-medical bg-slate-50"
            value={demographics.age || ''}
            readOnly
            placeholder="Auto-calculated"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sex Assigned at Birth *</label>
          <div className="flex gap-2">
            {(['male', 'female', 'intersex', 'prefer_not_say'] as const).map(sex => (
              <button
                key={sex}
                onClick={() => setDemographics({ ...demographics, sexAssignedAtBirth: sex })}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                  demographics.sexAssignedAtBirth === sex 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sex === 'prefer_not_say' ? 'Prefer not to say' : sex}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender Identity</label>
          <input 
            type="text" 
            className="input-medical"
            value={demographics.genderIdentity || ''}
            onChange={e => setDemographics({ ...demographics, genderIdentity: e.target.value })}
            placeholder="e.g. Male, Female, Non-binary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
          <select className="input-medical"
            value={demographics.maritalStatus || ''}
            onChange={e => setDemographics({ ...demographics, maritalStatus: e.target.value })}
          >
            <option value="">Select...</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
            <option>Domestic Partnership</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ethnicity</label>
          <select className="input-medical"
            value={demographics.ethnicity || ''}
            onChange={e => setDemographics({ ...demographics, ethnicity: e.target.value })}
          >
            <option value="">Select...</option>
            <option>Hispanic or Latino</option>
            <option>Not Hispanic or Latino</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Body Measurements</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="input-medical flex-1"
                value={measurements.height || ''}
                onChange={e => setMeasurements({ ...measurements, height: parseFloat(e.target.value) })}
                placeholder="175"
              />
              <select 
                className="input-medical w-24"
                value={measurements.heightUnit}
                onChange={e => setMeasurements({ ...measurements, heightUnit: e.target.value as 'cm' | 'ft-in' })}
              >
                <option value="cm">cm</option>
                <option value="ft-in">ft</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="input-medical flex-1"
                value={measurements.weight || ''}
                onChange={e => setMeasurements({ ...measurements, weight: parseFloat(e.target.value) })}
                placeholder="82"
              />
              <select 
                className="input-medical w-24"
                value={measurements.weightUnit}
                onChange={e => setMeasurements({ ...measurements, weightUnit: e.target.value as 'kg' | 'lb' })}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">BMI (Auto)</label>
            <input 
              type="text" 
              className={`input-medical bg-slate-50 font-semibold ${
                bmi && bmi > 25 ? 'text-amber-600' : bmi && bmi > 30 ? 'text-rose-600' : 'text-emerald-600'
              }`}
              value={bmi ? bmi.toFixed(1) : ''}
              readOnly
              placeholder="Auto-calculated"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
          <select className="input-medical">
            <option value="">Select...</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Genotype</label>
          <select className="input-medical">
            <option value="">Select...</option>
            {['AA', 'AS', 'SS', 'AC', 'SC'].map(gt => (
              <option key={gt} value={gt}>{gt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function VitalsStep({ vitals, setVitals }: { vitals: Partial<Vitals>; setVitals: (v: Partial<Vitals>) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Baseline Vital Signs</h3>
      <p className="text-slate-500">Enter your most recent measurements. These establish your health baseline.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <VitalInput 
          label="Resting Heart Rate" 
          unit="bpm" 
          value={vitals.restingHeartRate} 
          onChange={v => setVitals({ ...vitals, restingHeartRate: v })}
          normalRange="60-100"
        />
        <div className="grid grid-cols-2 gap-2">
          <VitalInput 
            label="Systolic BP" 
            unit="mmHg" 
            value={vitals.bloodPressureSystolic} 
            onChange={v => setVitals({ ...vitals, bloodPressureSystolic: v })}
            normalRange="<120"
          />
          <VitalInput 
            label="Diastolic BP" 
            unit="mmHg" 
            value={vitals.bloodPressureDiastolic} 
            onChange={v => setVitals({ ...vitals, bloodPressureDiastolic: v })}
            normalRange="<80"
          />
        </div>
        <VitalInput 
          label="Oxygen Saturation" 
          unit="%" 
          value={vitals.oxygenSaturation} 
          onChange={v => setVitals({ ...vitals, oxygenSaturation: v })}
          normalRange="95-100"
        />
        <VitalInput 
          label="Body Temperature" 
          unit="°C" 
          value={vitals.bodyTemperature} 
          onChange={v => setVitals({ ...vitals, bodyTemperature: v })}
          normalRange="36.1-37.2"
        />
        <VitalInput 
          label="Respiratory Rate" 
          unit="/min" 
          value={vitals.respiratoryRate} 
          onChange={v => setVitals({ ...vitals, respiratoryRate: v })}
          normalRange="12-20"
        />
        <VitalInput 
          label="Blood Sugar (Fasting)" 
          unit="mg/dL" 
          value={vitals.bloodSugarBaseline} 
          onChange={v => setVitals({ ...vitals, bloodSugarBaseline: v })}
          normalRange="70-100"
        />
      </div>
    </div>
  );
}

function VitalInput({ label, unit, value, onChange, normalRange }: {
  label: string; unit: string; value?: number; onChange: (v: number) => void; normalRange: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input 
          type="number" 
          className="input-medical pr-16"
          value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value))}
          placeholder="--"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{unit}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">Normal: {normalRange}</p>
    </div>
  );
}

function ConditionsStep({ conditions, setConditions }: { conditions: MedicalCondition[]; setConditions: (c: MedicalCondition[]) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCondition, setNewCondition] = useState<Partial<MedicalCondition>>({});

  const addCondition = () => {
    if (newCondition.condition && newCondition.category) {
      setConditions([...conditions, { ...newCondition, isActive: true } as MedicalCondition]);
      setNewCondition({});
      setSelectedCategory('');
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Medical Conditions</h3>
      <p className="text-slate-500">Add any pre-existing conditions. This helps us provide better AI recommendations.</p>

      {conditions.length > 0 && (
        <div className="space-y-2">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">{c.condition}</p>
                <p className="text-sm text-slate-500">{c.category} • {c.severity} • {c.controlled ? 'Controlled' : 'Uncontrolled'}</p>
              </div>
              <button onClick={() => removeCondition(i)} className="text-rose-500 hover:text-rose-700">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select 
            className="input-medical"
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setNewCondition({ ...newCondition, category: e.target.value }); }}
          >
            <option value="">Select category...</option>
            {conditionCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {selectedCategory && conditionOptions[selectedCategory] && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
            <div className="flex flex-wrap gap-2">
              {conditionOptions[selectedCategory].map(cond => (
                <button
                  key={cond}
                  onClick={() => setNewCondition({ ...newCondition, condition: cond })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    newCondition.condition === cond 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        )}

        {newCondition.condition && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                <div className="flex gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setNewCondition({ ...newCondition, severity: sev })}
                      className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-all ${
                        newCondition.severity === sev 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Diagnosed</label>
                <input 
                  type="date" 
                  className="input-medical"
                  onChange={e => setNewCondition({ ...newCondition, dateDiagnosed: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Treatment</label>
              <input 
                type="text" 
                className="input-medical"
                placeholder="e.g. Metformin 500mg + Lifestyle changes"
                onChange={e => setNewCondition({ ...newCondition, currentTreatment: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="controlled"
                className="w-4 h-4 rounded border-slate-300 text-primary-600"
                onChange={e => setNewCondition({ ...newCondition, controlled: e.target.checked })}
              />
              <label htmlFor="controlled" className="text-sm text-slate-700">Condition is currently controlled</label>
            </div>
            <button onClick={addCondition} className="btn-primary w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Add Condition
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MedicationsStep({ medications, setMedications }: { medications: Medication[]; setMedications: (m: Medication[]) => void }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [newMed, setNewMed] = useState<Partial<Medication>>({});

  const addMedication = () => {
    if (newMed.name && newMed.dosage) {
      setMedications([...medications, { ...newMed, id: generateId(), isActive: true } as Medication]);
      setNewMed({});
      setSelectedClass('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Current Medications</h3>
      <p className="text-slate-500">Add all current medications including prescriptions, OTC, and supplements.</p>

      {medications.length > 0 && (
        <div className="space-y-2">
          {medications.map((med, i) => (
            <div key={med.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{med.name} {med.strength}</p>
                  <p className="text-sm text-slate-500">{med.frequency} • {med.route} • {med.class}</p>
                </div>
              </div>
              <button 
                onClick={() => setMedications(medications.filter((_, idx) => idx !== i))}
                className="text-rose-500 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Medication Class</label>
          <div className="flex flex-wrap gap-2">
            {medicationClasses.map(cls => (
              <button
                key={cls.name}
                onClick={() => { setSelectedClass(cls.name); setNewMed({ ...newMed, class: cls.name }); }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  selectedClass === cls.name 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Common Examples</label>
              <div className="flex flex-wrap gap-2">
                {medicationClasses.find(c => c.name === selectedClass)?.examples.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setNewMed({ ...newMed, name: ex })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      newMed.name === ex 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                <input 
                  type="text" 
                  className="input-medical"
                  value={newMed.dosage || ''}
                  onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                <input 
                  type="text" 
                  className="input-medical"
                  value={newMed.frequency || ''}
                  onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                  placeholder="e.g. Twice daily"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Route</label>
              <div className="flex gap-2">
                {(['oral', 'iv', 'subcutaneous', 'topical', 'inhaled'] as const).map(route => (
                  <button
                    key={route}
                    onClick={() => setNewMed({ ...newMed, route })}
                    className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-all ${
                      newMed.route === route 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addMedication} className="btn-primary w-full">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Add Medication
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AllergiesStep({ allergies, setAllergies }: { allergies: Allergy[]; setAllergies: (a: Allergy[]) => void }) {
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({});

  const addAllergy = () => {
    if (newAllergy.allergen && newAllergy.type) {
      setAllergies([...allergies, newAllergy as Allergy]);
      setNewAllergy({});
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Allergies & Medical History</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Allergies</h4>
          {allergies.length > 0 && (
            <div className="space-y-2 mb-4">
              {allergies.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-medium text-rose-800">{a.allergen}</span>
                    <span className="text-xs text-rose-600 capitalize">({a.type})</span>
                  </div>
                  <button 
                    onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <select 
              className="input-medical w-32"
              value={newAllergy.type || ''}
              onChange={e => setNewAllergy({ ...newAllergy, type: e.target.value as 'drug' | 'food' | 'environmental' })}
            >
              <option value="">Type</option>
              <option value="drug">Drug</option>
              <option value="food">Food</option>
              <option value="environmental">Environmental</option>
            </select>
            <input 
              type="text" 
              className="input-medical flex-1"
              value={newAllergy.allergen || ''}
              onChange={e => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
              placeholder="Allergen name"
            />
            <select 
              className="input-medical w-28"
              value={newAllergy.severity || ''}
              onChange={e => setNewAllergy({ ...newAllergy, severity: e.target.value as 'mild' | 'moderate' | 'severe' })}
            >
              <option value="">Severity</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <button onClick={addAllergy} className="btn-primary px-4">Add</button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Family Medical History</h4>
          <p className="text-sm text-slate-500">You can add family history details in your health records later.</p>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Surgical History</h4>
          <p className="text-sm text-slate-500">You can add surgical history details in your health records later.</p>
        </div>
      </div>
    </div>
  );
}

function LifestyleStep({ lifestyle, setLifestyle }: { lifestyle: Partial<LifestyleHabits>; setLifestyle: (l: Partial<LifestyleHabits>) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Lifestyle & Habits</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary-500" />
            Physical Activity
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Exercise Level</label>
              <div className="flex gap-2">
                {(['none', 'light', 'moderate', 'intense'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setLifestyle({ ...lifestyle, exercise: level })}
                    className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-all ${
                      lifestyle.exercise === level 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Workouts per week</label>
              <input 
                type="number" 
                className="input-medical"
                value={lifestyle.workoutFrequency || ''}
                onChange={e => setLifestyle({ ...lifestyle, workoutFrequency: parseInt(e.target.value) })}
                placeholder="3"
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Smoking & Alcohol</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Smoking Status</label>
              <select 
                className="input-medical"
                value={lifestyle.smokingStatus || ''}
                onChange={e => setLifestyle({ ...lifestyle, smokingStatus: e.target.value as any })}
              >
                <option value="">Select...</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
                <option value="occasionally">Occasionally</option>
                <option value="vaping">Vaping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Alcohol Consumption</label>
              <select 
                className="input-medical"
                value={lifestyle.alcoholStatus || ''}
                onChange={e => setLifestyle({ ...lifestyle, alcoholStatus: e.target.value as any })}
              >
                <option value="">Select...</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Sleep</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Average Sleep (hours)</label>
              <input 
                type="number" 
                className="input-medical"
                value={lifestyle.sleepDuration || ''}
                onChange={e => setLifestyle({ ...lifestyle, sleepDuration: parseFloat(e.target.value) })}
                placeholder="7"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Sleep Quality</label>
              <div className="flex gap-2">
                {(['poor', 'fair', 'good', 'excellent'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setLifestyle({ ...lifestyle, sleepQuality: q })}
                    className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-all ${
                      lifestyle.sleepQuality === q 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Diet & Stress</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Diet Preferences</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Low salt', 'Low sugar', 'High protein', 'Renal diet'].map(diet => (
                  <button
                    key={diet}
                    onClick={() => {
                      const current = lifestyle.diet || [];
                      const updated = current.includes(diet) 
                        ? current.filter(d => d !== diet)
                        : [...current, diet];
                      setLifestyle({ ...lifestyle, diet: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      lifestyle.diet?.includes(diet)
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Stress Level</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setLifestyle({ ...lifestyle, stressLevel: s })}
                    className={`flex-1 py-2 rounded-lg text-sm border capitalize transition-all ${
                      lifestyle.stressLevel === s 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvidersStep({ providers, setProviders }: { providers: HealthcareProvider[]; setProviders: (p: HealthcareProvider[]) => void }) {
  const [newProvider, setNewProvider] = useState<Partial<HealthcareProvider>>({});

  const addProvider = () => {
    if (newProvider.name && newProvider.specialty) {
      setProviders([...providers, { ...newProvider, id: generateId(), type: 'specialist' } as HealthcareProvider]);
      setNewProvider({});
    }
  };

  const specialties = [
    'Family physician', 'General practitioner', 'Nephrologist', 'Cardiologist', 
    'Endocrinologist', 'Neurologist', 'Pulmonologist', 'Gastroenterologist',
    'Oncologist', 'Psychiatrist', 'Dermatologist', 'Orthopedic specialist',
    'Gynecologist', 'Urologist', 'Pharmacist', 'Physiotherapist'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Healthcare Providers</h3>
      <p className="text-slate-500">Add your current healthcare providers for better care coordination.</p>

      {providers.length > 0 && (
        <div className="space-y-2">
          {providers.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.specialty} • {p.hospitalAffiliation}</p>
                </div>
              </div>
              <button 
                onClick={() => setProviders(providers.filter((_, idx) => idx !== i))}
                className="text-rose-500 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Provider Name</label>
            <input 
              type="text" 
              className="input-medical"
              value={newProvider.name || ''}
              onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
              placeholder="Dr. Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
            <select 
              className="input-medical"
              value={newProvider.specialty || ''}
              onChange={e => setNewProvider({ ...newProvider, specialty: e.target.value })}
            >
              <option value="">Select...</option>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital/Clinic</label>
            <input 
              type="text" 
              className="input-medical"
              value={newProvider.hospitalAffiliation || ''}
              onChange={e => setNewProvider({ ...newProvider, hospitalAffiliation: e.target.value })}
              placeholder="City General Hospital"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input 
              type="tel" 
              className="input-medical"
              value={newProvider.phone || ''}
              onChange={e => setNewProvider({ ...newProvider, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        <button onClick={addProvider} className="btn-primary w-full">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>
    </div>
  );
}

function InsuranceStep({ 
  insurance, setInsurance, 
  emergencyContacts, setEmergencyContacts 
}: {
  insurance: Partial<InsuranceInfo>; setInsurance: (i: Partial<InsuranceInfo>) => void;
  emergencyContacts: EmergencyContact[]; setEmergencyContacts: (e: EmergencyContact[]) => void;
}) {
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});

  const addContact = () => {
    if (newContact.firstName && newContact.lastName && newContact.phone && newContact.relationship) {
      setEmergencyContacts([...emergencyContacts, newContact as EmergencyContact]);
      setNewContact({});
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Insurance & Emergency Contacts</h3>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-800">Insurance Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Type</label>
            <select 
              className="input-medical"
              value={insurance.type || ''}
              onChange={e => setInsurance({ ...insurance, type: e.target.value })}
            >
              <option value="">Select...</option>
              <option>Private insurance</option>
              <option>Employer-sponsored</option>
              <option>Government insurance</option>
              <option>Medicaid</option>
              <option>Medicare</option>
              <option>HMO</option>
              <option>PPO</option>
              <option>Self-pay / uninsured</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Carrier</label>
            <select 
              className="input-medical"
              value={insurance.carrier || ''}
              onChange={e => setInsurance({ ...insurance, carrier: e.target.value })}
            >
              <option value="">Select...</option>
              <option>Blue Cross Blue Shield</option>
              <option>Aetna</option>
              <option>Cigna</option>
              <option>UnitedHealthcare</option>
              <option>Humana</option>
              <option>Kaiser Permanente</option>
              <option>Regional insurer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Member ID</label>
            <input 
              type="text" 
              className="input-medical"
              value={insurance.memberId || ''}
              onChange={e => setInsurance({ ...insurance, memberId: e.target.value })}
              placeholder="ID123456"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group Number</label>
            <input 
              type="text" 
              className="input-medical"
              value={insurance.groupNumber || ''}
              onChange={e => setInsurance({ ...insurance, groupNumber: e.target.value })}
              placeholder="GRP987654"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-800">Emergency Contacts *</h4>

        {emergencyContacts.length > 0 && (
          <div className="space-y-2 mb-4">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div>
                  <p className="font-medium text-amber-900">{contact.firstName} {contact.lastName}</p>
                  <p className="text-sm text-amber-700">{contact.relationship} • {contact.phone}</p>
                </div>
                <button 
                  onClick={() => setEmergencyContacts(emergencyContacts.filter((_, idx) => idx !== i))}
                  className="text-amber-600 hover:text-amber-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input 
              type="text" 
              className="input-medical"
              value={newContact.firstName || ''}
              onChange={e => setNewContact({ ...newContact, firstName: e.target.value })}
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input 
              type="text" 
              className="input-medical"
              value={newContact.lastName || ''}
              onChange={e => setNewContact({ ...newContact, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
            <select 
              className="input-medical"
              value={newContact.relationship || ''}
              onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
            >
              <option value="">Select...</option>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Child</option>
              <option>Friend</option>
              <option>Guardian</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input 
              type="tel" 
              className="input-medical"
              value={newContact.phone || ''}
              onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="(555) 987-6543"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300"
              checked={newContact.canMakeDecisions || false}
              onChange={e => setNewContact({ ...newContact, canMakeDecisions: e.target.checked })}
            />
            Can make treatment decisions
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300"
              checked={newContact.isHealthcareProxy || false}
              onChange={e => setNewContact({ ...newContact, isHealthcareProxy: e.target.checked })}
            />
            Healthcare proxy
          </label>
        </div>
        <button onClick={addContact} className="btn-primary w-full">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Add Emergency Contact
        </button>
      </div>
    </div>
  );
}
