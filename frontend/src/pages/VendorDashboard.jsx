import React, { useState, useEffect } from 'react';
import { Store, Plus, Trash2, Tag, CheckCircle2, ShieldCheck, MapPin, Phone, CreditCard, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';

export default function VendorDashboard({ activeTab: propTab, onTabChange }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [internalTab, setInternalTab] = useState('catalog');
  const activeTab = propTab || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadVendorItems();
  }, []);

  const loadVendorItems = async () => {
    setLoading(true);
    try {
      const data = await API.getVendorProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading vendor products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);

    const newProd = {
      title: formData.get('title'),
      type: formData.get('type'),
      category: formData.get('category'),
      price: formData.get('price'),
      stockCount: formData.get('stockCount') || 50,
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl') || 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&auto=format&fit=crop&q=80',
    };

    try {
      await API.addVendorProduct(newProd);
      setShowAddModal(false);
      await loadVendorItems();
      alert('Product/Service listed successfully!');
    } catch (err) {
      alert('Failed to list item: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      await API.deleteVendorProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Vendor Profile Header */}
      <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-emerald-600" /> {t('certifiedVendor')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {t('gstLabel')}: {user?.gstNumber || 'MSME Reg.'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.shopName}</h1>
            <p className="text-xs text-slate-600 mt-0.5">{t('proprietorLabel')}: <strong>{user?.contactPerson}</strong></p>

            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user?.mobile}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user?.city}, {user?.state}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-slate-400" /> UPI: {user?.upiId}</span>
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" /> {t('addItemBtn')}
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500 uppercase font-bold">Total Catalog</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{products.length} Items</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500 uppercase font-bold">Puja Samagri & Gems</span>
          <div className="text-2xl font-black text-amber-700 mt-0.5">
            {products.filter((p) => p.type === 'Product').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500 uppercase font-bold">Ritual Services</span>
          <div className="text-2xl font-black text-indigo-700 mt-0.5">
            {products.filter((p) => p.type === 'Service').length}
          </div>
        </div>
      </div>

      {/* Product & Service Listings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Active Marketplace Listings</span>
          <span className="text-xs text-slate-400 font-normal">Visible to clients across India</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading items...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No items listed yet. Click "+ Add Item" above to publish your first offering!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div className="h-36 bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.type === 'Service' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {item.type}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white/95 font-bold text-slate-900 text-xs px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{item.category}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Stock: <strong className="text-emerald-700">{item.stockCount} units</strong>
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl my-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5">List New Product or Service</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add spiritual items, puja kits, genuine gemstones, or sacred homam bookings.
            </p>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Title / Name *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Certified 5-Mukhi Rudraksha / Navagraha Shanti Homam"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Type *</label>
                  <select
                    name="type"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Product">Physical Product</option>
                    <option value="Service">Ritual / Pooja Service</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Category *</label>
                  <select
                    name="category"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Puja Samagri">Puja Samagri & Kits</option>
                    <option value="Rudraksha & Gemstones">Rudraksha & Gemstones</option>
                    <option value="Pooja Services">Pooja & Homam Services</option>
                    <option value="Yantras & Idols">Yantras & Idols</option>
                    <option value="Astrology Books">Astrology Books</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Available Quantity / Slots</label>
                  <input
                    type="number"
                    name="stockCount"
                    defaultValue={50}
                    min="1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://... (or leave blank for default image)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Source details, energization rituals, benefits..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
