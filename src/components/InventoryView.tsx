/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Package, Plus, Edit, Trash2, Search, Filter, AlertTriangle, ShieldAlert 
} from 'lucide-react';
import { Product, UserRole } from '../types.js';
import { useLanguage } from '../LanguageContext.js';

interface InventoryViewProps {
  products: Product[];
  currentUserRole: UserRole;
  onAddProduct: (prod: Omit<Product, 'id' | 'companyId' | 'createdAt'>) => Promise<any>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
}

export default function InventoryView({ 
  products, 
  currentUserRole, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: InventoryViewProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Edit & Add States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errorText, setErrorText] = useState('');

  // Custom Deletion modal states
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStock, setFormStock] = useState('50');
  const [formMinStock, setFormMinStock] = useState('10');
  const [formCost, setFormCost] = useState('5');
  const [formSale, setFormSale] = useState('15');

  // Verify Roles access
  const hasWritingAccess = currentUserRole === UserRole.ADMINISTRATOR || currentUserRole === UserRole.MANAGER;

  const categories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => list.add(p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, searchTerm]);

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    // Generate simple fast randomized barcode SKU
    const randomBarCode = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
    setFormSku(randomBarCode);
    setFormCategory('');
    setFormStock('50');
    setFormMinStock('15');
    setFormCost('8');
    setFormSale('20');
    setErrorText('');
    setIsModalOpen(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormCategory(prod.category);
    setFormStock(prod.stockQuantity.toString());
    setFormMinStock(prod.minStockAlert.toString());
    setFormCost(prod.costPrice.toString());
    setFormSale(prod.salePrice.toString());
    setErrorText('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!formName || !formSku || !formCategory || !formStock || !formMinStock || !formCost || !formSale) {
      setErrorText("All parameters must be supplied to populate the records catalog.");
      return;
    }

    const payload = {
      name: formName,
      sku: formSku,
      category: formCategory,
      stockQuantity: Number(formStock),
      minStockAlert: Number(formMinStock),
      costPrice: Number(formCost),
      salePrice: Number(formSale)
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onAddProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorText(err.message || "Failed saving product updates. SKU must be unique!");
    }
  };

  const handleDeleteTrigger = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete product. Access restricted or active references exist.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs space-y-6" id="inventory-catalog-container">
      
      {/* Page header and triggers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-650" />
            {t('inventoryHubTitle')}
          </h2>
          <p className="text-xs text-slate-400">Add, track and modify product lines. Warns on critical low stocks.</p>
        </div>

        {hasWritingAccess ? (
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow transition"
          >
            <Plus className="w-4 h-4" />
            {t('appendProductBtn')}
          </button>
        ) : (
          <div className="bg-slate-100 px-3.5 py-2 rounded-lg text-slate-705 text-xs flex items-center gap-1.5 border border-slate-200">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            <span>Viewer Access Level Only ({currentUserRole})</span>
          </div>
        )}
      </div>

      {/* Control panel filters */}
      <div className="flex flex-col md:flex-row gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search catalog by product title, categories, or Barcode SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-xs pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-3.5 h-3.5 text-slate-450" />
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600"
          >
            <option value="All">{t('allCategory')}</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">{t('barcodeSkuLabel')}</th>
              <th className="py-3 px-2">{t('lineNameLabel')}</th>
              <th className="py-3 px-2">{t('categoryLabel')}</th>
              <th className="py-3 px-2 text-right">{t('wholesaleUnitPrice')}</th>
              <th className="py-3 px-2 text-right">{t('retailUnitPrice')}</th>
              <th className="py-3 px-4 text-center">{t('remainingQuantityLabel')}</th>
              {hasWritingAccess && <th className="py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => {
              const isLow = p.stockQuantity <= p.minStockAlert;
              const isOut = p.stockQuantity <= 0;
              return (
                <tr 
                  key={p.id} 
                  className={`hover:bg-slate-50/50 transition duration-150 ${
                    isOut ? 'bg-red-50/10' : isLow ? 'bg-amber-50/5' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono text-slate-500 font-medium">{p.sku}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">
                    <span className="block">{p.name}</span>
                    {isLow && (
                      <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5 mt-0.5 uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        Reprocurement required
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-slate-500 font-medium">${p.costPrice.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right font-semibold text-slate-900 font-bold">${p.salePrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isOut ? 'bg-red-50 text-red-700 border border-red-150' :
                        isLow ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                        'bg-indigo-50 text-indigo-750 border border-indigo-150'
                      }`}>
                        {p.stockQuantity} {t('itemsLabelCount')}
                      </span>
                    </div>
                  </td>
                  {hasWritingAccess && (
                    <td className="py-3">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => handleOpenEditForm(p)}
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition duration-150 cursor-pointer"
                          title="Edit details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTrigger(p.id, p.name)}
                          className="p-1 text-slate-500 hover:text-red-655 hover:bg-slate-100 rounded transition duration-150 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">No active inventory products on record.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adding & Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-150">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-3 border-slate-100">
              <Package className="w-4 h-4 text-indigo-600" />
              {editingProduct ? `Edit product parameters - ${editingProduct.sku}` : "Append New Product Line"}
            </h3>
            
            <form onSubmit={handleSaveProduct} className="mt-4 space-y-3.5 text-xs">
              
              {errorText && (
                <div className="p-2.5 bg-red-50 text-red-750 text-xs rounded border border-red-200">{errorText}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">{t('lineNameLabel')}</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Arabica Roast Beans, Aspirin Syrup"
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('barcodeSkuLabel')}</label>
                  <input 
                    type="text" 
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    placeholder="Auto generated barcode"
                    className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-2.5 font-mono text-slate-500 focus:bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('categoryLabel')}</label>
                  <input 
                    type="text" 
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="e.g. Beverages, Bakery"
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('remainingQuantityLabel')}</label>
                  <input 
                    type="number" 
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('lowStockSafetyMark')}</label>
                  <input 
                    type="number" 
                    value={formMinStock}
                    onChange={e => setFormMinStock(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('wholesaleUnitPrice')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formCost}
                    onChange={e => setFormCost(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('retailUnitPrice')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formSale}
                    onChange={e => setFormSale(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded py-2 px-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold transition"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer shadow-md shadow-indigo-600/10 transition"
                >
                  {t('saveRecordBtn')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      {productToDelete && (
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
                  : 'Confirm Product Deletion'}
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
              {language === 'ru' 
                ? `Вы абсолютно уверены, что хотите навсегда удалить товар "${productToDelete.name}" из каталога?` 
                : language === 'ky' 
                ? `Каталогдон "${productToDelete.name}" деталын биротоло өчүрүүнү каалайсызбы?` 
                : `Are you absolutely sure you want to permanently delete product "${productToDelete.name}" from the active database records?`}
            </p>

            {deleteError && (
              <div className="p-2.5 bg-red-50 text-red-705 text-xs rounded border border-red-150 font-medium font-sans">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2.5 justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold transition text-xs cursor-pointer"
              >
                {language === 'ru' ? 'Отмена' : language === 'ky' ? 'Кайра кайтуу' : 'Cancel'}
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
                {language === 'ru' ? 'Удалить' : language === 'ky' ? 'Өчүрүү' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
