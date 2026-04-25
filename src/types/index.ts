export type UserRole = 'individual' | 'employer' | 'insurance';

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  preferredLanguage?: string;
  communicationPreference?: 'sms' | 'email' | 'push';
  twoFactorEnabled?: boolean;
  termsAccepted: boolean;
  privacyPreferences?: Record<string, boolean>;
  createdAt: string;
  avatar?: string;
}

export interface PersonalDemographics {
  dateOfBirth: string;
  age?: number;
  sexAssignedAtBirth: 'female' | 'male' | 'intersex' | 'prefer_not_say';
  genderIdentity?: string;
  maritalStatus?: string;
  ethnicity?: string;
  race?: string;
}

export interface BloodInfo {
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  genotype?: 'AA' | 'AS' | 'SS' | 'AC' | 'SC';
}

export interface BodyMeasurements {
  height: number;
  heightUnit: 'cm' | 'ft-in';
  weight: number;
  weightUnit: 'kg' | 'lb';
  bmi?: number;
  waistCircumference?: number;
  hipCircumference?: number;
}

export interface Vitals {
  restingHeartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  bodyTemperature?: number;
  respiratoryRate?: number;
  bloodSugarBaseline?: number;
}

export interface ReproductiveHealth {
  pregnancyStatus?: boolean;
  breastfeedingStatus?: boolean;
  menstrualStatus?: string;
  menopauseStatus?: boolean;
}

export interface DisabilitySupport {
  visionImpairment?: boolean;
  hearingImpairment?: boolean;
  mobilityLimitation?: boolean;
  speechImpairment?: boolean;
  cognitiveSupportNeeds?: boolean;
}

export interface MedicalCondition {
  condition: string;
  category: string;
  dateDiagnosed?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  currentTreatment?: string;
  controlled?: boolean;
  managingDoctor?: string;
  notes?: string;
  isActive: boolean;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  class: string;
  dosage: string;
  strength: string;
  frequency: string;
  route: 'oral' | 'iv' | 'subcutaneous' | 'topical' | 'inhaled';
  startDate: string;
  endDate?: string;
  prescribingProvider?: string;
  indication?: string;
  sideEffects?: string[];
  adherenceStatus?: 'adherent' | 'partial' | 'non-adherent';
  isActive: boolean;
}

export interface Allergy {
  type: 'drug' | 'food' | 'environmental';
  allergen: string;
  reactionType?: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface FamilyHistory {
  condition: string;
  relation?: string;
  notes?: string;
}

export interface SurgicalHistory {
  procedure: string;
  year?: number;
  facility?: string;
  surgeon?: string;
  complications?: string;
}

export interface Immunization {
  vaccine: string;
  date?: string;
  facility?: string;
  notes?: string;
}

export interface LabResult {
  test: string;
  value: number;
  unit: string;
  date: string;
  referenceRange?: string;
  notes?: string;
}

export interface LifestyleHabits {
  exercise?: 'none' | 'light' | 'moderate' | 'intense';
  dailyActivityLevel?: 'low' | 'medium' | 'high';
  workoutFrequency?: number;
  exerciseType?: string;
  smokingStatus?: 'never' | 'former' | 'current' | 'occasionally' | 'vaping' | 'smokeless';
  packsPerDay?: number;
  yearsSmoked?: number;
  alcoholStatus?: 'never' | 'occasionally' | 'weekly' | 'daily' | 'heavy';
  alcoholType?: string;
  unitsPerWeek?: number;
  substanceUse?: string[];
  diet?: string[];
  mealFrequency?: number;
  sleepDuration?: number;
  insomnia?: boolean;
  snoring?: boolean;
  sleepApnea?: boolean;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  sexuallyActive?: boolean;
  protectionUse?: 'always' | 'sometimes' | 'never';
  stiHistory?: string[];
  familyPlanning?: string;
  stressLevel?: 'low' | 'medium' | 'high';
  waterIntake?: number;
  screenTime?: number;
  workType?: string;
  sedentaryHours?: number;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  type: 'primary' | 'specialist' | 'allied' | 'facility';
  hospitalAffiliation?: string;
  npi?: string;
  address?: string;
  phone?: string;
  email?: string;
  availability?: string;
  telemedicineAvailable?: boolean;
  distance?: number;
  rating?: number;
  priceRange?: string;
}

export interface InsuranceInfo {
  type: string;
  carrier: string;
  memberId?: string;
  groupNumber?: string;
  policyHolderName?: string;
  relationship?: 'self' | 'spouse' | 'child' | 'other';
  effectiveDate?: string;
  expiryDate?: string;
  planName?: string;
  coverageAreas?: string[];
  documents?: string[];
}

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  canDiscussHistory?: boolean;
  canMakeDecisions?: boolean;
  hasRecordAccess?: boolean;
  isLegalGuardian?: boolean;
  isHealthcareProxy?: boolean;
}

export interface HealthRecord {
  id: string;
  userId: string;
  profile?: UserProfile;
  demographics?: PersonalDemographics;
  bloodInfo?: BloodInfo;
  measurements?: BodyMeasurements;
  vitals?: Vitals;
  reproductive?: ReproductiveHealth;
  disability?: DisabilitySupport;
  conditions: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
  familyHistory: FamilyHistory[];
  surgicalHistory: SurgicalHistory[];
  immunizations: Immunization[];
  labHistory: LabResult[];
  lifestyle?: LifestyleHabits;
  providers: HealthcareProvider[];
  insurance?: InsuranceInfo;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  type: 'medication' | 'provider' | 'lifestyle' | 'screening';
  title: string;
  description: string;
  confidence: number;
  basis: string[];
  alternatives?: string[];
  genericOptions?: string[];
  costComparison?: {
    brand: number;
    generic: number;
    savings: number;
  };
  nearbyProviders?: HealthcareProvider[];
  safetyChecks?: string[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  symptoms?: string[];
  reason?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  encrypted: boolean;
  timestamp: string;
  read: boolean;
}

export interface EmployerData {
  id: string;
  companyName: string;
  employees: EmployeeSummary[];
  totalEmployees: number;
  onboardedCount: number;
  healthScore: number;
  costSavings: number;
  adherenceRate: number;
  anonymizedTrends: HealthTrend[];
}

export interface EmployeeSummary {
  id: string;
  name: string;
  department?: string;
  onboarded: boolean;
  lastActivity?: string;
  healthScore?: number;
  adherenceRate?: number;
}

export interface HealthTrend {
  month: string;
  avgAdherence: number;
  avgHealthScore: number;
  costSavings: number;
  activeConditions: number;
}

export interface InsuranceContract {
  id: string;
  employerId?: string;
  planName: string;
  contractType: 'fixed-fee' | 'per-member';
  monthlyFee: number;
  durationMonths: number;
  startDate: string;
  memberCount: number;
  genericSavings: number;
  totalClaims: number;
  status: 'active' | 'pending' | 'expired';
}

export interface DashboardKPI {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
}
