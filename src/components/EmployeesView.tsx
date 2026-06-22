/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, UserPlus, Trophy, Phone, Check, ShieldAlert, DollarSign 
} from 'lucide-react';
import { Employee, UserRole } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface EmployeesViewProps {
  employees: Employee[];
  currentUserRole: UserRole;
  onAddEmployee: (emp: Omit<Employee, 'id' | 'companyId' | 'createdAt'>) => Promise<any>;
}

export default function EmployeesView({ employees, currentUserRole, onAddEmployee }: EmployeesViewProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [baseSalary, setBaseSalary] = useState('600');
  const [rankingScore, setRankingScore] = useState('90');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasWritingAccess = currentUserRole === UserRole.ADMINISTRATOR;

  const handleHireEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !baseSalary) {
      alert("Please enter employee name, phone, and salary details.");
      return;
    }

    try {
      setLoading(true);
      await onAddEmployee({
        name,
        phone,
        baseSalary: Number(baseSalary),
        rankingScore: Number(rankingScore || 90)
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setBaseSalary('600');
      setRankingScore('90');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed adding employee profile.");
    } finally {
      setLoading(false);
    }
  };

  // Sort employees by ranking score
  const sortedEmployees = [...employees].sort((a,b) => b.rankingScore - a.rankingScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="employees-staff-hub">
      
      {/* Staff Leaderboard Ranking list */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-150 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center h-10">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              Staff Performance Ranking Leaderboard
            </h2>
            <p className="text-xs text-slate-400">View active employee wage cards and efficiency multipliers based on POS checkout audits.</p>
          </div>
          <span className="p-1 px-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-750 font-extrabold text-xs flex gap-1 items-center font-mono">
            <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
            {t('employeesTab')}: {employees.length}
          </span>
        </div>

        <div className="space-y-3.5 font-sans">
          {sortedEmployees.map((emp, index) => {
            return (
              <div 
                key={emp.id}
                className={`p-4 border rounded-xl flex items-center justify-between transition-all relative ${
                  index === 0 ? 'bg-amber-50/10 border-amber-300' :
                  index === 1 ? 'bg-slate-50 border-gray-300' :
                  index === 2 ? 'bg-amber-100/10 border-amber-200' :
                  'bg-white border-slate-150'
                }`}
              >
                {/* Ranking Medallion badge */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    index === 0 ? 'bg-amber-500 text-white shadow-sm ring-4 ring-amber-100' :
                    index === 1 ? 'bg-slate-400 text-white shadow-sm ring-4 ring-slate-100' :
                    index === 2 ? 'bg-amber-600/80 text-white shadow-sm ring-4 ring-amber-50' :
                    'bg-slate-105 text-slate-500'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="min-w-0 pr-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{emp.name}</h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-350" />
                      {emp.phone}
                    </span>
                  </div>
                </div>

                {/* Score & Wage tags */}
                <div className="flex gap-4 items-center shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Wage salary</span>
                    <span className="text-xs font-black text-slate-800 font-mono block mt-0.5">${emp.baseSalary.toLocaleString()}/mo</span>
                  </div>

                  <div className="text-center bg-white px-3 py-1 border border-slate-200 rounded-xl">
                    <span className="text-[9px] text-slate-405 font-bold block uppercase">Multiplier</span>
                    <span className="text-xs font-black text-indigo-650 block">{emp.rankingScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          {employees.length === 0 && (
            <p className="text-xs text-center text-slate-400 py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No employees recorded. Register a crew member on the right page panel!
            </p>
          )}
        </div>
      </div>

      {/* Adding crew form (right span) */}
      <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs h-fit">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-650" />
            Recruit Crew Member
          </h3>
        </div>

        {hasWritingAccess ? (
          <form onSubmit={handleHireEmployee} className="mt-4 space-y-4 text-xs">
            {success && (
              <div className="p-2.5 bg-indigo-50 text-indigo-800 border border-indigo-150 rounded text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-650" />
                Crew member enrolled onto ledger lists successfully!
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Crew Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Saniya Nurmetova, Aidar Talgat"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Primary Telephone contact</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <input 
                  type="text" 
                  placeholder="e.g. +7 701 777 9900"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded py-2 pl-8 pr-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Wage salary ($ / Month)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <input 
                  type="number" 
                  placeholder="600"
                  value={baseSalary}
                  onChange={e => setBaseSalary(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded py-2 pl-8 pr-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Efficiency Ranking score (Starting)</label>
              <input 
                type="number" 
                placeholder="90"
                min="0"
                max="100"
                value={rankingScore}
                onChange={e => setRankingScore(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-md shadow-indigo-600/10 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer text-center block"
            >
              {loading ? "Adding Employee record..." : "Hire crew member"}
            </button>
          </form>
        ) : (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-1.5 mt-3 bg-slate-50 rounded-lg p-4 border border-dashed border-slate-200">
            <ShieldAlert className="w-7 h-7 text-slate-300 shrink-0" />
            <p className="text-xs leading-relaxed">Your current role '<strong>{currentUserRole}</strong>' excludes recruitment permissions. (Admin level required).</p>
          </div>
        )}
      </div>

    </div>
  );
}
