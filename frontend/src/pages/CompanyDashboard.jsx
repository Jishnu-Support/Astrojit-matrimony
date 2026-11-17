import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Compass, Store, ShoppingBag, FileText, Search, Sparkles,
  Building2, UserCheck, CheckCircle2, Heart, ShieldCheck, Trash2, Eye, X,
  Filter, Phone, MapPin, Briefcase, GraduationCap, Calendar, Award
} from 'lucide-react';
import { API } from '../api';
import { useLang } from '../i18n';
import ThirukanithaHoroscopeView from '../components/ThirukanithaHoroscopeView';
import HoroscopePagerView from '../components/HoroscopePagerView';

export default function CompanyDashboard({ activeTab: propTab, onTabChange }) {
  const { lang, t } = useLang();
  const [internalTab, setInternalTab] = useState('overview');
  const activeTab = propTab || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [overview, setOverview] = useState(null);
  const [clients, setClients] = useState([]);
  const [astrologers, setAstrologers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [matrimonyProfiles, setMatrimonyProfiles] = useState([]);
  const [matrimonySearch, setMatrimonySearch] = useState('');
  const [matrimonyFilter, setMatrimonyFilter] = useState('all');
  const [selectedMatrimonyProfile, setSelectedMatrimonyProfile] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedClientMobile, setSelectedClientMobile] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [clientNotes, setClientNotes] = useState([]);
  const [loadingClient, setLoadingClient] = useState(false);

  // Pure Unilingual helper
  const tr = (en, ta, kn, hi, te, bn) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    if (lang === 'te') return te || en;
    if (lang === 'bn') return bn || en;
    return en;
  };

  useEffect(() => {
    loadAllCompanyData();
  }, []);

  const loadAllCompanyData = async () => {
    setLoading(true);
    try {
      const [ovData, clData, astData, venData, prodData, matData] = await Promise.all([
        API.getCompanyOverview(),
        API.getCompanyClients(),
        API.getCompanyAstrologers(),
        API.getCompanyVendors(),
        API.getCompanyProducts(),
        API.getCompanyMatrimonyProfiles(),
      ]);

      setOverview(ovData);
      setClients(clData);
      setAstrologers(astData);
      setVendors(venData);
      setProducts(prodData);
      setMatrimonyProfiles(matData || []);
    } catch (err) {
      console.error('Error loading company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (profileId, currentStatus) => {
    try {
      await API.verifyCompanyMatrimonyProfile(profileId, !currentStatus);
      setMatrimonyProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, isVerified: !currentStatus, account: { ...p.account, isVerified: !currentStatus } }
            : p
        )
      );
      if (selectedMatrimonyProfile && selectedMatrimonyProfile.id === profileId) {
        setSelectedMatrimonyProfile((prev) => ({
          ...prev,
          isVerified: !currentStatus,
          account: { ...prev.account, isVerified: !currentStatus },
        }));
      }
      setActionSuccessMsg(
        !currentStatus
          ? tr('Profile verified with Official Badge!', 'சுயவிவரம் அதிகாரப்பூர்வமாக சரிபார்க்கப்பட்டது!')
          : tr('Verification badge revoked.', 'சரிபார்ப்பு பேட்ஜ் ரத்து செய்யப்பட்டது.')
      );
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      alert('Verification update failed: ' + err.message);
    }
  };

  const handleDeleteMatrimony = async (profileId, name) => {
    const confirmPrompt = tr(
      `Are you sure you want to remove profile ${name || profileId}?`,
      `சுயவிவரம் ${name || profileId} ஐ நீக்க விரும்புகிறீர்களா?`
    );
    if (!window.confirm(confirmPrompt)) return;
    try {
      await API.deleteCompanyMatrimonyProfile(profileId);
      setMatrimonyProfiles((prev) => prev.filter((p) => p.id !== profileId));
      if (selectedMatrimonyProfile && selectedMatrimonyProfile.id === profileId) {
        setSelectedMatrimonyProfile(null);
      }
      setActionSuccessMsg(tr('Profile deleted successfully.', 'சுயவிவரம் வெற்றிகரமாக நீக்கப்பட்டது.'));
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleInspectClient = async (mobile) => {
    setSelectedClientMobile(mobile);
    setLoadingClient(true);
    try {
      const data = await API.getClientProfileByMobile(mobile);
      setClientProfile(data.client || data);
      setClientNotes(data.consultationHistory || []);
    } catch (err) {
      alert('Failed to load client details: ' + err.message);
    } finally {
      setLoadingClient(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Company Header */}
      <div className="bg-white border border-rose-200/80 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-rose-600" /> {t('superAdminPortal')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {t('centralizedGovernance')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('companyHqTitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('companyHqDesc')}
            </p>
          </div>

          <button
            onClick={loadAllCompanyData}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-semibold transition-colors cursor-pointer"
          >
            {t('refreshRecords')}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => { setActiveTab('overview'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabOverview')}
          </button>
          <button
            onClick={() => { setActiveTab('clients'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabClients')} ({clients.length})
          </button>
          <button
            onClick={() => { setActiveTab('astrologers'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'astrologers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabAstrologers')} ({astrologers.length})
          </button>
          <button
            onClick={() => { setActiveTab('thirukanitha'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'thirukanitha'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tr('Thirukanitha Horoscope', 'திருக்கணித ஜாதகம்')}
          </button>
          <button
            onClick={() => { setActiveTab('vendors'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vendors'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabVendors')} ({vendors.length})
          </button>
          <button
            onClick={() => { setActiveTab('products'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('tabProducts')} ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('matrimony'); setSelectedClientMobile(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrimony'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>{tr('Matrimony Profiles', 'திருமண சுயவிவரங்கள்', 'ಮ್ಯಾಟ್ರಿಮೋನಿ ಪ್ರೊಫೈಲ್‌ಗಳು', 'वैवाहिक प्रोफाइल')} ({matrimonyProfiles.length})</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
          <Sparkles className="w-8 h-8 text-rose-500 mx-auto animate-spin mb-3" />
          <p className="text-slate-500 text-xs">Aggregating platform data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && overview && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Clients</span>
                  <div className="text-2xl font-black text-amber-700 mt-0.5">{overview.metrics.totalClients}</div>
                  <span className="text-[11px] text-slate-400">Registered users</span>
                </div>

                <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-rose-600 uppercase font-bold block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500" /> Matrimony Hub
                  </span>
                  <div className="text-2xl font-black text-rose-700 mt-0.5">{matrimonyProfiles.length}</div>
                  <span className="text-[11px] text-slate-400">
                    {matrimonyProfiles.filter((p) => p.isVerified || p.account?.isVerified).length} verified profiles
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Astrologers</span>
                  <div className="text-2xl font-black text-indigo-700 mt-0.5">{overview.metrics.totalAstrologers}</div>
                  <span className="text-[11px] text-slate-400">
                    {overview.metrics.individualAstrologers} Indiv / {overview.metrics.companyAstrologers} Firms
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Vendors</span>
                  <div className="text-2xl font-black text-emerald-700 mt-0.5">{overview.metrics.totalVendors}</div>
                  <span className="text-[11px] text-slate-400">Puja & Gems shops</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Marketplace</span>
                  <div className="text-2xl font-black text-purple-700 mt-0.5">{products.length}</div>
                  <span className="text-[11px] text-slate-400">
                    {overview.metrics.totalProductsListed} items / {overview.metrics.totalServicesListed} poojas
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Consultations</span>
                  <div className="text-2xl font-black text-rose-700 mt-0.5">{overview.metrics.totalConsultations}</div>
                  <span className="text-[11px] text-slate-400">Remedial records</span>
                </div>
              </div>

              {/* Recent Consultations Log */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span>Recent Astrological Consultations & Prescriptions</span>
                  <span className="text-[11px] text-slate-400 font-normal">Real-time audit log</span>
                </h3>

                {overview.recentConsultations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No consultations logged yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {overview.recentConsultations.map((c) => (
                      <div key={c.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{c.clientName}</span>
                            <span className="text-xs text-amber-800 font-mono">({c.clientMobile})</span>
                            <span className="text-[11px] text-slate-400">by</span>
                            <span className="text-xs font-bold text-indigo-700">{c.astrologerName}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{c.notes}</p>
                          {c.remediesSuggested && (
                            <p className="text-xs text-amber-900 mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                              <strong>Remedies:</strong> {c.remediesSuggested}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-[11px] text-slate-400 shrink-0">
                          {new Date(c.date).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: THIRUKANITHA HOROSCOPE */}
          {activeTab === 'thirukanitha' && (
            <ThirukanithaHoroscopeView />
          )}

          {/* TAB: HOROSCOPE PAGERS (1-PAGE A4) */}
          {(activeTab === 'horoscope_pagers' || activeTab === 'pager') && (
            <HoroscopePagerView />
          )}

          {/* TAB 2: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              {selectedClientMobile ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-700">
                      Company Inspection: <strong className="text-amber-800">{clientProfile?.name} ({selectedClientMobile})</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedClientMobile(null);
                        setClientProfile(null);
                      }}
                      className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                      ← Back to clients list
                    </button>
                  </div>

                  {loadingClient ? (
                    <div className="p-8 text-center text-slate-400 text-xs">Loading client details...</div>
                  ) : (
                    <div className="space-y-4">
                      {/* Client Details Summary */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <h4 className="font-bold text-slate-900 text-sm mb-3 border-b border-slate-100 pb-2">
                          Client Profile Summary
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Full Name</span>
                            <span className="font-bold text-slate-900 text-sm">{clientProfile?.name || '—'}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Mobile</span>
                            <span className="font-bold text-slate-900 font-mono">{clientProfile?.mobile || selectedClientMobile}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender</span>
                            <span className="font-bold text-slate-900 capitalize">{clientProfile?.gender || '—'}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Birth Date & Time</span>
                            <span className="font-bold text-slate-900">{clientProfile?.dob} ({clientProfile?.dobTime})</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Birth Place</span>
                            <span className="font-bold text-slate-900">{clientProfile?.dobPlace || '—'}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Nakshatra / Rasi</span>
                            <span className="font-bold text-slate-900">{clientProfile?.nakshatra || '—'} / {clientProfile?.rasi || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Consultation History */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                          Consultation History ({clientNotes.length})
                        </h4>
                        {clientNotes.length === 0 ? (
                          <p className="text-slate-400 text-xs italic">No consultation notes recorded for this client.</p>
                        ) : (
                          <div className="space-y-3">
                            {clientNotes.map((note, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="flex justify-between items-center text-slate-500 text-[10px]">
                                  <span>Astrologer: <strong>{note.astrologerName || 'Astrologer'}</strong></span>
                                  <span>{note.date || 'Recent'}</span>
                                </div>
                                <p className="text-slate-800 font-medium whitespace-pre-line">{note.notes}</p>
                                {note.remediesSuggested && (
                                  <p className="text-amber-900 pt-1 border-t border-slate-200">
                                    <strong>Remedies:</strong> {note.remediesSuggested}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                    Registered Clients Database
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2 px-2.5">Name</th>
                          <th className="py-2 px-2.5">Mobile</th>
                          <th className="py-2 px-2.5">Parents</th>
                          <th className="py-2 px-2.5">Birth Date & Time</th>
                          <th className="py-2 px-2.5">Birth Place</th>
                          <th className="py-2 px-2.5">Referral</th>
                          <th className="py-2 px-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {clients.map((c) => (
                          <tr key={c.id} className="hover:bg-amber-50/40">
                            <td className="py-2.5 px-2.5 font-bold text-slate-900">{c.name}</td>
                            <td className="py-2.5 px-2.5 font-mono text-amber-800 font-bold">{c.mobile}</td>
                            <td className="py-2.5 px-2.5 text-slate-600">
                              {c.fatherName || '-'} / {c.motherName || '-'}
                            </td>
                            <td className="py-2.5 px-2.5 text-slate-700">{c.dob} @ {c.dobTime}</td>
                            <td className="py-2.5 px-2.5 text-slate-700">{c.dobPlace}</td>
                            <td className="py-2.5 px-2.5">
                              {c.astrologerReferralCode ? (
                                <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                                  {c.astrologerReferralCode}
                                </span>
                              ) : (
                                <span className="text-slate-400">Direct</span>
                              )}
                            </td>
                            <td className="py-2.5 px-2.5 text-right">
                              <button
                                onClick={() => handleInspectClient(c.mobile)}
                                className="bg-amber-50 hover:bg-amber-500 hover:text-slate-950 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
                              >
                                Inspect Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASTROLOGERS */}
          {activeTab === 'astrologers' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                Practicing Astrologers & Firms Directory
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2 px-2.5">Name / Firm</th>
                      <th className="py-2 px-2.5">Type</th>
                      <th className="py-2 px-2.5">Mobile</th>
                      <th className="py-2 px-2.5">Address</th>
                      <th className="py-2 px-2.5">Specializations</th>
                      <th className="py-2 px-2.5">Referral Code</th>
                      <th className="py-2 px-2.5 text-right">Referred Clients</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {astrologers.map((a) => (
                      <tr key={a.id} className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-2.5 font-bold text-slate-900">{a.name}</td>
                        <td className="py-2.5 px-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.type === 'company'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {a.type === 'company' ? 'Firm' : 'Individual'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 font-mono text-amber-800 font-bold">{a.mobile}</td>
                        <td className="py-2.5 px-2.5 text-slate-600 max-w-[180px] truncate">{a.address}</td>
                        <td className="py-2.5 px-2.5 text-slate-600">
                          {Array.isArray(a.specializations) ? a.specializations.join(', ') : a.specializations}
                        </td>
                        <td className="py-2.5 px-2.5 font-mono text-amber-900 font-bold">{a.referralCode}</td>
                        <td className="py-2.5 px-2.5 text-right font-black text-indigo-800">
                          {a.referredClientsCount || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VENDORS */}
          {activeTab === 'vendors' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                Verified Vendors & Merchant Partners
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2 px-2.5">Shop Name</th>
                      <th className="py-2 px-2.5">Contact Person</th>
                      <th className="py-2 px-2.5">Mobile</th>
                      <th className="py-2 px-2.5">City</th>
                      <th className="py-2 px-2.5">GST / MSME</th>
                      <th className="py-2 px-2.5">UPI ID</th>
                      <th className="py-2.5 px-2.5 text-right">Items Listed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-2.5 font-bold text-slate-900">{v.shopName}</td>
                        <td className="py-2.5 px-2.5 text-slate-700">{v.contactPerson}</td>
                        <td className="py-2.5 px-2.5 font-mono text-amber-800 font-bold">{v.mobile}</td>
                        <td className="py-2.5 px-2.5 text-slate-700">{v.city}</td>
                        <td className="py-2.5 px-2.5 font-mono text-slate-500">{v.gstNumber}</td>
                        <td className="py-2.5 px-2.5 text-emerald-700 font-medium">{v.upiId}</td>
                        <td className="py-2.5 px-2.5 text-right font-black text-amber-800">
                          {v.productsCount || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                Platform-Wide Marketplace Master Catalog
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {products.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          item.type === 'Service' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {item.type}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                      <span>Vendor: {item.vendorName}</span>
                      <span>Stock: {item.stockCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MATRIMONY GOVERNANCE & MODERATION */}
          {activeTab === 'matrimony' && (
            <div className="bg-white border border-rose-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>{tr('Vedic Matrimony Profiles Governance', 'வேத திருமண சுயவிவரங்கள் நிர்வாகம்')}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tr(
                      'Verify identities, review horoscope submissions, manage verification badges (Blue Tick), and moderate candidate profiles',
                      'சுயவிவரங்களை சரிபார்க்கவும், ஜாதக பதிவுகளை மதிப்பாய்வு செய்யவும், சரிபார்ப்பு பேட்ஜ்களை வழங்கவும்'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    {matrimonyProfiles.length} {tr('Registered Profiles', 'பதிவு செய்யப்பட்ட சுயவிவரங்கள்')}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {matrimonyProfiles.filter((p) => p.isVerified || p.account?.isVerified).length} {tr('Verified', 'சரிபார்க்கப்பட்டது')}
                  </span>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={matrimonySearch}
                    onChange={(e) => setMatrimonySearch(e.target.value)}
                    placeholder={tr('Search by name, ID, phone, gotra, star or city...', 'பெயர், எண், கோத்திரம், நட்சத்திரம் மூலம் தேடவும்...')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400"
                  />
                  {matrimonySearch && (
                    <button onClick={() => setMatrimonySearch('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
                  {[
                    { id: 'all', label: tr('All', 'அனைத்தும்') },
                    { id: 'groom', label: tr('Grooms', 'மணமகன்கள்') },
                    { id: 'bride', label: tr('Brides', 'மணமகள்கள்') },
                    { id: 'verified', label: tr('Verified (Blue Tick)', 'சரிபார்க்கப்பட்டது') },
                    { id: 'pending', label: tr('Pending Review', 'நிலுவையில் உள்ளவை') },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setMatrimonyFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        matrimonyFilter === f.id
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrimony Profiles Table */}
              {(() => {
                const filtered = matrimonyProfiles.filter((p) => {
                  const isVerified = Boolean(p.isVerified || p.account?.isVerified);
                  const isGroom = (p.profileType || p.gender || '').toLowerCase().includes('groom') || p.gender === 'male';
                  const isBride = (p.profileType || p.gender || '').toLowerCase().includes('bride') || p.gender === 'female';

                  if (matrimonyFilter === 'groom' && !isGroom) return false;
                  if (matrimonyFilter === 'bride' && !isBride) return false;
                  if (matrimonyFilter === 'verified' && !isVerified) return false;
                  if (matrimonyFilter === 'pending' && isVerified) return false;

                  if (matrimonySearch.trim()) {
                    const q = matrimonySearch.toLowerCase();
                    const name = (p.fullName || p.name || '').toLowerCase();
                    const id = (p.id || '').toLowerCase();
                    const mobile = (p.mobile || p.contact?.mobile || '').toLowerCase();
                    const star = (p.nakshatra || p.starNakshatra || '').toLowerCase();
                    const caste = (p.caste || '').toLowerCase();
                    const city = (p.city || p.workLocation || '').toLowerCase();
                    return name.includes(q) || id.includes(q) || mobile.includes(q) || star.includes(q) || caste.includes(q) || city.includes(q);
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs">
                      <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold">{tr('No matrimony profiles found matching your search.', 'உங்கள் தேடலுக்குரிய சுயவிவரங்கள் எதுவும் கிடைக்கவில்லை.')}</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                          <th className="py-2.5 px-3">{tr('Candidate', 'வேட்பாளர்')}</th>
                          <th className="py-2.5 px-3">{tr('Horoscope Coordinates', 'ஜாதகக் குறிப்புகள்')}</th>
                          <th className="py-2.5 px-3">{tr('Community & Caste', 'சமூகம் / சாதி')}</th>
                          <th className="py-2.5 px-3">{tr('Education & Profession', 'கல்வி & தொழில்')}</th>
                          <th className="py-2.5 px-3">{tr('Location', 'இருப்பிடம்')}</th>
                          <th className="py-2.5 px-3">{tr('Contact', 'தொடர்பு')}</th>
                          <th className="py-2.5 px-3">{tr('Verification', 'சரிபார்ப்பு')}</th>
                          <th className="py-2.5 px-3 text-right">{tr('Actions', 'செயல்கள்')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((p) => {
                          const isVerified = Boolean(p.isVerified || p.account?.isVerified);
                          const isGroom = (p.profileType || p.gender || '').toLowerCase().includes('groom') || p.gender === 'male';
                          const displayName = p.fullName || p.name || 'Candidate';
                          const photo = p.photoUrl || p.primaryPhoto || (isGroom ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

                          return (
                            <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={photo}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover border border-rose-200 shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <strong className="text-slate-900 text-xs">{displayName}</strong>
                                      {isVerified && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Verified Profile" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="font-mono text-[10px] text-slate-500 font-semibold">{p.id}</span>
                                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                        isGroom ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                      }`}>
                                        {isGroom ? tr('Groom', 'மணமகன்') : tr('Bride', 'மணமகள்')}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {p.age ? `${p.age} yrs` : ''} {p.height ? `• ${p.height}` : ''}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="text-slate-800 font-semibold">
                                  {p.nakshatra || p.starNakshatra || '—'}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {p.rasi || p.rasiMoonSign || '—'}
                                </div>
                                {p.doshaDetails && (
                                  <span className="text-[10px] text-amber-700 block truncate max-w-[150px]">
                                    {p.doshaDetails}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <div className="text-slate-800 font-medium">
                                  {p.religion || 'Hindu'} • {p.caste || 'Brahmin'}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {p.subCaste || p.sect || '—'} {p.gotra ? `(Gotra: ${p.gotra})` : ''}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900 truncate max-w-[150px]">
                                  {p.occupation || p.jobTitle || 'Professional'}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                                  {p.highestEducation || p.degree || 'Graduate'}
                                </div>
                                {p.annualIncome && (
                                  <div className="text-[10px] text-emerald-700 font-semibold">
                                    {p.annualIncome}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <div className="text-slate-800 font-medium">
                                  {p.city || p.workLocation || 'India'}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {p.state || 'Tamil Nadu'}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-mono text-amber-900 font-bold">
                                  {p.mobile || p.contact?.mobile || '—'}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                  {p.email || p.contact?.email || ''}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                {isVerified ? (
                                  <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                                      {tr('Verified Blue Tick', 'சரிபார்க்கப்பட்டது')}
                                    </span>
                                    <button
                                      onClick={() => handleToggleVerify(p.id, true)}
                                      className="block text-[10px] text-slate-500 hover:text-rose-600 underline cursor-pointer"
                                    >
                                      {tr('Revoke', 'ரத்து செய்')}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                      {tr('Pending Review', 'நிலுவையில்')}
                                    </span>
                                    <button
                                      onClick={() => handleToggleVerify(p.id, false)}
                                      className="block text-[10px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                                    >
                                      ✓ {tr('Grant Blue Tick', 'சரிபார்ப்பு வழங்கு')}
                                    </button>
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedMatrimonyProfile(p)}
                                    className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    title={tr('View Full Profile', 'முழு சுயவிவரம் பார்க்க')}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMatrimony(p.id, displayName)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title={tr('Delete Profile', 'சுயவிவரத்தை நீக்கு')}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Matrimony Profile Detail Modal */}
              {selectedMatrimonyProfile && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-2xl w-full border border-rose-200 shadow-2xl overflow-hidden my-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 sm:p-5 flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedMatrimonyProfile.photoUrl || selectedMatrimonyProfile.primaryPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                          alt={selectedMatrimonyProfile.fullName || selectedMatrimonyProfile.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-white">
                              {selectedMatrimonyProfile.fullName || selectedMatrimonyProfile.name}
                            </h3>
                            {(selectedMatrimonyProfile.isVerified || selectedMatrimonyProfile.account?.isVerified) && (
                              <span className="bg-white text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-blue-600" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-rose-100 mt-0.5">
                            ID: <span className="font-mono font-bold text-white">{selectedMatrimonyProfile.id}</span> • {selectedMatrimonyProfile.age} yrs • {selectedMatrimonyProfile.height}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedMatrimonyProfile(null)}
                        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                      {/* Astrological Coordinates */}
                      <div className="bg-rose-50/50 border border-rose-200 p-3.5 rounded-xl space-y-2">
                        <h4 className="font-bold text-rose-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-rose-600" />
                          {tr('Vedic Astrology & Horoscope Data', 'வேத ஜோதிடக் குறிப்புகள்')}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Star / Nakshatra', 'நட்சத்திரம்')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.nakshatra || selectedMatrimonyProfile.starNakshatra || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Rasi / Moon Sign', 'ராசி')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.rasi || selectedMatrimonyProfile.rasiMoonSign || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Lagnam', 'லக்னம்')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.lagna || selectedMatrimonyProfile.lagnamAscendant || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Chevvai / Manglik', 'செவ்வாய் தோஷம்')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.manglikStatus || selectedMatrimonyProfile.manglikDosha || 'No'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Education & Career */}
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                          {tr('Education & Profession', 'கல்வி மற்றும் பணி விவரங்கள்')}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Education', 'கல்வி')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.highestEducation || selectedMatrimonyProfile.degree || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Occupation', 'பணி')}</span>
                            <strong className="text-slate-900">{selectedMatrimonyProfile.occupation || selectedMatrimonyProfile.jobTitle || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Annual Income', 'ஆண்டு வருமானம்')}</span>
                            <strong className="text-emerald-700 font-bold">{selectedMatrimonyProfile.annualIncome || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Company', 'நிறுவனம்')}</span>
                            <span className="text-slate-800">{selectedMatrimonyProfile.company || selectedMatrimonyProfile.companyName || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Location', 'இருப்பிடம்')}</span>
                            <span className="text-slate-800">{selectedMatrimonyProfile.city || selectedMatrimonyProfile.workLocation || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Family Background */}
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-600" />
                          {tr('Family Background', 'குடும்பப் பின்னணி')}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr("Father's Name", 'தந்தை பெயர்')}</span>
                            <span className="text-slate-800 font-semibold">{selectedMatrimonyProfile.fatherName || '—'}</span>
                            <span className="text-[10px] text-slate-400 block">{selectedMatrimonyProfile.fatherOccupation}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr("Mother's Name", 'தாய் பெயர்')}</span>
                            <span className="text-slate-800 font-semibold">{selectedMatrimonyProfile.motherName || '—'}</span>
                            <span className="text-[10px] text-slate-400 block">{selectedMatrimonyProfile.motherOccupation}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{tr('Family Type & Values', 'குடும்ப வகை')}</span>
                            <span className="text-slate-800">{selectedMatrimonyProfile.familyType || 'Nuclear'} • {selectedMatrimonyProfile.familyValues || 'Moderate'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact & Governance Actions */}
                      <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="text-[10px] text-amber-800 uppercase font-bold block">{tr('Registered Contact Info', 'பதிவு செய்யப்பட்ட தொடர்பு')}</span>
                          <span className="font-mono text-sm font-bold text-slate-900">{selectedMatrimonyProfile.mobile || selectedMatrimonyProfile.contact?.mobile}</span>
                          <span className="text-xs text-slate-500 block">{selectedMatrimonyProfile.email || selectedMatrimonyProfile.contact?.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVerify(selectedMatrimonyProfile.id, Boolean(selectedMatrimonyProfile.isVerified || selectedMatrimonyProfile.account?.isVerified))}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {Boolean(selectedMatrimonyProfile.isVerified || selectedMatrimonyProfile.account?.isVerified)
                              ? tr('Revoke Blue Tick', 'சரிபார்ப்பை ரத்து செய்')
                              : tr('Grant Blue Tick Verification', 'அதிகாரப்பூர்வ சரிபார்ப்பு வழங்கு')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
