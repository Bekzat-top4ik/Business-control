/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, UserPlus, Gift, Phone, Mail, Award, Check 
} from 'lucide-react';
import { Customer, UserRole } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface CRMViewProps {
  customers: Customer[];
  currentUserRole: UserRole;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'companyId' | 'createdAt' | 'loyaltyPoints' | 'isVip'>) => Promise<any>;
}

export default function CRMView({ customers, currentUserRole, onAddCustomer }: CRMViewProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Name and telephone information are mandatory properties.");
      return;
    }

    try {
      setLoading(true);
      await onAddCustomer({
        name,
        email: email || 'walk-in@local.saas',
        phone
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed adding customer profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="crm-clientele-hub">
      
      {/* Customer registry database (left span) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-150 p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" />
            CRM Clientele Loyalty Database
          </h2>
          <p className="text-xs text-slate-400">Track customer purchases, outstanding loyalty points, and VIP enrollment tiers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2 px-3">{t('customerLabel')}</th>
                <th className="py-2 px-2">Phone Number</th>
                <th className="py-2 px-2">Email Address</th>
                <th className="py-2 px-4 text-center">Loyalty Balance</th>
                <th className="py-2 text-center">SaaS VIP Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-705">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-800">{c.name}</td>
                  <td className="py-3 px-2 font-mono text-slate-550">{c.phone}</td>
                  <td className="py-3 px-2 text-slate-550">{c.email || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold font-mono rounded text-[10px]">
                      {c.loyaltyPoints} points
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-center">
                      {c.isVip ? (
                        <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-800 rounded-full text-[8.5px] font-extrabold flex items-center gap-0.5 border border-yellow-200 uppercase tracking-wider leading-none">
                          <Award className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                          VIP Tier
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-[9px] font-medium">
                          Standard Client
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 font-semibold animate-transition font-bold">No customers enrolled onto workspace registries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adding customer form (right span) */}
      <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs h-fit">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-650" />
            Fast-Enroll Customer
          </h3>
        </div>

        <form onSubmit={handleCreateCustomer} className="mt-4 space-y-4 text-xs">
          {success && (
            <div className="p-2.5 bg-indigo-50 text-indigo-800 border border-indigo-150 rounded text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 text-indigo-605" />
              Customer registered into CRM registry!
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Client Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Elena Petrova, Daniyar Kasi"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Phone number contact</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              <input 
                type="tel" 
                placeholder="e.g. +7 701 556 2211"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 pl-8 pr-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-705 block text-[10px] uppercase tracking-wider">Email address (Optional)</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              <input 
                type="email" 
                placeholder="e.g. client@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 pl-8 pr-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-50/75 border border-slate-100 p-3 rounded-lg text-[10px] text-slate-450 flex gap-2">
            <Gift className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="leading-relaxed font-sans">
              Auto registers loyalty coefficients. Customers acquire points based on checkout size. Reach <strong className="text-indigo-700">100 points</strong> to unlock special <strong className="text-yellow-600">VIP Status</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-md shadow-indigo-600/10 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer text-center block"
          >
            {loading ? "Adding Customer profile..." : "Save CRM loyalty file"}
          </button>
        </form>
      </div>

    </div>
  );
}
