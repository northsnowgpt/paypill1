'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Eye, Lock, ChevronRight,
  Heart, Activity, Pill, AlertTriangle, History,
  FlaskConical, Syringe, Scissors, Dna
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockHealthRecord } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

const recordSections = [
  { id: 'demographics', title: 'Demographics & Vitals', icon: Heart, color: 'rose' },
  { id: 'conditions', title: 'Medical Conditions', icon: AlertTriangle, color: 'amber' },
  { id: 'medications', title: 'Medications', icon: Pill, color: 'primary' },
  { id: 'allergies', title: 'Allergies & History', icon: History, color: 'rose' },
  { id: 'labs', title: 'Lab Results', icon: FlaskConical, color: 'teal' },
  { id: 'immunizations', title: 'Immunizations', icon: Syringe, color: 'emerald' },
  { id: 'surgeries', title: 'Surgical History', icon: Scissors, color: 'slate' },
  { id: 'family', title: 'Family History', icon: Dna, color: 'primary' },
];

export default function HealthRecords() {
  const { healthRecord } = useAppStore();
  const [activeSection, setActiveSection] = useState('demographics');

  const record = healthRecord || mockHealthRecord;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" />
            Health Records
          </h1>
          <p className="text-slate-500 mt-1">View and manage your complete health history</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
        <Lock className="w-4 h-4" />
        <span>All records are encrypted and HIPAA-compliant. Last updated: {formatDate(record.updatedAt || '')}</span>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {recordSections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white border border-slate-200"
          >
            {activeSection === 'demographics' && <DemographicsView record={record} />}
            {activeSection === 'conditions' && <ConditionsView record={record} />}
            {activeSection === 'medications' && <MedicationsView record={record} />}
            {activeSection === 'allergies' && <AllergiesView record={record} />}
            {activeSection === 'labs' && <LabsView record={record} />}
            {activeSection === 'immunizations' && <ImmunizationsView record={record} />}
            {activeSection === 'surgeries' && <SurgeriesView record={record} />}
            {activeSection === 'family' && <FamilyView record={record} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DemographicsView({ record }: { record: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Personal Demographics</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard label="Full Name" value={`${record.profile?.firstName} ${record.profile?.lastName}`} />
        <InfoCard label="Date of Birth" value={formatDate(record.demographics?.dateOfBirth)} />
        <InfoCard label="Age" value={`${record.demographics?.age} years`} />
        <InfoCard label="Sex" value={record.demographics?.sexAssignedAtBirth} />
        <InfoCard label="Gender Identity" value={record.demographics?.genderIdentity} />
        <InfoCard label="Marital Status" value={record.demographics?.maritalStatus} />
        <InfoCard label="Ethnicity" value={record.demographics?.ethnicity} />
        <InfoCard label="Race" value={record.demographics?.race} />
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-8">Body Measurements</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard label="Height" value={`${record.measurements?.height} ${record.measurements?.heightUnit}`} />
        <InfoCard label="Weight" value={`${record.measurements?.weight} ${record.measurements?.weightUnit}`} />
        <InfoCard label="BMI" value={record.measurements?.bmi} />
        <InfoCard label="Waist" value={`${record.measurements?.waistCircumference} cm`} />
        <InfoCard label="Hip" value={`${record.measurements?.hipCircumference} cm`} />
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-8">Blood Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard label="Blood Group" value={record.bloodInfo?.bloodGroup} />
        <InfoCard label="Genotype" value={record.bloodInfo?.genotype} />
      </div>
    </div>
  );
}

function ConditionsView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Active Medical Conditions</h3>
      {record.conditions?.map((c: any, i: number) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{c.condition}</h4>
              <p className="text-sm text-slate-500">{c.category}</p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                ${c.severity === 'mild' ? 'bg-emerald-50 text-emerald-700' : 
                  c.severity === 'moderate' ? 'bg-amber-50 text-amber-700' :
                  'bg-rose-50 text-rose-700'}`}>
                {c.severity}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${c.controlled ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {c.controlled ? 'Controlled' : 'Uncontrolled'}
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
            <div>
              <span className="text-slate-400">Diagnosed:</span>
              <span className="ml-1 text-slate-700">{formatDate(c.dateDiagnosed)}</span>
            </div>
            <div>
              <span className="text-slate-400">Treatment:</span>
              <span className="ml-1 text-slate-700">{c.currentTreatment}</span>
            </div>
            <div>
              <span className="text-slate-400">Provider:</span>
              <span className="ml-1 text-slate-700">{c.managingDoctor}</span>
            </div>
          </div>
          {c.notes && (
            <p className="mt-3 text-sm text-slate-600 bg-white p-3 rounded-lg">{c.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function MedicationsView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Current Medications</h3>
      {record.medications?.map((med: any) => (
        <div key={med.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{med.name} {med.strength}</h4>
              <p className="text-sm text-slate-500">{med.class}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
              ${med.adherenceStatus === 'adherent' ? 'bg-emerald-50 text-emerald-700' : 
                med.adherenceStatus === 'partial' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'}`}>
              {med.adherenceStatus}
            </span>
          </div>
          <div className="grid md:grid-cols-4 gap-3 mt-3 text-sm">
            <InfoCard label="Dosage" value={med.dosage} />
            <InfoCard label="Frequency" value={med.frequency} />
            <InfoCard label="Route" value={med.route} />
            <InfoCard label="Started" value={formatDate(med.startDate)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AllergiesView({ record }: { record: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Allergies</h3>
        <div className="space-y-3">
          {record.allergies?.map((a: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-rose-800">{a.allergen}</h4>
                  <p className="text-sm text-rose-600">{a.reactionType}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                  ${a.severity === 'mild' ? 'bg-amber-100 text-amber-800' : 
                    a.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'}`}>
                  {a.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Family History</h3>
        <div className="space-y-3">
          {record.familyHistory?.map((fh: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="font-medium text-slate-800">{fh.condition}</h4>
              <p className="text-sm text-slate-500">Relation: {fh.relation}</p>
              {fh.notes && <p className="text-sm text-slate-600 mt-1">{fh.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabsView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Lab Results</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Test</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Result</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Reference</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {record.labHistory?.map((lab: any, i: number) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm font-medium text-slate-800">{lab.test}</td>
                <td className="py-3 px-4 text-sm text-slate-700">{lab.value} {lab.unit}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{lab.referenceRange}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{formatDate(lab.date)}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${lab.notes?.includes('Normal') || lab.notes?.includes('Within') ? 'bg-emerald-50 text-emerald-700' : 
                      lab.notes?.includes('Improved') ? 'bg-primary-50 text-primary-700' :
                      'bg-amber-50 text-amber-700'}`}>
                    {lab.notes?.includes('Normal') ? 'Normal' : lab.notes?.includes('Improved') ? 'Improved' : 'Review'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImmunizationsView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Immunization History</h3>
      {record.immunizations?.map((imm: any, i: number) => (
        <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
          <div>
            <h4 className="font-medium text-emerald-800">{imm.vaccine}</h4>
            <p className="text-sm text-emerald-600">{imm.facility}</p>
          </div>
          <span className="text-sm text-emerald-700 font-medium">{formatDate(imm.date)}</span>
        </div>
      ))}
    </div>
  );
}

function SurgeriesView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Surgical History</h3>
      {record.surgicalHistory?.map((surg: any, i: number) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <h4 className="font-medium text-slate-800">{surg.procedure}</h4>
          <div className="grid md:grid-cols-3 gap-3 mt-2 text-sm">
            <div><span className="text-slate-400">Year:</span> <span className="text-slate-700">{surg.year}</span></div>
            <div><span className="text-slate-400">Facility:</span> <span className="text-slate-700">{surg.facility}</span></div>
            <div><span className="text-slate-400">Surgeon:</span> <span className="text-slate-700">{surg.surgeon}</span></div>
          </div>
          {surg.complications && (
            <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">Complications: {surg.complications}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function FamilyView({ record }: { record: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Family Medical History</h3>
      {record.familyHistory?.map((fh: any, i: number) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <Dna className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">{fh.condition}</h4>
              <p className="text-sm text-slate-500">Relation: {fh.relation}</p>
            </div>
          </div>
          {fh.notes && <p className="mt-2 text-sm text-slate-600">{fh.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value || value === 'undefined undefined') return null;
  return (
    <div className="p-3 rounded-lg bg-slate-50">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}
