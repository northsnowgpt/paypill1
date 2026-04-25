'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, TrendingUp, Upload, Download,
  Search, Filter, ChevronRight, Activity, DollarSign,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  LogOut, Building2, Heart
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockEmployerData } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function EmployerPortal() {
  const { logout } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
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
                    ? 'bg-teal-500/20 text-teal-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-800 transition-colors"
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
            <Building2 className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-slate-700">{mockEmployerData.companyName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Employer Portal</span>
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <EmployerDashboard />}
          {activeTab === 'employees' && <EmployeeManagement />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'bulk' && <BulkUpload />}
        </div>
      </main>
    </div>
  );
}

function EmployerDashboard() {
  const data = mockEmployerData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Workforce Health Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of employee health engagement and cost savings</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployerKPICard 
          icon={<Users className="w-5 h-5" />}
          label="Total Employees"
          value={data.totalEmployees}
          change={+12}
          color="primary"
        />
        <EmployerKPICard 
          icon={<Activity className="w-5 h-5" />}
          label="Onboarded"
          value={data.onboardedCount}
          subtitle={`${Math.round((data.onboardedCount / data.totalEmployees) * 100)}% completion`}
          color="teal"
        />
        <EmployerKPICard 
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Health Score"
          value={data.healthScore}
          change={+5}
          color="emerald"
        />
        <EmployerKPICard 
          icon={<DollarSign className="w-5 h-5" />}
          label="Cost Savings"
          value={`$${(data.costSavings / 1000).toFixed(0)}K`}
          change={+8}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Health Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.anonymizedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="avgHealthScore" stroke="#0d9488" fill="#0d9488" fillOpacity={0.1} name="Health Score" />
              <Area type="monotone" dataKey="avgAdherence" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} name="Adherence %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Savings Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Cost Savings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.anonymizedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']}
              />
              <Bar dataKey="costSavings" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Employee Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Employee</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Department</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Health Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Adherence</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.slice(0, 5).map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{emp.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{emp.department}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${emp.onboarded ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {emp.onboarded ? 'Onboarded' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {emp.healthScore ? (
                      <span className={`font-semibold ${emp.healthScore >= 80 ? 'text-emerald-600' : emp.healthScore >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {emp.healthScore}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">
                    {emp.adherenceRate ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${emp.adherenceRate >= 80 ? 'bg-emerald-500' : emp.adherenceRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${emp.adherenceRate}%` }}
                          />
                        </div>
                        <span className="text-xs">{emp.adherenceRate}%</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">{emp.lastActivity || 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeeManagement() {
  const data = mockEmployerData;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'onboarded' | 'pending'>('all');

  const filtered = data.employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : 
                         filterStatus === 'onboarded' ? emp.onboarded : !emp.onboarded;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
          <p className="text-slate-500 mt-1">View and manage workforce health onboarding</p>
        </div>
        <button className="btn-teal flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Bulk Import
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            className="input-medical pl-10"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'onboarded', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filterStatus === f 
                  ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Employee</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Department</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Health Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Adherence</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center">
                        <span className="text-sm font-bold text-teal-700">{emp.name[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500">{emp.department}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${emp.onboarded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {emp.onboarded ? 'Onboarded' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700">
                    {emp.healthScore || '-'}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700">
                    {emp.adherenceRate ? `${emp.adherenceRate}%` : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                      View Details
                    </button>
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

function AnalyticsView() {
  const data = mockEmployerData;
  const COLORS = ['#0d9488', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6'];

  const deptData = [
    { name: 'Engineering', employees: 45, avgHealthScore: 82, avgAdherence: 88 },
    { name: 'Sales', employees: 32, avgHealthScore: 76, avgAdherence: 72 },
    { name: 'HR', employees: 12, avgHealthScore: 89, avgAdherence: 94 },
    { name: 'Marketing', employees: 18, avgHealthScore: 74, avgAdherence: 68 },
    { name: 'Finance', employees: 15, avgHealthScore: 85, avgAdherence: 90 },
    { name: 'Operations', employees: 28, avgHealthScore: 78, avgAdherence: 80 },
  ];

  const conditionData = [
    { name: 'Hypertension', value: 124 },
    { name: 'Diabetes', value: 87 },
    { name: 'Obesity', value: 156 },
    { name: 'Anxiety', value: 98 },
    { name: 'High Cholesterol', value: 112 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Health Analytics</h1>
        <p className="text-slate-500 mt-1">Anonymized workforce health insights and trends</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Health Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="avgHealthScore" fill="#0d9488" radius={[0, 6, 6, 0]} name="Health Score" />
              <Bar dataKey="avgAdherence" fill="#2563eb" radius={[0, 6, 6, 0]} name="Adherence %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Common Conditions (Anonymized)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={conditionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {conditionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cost Savings Breakdown</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-sm text-emerald-600 font-medium">Generic Drug Savings</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">$87,600</p>
            <p className="text-xs text-emerald-600 mt-1">YTD savings from generic alternatives</p>
          </div>
          <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
            <p className="text-sm text-primary-600 font-medium">Preventive Care</p>
            <p className="text-2xl font-bold text-primary-800 mt-1">$24,800</p>
            <p className="text-xs text-primary-600 mt-1">Reduced emergency visits</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-sm text-amber-600 font-medium">Adherence Improvement</p>
            <p className="text-2xl font-bold text-amber-800 mt-1">$12,100</p>
            <p className="text-xs text-amber-600 mt-1">Fewer complications & readmissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkUpload() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bulk Employee Onboarding</h1>
        <p className="text-slate-500 mt-1">Upload CSV or Excel files to onboard multiple employees</p>
      </div>

      <div className="p-8 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Upload Employee File</h3>
        <p className="text-slate-500 mt-1 mb-4">Drag and drop your CSV or Excel file here, or click to browse</p>
        <button className="btn-teal">Select File</button>
        <p className="text-xs text-slate-400 mt-4">
          Supported formats: .csv, .xlsx, .xls • Max file size: 10MB
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Template Requirements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-4 font-medium text-slate-600">Column</th>
                <th className="text-left py-2 px-4 font-medium text-slate-600">Required</th>
                <th className="text-left py-2 px-4 font-medium text-slate-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { col: 'first_name', req: 'Yes', desc: 'Employee first name' },
                { col: 'last_name', req: 'Yes', desc: 'Employee last name' },
                { col: 'email', req: 'Yes', desc: 'Work email address' },
                { col: 'employee_id', req: 'No', desc: 'Internal employee ID' },
                { col: 'department', req: 'No', desc: 'Department name' },
                { col: 'phone', req: 'No', desc: 'Contact phone number' },
              ].map(row => (
                <tr key={row.col} className="border-b border-slate-50">
                  <td className="py-2 px-4 font-mono text-slate-700">{row.col}</td>
                  <td className="py-2 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.req === 'Yes' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                      {row.req}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-slate-500">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-4 text-sm text-teal-600 font-medium flex items-center gap-1">
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>
    </div>
  );
}

function EmployerKPICard({ icon, label, value, subtitle, change, color }: any) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 card-hover">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium
          ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}% from last month
        </div>
      )}
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}
