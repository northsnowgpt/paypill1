'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  UserProfile, 
  HealthRecord, 
  UserRole,
  AIRecommendation,
  Appointment,
  Message,
  EmployerData,
  InsuranceContract,
  OnboardingStep
} from '@/types';

interface AppState {
  // Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;

  // Health Record
  healthRecord: HealthRecord | null;

  // AI
  recommendations: AIRecommendation[];
  isAnalyzing: boolean;

  // Appointments
  appointments: Appointment[];

  // Messages
  messages: Message[];

  // Employer
  employerData: EmployerData | null;

  // Insurance
  insuranceContracts: InsuranceContract[];

  // Onboarding
  onboardingSteps: OnboardingStep[];
  currentStep: number;
  onboardingComplete: boolean;

  // UI
  sidebarOpen: boolean;
  activeTab: string;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
  setHealthRecord: (record: HealthRecord | null) => void;
  updateHealthRecord: (updates: Partial<HealthRecord>) => void;
  setRecommendations: (recs: AIRecommendation[]) => void;
  addRecommendation: (rec: AIRecommendation) => void;
  setAnalyzing: (status: boolean) => void;
  setAppointments: (appts: Appointment[]) => void;
  addAppointment: (appt: Appointment) => void;
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  setEmployerData: (data: EmployerData | null) => void;
  setInsuranceContracts: (contracts: InsuranceContract[]) => void;
  setOnboardingSteps: (steps: OnboardingStep[]) => void;
  completeStep: (stepId: string) => void;
  setCurrentStep: (step: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
}

const initialOnboardingSteps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome & Profile', description: 'Set up your basic profile and preferences', component: 'WelcomeProfile', required: true, completed: false },
  { id: 'demographics', title: 'Personal Information', description: 'Demographics, blood type, and measurements', component: 'Demographics', required: true, completed: false },
  { id: 'vitals', title: 'Vital Signs', description: 'Baseline vital measurements', component: 'Vitals', required: true, completed: false },
  { id: 'conditions', title: 'Medical Conditions', description: 'Pre-existing conditions and history', component: 'Conditions', required: false, completed: false },
  { id: 'medications', title: 'Current Medications', description: 'Medications and supplements', component: 'Medications', required: false, completed: false },
  { id: 'allergies', title: 'Allergies & History', description: 'Allergies, family history, surgeries', component: 'AllergiesHistory', required: false, completed: false },
  { id: 'lifestyle', title: 'Lifestyle & Habits', description: 'Exercise, diet, sleep, and habits', component: 'Lifestyle', required: false, completed: false },
  { id: 'providers', title: 'Healthcare Providers', description: 'Your care team and facilities', component: 'Providers', required: false, completed: false },
  { id: 'insurance', title: 'Insurance & Emergency', description: 'Insurance details and emergency contacts', component: 'InsuranceEmergency', required: true, completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      userRole: null,
      healthRecord: null,
      recommendations: [],
      isAnalyzing: false,
      appointments: [],
      messages: [],
      employerData: null,
      insuranceContracts: [],
      onboardingSteps: initialOnboardingSteps,
      currentStep: 0,
      onboardingComplete: false,
      sidebarOpen: true,
      activeTab: 'dashboard',

      setUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      setRole: (role) => set({ userRole: role }),
      logout: () => set({ 
        currentUser: null, 
        isAuthenticated: false, 
        userRole: null,
        healthRecord: null,
        recommendations: [],
        appointments: [],
        messages: [],
        employerData: null,
        insuranceContracts: [],
        onboardingSteps: initialOnboardingSteps,
        currentStep: 0,
        onboardingComplete: false,
        activeTab: 'dashboard'
      }),

      setHealthRecord: (record) => set({ healthRecord: record }),
      updateHealthRecord: (updates) => set((state) => ({
        healthRecord: state.healthRecord ? { ...state.healthRecord, ...updates, updatedAt: new Date().toISOString() } : null
      })),

      setRecommendations: (recs) => set({ recommendations: recs }),
      addRecommendation: (rec) => set((state) => ({ recommendations: [...state.recommendations, rec] })),
      setAnalyzing: (status) => set({ isAnalyzing: status }),

      setAppointments: (appts) => set({ appointments: appts }),
      addAppointment: (appt) => set((state) => ({ appointments: [...state.appointments, appt] })),

      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

      setEmployerData: (data) => set({ employerData: data }),
      setInsuranceContracts: (contracts) => set({ insuranceContracts: contracts }),

      setOnboardingSteps: (steps) => set({ onboardingSteps: steps }),
      completeStep: (stepId) => set((state) => ({
        onboardingSteps: state.onboardingSteps.map(s => 
          s.id === stepId ? { ...s, completed: true } : s
        )
      })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'paypill-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        healthRecord: state.healthRecord,
        recommendations: state.recommendations,
        appointments: state.appointments,
        messages: state.messages,
        employerData: state.employerData,
        insuranceContracts: state.insuranceContracts,
        onboardingSteps: state.onboardingSteps,
        currentStep: state.currentStep,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
