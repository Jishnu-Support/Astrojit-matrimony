import React, { useState } from 'react';
import { User, Compass, Store, Shield, Phone, Lock, Calendar, Clock, MapPin, Building2, UserCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register({ defaultRole = 'client', onSwitchToLogin }) {
  const { registerClient, registerAstrologer, registerVendor } = useAuth();
  const [selectedRole, setSelectedRole] = useState(defaultRole === 'company' ? 'client' : defaultRole);
  const [astroType, setAstroType] = useState('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      fatherName: formData.get('fatherName'),
      motherName: formData.get('motherName'),
      dob: formData.get('dob'),
      dobTime: formData.get('dobTime'),
      dobPlace: formData.get('dobPlace'),
      mobile: formData.get('mobile'),
      password: formData.get('password'),
      astrologerReferralCode: formData.get('astrologerReferralCode'),
    };

    try {
      await registerClient(data);
    } catch (err) {
      setError(err.message || 'Client registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAstrologerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      type: astroType,
      name: formData.get('name'),
      contactPerson: astroType === 'company' ? formData.get('contactPerson') : undefined,
      mobile: formData.get('mobile'),
      password: formData.get('password'),
      address: formData.get('address'),
      specializations: formData.get('specializations'),
      experience: formData.get('experience'),
      languages: formData.get('languages'),
      bio: formData.get('bio'),
      gstNumber: astroType === 'company' ? formData.get('gstNumber') : undefined,
    };

    try {
      await registerAstrologer(data);
    } catch (err) {
      setError(err.message || 'Astrologer registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      shopName: formData.get('shopName'),
      contactPerson: formData.get('contactPerson'),
      mobile: formData.get('mobile'),
      password: formData.get('password'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: formData.get('pincode'),
      gstNumber: formData.get('gstNumber'),
      category: formData.get('category'),
      upiId: formData.get('upiId'),
    };

    try {
      await registerVendor(data);
    } catch (err) {
      setError(err.message || 'Vendor registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-4 sm:my-8 space-y-4 sm:space-y-6">
      {/* Brand & Header */}
      <div className="text-center space-y-1.5 flex flex-col items-center">
        <Logo size="md" showTagline={false} />
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Create Your <span className="text-amber-600">Astrojit</span> Account
        </h2>
        <p className="text-xs text-slate-500">
          Mobile Number is used as username for fast, OTP/SMS-ready login
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => { setSelectedRole('client'); setError(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'client'
              ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 text-amber-600" /> Client
        </button>

        <button
          onClick={() => { setSelectedRole('astrologer'); setError(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'astrologer'
              ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-indigo-600" /> Astrologer
        </button>

        <button
          onClick={() => { setSelectedRole('vendor'); setError(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'vendor'
              ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-emerald-600" /> Vendor
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-7 shadow-xs">
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* 1. CLIENT REGISTRATION */}
        {selectedRole === 'client' && (
          <form onSubmit={handleClientSubmit} className="space-y-3.5 text-xs">
            <div className="border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" /> Client Registration & Birth Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Birth details will automatically synthesize your certified One-Page Janma Kundli
              </p>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Aarav Kumar Sharma"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="e.g. Sunita Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Date of Birth (D.O.B) *</label>
                <input
                  type="date"
                  name="dob"
                  required
                  defaultValue="1998-05-15"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Birth Time *</label>
                <input
                  type="time"
                  name="dobTime"
                  required
                  defaultValue="07:30"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Birth Place *</label>
                <input
                  type="text"
                  name="dobPlace"
                  required
                  placeholder="e.g. Varanasi, UP"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Mobile Number (Username) *
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Set password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Astrologer Referral Code (Optional)
              </label>
              <input
                type="text"
                name="astrologerReferralCode"
                placeholder="e.g. PANDIT101 or ASTROVEDA"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3"
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
              Register & Generate My One-Page Horoscope
            </button>
          </form>
        )}

        {/* 2. ASTROLOGER REGISTRATION */}
        {selectedRole === 'astrologer' && (
          <form onSubmit={handleAstrologerSubmit} className="space-y-3.5 text-xs">
            <div className="border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" /> Astrologer Practitioner Registration
              </h3>
              <p className="text-[11px] text-slate-500">
                Register as an Individual Astrologer or Astrological Firm
              </p>
            </div>

            <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 text-slate-800 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="astroType"
                  value="individual"
                  checked={astroType === 'individual'}
                  onChange={() => setAstroType('individual')}
                  className="accent-indigo-600"
                />
                Individual Astrologer
              </label>
              <label className="flex items-center gap-2 text-slate-800 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="astroType"
                  value="company"
                  checked={astroType === 'company'}
                  onChange={() => setAstroType('company')}
                  className="accent-indigo-600"
                />
                Astrological Firm / Co.
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {astroType === 'company' ? 'Firm / Company Name *' : 'Astrologer Full Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={astroType === 'company' ? 'e.g. AstroVeda Consultancy LLP' : 'e.g. Pandit Rajesh Sharma'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {astroType === 'company' && (
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    Contact Person / Lead Astrologer *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder="e.g. Dr. Meenakshi Sundaram"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Mobile Number (Username) *
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Set password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 15+ Years"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Office / Temple Address *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Full consultation office address"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Specializations</label>
                <input
                  type="text"
                  name="specializations"
                  placeholder="e.g. Vedic, Kundli, Vastu, KP"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Languages</label>
                <input
                  type="text"
                  name="languages"
                  placeholder="e.g. Hindi, Sanskrit, English"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {astroType === 'company' && (
              <div>
                <label className="text-slate-700 font-bold block mb-1">Registration / GSTIN Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-slate-700 font-bold block mb-1">Professional Bio</label>
              <textarea
                name="bio"
                rows={2}
                placeholder="Summary of experience, lineage or certifications..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3"
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
              Register Astrologer & Get Referral Code
            </button>
          </form>
        )}

        {/* 3. VENDOR REGISTRATION */}
        {selectedRole === 'vendor' && (
          <form onSubmit={handleVendorSubmit} className="space-y-3.5 text-xs">
            <div className="border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" /> Merchant & Vendor Partner Registration
              </h3>
              <p className="text-[11px] text-slate-500">
                Supply puja samagri, energized gemstones, rudraksha, and sacred ritual services
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Shop / Business Name *</label>
                <input
                  type="text"
                  name="shopName"
                  required
                  placeholder="e.g. Shree Kashi Divine Samagri"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Proprietor / Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  required
                  placeholder="e.g. Suresh Agarwal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Mobile (Username) *</label>
                <input
                  type="text"
                  name="mobile"
                  required
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Set password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Shop Address *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Shop number, street, landmark"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Varanasi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 221001"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
                <select
                  name="category"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Puja Samagri & Kits">Puja Samagri & Kits</option>
                  <option value="Rudraksha & Gemstones">Rudraksha & Gemstones</option>
                  <option value="Pooja & Homam Services">Pooja & Homam Services</option>
                  <option value="Yantras & Brass Idols">Yantras & Brass Idols</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">GSTIN / MSME</label>
                <input
                  type="text"
                  name="gstNumber"
                  placeholder="GST or MSME ID"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="yourname@upi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3"
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : null}
              Register Vendor & Start Listing
            </button>
          </form>
        )}

        {/* Back to Login link */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-700 hover:underline font-bold cursor-pointer"
          >
            Sign in with mobile number →
          </button>
        </div>
      </div>
    </div>
  );
}
