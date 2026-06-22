/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Key, Sparkles, AlertCircle, PlayCircle, Loader2, RefreshCw, Layers 
} from 'lucide-react';
import Sidebar from './components/Sidebar.js';
import DashboardView from './components/DashboardView.js';
import POSView from './components/POSView.js';
import InventoryView from './components/InventoryView.js';
import FinanceView from './components/FinanceView.js';
import CRMView from './components/CRMView.js';
import EmployeesView from './components/EmployeesView.js';
import SuperAdminView from './components/SuperAdminView.js';
import { UserRole, AuthUserSession, DashboardSummary, Product, Expense, Customer, Employee } from './types.js';
import { useLanguage } from './LanguageContext.js';

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab ] = useState('dashboard');

  const [token, setToken] = useState<string | null>(localStorage.getItem('saas_jwt_token'));
  const [session, setSession] = useState<AuthUserSession | null>(null);
  
  // Auth screen toggle
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [registerCompanyName, setRegisterCompanyName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Core datasets
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Page level loaders
  const [appLoading, setAppLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Get auth headers
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 1. Trigger Auth Profile Fetching
  const fetchUserProfile = async (jwt: string) => {
    try {
      setAppLoading(true);
      const res = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
      handleLogout();
    } finally {
      setAppLoading(false);
    }
  };

  // 2. Fetch Dashboard aggregate KPIs
  const loadDashboardMetrics = async () => {
    if (!token) return;
    try {
      setSummaryLoading(true);
      const res = await fetch('/api/dashboard/summary', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDashboardSummary(data);
      }
    } catch (e) {
      console.error("error fetching summary metrics:", e);
    } finally {
      setSummaryLoading(false);
    }
  };

  // 3. Fetch specific modules Lists
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { headers: getHeaders() });
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses', { headers: getHeaders() });
      if (res.ok) setExpenses(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers', { headers: getHeaders() });
      if (res.ok) setCustomers(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees', { headers: getHeaders() });
      if (res.ok) setEmployees(await res.json());
    } catch (e) { console.error(e); }
  };

  // Core Refresh trigger
  const fetchAllSubscribedContext = () => {
    if (!token) return;
    loadDashboardMetrics();
    fetchProducts();
    fetchExpenses();
    fetchCustomers();
    fetchEmployees();
  };

  // Listen to session login
  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setSession(null);
    }
  }, [token]);

  // Listen to profile change
  useEffect(() => {
    if (session) {
      if (session.role === UserRole.SUPER_ADMIN) {
        setActiveTab('superAdmin');
      } else {
        fetchAllSubscribedContext();
      }
    }
  }, [session]);

  const handleLogout = () => {
    localStorage.removeItem('saas_jwt_token');
    setToken(null);
    setSession(null);
    setDashboardSummary(null);
    setProducts([]);
    setExpenses([]);
    setCustomers([]);
    setEmployees([]);
    setActiveTab('dashboard');
  };

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPass) return;

    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPass })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failing. Check credentials.");
        return;
      }

      localStorage.setItem('saas_jwt_token', data.token);
      setToken(data.token);
    } catch (err) {
      setAuthError("Failed connecting to SaaS backend services.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!registerCompanyName || !registerUsername || !authEmail || !authPass) {
      setAuthError("All fields are mandatory properties.");
      return;
    }

    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: registerCompanyName,
          username: registerUsername,
          email: authEmail,
          password: authPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Registration rejected.");
        return;
      }

      localStorage.setItem('saas_jwt_token', data.token);
      setToken(data.token);
    } catch (err) {
      setAuthError("Failed connecting to SaaS server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // --- API OPERATIONS WRAPPER FOR CHILDS ---

  const handlePOSCheckout = async (cart: { productId: string; quantity: number }[], customerId: string | null, paymentMethod: 'Cash' | 'Card' | 'Mobile') => {
    const res = await fetch('/api/sales/checkout', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cart, customerId, paymentMethod })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "POS checkout rejected.");
    }
    const val = await res.json();
    fetchAllSubscribedContext(); // Refresh metrics list
    return val;
  };

  const handleAddProduct = async (prod: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(prod)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed adding item.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleUpdateProduct = async (id: string, updates: any) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed updates.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete denied.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleAddExpense = async (expense: any) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expense)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed logging outlay cost.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleDeleteExpense = async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Denied.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleAddCustomer = async (cust: any) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cust)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed adding CRM profile.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleAddEmployee = async (emp: any) => {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(emp)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed recruiting employees.");
    }
    fetchAllSubscribedContext();
    return await res.json();
  };

  const handleRefreshAiInsights = async () => {
    const res = await fetch(`/api/ai/insights?lang=${language}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Could not acquire Copilot reports.");
    return await res.json();
  };

  const handleTriggerSimulateTelegram = async () => {
    const res = await fetch(`/api/telegram/trigger-report?lang=${language}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Webhook broadcast simulation error.");
    fetchAllSubscribedContext(); // Will log action into audit logs!
    return await res.json();
  };


  // MAIN PAGE RENDER PIPELINE
  if (appLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 text-slate-800 gap-3 select-none">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <h2 className="text-sm font-semibold tracking-wide animate-pulse text-indigo-950">Initializing SaaS workspace environment...</h2>
      </div>
    );
  }

  // LOGIN / REGISTRATION WORKFLOW
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-xs select-none relative">
        
        {/* Floating Language Switcher for non-logged users */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-xl shadow-xs z-50">
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('ru')} 
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              language === 'ru' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            RU
          </button>
          <button 
            onClick={() => setLanguage('ky')} 
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              language === 'ky' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            KY
          </button>
        </div>

        {/* Decorative corner ambient glow rings */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-50/60 blur-3xl pointer-events-none"></div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full shadow-xl shadow-slate-200/50 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-lg shadow-indigo-600/20">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base tracking-tight">{t('loginHeader')}</h1>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">{t('loginSubtitle')}</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-750 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isLoginView ? (
            /* LOGIN MODULE */
            <form onSubmit={handleLoginFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Terminal Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input 
                    type="email" 
                    placeholder="e.g. cafe_admin@example.com"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 pl-10 pr-4 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Access Key Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={authPass}
                    onChange={e => setAuthPass(e.target.value)}
                    className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/10 flex justify-center items-center gap-1.5 cursor-pointer"
                id="login-form-submit-btn"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                {t('signinButton')}
              </button>
            </form>
          ) : (
            /* TENANT WORKSPACE REGISTRATION */
            <form onSubmit={handleRegisterFormSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{t('businessWorkspaceName')}</label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="e.g. Almaty Pizza Cafe, Golden Drugstore"
                    value={registerCompanyName}
                    onChange={e => setRegisterCompanyName(e.target.value)}
                    className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 pl-10 pr-4 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Administrator full name</label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="e.g. Alikhan Asanov"
                    value={registerUsername}
                    onChange={e => setRegisterUsername(e.target.value)}
                    className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 pl-10 pr-4 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Work Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. admin@local.saas"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 px-4 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{t('choosePasscode')}</label>
                <input 
                  type="password" 
                  placeholder="Minimum 6 characters"
                  value={authPass}
                  onChange={e => setAuthPass(e.target.value)}
                  className="w-full bg-white border border-slate-250 text-slate-850 py-2.5 px-4 rounded-xl placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow flex justify-center items-center gap-1 cursor-pointer"
                id="register-form-submit-btn"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
                {t('bootstrapWorkspaceBtn')}
              </button>
            </form>
          )}

          {/* Toggle Screen view logic */}
          <div className="text-center pt-2.5 border-t border-slate-100 text-slate-500 text-[10.5px]">
            {isLoginView ? (
              <p>
                 {t('wantConfigureSeparate')}{' '}
                <button 
                  onClick={() => { setIsLoginView(false); setAuthError(''); }}
                  className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  {t('createDynamicTenant')}
                </button>
              </p>
            ) : (
              <p>
                 {t('alreadyRegisteredCompany')}{' '}
                <button 
                  onClick={() => { setIsLoginView(true); setAuthError(''); }}
                  className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  {t('logOnTerminal')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOGGED AUTH WORKSPACE LAYOUT
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* Structural Sidebar Drawer Segment */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (session?.role === UserRole.SUPER_ADMIN) {
            setActiveTab('superAdmin');
          } else {
            setActiveTab(tab);
          }
        }} 
        session={session} 
        onLogout={handleLogout}
      />

      {/* Main viewport Container segment */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Workspace global Header navigation */}
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex justify-between items-center shrink-0 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-gray-900 capitalize tracking-tight" id="active-viewport-header-title">
              {activeTab === 'superAdmin' ? t('superAdminHeader') :
               activeTab === 'dashboard' ? t('headerDashboard') : 
               activeTab === 'pos' ? t('headerPOS') :
               activeTab === 'inventory' ? t('headerInventory') :
               activeTab === 'expenses' ? t('headerExpenses') :
               activeTab === 'crm' ? t('headerCRM') : t('headerEmployees')}
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">{t('headerSubtitle')}</p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Quick Refresh indicators */}
            <button 
              onClick={fetchAllSubscribedContext}
              disabled={summaryLoading}
              className="p-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-slate-100 transition duration-150 cursor-pointer disabled:opacity-50"
              title="Force Metrics synchronization"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${summaryLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="bg-slate-50 border px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{t('connectedStatusLabel')}</span>
            </div>
          </div>
        </header>

        {/* Modular Viewports mapping */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === 'superAdmin' && (
            <SuperAdminView 
              token={token} 
              getHeaders={getHeaders} 
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              summary={dashboardSummary} 
              onNavigateToPOS={() => setActiveTab('pos')} 
              onNavigateToInventory={() => setActiveTab('inventory')}
              isLoading={summaryLoading} 
              productsCount={products.length}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'pos' && (
            <POSView 
              products={products} 
              customers={customers} 
              onCheckout={handlePOSCheckout} 
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              products={products} 
              currentUserRole={session.role}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'expenses' && (
            <FinanceView 
              expenses={expenses}
              currentUserRole={session.role}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'crm' && (
            <CRMView 
              customers={customers}
              currentUserRole={session.role}
              onAddCustomer={handleAddCustomer}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView 
              employees={employees}
              currentUserRole={session.role}
              onAddEmployee={handleAddEmployee}
            />
          )}
        </main>

      </div>

    </div>
  );
}
