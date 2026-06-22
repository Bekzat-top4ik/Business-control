/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, PlayCircle, BarChart3, Activity,
  Sparkles, CheckCircle2, ArrowRight, Bot, HelpCircle, PlusCircle, ShoppingCart, Package, Clock, LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardSummary } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface DashboardViewProps {
  summary: DashboardSummary | null;
  onNavigateToPOS: () => void;
  onNavigateToInventory: () => void;
  isLoading: boolean;
  productsCount: number;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({ 
  summary, 
  onNavigateToPOS, 
  onNavigateToInventory, 
  isLoading,
  productsCount,
  onNavigateToTab
}: DashboardViewProps) {
  const { t, language } = useLanguage();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Localized texts for simple guide & assistant to guarantee exact compliance and high accessibility
  const content = {
    en: {
      assistantGreeting: "Hello! I am your store assistant. Here's how your shop is doing today:",
      nextStepLabel: "What should I do next?",
      onboardingTitle: "Let's Get Your Store Ready! 🚀",
      onboardingSub: "Complete these 4 simple steps to start managing your business like a pro.",
      step1Title: "Step 1: Create your business",
      step1Desc: "Done! Your business terminal is live.",
      step2Title: "Step 2: Add your first product",
      step2Desc: "Add the items you want to sell with pricing.",
      step2Btn: "Add a Product now",
      step3Title: "Step 3: Register your first sale",
      step3Desc: "Open the cashier page to receive customer payments.",
      step3Btn: "Open Cashier",
      step4Title: "Step 4: View your reports",
      step4Desc: "Instantly see how much profit you made today.",
      step4Btn: "View simple reports",
      salesCountMessage: (count: number) => `You have registered ${count} sales today. Quality work!`,
      noSalesMessage: "You haven't made any sales today. Let's make your first sale!",
      lowStockMessage: (count: number) => `Warning: ${count} of your products are running out soon. Click to stock up!`,
      perfectStockMessage: "Your products list is in great shape! No critical low stock detected.",
      quickTip: "💡 Tip: Log your store bills like rent or electricity under the 'Expenses' section to see your exact net profit!",
      attentionRequired: "⚠️ Needs Your Attention",
      todaySales: "Cashier Sales Today",
      todayProfit: "Your Clean Profit Today",
      earnExplanation: "This is all the cash, card, and QR payments you collected today.",
      profitExplanation: "This is your actual profit after subtracting the product costs.",
      lowStockExplanation: "Products with very low quantity on shelves that need buying.",
      activeAlertHeader: "Action Alert",
      viewAllProducts: "View All Products",
      recentActivity: "Recent Store Actions Logs",
      recentSales: "Today's Sales Records",
      noAudits: "No store action logs yet.",
      noSalesRecorded: "You haven't made any sales registered today. Let's make your first sale using the Sales Terminal!"
    },
    ru: {
      assistantGreeting: "Здравствуйте! Я ваш умный помощник. Вот состояние ваших дел на сегодня:",
      nextStepLabel: "Что мне делать дальше?",
      onboardingTitle: "Давайте настроим ваш магазин! 🚀",
      onboardingSub: "Выполните эти 4 простых шага, чтобы начать вести учет как профессионал.",
      step1Title: "Шаг 1: Назовите свой бизнес",
      step1Desc: "Готово! Ваш личный кабинет запущен.",
      step2Title: "Шаг 2: Добавьте первый товар",
      step2Desc: "Укажите наименования товаров, которые вы продаете, и цены.",
      step2Btn: "Добавить продукт",
      step3Title: "Шаг 3: Сделайте первую продажу",
      step3Desc: "Откройте кассу, чтобы принимать оплату от покупателей.",
      step3Btn: "Открыть Кассу",
      step4Title: "Шаг 4: Посмотрите результаты",
      step4Desc: "Здесь вы мгновенно увидите, сколько чистой прибыли заработали.",
      step4Btn: "Посмотреть отчеты",
      salesCountMessage: (count: number) => `Сегодня вы зарегистрировали ${count} продаж. Отличный результат!`,
      noSalesMessage: "Сегодня еще не было продаж. Давайте проведем вашу первую продажу на кассе!",
      lowStockMessage: (count: number) => `Внимание: у вас заканчивается ${count} шт. товаров. Нужно докупить их!`,
      perfectStockMessage: "Все товары в достаточном количестве! Дефицита нет.",
      quickTip: "💡 Совет: записывайте расходы (аренду, свет, зарплаты) в разделе 'Расходы', чтобы видеть чистую прибыль!",
      attentionRequired: "⚠️ Требует вашего внимания",
      todaySales: "Продажи через кассу сегодня",
      todayProfit: "Ваша чистая прибыль сегодня",
      earnExplanation: "Это все деньги, полученные через кассу наличными, картой или QR-кодом.",
      profitExplanation: "Это ваши реальные заработанные деньги за вычетом оптовой цены закупки товаров.",
      lowStockExplanation: "Товары на полках, которые почти закончились и требуют закупки.",
      activeAlertHeader: "Предупреждение",
      viewAllProducts: "Посмотреть все товары",
      recentActivity: "История действий в магазине",
      recentSales: "Записи сегодняшних продаж",
      noAudits: "Действий в магазине пока не зафиксировано.",
      noSalesRecorded: "Сегодня еще не было зарегистрировано продаж через кассу."
    },
    ky: {
      assistantGreeting: "Ассалому алейкум! Мен сиздин жардамчыңызмын. Бүгүнкү дүкөндүн абалы:",
      nextStepLabel: "Андан кийин эмне кылышым керек?",
      onboardingTitle: "Дүкөндү чогуу ишке киргизели! 🚀",
      onboardingSub: "Ишти ийгиликтүү баштоо үчүн төмөнкү 4 жөнөкөй кадамды аткарыңыз.",
      step1Title: "Кадам 1: Бизнести атоо",
      step1Desc: "Даяр! Сиздин жеке терминалыңыз кошулду.",
      step2Title: "Кадам 2: Биринчи товарды кошуу",
      step2Desc: "Сата турган товарларыңызды жана алардын баасын жазыңыз.",
      step2Btn: "Товар кошуу",
      step3Title: "Кадам 3: Биринчи сатууну каттоого алуу",
      step3Desc: "Касса барагын ачып, кардарлардан төлөм кабыл алыңыз.",
      step3Btn: "Кассаны ачуу",
      step4Title: "Кадам 4: Жалпы эсепти көрүү",
      step4Desc: "Бүгүн канча таза пайда тапканыңызды дароо көрүңүз.",
      step4Btn: "Эсептерди көрүү",
      salesCountMessage: (count: number) => `Бүгүн сиз кассадан ${count} сатуу ишке ашырдыңыз. Азаматсыз!`,
      noSalesMessage: "Бүгүн сатуу боло элек. Келиңиз, кассадан биринчи сатууну жасап көрөлү!",
      lowStockMessage: (count: number) => `Эскертүү: сизде ${count} товар азайып калды. Аларды тезинен сатып алуу керек!`,
      perfectStockMessage: "Товарлар кампада жетиштүү! Дефицит жок.",
      quickTip: "💡 Кеңеш: таза кирешени так көрүү үчүн ижара, электр энергиясы сыяктуу чыгымдарды 'Чыгымдар' бөлүмүнө жазып туруңуз!",
      attentionRequired: "⚠️ Сиздин көңүлүңүздү талап кылат",
      todaySales: "Кассадагы бүгүнкү сатуулар",
      todayProfit: "Бүгүнкү таза пайдаңыз",
      earnExplanation: "Бүгүн кассадан накталай, карта же QR аркылуу чогулган бардык каражаттар.",
      profitExplanation: "Товардын опто баасын алып салгандагы сиздин таза тапкан акчаңыз.",
      lowStockExplanation: "Текчелерде өтө эле аз калып, сатып алууну талап кылган товарлар.",
      activeAlertHeader: "Эскертүү",
      viewAllProducts: "Бардык товарларды көрүү",
      recentActivity: "Дүкөндөгү акыркы иш-аракеттердин тарыхы",
      recentSales: "Бүгүнкү сатуулардын жазуулары",
      noAudits: "Азырынча эч кандай аракет каттала элек.",
      noSalesRecorded: "Бүгүн сатуулар боло элек. Баштоо үчүн Сатуулар же Касса барагын ачыңыз!"
    }
  };

  const activeLang = language === 'ru' ? 'ru' : language === 'ky' ? 'ky' : 'en';
  const localText = content[activeLang];

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" id="dashboard-loader">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-semibold animate-pulse mt-4">Идёт расчёт показателей...</p>
        </div>
      </div>
    );
  }

  // Computing real steps completion
  const step1Done = true; // Always done since logged in
  const step2Done = productsCount > 0;
  const step3Done = summary.recentSales.length > 0;
  const step4Done = activeLang !== null; // Viewed this page!

  let completedStepsCount = 1;
  if (step2Done) completedStepsCount++;
  if (step3Done) completedStepsCount++;
  if (step4Done) completedStepsCount++;

  const isAllOnboardingDone = step1Done && step2Done && step3Done;

  return (
    <div className="space-y-8 pb-12" id="dashboard-view-main">
      
      {/* 1. Big Warm Header Greetings */}
      <div className="bg-linear-to-r from-indigo-900 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg" id="dashboard-welcome-banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
              🎯 {t('connectedStatusLabel') || "Online"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight leading-none text-white">
            {t('welcomeBack') || "Welcome back"}!
          </h2>
          <p className="text-sm text-indigo-100 max-w-xl font-normal leading-relaxed">
            {t('headerSubtitle') || "We designed this platform so you can manage your store cleanly with zero computer training."}
          </p>
        </div>
        <div className="absolute right-6 bottom-4 sm:right-10 sm:bottom-6 opacity-10 pointer-events-none">
          <Activity className="w-36 h-36" />
        </div>
      </div>

      {/* 2. FIRST-TIME USER ONBOARDING CHECKLIST */}
      {showOnboarding && !isAllOnboardingDone && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50/70 border-2 border-emerald-150 rounded-2xl p-6 shadow-sm space-y-4 relative"
          id="visual-onboarding-assistant-widget"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                {localText.onboardingTitle}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {localText.onboardingSub}
              </p>
            </div>
            
            <div className="px-4 py-2 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black shrink-0">
              {completedStepsCount} / 4 Done
            </div>
          </div>

          {/* Stepper visual cards (horizontal layout for perfect visual ease) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 bg-white ${step1Done ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 1</span>
                {step1Done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{localText.step1Title}</h4>
                <p className="text-[11px] text-emerald-700 font-medium mt-1 leading-normal">{localText.step1Desc}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 bg-white ${step2Done ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-150 shadow-xs'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 2</span>
                {step2Done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{localText.step2Title}</h4>
                <p className="text-[10.5px] text-slate-400 mt-0.5 leading-normal">{step2Done ? "Complete! Product catalog registered." : localText.step2Desc}</p>
              </div>
              {!step2Done && (
                <button 
                  onClick={() => onNavigateToTab('inventory')}
                  className="w-full mt-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-lg transition text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {localText.step2Btn}
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 bg-white ${step3Done ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-150 shadow-xs'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 3</span>
                {step3Done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-250"></div>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{localText.step3Title}</h4>
                <p className="text-[10.5px] text-slate-400 mt-0.5 leading-normal">{step3Done ? `Registered ${summary.recentSales.length} sale!` : localText.step3Desc}</p>
              </div>
              {!step3Done && (
                <button 
                  onClick={() => onNavigateToTab('pos')}
                  disabled={!step2Done}
                  className={`w-full mt-2 py-1.5 text-white font-extrabold text-[10px] rounded-lg transition text-center flex items-center justify-center gap-1 cursor-pointer ${
                    step2Done ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 pointer-events-none opacity-50'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {localText.step3Btn}
                </button>
              )}
            </div>

            {/* Step 4 */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-36 bg-white ${step4Done ? 'border-emerald-200 bg-emerald-50/10 font-bold' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 4</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{localText.step4Title}</h4>
                <p className="text-[10.5px] text-slate-400 mt-0.5 leading-normal">{localText.step4Desc}</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('ai')}
                className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] rounded-lg transition text-center block cursor-pointer"
              >
                {localText.step4Btn}
              </button>
            </div>

          </div>
        </motion.div>
      )}

      {/* 3. BUILT-IN SMART HELPER ASSISTANT BALLOON */}
      <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden" id="smart-assistant-speech-balloon">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-xl pointer-events-none"></div>
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 shrink-0 border border-indigo-200 animate-pulse">
          <Bot className="w-6 h-6" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
              🤖 Smart Shop Assistant
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-1">
            "{localText.assistantGreeting}"
          </p>
          
          {/* Diagnostic outputs based on state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Low stock reminder */}
            {summary.lowStockCount > 0 ? (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-xs text-amber-900 font-semibold">{localText.lowStockMessage(summary.lowStockCount)}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-950 font-semibold">{localText.perfectStockMessage}</span>
              </div>
            )}

            {/* Total sales reminder */}
            {summary.recentSales.length > 0 ? (
              <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-xs text-indigo-950 font-semibold">{localText.salesCountMessage(summary.recentSales.length)}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <PlayCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-semibold">{localText.noSalesMessage}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {localText.quickTip}
          </p>
        </div>
      </div>

      {/* 4. MAIN HUGE KPI CARDS (LARGE TOUCH PATHS, ZERO TECHNICAL TERMINOLOGY) */}
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">
        📊 {localText.nextStepLabel}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="accessible-bento-kpi-grid">
        
        {/* Card 1: MONEY COLLECTED (REVENUE) */}
        <div 
          onClick={onNavigateToPOS} 
          className="border-2 border-indigo-150 bg-indigo-50/10 rounded-2xl p-6 flex flex-col justify-between h-48 hover:shadow-lg transition-all cursor-pointer group hover:border-indigo-400"
          id="kpi-revenue-huge-card"
        >
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-850 font-bold text-[10px] uppercase tracking-wider">
              {localText.todaySales}
            </span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-600 text-white group-hover:scale-110 transition shrink-0 shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 block">
              ${summary.revenue.toLocaleString()}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
              {localText.earnExplanation}
            </p>
          </div>
        </div>

        {/* Card 2: ACTUAL PROFIT */}
        <div 
          onClick={() => onNavigateToTab('ai')} 
          className="border-2 border-emerald-150 bg-emerald-50/10 rounded-2xl p-6 flex flex-col justify-between h-48 hover:shadow-lg transition-all cursor-pointer group hover:border-emerald-400"
          id="kpi-profit-huge-card"
        >
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-850 font-bold text-[10px] uppercase tracking-wider">
              {localText.todayProfit}
            </span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 text-white group-hover:scale-110 transition shrink-0 shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 block">
              ${summary.profit.toLocaleString()}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
              {localText.profitExplanation}
            </p>
          </div>
        </div>

        {/* Card 3: LOW STOCK WARNERS */}
        <div 
          onClick={onNavigateToInventory} 
          className={`border-2 rounded-2xl p-6 flex flex-col justify-between h-48 hover:shadow-lg transition-all cursor-pointer group ${
            summary.lowStockCount > 0 
              ? 'border-amber-200 bg-amber-50/20 hover:border-amber-500' 
              : 'border-slate-200 bg-slate-50/10 hover:border-slate-400'
          }`}
          id="kpi-lowstock-huge-card"
        >
          <div className="flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
              summary.lowStockCount > 0 ? 'bg-amber-100 text-amber-850' : 'bg-slate-100 text-slate-650'
            }`}>
              {t('lowStockItemsCount') || "Low Stocks Status"}
            </span>
            <div className={`p-2 sm:p-2.5 rounded-xl text-white group-hover:scale-110 transition shrink-0 shadow-md ${
              summary.lowStockCount > 0 ? 'bg-amber-500' : 'bg-slate-500'
            }`}>
              {summary.lowStockCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 block">
              {summary.lowStockCount} {activeLang === 'ru' ? 'товаров' : activeLang === 'ky' ? 'товар' : 'items'}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
              {summary.lowStockCount > 0 ? localText.lowStockMessage(summary.lowStockCount) : localText.lowStockExplanation}
            </p>
          </div>
        </div>

      </div>

      {/* 5. SPLIT DISPLAY BAR CHART AND AUDIT LOG ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAR CHART DISPLAY */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-4" id="visual-trend-graph">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                {t('salesBreakdownTitle') || "Sales overview trend"}
              </h3>
              <p className="text-xs text-slate-400">Shows your sales history to help you see peak times easily.</p>
            </div>
            
            <button 
              onClick={onNavigateToPOS}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              {t('registerSaleBtn') || "Sell Goods"}
            </button>
          </div>

          {summary.recentSales.length === 0 ? (
            <div className="h-48 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4">
              <ShoppingCart className="w-10 h-10 text-slate-300 animate-bounce" />
              <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">{localText.noSalesRecorded}</p>
            </div>
          ) : (
            <div className="pt-4">
              <div className="h-44 w-full flex items-end gap-3 px-2 relative">
                {/* Horizontal Guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
                  <div className="border-t border-slate-100 h-px w-full"></div>
                  <div className="border-t border-slate-100 h-px w-full"></div>
                  <div className="border-t border-slate-100 h-px w-full"></div>
                </div>

                {summary.recentSales.slice(0, 7).reverse().map((sale, index) => {
                  const maxVal = Math.max(...summary.recentSales.map(s => s.totalAmount), 10);
                  const barHeightPercent = Math.max(15, (sale.totalAmount / maxVal) * 85);

                  return (
                    <div 
                      key={sale.id} 
                      className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                    >
                      {/* Interactive large touch balloon target with 44px equivalent hover area */}
                      <div className="absolute bottom-full mb-2 bg-slate-900 text-white rounded-lg p-3 opacity-0 group-hover:opacity-100 transition z-20 w-36 text-center shadow-md text-xs pointer-events-none">
                        <p className="font-extrabold text-emerald-400">${sale.totalAmount.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-350">Profit: +${sale.totalProfit.toFixed(2)}</p>
                        <p className="text-[9px] text-slate-400">{new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>

                      <div className="w-full bg-slate-50 rounded-lg h-[80%] flex items-end relative overflow-hidden border border-slate-100 shadow-xs">
                        <div 
                          style={{ height: `${barHeightPercent}%` }}
                          className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 transition-all rounded-b-md"
                        ></div>
                      </div>
                      
                      <span className="text-[9.5px] font-bold text-slate-800 font-mono mt-1.5">
                        ${sale.totalAmount.toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RECENT WORKSPACE ACTIVITY AUDIT LOG (CLEANED EXPLANATION) */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs flex flex-col justify-between space-y-4" id="visual-store-actions">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              {localText.recentActivity}
            </h3>
            <p className="text-xs text-slate-400">Review other operators' latest adjustments instantly.</p>
          </div>

          <div className="space-y-3 max-h-[14rem] overflow-y-auto pr-1 flex-1">
            {summary.recentLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="border-l-3 border-indigo-500 pl-3 py-1 space-y-0.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed font-sans text-xs">{log.details}</p>
                <div className="text-[10px] text-slate-400 mt-0.5 font-bold">
                  👤 {log.username}
                </div>
              </div>
            ))}
            {summary.recentLogs.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-10">{localText.noAudits}</p>
            )}
          </div>
        </div>

      </div>

      {/* 6. RECENT SALES TRANSACTION RECORDS (INCREASED TYPOGRAPHY / CLICK targets) */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs" id="clean-sales-records-list">
        <h3 className="text-sm font-black text-slate-900 mb-4">{localText.recentSales}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-widest text-[9.5px]">
                <th className="py-3">Receipt No.</th>
                <th className="py-3">When</th>
                <th className="py-3">Customer Code</th>
                <th className="py-3">Employee</th>
                <th className="py-3">Method</th>
                <th className="py-3 text-right">Payment Size</th>
                <th className="py-3 text-right">Store Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs sm:text-sm text-slate-700">
              {summary.recentSales.slice(0, 8).map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition duration-150 text-slate-800">
                  <td className="py-3.5 font-mono font-bold text-slate-900">{sale.id.slice(0, 8)}...</td>
                  <td className="py-3.5 text-slate-500 font-mono">
                    {new Date(sale.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 font-bold text-slate-800">{sale.customerName || "Walk-in Guest"}</td>
                  <td className="py-3.5 text-slate-500 font-medium">👤 {sale.employeeName}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      sale.paymentMethod === 'Card' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                      sale.paymentMethod === 'Mobile' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {sale.paymentMethod === 'Card' ? '💳 Card' : sale.paymentMethod === 'Mobile' ? '📱 Mobile QR' : '💵 Cash'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-black text-slate-900">${sale.totalAmount.toFixed(2)}</td>
                  <td className="py-3.5 text-right font-black text-indigo-700">+${sale.totalProfit.toFixed(2)}</td>
                </tr>
              ))}
              {summary.recentSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium font-sans">
                    {t('noSalesRecorded') || "No sales logged today yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
