/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, Plus, Trash2, Calendar, FileText, Check, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { Expense, UserRole } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface FinanceViewProps {
  expenses: Expense[];
  currentUserRole: UserRole;
  onAddExpense: (expense: Omit<Expense, 'id' | 'companyId' | 'createdAt'>) => Promise<any>;
  onDeleteExpense: (id: string) => Promise<any>;
}

export default function FinanceView({ expenses, currentUserRole, onAddExpense, onDeleteExpense }: FinanceViewProps) {
  const { t, language } = useLanguage();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Supplies');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Custom Deletion modal states
  const [expenseToDelete, setExpenseToDelete] = useState<{ id: string; detail: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const hasWritingAccess = currentUserRole === UserRole.ADMINISTRATOR || currentUserRole === UserRole.MANAGER;

  // Aggregate Category expenditure mapping
  const expenseSummary = useMemo(() => {
    let rentTotal = 0;
    let utilTotal = 0;
    let supplyTotal = 0;
    let wageTotal = 0;
    let otherTotal = 0;
    let total = 0;

    expenses.forEach(e => {
      total += e.amount;
      const cat = e.category.toLowerCase();
      if (cat.includes('rent')) rentTotal += e.amount;
      else if (cat.includes('utility') || cat.includes('electric') || cat.includes('power')) utilTotal += e.amount;
      else if (cat.includes('supply') || cat.includes('milk') || cat.includes('beverage')) supplyTotal += e.amount;
      else if (cat.includes('wage') || cat.includes('salary')) wageTotal += e.amount;
      else otherTotal += e.amount;
    });

    return { total, rentTotal, utilTotal, supplyTotal, wageTotal, otherTotal };
  }, [expenses]);

  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !description || !date) {
      alert("Please supply complete cost amount values and descriptions.");
      return;
    }

    try {
      setLoading(true);
      await onAddExpense({
        amount: Number(amount),
        category,
        description,
        date
      });
      setSuccess(true);
      setAmount('');
      setDescription('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed saving expense records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrigger = (id: string, detail: string) => {
    setExpenseToDelete({ id, detail });
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDeleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete expense entry. Access restricted.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="finance-overview-container">
      
      {/* Category split metrics summary widgets (left side columns) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Dynamic breakdown grid cards */}
        <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              Aggregate Running Outlays (OPEX)
            </h3>
            <p className="text-xs text-slate-400">Review total categorized expenditure logged under this workspace.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Supplies</span>
              <span className="text-sm font-bold text-slate-850 mt-1 block">${expenseSummary.supplyTotal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Rent</span>
              <span className="text-sm font-bold text-slate-850 mt-1 block">${expenseSummary.rentTotal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Utilities</span>
              <span className="text-sm font-bold text-slate-850 mt-1 block">${expenseSummary.utilTotal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Wages & Salaries</span>
              <span className="text-sm font-bold text-slate-850 mt-1 block">${expenseSummary.wageTotal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Other</span>
              <span className="text-sm font-bold text-slate-850 mt-1 block">${expenseSummary.otherTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex justify-between items-center text-xs">
            <div className="flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-rose-900">
                <span className="font-bold block">Total logged operational bills:</span>
                <span className="text-slate-400">Totaling all active entries listed on the ledger sheets.</span>
              </div>
            </div>
            <span className="text-xl font-extrabold text-rose-750 font-mono">${expenseSummary.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Expenses List Journal */}
        <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 h-5">{t('expensesTab')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2">Description</th>
                  <th className="py-2.5 text-right px-3">Amount</th>
                  {hasWritingAccess && <th className="py-2.5 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-705">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{e.date}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-slate-800 line-clamp-1 mt-1.5">{e.description}</td>
                    <td className="py-2.5 text-right font-extrabold text-rose-600 font-mono px-3">${e.amount.toFixed(2)}</td>
                    {hasWritingAccess && (
                      <td className="py-2.5">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleDeleteTrigger(e.id, e.description)}
                            className="p-1 text-slate-500 hover:text-red-500 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 font-semibold">No expenses currently logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Expense logging form (right side drawer col) */}
      <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs h-fit">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            Log Operational cost
          </h3>
        </div>

        {hasWritingAccess ? (
          <form onSubmit={handleLogExpense} className="mt-4 space-y-4 text-xs">
            {success && (
              <div className="p-2.5 bg-indigo-50 text-indigo-800 border border-indigo-150 rounded text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-650" />
                Expense entry logged successfully.
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block">Outlay Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition cursor-pointer"
              >
                <option value="Supplies font-medium">Material Supplies / Goods</option>
                <option value="Rent">Premises Rent</option>
                <option value="Utilities">Local Utilities (Water, Power, Net)</option>
                <option value="Wages">Employee Wages & Salary adjustments</option>
                <option value="Marketing">Advertising & Local Promo campaigns</option>
                <option value="Other">Other / Miscellaneous costs</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block">Expense Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block font-mono">Date occurance</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded py-2 pl-8 pr-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-705 block">Description / Note</label>
              <textarea 
                rows={3}
                placeholder="e.g. Milk delivery (50 Litres), Electric heater repair invoice..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition leading-relaxed"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-md shadow-indigo-600/10 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer text-center block"
            >
              {loading ? "Registering billing details..." : "Commit Expense Entry"}
            </button>
          </form>
        ) : (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-1.5 mt-3 bg-slate-50 rounded-lg p-4 border border-dashed border-slate-200">
            <ShieldAlert className="w-7 h-7 text-slate-300" />
            <p className="text-xs">Your current role access level '<strong>{currentUserRole}</strong>' lacks permission to post expense bills.</p>
          </div>
        )}
      </div>

      {/* Custom Deletion Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-650" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'ru' 
                  ? 'Подтверждение удаления' 
                  : language === 'ky' 
                  ? 'Өчүрүүнү ырастоо' 
                  : 'Confirm Expense Deletion'}
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
              {language === 'ru' 
                ? `Вы абсолютно уверены, что хотите навсегда удалить запись о расходе "${expenseToDelete.detail}" из базы данных?` 
                : language === 'ky' 
                ? `Чыгымдардын тизмесинен "${expenseToDelete.detail}" жазуусун биротоло өчүргүңүз келеби?` 
                : `Are you absolutely sure you want to permanently delete the expense entry "${expenseToDelete.detail}"? This action is irreversible.`}
            </p>

            {deleteError && (
              <div className="p-2.5 bg-red-50 text-red-705 text-xs rounded border border-red-150 font-medium font-sans">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2.5 justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold transition text-xs cursor-pointer"
              >
                {language === 'ru' ? 'Отмена' : language === 'ky' ? 'Жакко чыгаруу' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md shadow-red-600/10 transition text-xs flex items-center gap-1 cursor-pointer"
              >
                {isDeleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                {language === 'ru' ? 'Удалить' : language === 'ky' ? 'Өчүрүү' : 'Delete Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
