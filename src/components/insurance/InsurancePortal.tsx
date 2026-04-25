'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Landmark, Users, DollarSign, FileText,
  TrendingUp, Shield, AlertTriangle, CheckCircle2, Clock,
  ChevronRight, Search, Filter, LogOut, BarChart3
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockInsuranceContracts } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function InsurancePortal() {
  const { logout } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'savings', label: 'Generic Savings', icon: TrendingUp },
    { id: 'routing', label: 'Payment Routing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-800 border-r border-slate-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-white">PayPill</span>}
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-slate-700">Insurance Payor Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Fixed-Fee Management</span>
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <InsuranceDashboard />}
          {activeTab === 'contracts' && <ContractsView />}
          {activeTab === 'members' && <MembersView />}
          {activeTab === 'savings' && <SavingsView />}
          {activeTab === 'routing' && <PaymentRouting />}
        </div>
      </main>
    </div>
  );
}

function InsuranceDashboard() {
  const contracts = mockInsuranceContracts;
  const totalMembers = contracts.reduce((sum, c) => sum + c.memberCount, 0);
  const totalSavings = contracts.reduce((sum, c) => sum + c.genericSavings, 0);
  const totalRevenue = contracts.reduce((sum, c) => sum + (c.monthlyFee * c.durationMonths), 0);

  const monthlyData = [
    { month: 'Jan', revenue: 165000, claims: 142000, savings: 18500 },
    { month: 'Feb', revenue: 165000, claims: 138000, savings: 19200 },
    { month: 'Mar', revenue: 167000, claims: 145000, savings: 20500 },
    { month: 'Apr', revenue: 167000, claims: 140000, savings: 21800 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Insurance Dashboard</h1>
        <p className="text-slate-500 mt-1">Fixed-fee contract management and member outcomes</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsuranceKPICard 
          icon={<Users className="w-5 h-5" />}
          label="Total Members"
          value={totalMembers.toLocaleString()}
          change={+5.2}
          color="primary"
        />
        <InsuranceKPICard 
          icon={<DollarSign className="w-5 h-5" />}
          label="Annual Revenue"
          value={formatCurrency(totalRevenue)}
          change={+3.8}
          color="amber"
        />
        <InsuranceKPICard 
          icon={<TrendingUp className="w-5 h-5" />}
          label="Generic Savings"
          value={formatCurrency(totalSavings)}
          change={+12.4}
          color="emerald"
        />
        <InsuranceKPICard 
          icon={<FileText className="w-5 h-5" />}
          label="Active Contracts"
          value={contracts.filter(c => c.status === 'active').length}
          color="slate"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue vs Claims */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue vs Claims</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Revenue" />
              <Area type="monotone" dataKey="claims" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Claims" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Trend */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Generic Savings Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px' }}
              />
              <Bar dataKey="savings" fill="#10b981" radius={[6, 6, 0, 0]} name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Contracts */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Active Contracts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Plan Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Members</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Monthly Fee</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Generic Savings</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(contract => (
                <tr key={contract.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{contract.planName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${contract.contractType === 'fixed-fee' ? 'bg-primary-50 text-primary-700' : 'bg-teal-50 text-teal-700'}`}>
                      {contract.contractType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{contract.memberCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{formatCurrency(contract.monthlyFee)}/mo</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{contract.durationMonths} months</td>
                  <td className="py-3 px-4 text-sm text-emerald-700 font-medium">{formatCurrency(contract.genericSavings)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${contract.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 
                        contract.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-500'}`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ContractsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contract Management</h1>
          <p className="text-slate-500 mt-1">Manage fixed-fee and per-member contracts</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          New Contract
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mockInsuranceContracts.map(contract => (
          <div key={contract.id} className="p-6 rounded-2xl bg-white border border-slate-200 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">{contract.planName}</h3>
                <p className="text-sm text-slate-500">Started {formatDate(contract.startDate)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium
                ${contract.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {contract.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Monthly Fee</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(contract.monthlyFee)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Members</p>
                <p className="text-lg font-bold text-slate-800">{contract.memberCount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Total Claims</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(contract.totalClaims)}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-600">Generic Savings</p>
                <p className="text-lg font-bold text-emerald-800">{formatCurrency(contract.genericSavings)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Contract type: <span className="font-medium text-slate-700 capitalize">{contract.contractType}</span></span>
              <span className="text-slate-500">Duration: <span className="font-medium text-slate-700">{contract.durationMonths} months</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Member Outcomes</h1>
        <p className="text-slate-500 mt-1">Track member health adherence and cost outcomes</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Adherent Members</p>
              <p className="text-2xl font-bold text-slate-800">847</p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">86% of total members</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">At-Risk Members</p>
              <p className="text-2xl font-bold text-slate-800">136</p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">14% need intervention</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Non-Adherent</p>
              <p className="text-2xl font-bold text-slate-800">42</p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: '4%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">4% critical attention needed</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Member Risk Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Risk Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Members</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Avg Health Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Avg Cost/Month</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { category: 'Low Risk', members: 423, score: 88, cost: 145, trend: 'stable' },
                { category: 'Moderate Risk', members: 312, score: 72, cost: 280, trend: 'improving' },
                { category: 'High Risk', members: 136, score: 58, cost: 520, trend: 'worsening' },
                { category: 'Critical', members: 42, score: 42, cost: 890, trend: 'intervention' },
              ].map(row => (
                <tr key={row.category} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{row.category}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{row.members}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{row.score}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">${row.cost}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${row.trend === 'improving' ? 'bg-emerald-50 text-emerald-700' : 
                        row.trend === 'stable' ? 'bg-blue-50 text-blue-700' :
                        row.trend === 'worsening' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'}`}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SavingsView() {
  const savingsData = [
    { drug: 'Metformin', brand: 67, generic: 12, savings: 55, members: 87 },
    { drug: 'Lisinopril', brand: 45, generic: 8, savings: 37, members: 124 },
    { drug: 'Atorvastatin', brand: 89, generic: 18, savings: 71, members: 156 },
    { drug: 'Omeprazole', brand: 34, generic: 6, savings: 28, members: 98 },
    { drug: 'Amlodipine', brand: 52, generic: 10, savings: 42, members: 112 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Generic Drug Savings</h1>
        <p className="text-slate-500 mt-1">Track savings from generic medication adoption</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
          <p className="text-sm text-emerald-600 font-medium">Total YTD Savings</p>
          <p className="text-3xl font-bold text-emerald-800 mt-1">$124,500</p>
          <p className="text-xs text-emerald-600 mt-1">+12.4% from last quarter</p>
        </div>
        <div className="p-5 rounded-2xl bg-primary-50 border border-primary-100">
          <p className="text-sm text-primary-600 font-medium">Generic Adoption Rate</p>
          <p className="text-3xl font-bold text-primary-800 mt-1">78.3%</p>
          <p className="text-xs text-primary-600 mt-1">of eligible prescriptions</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
          <p className="text-sm text-amber-600 font-medium">Avg Savings/Member</p>
          <p className="text-3xl font-bold text-amber-800 mt-1">$126.50</p>
          <p className="text-xs text-amber-600 mt-1">per month</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Generic Savings by Drug</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Drug</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Brand Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Generic Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Savings</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Members</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Total Savings</th>
              </tr>
            </thead>
            <tbody>
              {savingsData.map(drug => (
                <tr key={drug.drug} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{drug.drug}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">${drug.brand}/mo</td>
                  <td className="py-3 px-4 text-sm text-emerald-600 font-medium">${drug.generic}/mo</td>
                  <td className="py-3 px-4 text-sm text-emerald-700 font-bold">${drug.savings}/mo</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{drug.members}</td>
                  <td className="py-3 px-4 text-sm text-emerald-700 font-bold">
                    ${(drug.savings * drug.members).toLocaleString()}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentRouting() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payment Routing</h1>
        <p className="text-slate-500 mt-1">Configure financial routing from provider visits to insurance policies</p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Routing Rules</h3>
        <div className="space-y-4">
          {[
            { name: 'Primary Care Visits', rule: 'Route to primary insurance on file', status: 'active', volume: '2,340/mo' },
            { name: 'Specialist Visits', rule: 'Pre-authorization required, then route', status: 'active', volume: '890/mo' },
            { name: 'Emergency Services', rule: 'Auto-route with 24hr retro authorization', status: 'active', volume: '45/mo' },
            { name: 'Pharmacy Claims', rule: 'Route to prescription coverage plan', status: 'active', volume: '4,120/mo' },
            { name: 'Telemedicine', rule: 'Route to virtual care benefit', status: 'pending', volume: '0/mo' },
          ].map(rule => (
            <div key={rule.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${rule.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{rule.name}</p>
                  <p className="text-sm text-slate-500">{rule.rule}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">{rule.volume}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${rule.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {rule.status}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Member</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Provider</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2026-04-24', member: 'ID-4521', provider: 'Dr. Chen', service: 'Cardiology', amount: 245, status: 'routed' },
                { date: '2026-04-23', member: 'ID-3892', provider: 'Dr. Wilson', service: 'Endocrinology', amount: 180, status: 'routed' },
                { date: '2026-04-23', member: 'ID-7821', provider: 'City General', service: 'Emergency', amount: 1200, status: 'pending' },
                { date: '2026-04-22', member: 'ID-4456', provider: 'QuickCare Pharmacy', service: 'Prescription', amount: 45, status: 'routed' },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-700">{formatDate(tx.date)}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 font-mono">{tx.member}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{tx.provider}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{tx.service}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${tx.status === 'routed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InsuranceKPICard({ icon, label, value, change, color }: any) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 card-hover">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium
          ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
          {Math.abs(change)}% from last quarter
        </div>
      )}
    </div>
  );
}
