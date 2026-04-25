import type { 
  HealthRecord, 
  HealthcareProvider, 
  AIRecommendation,
  Appointment,
  Message,
  EmployerData,
  InsuranceContract,
  UserProfile
} from '@/types';
import { generateId } from '@/lib/utils';

export const mockProviders: HealthcareProvider[] = [
  { id: 'p1', name: 'Dr. Sarah Chen', specialty: 'Cardiology', type: 'specialist', hospitalAffiliation: 'Metro Heart Center', address: '123 Medical Plaza, Suite 400', phone: '(555) 123-4567', email: 's.chen@metroheart.com', availability: 'Mon-Fri 9AM-5PM', telemedicineAvailable: true, distance: 2.3, rating: 4.8, priceRange: '$$$' },
  { id: 'p2', name: 'Dr. James Wilson', specialty: 'Endocrinology', type: 'specialist', hospitalAffiliation: 'Diabetes Care Institute', address: '456 Health Blvd, Floor 3', phone: '(555) 234-5678', email: 'j.wilson@dci.org', availability: 'Tue-Thu 8AM-4PM', telemedicineAvailable: true, distance: 1.8, rating: 4.9, priceRange: '$$' },
  { id: 'p3', name: 'Dr. Maria Garcia', specialty: 'Nephrology', type: 'specialist', hospitalAffiliation: 'Kidney Health Partners', address: '789 Renal Way, Building C', phone: '(555) 345-6789', email: 'm.garcia@khp.net', availability: 'Mon-Wed-Fri 10AM-6PM', telemedicineAvailable: false, distance: 3.1, rating: 4.7, priceRange: '$$$' },
  { id: 'p4', name: 'Dr. Robert Kim', specialty: 'General Practice', type: 'primary', hospitalAffiliation: 'Community Health Network', address: '321 Main St', phone: '(555) 456-7890', email: 'r.kim@chn.org', availability: 'Mon-Sat 8AM-8PM', telemedicineAvailable: true, distance: 0.5, rating: 4.6, priceRange: '$' },
  { id: 'p5', name: 'Dr. Lisa Thompson', specialty: 'Psychiatry', type: 'specialist', hospitalAffiliation: 'Mind Wellness Center', address: '654 Therapy Lane', phone: '(555) 567-8901', email: 'l.thompson@mwc.com', availability: 'Mon-Fri 11AM-7PM', telemedicineAvailable: true, distance: 4.2, rating: 4.9, priceRange: '$$' },
  { id: 'p6', name: 'City General Hospital', specialty: 'Multi-Specialty', type: 'facility', hospitalAffiliation: 'City General', address: '1000 Hospital Drive', phone: '(555) 678-9012', availability: '24/7', telemedicineAvailable: true, distance: 5.0, rating: 4.5, priceRange: '$$$$' },
  { id: 'p7', name: 'QuickCare Pharmacy', specialty: 'Pharmacy', type: 'allied', address: '1500 Market St', phone: '(555) 789-0123', availability: '24/7', telemedicineAvailable: false, distance: 0.8, rating: 4.4, priceRange: '$' },
  { id: 'p8', name: 'MedSave Pharmacy', specialty: 'Pharmacy', type: 'allied', address: '2000 Commerce Ave', phone: '(555) 890-1234', availability: 'Mon-Sun 7AM-11PM', telemedicineAvailable: false, distance: 1.2, rating: 4.3, priceRange: '$' },
  { id: 'p9', name: 'PhysioFirst Rehab', specialty: 'Physiotherapy', type: 'allied', address: '300 Recovery Rd', phone: '(555) 901-2345', availability: 'Mon-Sat 7AM-7PM', telemedicineAvailable: false, distance: 2.0, rating: 4.7, priceRange: '$$' },
  { id: 'p10', name: 'Dr. Ahmed Hassan', specialty: 'Pulmonology', type: 'specialist', hospitalAffiliation: 'Lung Care Institute', address: '88 Breath Blvd', phone: '(555) 012-3456', availability: 'Mon-Thu 9AM-5PM', telemedicineAvailable: true, distance: 3.5, rating: 4.8, priceRange: '$$$' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', userId: 'u1', providerId: 'p1', providerName: 'Dr. Sarah Chen', specialty: 'Cardiology', date: '2026-05-15', time: '10:00 AM', type: 'in-person', status: 'confirmed', reason: 'Annual cardiac review', symptoms: ['chest tightness', 'shortness of breath'] },
  { id: 'a2', userId: 'u1', providerId: 'p2', providerName: 'Dr. James Wilson', specialty: 'Endocrinology', date: '2026-05-22', time: '2:30 PM', type: 'telemedicine', status: 'scheduled', reason: 'Diabetes management follow-up', symptoms: ['fatigue', 'increased thirst'] },
  { id: 'a3', userId: 'u1', providerId: 'p4', providerName: 'Dr. Robert Kim', specialty: 'General Practice', date: '2026-04-28', time: '9:00 AM', type: 'in-person', status: 'completed', reason: 'Routine checkup', notes: 'BP stable, continue current medications' },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'p1', senderName: 'Dr. Sarah Chen', senderRole: 'Cardiologist', recipientId: 'u1', content: 'Your recent ECG results look stable. Please continue with your current medication regimen and schedule a follow-up in 3 months.', encrypted: true, timestamp: '2026-04-20T14:30:00Z', read: true },
  { id: 'm2', senderId: 'p2', senderName: 'Dr. James Wilson', senderRole: 'Endocrinologist', recipientId: 'u1', content: 'Your HbA1c has improved to 7.2%. Great progress! I've updated your medication list with a lower dose of metformin.', encrypted: true, timestamp: '2026-04-22T09:15:00Z', read: false },
  { id: 'm3', senderId: 'u1', senderName: 'John Doe', senderRole: 'Patient', recipientId: 'p1', content: 'Thank you doctor. I've been experiencing mild dizziness after taking the new medication. Should I be concerned?', encrypted: true, timestamp: '2026-04-23T16:45:00Z', read: false },
];

export const mockEmployerData: EmployerData = {
  id: 'e1',
  companyName: 'TechCorp Industries',
  totalEmployees: 1247,
  onboardedCount: 983,
  healthScore: 78,
  costSavings: 124500,
  adherenceRate: 82,
  employees: [
    { id: 'emp1', name: 'Alice Johnson', department: 'Engineering', onboarded: true, lastActivity: '2026-04-24', healthScore: 85, adherenceRate: 92 },
    { id: 'emp2', name: 'Bob Smith', department: 'Sales', onboarded: true, lastActivity: '2026-04-23', healthScore: 72, adherenceRate: 78 },
    { id: 'emp3', name: 'Carol White', department: 'HR', onboarded: true, lastActivity: '2026-04-22', healthScore: 91, adherenceRate: 95 },
    { id: 'emp4', name: 'David Brown', department: 'Engineering', onboarded: false, lastActivity: '2026-04-01', healthScore: undefined, adherenceRate: undefined },
    { id: 'emp5', name: 'Eva Martinez', department: 'Marketing', onboarded: true, lastActivity: '2026-04-24', healthScore: 68, adherenceRate: 65 },
    { id: 'emp6', name: 'Frank Lee', department: 'Finance', onboarded: true, lastActivity: '2026-04-20', healthScore: 88, adherenceRate: 90 },
    { id: 'emp7', name: 'Grace Kim', department: 'Engineering', onboarded: true, lastActivity: '2026-04-21', healthScore: 76, adherenceRate: 80 },
    { id: 'emp8', name: 'Henry Wilson', department: 'Operations', onboarded: false, lastActivity: undefined, healthScore: undefined, adherenceRate: undefined },
  ],
  anonymizedTrends: [
    { month: 'Jan 2026', avgAdherence: 79, avgHealthScore: 74, costSavings: 18500, activeConditions: 342 },
    { month: 'Feb 2026', avgAdherence: 80, avgHealthScore: 75, costSavings: 19200, activeConditions: 338 },
    { month: 'Mar 2026', avgAdherence: 81, avgHealthScore: 76, costSavings: 20500, activeConditions: 335 },
    { month: 'Apr 2026', avgAdherence: 82, avgHealthScore: 78, costSavings: 21800, activeConditions: 331 },
  ]
};

export const mockInsuranceContracts: InsuranceContract[] = [
  { id: 'ic1', employerId: 'e1', planName: 'TechCorp Premium Health', contractType: 'fixed-fee', monthlyFee: 45000, durationMonths: 12, startDate: '2026-01-01', memberCount: 983, genericSavings: 87600, totalClaims: 234000, status: 'active' },
  { id: 'ic2', employerId: 'e2', planName: 'Startup Basic Care', contractType: 'per-member', monthlyFee: 125, durationMonths: 12, startDate: '2026-02-01', memberCount: 45, genericSavings: 3200, totalClaims: 8900, status: 'active' },
  { id: 'ic3', employerId: 'e3', planName: 'Enterprise Complete', contractType: 'fixed-fee', monthlyFee: 120000, durationMonths: 24, startDate: '2025-06-01', memberCount: 2500, genericSavings: 145000, totalClaims: 567000, status: 'active' },
  { id: 'ic4', planName: 'Individual Gold Plan', contractType: 'per-member', monthlyFee: 450, durationMonths: 12, startDate: '2026-03-01', memberCount: 1, genericSavings: 0, totalClaims: 0, status: 'active' },
];

export const mockUser: UserProfile = {
  id: 'u1',
  role: 'individual',
  email: 'john.doe@email.com',
  phone: '(555) 123-4567',
  firstName: 'John',
  lastName: 'Doe',
  preferredName: 'Johnny',
  preferredLanguage: 'English',
  communicationPreference: 'email',
  twoFactorEnabled: true,
  termsAccepted: true,
  createdAt: '2026-01-15T10:00:00Z',
};

export const mockHealthRecord: HealthRecord = {
  id: 'hr1',
  userId: 'u1',
  profile: mockUser,
  demographics: {
    dateOfBirth: '1985-03-15',
    age: 41,
    sexAssignedAtBirth: 'male',
    genderIdentity: 'Male',
    maritalStatus: 'Married',
    ethnicity: 'Hispanic',
    race: 'White',
  },
  bloodInfo: {
    bloodGroup: 'O+',
    genotype: 'AA',
  },
  measurements: {
    height: 175,
    heightUnit: 'cm',
    weight: 82,
    weightUnit: 'kg',
    bmi: 26.8,
    waistCircumference: 94,
    hipCircumference: 102,
  },
  vitals: {
    restingHeartRate: 72,
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    oxygenSaturation: 98,
    bodyTemperature: 36.6,
    respiratoryRate: 16,
    bloodSugarBaseline: 110,
  },
  conditions: [
    { condition: 'Type 2 Diabetes', category: 'Endocrine and Metabolic', dateDiagnosed: '2019-06-01', severity: 'moderate', currentTreatment: 'Metformin 500mg + Lifestyle', controlled: true, managingDoctor: 'Dr. James Wilson', notes: 'Well controlled with medication', isActive: true },
    { condition: 'Hypertension', category: 'Cardiovascular', dateDiagnosed: '2020-01-15', severity: 'mild', currentTreatment: 'Lisinopril 10mg', controlled: true, managingDoctor: 'Dr. Sarah Chen', notes: 'BP stable on current regimen', isActive: true },
    { condition: 'GERD', category: 'Gastrointestinal', dateDiagnosed: '2021-03-10', severity: 'mild', currentTreatment: 'Omeprazole 20mg PRN', controlled: true, managingDoctor: 'Dr. Robert Kim', notes: 'Occasional flare-ups', isActive: true },
  ],
  medications: [
    { id: 'med1', name: 'Metformin', genericName: 'Metformin Hydrochloride', class: 'Diabetes Medications', dosage: '500mg', strength: '500mg', frequency: 'Twice daily', route: 'oral', startDate: '2019-06-15', prescribingProvider: 'Dr. James Wilson', indication: 'Type 2 Diabetes', sideEffects: ['nausea', 'diarrhea'], adherenceStatus: 'adherent', isActive: true },
    { id: 'med2', name: 'Lisinopril', genericName: 'Lisinopril', class: 'Blood Pressure Medications', dosage: '10mg', strength: '10mg', frequency: 'Once daily', route: 'oral', startDate: '2020-02-01', prescribingProvider: 'Dr. Sarah Chen', indication: 'Hypertension', sideEffects: ['dry cough', 'dizziness'], adherenceStatus: 'adherent', isActive: true },
    { id: 'med3', name: 'Omeprazole', genericName: 'Omeprazole', class: 'Gastrointestinal Medications', dosage: '20mg', strength: '20mg', frequency: 'As needed', route: 'oral', startDate: '2021-03-15', prescribingProvider: 'Dr. Robert Kim', indication: 'GERD', sideEffects: ['headache'], adherenceStatus: 'partial', isActive: true },
    { id: 'med4', name: 'Atorvastatin', genericName: 'Atorvastatin Calcium', class: 'Heart and Cholesterol Medications', dosage: '20mg', strength: '20mg', frequency: 'Once daily at bedtime', route: 'oral', startDate: '2022-08-01', prescribingProvider: 'Dr. Sarah Chen', indication: 'High Cholesterol', sideEffects: ['muscle pain'], adherenceStatus: 'adherent', isActive: true },
  ],
  allergies: [
    { type: 'drug', allergen: 'Penicillin', reactionType: 'Rash, hives', severity: 'moderate' },
    { type: 'food', allergen: 'Shellfish', reactionType: 'Swelling, difficulty breathing', severity: 'severe' },
  ],
  familyHistory: [
    { condition: 'Diabetes', relation: 'Father', notes: 'Type 2, diagnosed at 55' },
    { condition: 'Heart Disease', relation: 'Grandfather', notes: 'Coronary artery disease' },
    { condition: 'Hypertension', relation: 'Mother', notes: 'Controlled with medication' },
  ],
  surgicalHistory: [
    { procedure: 'Appendectomy', year: 2005, facility: 'City General Hospital', surgeon: 'Dr. Smith', complications: 'None' },
    { procedure: 'Knee Arthroscopy', year: 2018, facility: 'Sports Medicine Center', surgeon: 'Dr. Johnson', complications: 'Minor infection, resolved' },
  ],
  immunizations: [
    { vaccine: 'COVID-19 (Pfizer)', date: '2025-09-15', facility: 'City General Hospital' },
    { vaccine: 'Influenza', date: '2025-10-01', facility: 'QuickCare Pharmacy' },
    { vaccine: 'Tetanus', date: '2020-05-20', facility: 'Community Health Network' },
  ],
  labHistory: [
    { test: 'HbA1c', value: 7.2, unit: '%', date: '2026-03-15', referenceRange: '< 7.0%', notes: 'Improved from 7.8%' },
    { test: 'Fasting Glucose', value: 110, unit: 'mg/dL', date: '2026-03-15', referenceRange: '70-100 mg/dL', notes: 'Slightly elevated' },
    { test: 'Total Cholesterol', value: 195, unit: 'mg/dL', date: '2026-03-15', referenceRange: '< 200 mg/dL', notes: 'Within normal range' },
    { test: 'LDL', value: 118, unit: 'mg/dL', date: '2026-03-15', referenceRange: '< 100 mg/dL', notes: 'Borderline high' },
    { test: 'Creatinine', value: 1.0, unit: 'mg/dL', date: '2026-03-15', referenceRange: '0.7-1.3 mg/dL', notes: 'Normal' },
    { test: 'eGFR', value: 88, unit: 'mL/min', date: '2026-03-15', referenceRange: '> 60 mL/min', notes: 'Normal' },
  ],
  lifestyle: {
    exercise: 'moderate',
    dailyActivityLevel: 'medium',
    workoutFrequency: 3,
    exerciseType: 'Running, weight training',
    smokingStatus: 'never',
    alcoholStatus: 'occasionally',
    alcoholType: 'Beer, wine',
    unitsPerWeek: 4,
    diet: ['low_salt', 'low_sugar'],
    mealFrequency: 3,
    sleepDuration: 7,
    sleepQuality: 'good',
    stressLevel: 'medium',
    waterIntake: 2.5,
    screenTime: 8,
    workType: 'Office desk job',
    sedentaryHours: 9,
  },
  providers: mockProviders.filter(p => ['p1', 'p2', 'p4'].includes(p.id)),
  insurance: {
    type: 'Employer-sponsored insurance',
    carrier: 'Blue Cross Blue Shield',
    memberId: 'BC123456789',
    groupNumber: 'GRP987654',
    policyHolderName: 'John Doe',
    relationship: 'self',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    planName: 'TechCorp Premium Health',
    coverageAreas: ['Primary insurance', 'Prescription coverage', 'Dental coverage', 'Vision coverage'],
  },
  emergencyContacts: [
    { firstName: 'Jane', lastName: 'Doe', relationship: 'Spouse', phone: '(555) 987-6543', alternatePhone: '(555) 987-6544', email: 'jane.doe@email.com', address: 'Same as patient', canDiscussHistory: true, canMakeDecisions: true, hasRecordAccess: true, isLegalGuardian: false, isHealthcareProxy: true },
    { firstName: 'Michael', lastName: 'Doe', relationship: 'Sibling', phone: '(555) 876-5432', canDiscussHistory: true, canMakeDecisions: false, hasRecordAccess: false, isLegalGuardian: false, isHealthcareProxy: false },
  ],
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-04-24T16:30:00Z',
};

export const mockRecommendations: AIRecommendation[] = [
  {
    id: 'rec1',
    type: 'medication',
    title: 'Switch to Generic Metformin',
    description: 'Based on your current prescription and insurance coverage, switching to generic Metformin could save you $45/month while maintaining identical therapeutic efficacy.',
    confidence: 0.94,
    basis: ['Current medication profile', 'Insurance formulary', 'Generic availability'],
    alternatives: ['Metformin ER (extended release)', 'Metformin immediate release'],
    genericOptions: ['Metformin Hydrochloride (generic) - $12/month', 'Metformin ER (generic) - $15/month'],
    costComparison: { brand: 67, generic: 12, savings: 55 },
    nearbyProviders: mockProviders.filter(p => p.specialty === 'Pharmacy'),
    safetyChecks: ['No known drug interactions', 'Same active ingredient', 'FDA bioequivalent approved'],
    createdAt: '2026-04-24T10:00:00Z',
  },
  {
    id: 'rec2',
    type: 'provider',
    title: 'Nearby Endocrinology Follow-up',
    description: 'Dr. James Wilson (1.8 miles) has availability next Tuesday. Your HbA1c trend suggests optimal timing for a 3-month follow-up.',
    confidence: 0.88,
    basis: ['HbA1c trend analysis', 'Provider proximity', 'Appointment availability'],
    nearbyProviders: [mockProviders.find(p => p.id === 'p2')!],
    safetyChecks: ['Provider accepts your insurance', 'In-network verified'],
    createdAt: '2026-04-24T10:05:00Z',
  },
  {
    id: 'rec3',
    type: 'lifestyle',
    title: 'Increase Daily Steps to 8,000',
    description: 'Your current activity level and BMI suggest increasing daily steps could improve glucose control by an estimated 0.3% HbA1c reduction over 12 weeks.',
    confidence: 0.82,
    basis: ['Activity level assessment', 'BMI analysis', 'Diabetes management guidelines'],
    createdAt: '2026-04-24T10:10:00Z',
  },
  {
    id: 'rec4',
    type: 'screening',
    title: 'Annual Diabetic Eye Exam Due',
    description: 'It has been 14 months since your last diabetic retinopathy screening. Schedule with an ophthalmologist within the next 30 days.',
    confidence: 0.91,
    basis: ['Last screening date', 'ADA guidelines', 'Diabetes duration'],
    nearbyProviders: [mockProviders.find(p => p.id === 'p6')!],
    createdAt: '2026-04-24T10:15:00Z',
  },
];
