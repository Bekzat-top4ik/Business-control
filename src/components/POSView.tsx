/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, User, CreditCard, DollarSign, Smartphone, Trash2, Plus, Minus, CheckCircle, AlertTriangle, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Customer } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  onCheckout: (cart: { productId: string; quantity: number }[], customerId: string | null, paymentMethod: 'Cash' | 'Card' | 'Mobile') => Promise<any>;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSView({ products, customers, onCheckout }: POSViewProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Mobile'>('Cash');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  // Localized dictionary with high contrast plain phrases
  const localeDict = {
    en: {
      helperBanner: "👇 Tap on any product on the left side to add it to the tray on the right:",
      searchPlaceholder: "🔍 Type a product name or scan SKU barcode to search...",
      allCategories: "All Products",
      emptyBasketTitle: "Your Customer's Tray is Empty",
      emptyBasketPrompt: "Tap on products in the catalog to build a buyer's receipt.",
      cartTitle: "Customer's Tray & Receipt",
      outOfStock: "SOLD OUT (No stock)",
      unitsLeft: (qty: number) => `On shelves: ${qty} units left`,
      lowStock: (qty: number) => `⚠️ Priority restock: ${qty} leftover!`,
      selectCustomer: "Who is buying this? (Optional customer tag)",
      noCustomer: "Walk-In Guest (Standard simple checkout)",
      choosePayment: "How is the customer paying?",
      paymentCash: "💵 Cash (Paper money)",
      paymentCard: "💳 Bank Card",
      paymentMobile: "📱 Phone QR Scan",
      totalLabel: "Grand Total Amount to Collect:",
      checkoutButton: (total: number) => `✅ Finish Sale & Receive $${total.toFixed(2)}`,
      checkoutInProcess: "Saving transaction receipts safely...",
      successHeader: "Receipt Created Successfully!",
      successSub: "Product numbers updated in the catalog.",
      startNextLabel: "👉 Start Next Customer Checkout",
      earnedPointsText: (pts: number) => `⭐ Will earn +${pts} loyalty points`,
      searchNoMatches: "No products matched your search. Check spelling or add product under 'Products' tab.",
      removeBtn: "Delete item"
    },
    ru: {
      helperBanner: "👇 Нажмите на любой товар слева, чтобы добавить его в корзину справа:",
      searchPlaceholder: "🔍 Напишите название товара или штрихкод для поиска...",
      allCategories: "Все товары",
      emptyBasketTitle: "Корзина покупателя пока пуста",
      emptyBasketPrompt: "Нажмите на товары в левой части экрана, чтобы наполнить чек.",
      cartTitle: "Корзина и Чек покупателя",
      outOfStock: "РАСПРОДАНО (Нет на складе)",
      unitsLeft: (qty: number) => `На полке: осталось ${qty} шт.`,
      lowStock: (qty: number) => `⚠️ Мало остатка: всего ${qty} шт.!`,
      selectCustomer: "Кто делает покупку? (Необязательно)",
      noCustomer: "Обычный покупатель (Без регистрации в базе)",
      choosePayment: "Какой способ оплаты выбрал клиент?",
      paymentCash: "💵 Бумажные наличные",
      paymentCard: "💳 Банковская карта",
      paymentMobile: "📱 Перевод / QR-код по телефону",
      totalLabel: "Итого к оплате с покупателя:",
      checkoutButton: (total: number) => `✅ Завершить продажу и принять $${total.toFixed(2)}`,
      checkoutInProcess: "Сохраняем чек продажи в базу...",
      successHeader: "Продажа успешно оформлена!",
      successSub: "Количество товара автоматически обновилось на складе.",
      startNextLabel: "👉 Обслуживать следующего покупателя",
      earnedPointsText: (pts: number) => `⭐ Получит +${pts} бонусных баллов`,
      searchNoMatches: "Товары с таким названием не найдены. Вы можете добавить товары во вкладке 'Товары'.",
      removeBtn: "Убрать из чека"
    },
    ky: {
      helperBanner: "👇 Каалаган товарды оң жактагы чекке кошуу үчүн сол жакты басыңыз:",
      searchPlaceholder: "🔍 Товардын атын же штрихкодун жазып издеңиз...",
      allCategories: "Бардык товарлор",
      emptyBasketTitle: "Кардардын себети азырынча бош",
      emptyBasketPrompt: "Чекти толтуруу үчүн сол тараптагы каталогдон товарларды басыңыз.",
      cartTitle: "Кардардын себети жана Чек",
      outOfStock: "ТҮГӨНДҮ (Кампада жок)",
      unitsLeft: (qty: number) => `Текчеде: ${qty} даана калды`,
      lowStock: (qty: number) => `⚠️ Тез арада закупка: ${qty} даана калды!`,
      selectCustomer: "Бул товарды ким сатып алууда? (Милдеттүү эмес)",
      noCustomer: "Жөнөкөй сатып алуучу (Картасыз)",
      choosePayment: "Кардар төлөмдү кандай жол менен кылат?",
      paymentCash: "💵 Накталай кагаз акча",
      paymentCard: "💳 Банк картасы аркылуу",
      paymentMobile: "📱 Телефондон QR-код менен",
      totalLabel: "Кардардан алынуучу жалпы сумма:",
      checkoutButton: (total: number) => `✅ Сатууну аяктоо жана $${total.toFixed(2)} кабыл алуу`,
      checkoutInProcess: "Сатуу чегин базага коопсуз сактоодо...",
      successHeader: "Сатуу ийгиликтүү катталды!",
      successSub: "Товардын саны дүкөндө автоматтык түрдө азайды.",
      startNextLabel: "👉 Кийинки кардарды тейлөөгө өтүү",
      earnedPointsText: (pts: number) => `⭐ Кардарга +${pts} лоялдуулук упай кошулат`,
      searchNoMatches: "Сиз жазган товар табылган жок. Жаңы товарларды 'Товарлор' бөлүмүнөн кошо аласыз.",
      removeBtn: "Чектен өчүрүү"
    }
  };

  const activeLang = language === 'ru' ? 'ru' : language === 'ky' ? 'ky' : 'en';
  const lt = localeDict[activeLang];

  // Extract unique categories in this workspace catalog
  const categories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (p.category) list.add(p.category);
    });
    return ['All', ...Array.from(list)];
  }, [products]);

  // Filter products by query & category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Selected customer object helper
  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // Calculate cart cost stats
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
  }, [cart]);

  const earnedPoints = useMemo(() => {
    return Math.floor(cartSubtotal / 10);
  }, [cartSubtotal]);

  // Add item helper
  const handleAddToBasket = (product: Product) => {
    if (product.stockQuantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Эскертүү: Кампада болгону ${product.stockQuantity} даана товар калган.`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCheckoutSuccess(null);
  };

  const handleUpdateQty = (productId: string, val: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;
      const newQty = existing.quantity + val;
      if (newQty <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      if (newQty > existing.product.stockQuantity) {
        alert(`Сиз кампа калдыгынан ашык товар кошо албайсыз. Болгону: ${existing.product.stockQuantity} шт.`);
        return prev;
      }
      return prev.map(item => 
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckoutProcess = async () => {
    if (cart.length === 0) return;
    try {
      setCheckoutLoading(true);
      const cartPayload = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      const res = await onCheckout(cartPayload, selectedCustomerId || null, paymentMethod);
      setCheckoutSuccess(res);
      setCart([]);
      setSelectedCustomerId('');
      setPaymentMethod('Cash');
    } catch (e: any) {
      alert(`Сбой расчета: ${e.message || "Проверьте количество товаров на складе."}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-4" id="pos-flow-view">
      
      {/* Friendly Top Instructions Guidance Bar */}
      <div className="bg-slate-100 border border-slate-200 text-slate-800 p-3 rounded-2xl text-xs sm:text-sm font-bold flex gap-2 items-center" id="pos-instruction-header">
        <span className="text-xl shrink-0">👋</span>
        <span className="leading-tight">{lt.helperBanner}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Product Selector Left Side (occupies 7 columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 bg-white rounded-2xl border border-slate-150 p-5 shadow-xs overflow-hidden h-[75vh] min-h-[480px]">
          
          {/* Subheader Search and Category Filters */}
          <div className="space-y-3 shrink-0">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              <input 
                type="text" 
                placeholder={lt.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition font-medium"
              />
            </div>

            {/* Quick Categories list with thick horizontal scrolling */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                      : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/50'
                  }`}
                >
                  {cat === 'All' ? lt.allCategories : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product display card grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
              {filteredProducts.map(p => {
                const isLowStock = p.stockQuantity <= p.minStockAlert;
                const isOut = p.stockQuantity <= 0;
                
                return (
                  <div 
                     key={p.id}
                     onClick={() => !isOut && handleAddToBasket(p)}
                     style={{ contentVisibility: 'auto' }}
                     className={`border-2 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg cursor-pointer transition-all duration-150 select-none group min-h-[120px] relative ${
                       isOut ? 'opacity-40 border-slate-100 cursor-not-allowed bg-slate-50' :
                       isLowStock ? 'border-amber-300 bg-amber-50/20 hover:border-amber-500' :
                       'border-slate-150 hover:border-indigo-500 bg-white'
                     }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{p.sku || "No Barcode"}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isOut ? 'bg-red-100 text-red-700' :
                          isLowStock ? 'bg-amber-100 text-amber-850 border border-amber-200' :
                          'bg-indigo-50 text-indigo-850'
                        }`}>
                          {isOut ? lt.outOfStock : isLowStock ? lt.lowStock(p.stockQuantity) : lt.unitsLeft(p.stockQuantity)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-800 text-sm mt-3 leading-snug group-hover:text-indigo-650 transition">
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-slate-900 font-black text-lg">${p.salePrice.toFixed(2)}</span>
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-bold">Category: {p.category}</span>
                    </div>
                  </div>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-400 text-sm space-y-2">
                  <div className="text-3xl">🧩</div>
                  <p className="max-w-xs mx-auto font-medium">{lt.searchNoMatches}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POS Cart Sidebar Checkout Pane (occupies 5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-4" id="checkout-basket-container">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xs flex flex-col p-5 h-[75vh] min-h-[480px]" id="pos-basket-panel">
            
            {/* Checkout Header */}
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3.5 shrink-0">
              <ShoppingCart className="w-5 h-5 text-indigo-650" />
              <h3 className="font-black text-slate-900 text-sm sm:text-base">{lt.cartTitle}</h3>
              <span className="ml-auto bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>

            {/* Cart Contents List */}
            <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-2 py-3 border-b border-slate-100 items-center justify-between text-xs sm:text-sm">
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-extrabold text-slate-800 truncate leading-snug">{item.product.name}</h4>
                    <span className="text-[11px] text-slate-400 font-bold block mt-0.5">${item.product.salePrice.toFixed(2)} each</span>
                  </div>
                  
                  {/* Visual Plus/Minus with Large Touch Targets (Minimum 44px equivalent click target bounds) */}
                  <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
                    <button 
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-lg hover:text-red-500 transition cursor-pointer font-extrabold shadow-sm text-sm"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-black text-slate-900 font-mono text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-lg hover:text-indigo-600 transition cursor-pointer font-extrabold shadow-sm text-sm"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Value and Delete Action */}
                  <div className="text-right pl-2 min-w-[70px] shrink-0">
                    <span className="font-black text-slate-900 block text-sm sm:text-base">${(item.product.salePrice * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-[11px] text-red-500 hover:text-red-700 hover:underline font-bold inline-block mt-1 flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      {lt.removeBtn}
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && !checkoutSuccess && (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center select-none">
                  <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-650 mb-3 animate-pulse">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{lt.emptyBasketTitle}</h4>
                  <p className="text-xs text-slate-400 max-w-[200px] mt-1.5 leading-relaxed font-sans font-medium">{lt.emptyBasketPrompt}</p>
                </div>
              )}

              {/* Checkout Success Screen */}
              {checkoutSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-250 rounded-2xl p-6 text-center my-4 text-emerald-950"
                  id="checkout-receipt-modal"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-sm animate-bounce">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-base text-emerald-900">{lt.successHeader}</h4>
                  <p className="text-xs text-emerald-800 font-medium mt-1">
                    {lt.successSub}
                  </p>
                  
                  <div className="my-5 p-4 bg-white border border-emerald-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Amount Received</span>
                    <span className="font-black text-3xl sm:text-4xl text-slate-900 font-mono">${checkoutSuccess.sale.totalAmount.toFixed(2)}</span>
                    <span className="text-[11px] text-indigo-600 block pt-1.5 font-bold border-t border-slate-50 mt-1">
                      Receipt Code: {checkoutSuccess.sale.id.slice(0, 8)}...
                    </span>
                  </div>

                  <button 
                    onClick={() => setCheckoutSuccess(null)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition duration-150 flex items-center justify-center gap-1 cursor-pointer text-xs uppercase tracking-wider shadow-md shadow-emerald-700/10"
                  >
                    {lt.startNextLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* CRM Loyalty Integration & Payment Selection (Shown only when items in cart) */}
            {cart.length > 0 && (
              <div className="border-t-2 border-slate-150 pt-4 space-y-4 shrink-0 bg-white" id="pos-billing-flows">
                
                {/* 1. Who is buying (Customer selection) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-bold text-slate-450 tracking-wider flex items-center gap-1.5 block">
                    <User className="w-4 h-4 text-slate-400" />
                    {lt.selectCustomer}
                  </label>
                  <select 
                    value={selectedCustomerId}
                    onChange={e => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-3 text-xs sm:text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 font-bold text-slate-700"
                  >
                    <option value="">{lt.noCustomer}</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} ({c.phone}) — {c.isVip ? '⭐ VIP Member' : `${c.loyaltyPoints} points`}
                      </option>
                    ))}
                  </select>
                  {activeCustomer && (
                    <p className="text-[11px] text-indigo-600 pl-1 font-bold">
                      🎉 {lt.earnedPointsText(earnedPoints)}
                    </p>
                  )}
                </div>

                {/* 2. Choose Payment Method (Large buttons!) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-bold text-slate-450 tracking-wider block">{lt.choosePayment}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setPaymentMethod('Cash')}
                      className={`flex flex-col items-center py-2.5 px-1 border-2 rounded-xl transition-all duration-150 cursor-pointer ${
                        paymentMethod === 'Cash' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 mb-1 text-slate-700" />
                      <span className="text-[10px] sm:text-xs font-black">{lt.paymentCash.split(' ')[1]}</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Card')}
                      className={`flex flex-col items-center py-2.5 px-1 border-2 rounded-xl transition-all duration-150 cursor-pointer ${
                        paymentMethod === 'Card' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mb-1 text-slate-700" />
                      <span className="text-[10px] sm:text-xs font-black">{lt.paymentCard.split(' ')[1]}</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Mobile')}
                      className={`flex flex-col items-center py-2.5 px-1 border-2 rounded-xl transition-all duration-150 cursor-pointer ${
                        paymentMethod === 'Mobile' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mb-1 text-slate-700" />
                      <span className="text-[10px] sm:text-xs font-black">{lt.paymentMobile.split(' ')[3] || "QR"}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Simple Invoice Total block */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-150">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>{lt.totalLabel}</span>
                    <span className="text-indigo-750 text-2xl font-black font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* 4. Complete Action Checkout button with 48px height for best accessibility touch targets */}
                <button
                  onClick={handleCheckoutProcess}
                  disabled={checkoutLoading || cart.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-13 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  {checkoutLoading ? (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {lt.checkoutButton(cartSubtotal)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
