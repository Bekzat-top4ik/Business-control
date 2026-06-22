/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, TrendingDown, Users, Bot, Settings, LogOut, RefreshCcw, Send, Sparkles, Shield
} from 'lucide-react';
import { UserRole, AuthUserSession } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  session: AuthUserSession | null;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, session, onLogout }: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();

  const baseItems = [
    { id: 'dashboard', label: t('dashboardTab'), icon: LayoutDashboard },
    { id: 'pos', label: t('posTab'), icon: ShoppingCart },
    { id: 'inventory', label: t('inventoryTab'), icon: Package },
    { id: 'expenses', label: t('expensesTab'), icon: TrendingDown },
    { id: 'crm', label: t('crmTab'), icon: Users },
    { id: 'employees', label: t('employeesTab'), icon: AwardIcon } // Use AwardIcon definition
  ];

  const navItems = session?.role === UserRole.SUPER_ADMIN
    ? [
        { id: 'superAdmin', label: t('superAdminTab') || "Owner Control Center", icon: Shield }
      ]
    : baseItems;

  function AwardIcon(props: any) {
    return (
      <svg
        {...props}
        className={props.className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }

  return (
    <div className="w-64 bg-white text-slate-850 flex flex-col justify-between shrink-0 h-screen select-none border-r border-slate-200 font-sans" id="applet-sidebar">
      
      {/* Brand logo & Session header info */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-600/20">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-sm tracking-tight leading-none">SaaS Business</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1 leading-none">Management suite</span>
            </div>
          </div>
        </div>

        {/* Dynamic High-contrast Language select toggle links */}
        <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100/80 border border-slate-200/50 rounded-lg">
          <button 
            onClick={() => setLanguage('en')} 
            className={`flex-1 py-1 text-center font-bold text-[10px] rounded transition-all cursor-pointer ${
              language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('ru')} 
            className={`flex-1 py-1 text-center font-bold text-[10px] rounded transition-all cursor-pointer ${
              language === 'ru' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            RU
          </button>
          <button 
            onClick={() => setLanguage('ky')} 
            className={`flex-1 py-1 text-center font-bold text-[10px] rounded transition-all cursor-pointer ${
              language === 'ky' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            KY
          </button>
        </div>

        {/* Auth profile segment */}
        {session && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5" id="active-user-workspace-tag">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{t('currentUserLabel')}</span>
            <span className="text-xs font-bold text-slate-700 truncate block leading-none">{session.companyName}</span>
            <div className="flex items-center gap-1.5 mt-1 border-t border-slate-200/60 pt-1.5 justify-between">
              <span className="text-[10.5px] text-indigo-600 font-semibold">{session.username.split(' ')[0]}</span>
              <span className="px-1.5 py-0.5 bg-indigo-50 text-[8.5px] font-bold text-indigo-700 rounded uppercase tracking-wider border border-indigo-100 leading-none">
                {session.role}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation menu list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-750 font-bold border border-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition text-left"
          id="logout-button"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>{t('logoutButton')}</span>
        </button>
      </div>

    </div>
  );
}

