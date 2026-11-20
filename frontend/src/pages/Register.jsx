import React, { useState } from 'react';
import {
  User,
  Compass,
  Store,
  Shield,
  Phone,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  Sparkles,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import LocationHierarchyInput from '../components/LocationHierarchyInput';
import OtpMobileInput from '../components/OtpMobileInput';

export default function Register({ defaultRole = 'client', onSwitchToLogin }) {
  const { registerClient, registerAstrologer, registerVendor } = useAuth();
  const [selectedRole, setSelectedRole] = useState(defaultRole === 'company' ? 'client' : defaultRole);
  const [astroType, setAstroType] = useState('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Shared Form State across tabs
  const [mobile, setMobile] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Location State
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);

  // Switch role handler: resets verification and clears error
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
    setMobile('');
    setIsMobileVerified(false);
    setPassword('');
    setConfirmPassword('');
    setCity('');
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isMobileVerified) {
      setError('Please verify your 10-digit mobile number with OTP before completing registration.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (!city.trim()) {
      setError('Please select or enter your Birth Place / City.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      fatherName: formData.get('fatherName'),
      motherName: formData.get('motherName'),
      dob: formData.get('dob'),
      dobTime: formData.get('dobTime'),
      country,
      state,
      city: city.trim(),
      dobPlace: `${city.trim()}, ${state}, ${country}`,
      lat: coords?.lat,
      lon: coords?.lon,
      mobile: mobile.trim(),
      password,
      confirmPassword,
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
    setError('');

    if (!isMobileVerified) {
      setError('Please verify your 10-digit mobile number with OTP before completing registration.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (!city.trim()) {
      setError('Please select or enter your Office City / Town.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = {
      type: astroType,
      name: formData.get('name'),
      contactPerson: astroType === 'company' ? formData.get('contactPerson') : undefined,
      mobile: mobile.trim(),
      password,
      confirmPassword,
      country,
      state,
      city: city.trim(),
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
    setError('');

    if (!isMobileVerified) {
      setError('Please verify your 10-digit mobile number with OTP before completing registration.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (!city.trim()) {
      setError('Please select or enter your Store City.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = {
      shopName: formData.get('shopName'),
      contactPerson: formData.get('contactPerson'),
      mobile: mobile.trim(),
      password,
      confirmPassword,
      country,
      state,
      city: city.trim(),
      address: formData.get('address'),
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
          Mobile Number is verified via OTP and used as your username
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => handleRoleChange('client')}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'client'
              ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 text-amber-600" /> Client
        </button>

        <button
          onClick={() => handleRoleChange('astrologer')}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'astrologer'
              ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-indigo-600" /> Astrologer
        </button>

        <button
          onClick={() => handleRoleChange('vendor')}
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
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
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

            {/* Full Name */}
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

            {/* Parents' Names */}
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

            {/* DOB & Birth Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Date of Birth (D.O.B) *
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Birth Time *
                </label>
                <input
                  type="time"
                  name="dobTime"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Location Hierarchy: Country -> State/Province -> Birth Place (City) with 1-letter auto suggestions */}
            <div className="pt-1">
              <LocationHierarchyInput
                labelCity="Birth Place *"
                cityPlaceholder="Type city name (e.g. S, C, M...)"
                country={country}
                setCountry={setCountry}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                onLocationChange={(coordsData) => setCoords(coordsData)}
                theme="amber"
                required={true}
              />
            </div>

            {/* Mobile Number with OTP Verification */}
            <div className="pt-1">
              <OtpMobileInput
                mobile={mobile}
                setMobile={setMobile}
                isVerified={isMobileVerified}
                setIsVerified={setIsMobileVerified}
                role="client"
                theme="amber"
                required={true}
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" /> Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Set password (min 6 chars)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Confirm Password *
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-bold ${
                        password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {password === confirmPassword ? '✓ Passwords match' : '✕ Do not match'}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Astrologer Referral Code */}
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Astrologer Referral Code (Optional)
              </label>
              <input
                type="text"
                name="astrologerReferralCode"
                placeholder="e.g. PANDIT101 or ASTROVEDA"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3 disabled:opacity-50"
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

            {/* Individual vs Firm Selector */}
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

            {/* Name and Contact Person */}
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

              {astroType === 'company' ? (
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
              ) : (
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 15+ Years"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Location Hierarchy: Country -> State/Province -> City/Town with 1-letter auto suggestions */}
            <div className="pt-1">
              <LocationHierarchyInput
                labelCity="City / Town *"
                cityPlaceholder="Type city name (e.g. S, C, M...)"
                country={country}
                setCountry={setCountry}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                theme="indigo"
                required={true}
              />
            </div>

            {/* Street / Office Address */}
            <div>
              <label className="text-slate-700 font-bold block mb-1">Office / Temple Street Address *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Street address, building, landmark..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Specializations & Languages */}
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
                  placeholder="e.g. Tamil, English, Hindi"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            )}

            <div>
              <label className="text-slate-700 font-bold block mb-1">Professional Bio</label>
              <textarea
                name="bio"
                rows={2}
                placeholder="Summary of experience, lineage or astrological certifications..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Mobile Number with OTP Verification */}
            <div className="pt-1">
              <OtpMobileInput
                mobile={mobile}
                setMobile={setMobile}
                isVerified={isMobileVerified}
                setIsVerified={setIsMobileVerified}
                role="astrologer"
                theme="indigo"
                required={true}
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" /> Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Set password (min 6 chars)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" /> Confirm Password *
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-bold ${
                        password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {password === confirmPassword ? '✓ Passwords match' : '✕ Do not match'}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3 disabled:opacity-50"
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

            {/* Shop Name & Contact Person */}
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

            {/* Category, GST, UPI */}
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
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

            {/* Location Hierarchy: Country -> State/Province -> City with 1-letter auto suggestions */}
            <div className="pt-1">
              <LocationHierarchyInput
                labelCity="City *"
                cityPlaceholder="Type city name (e.g. S, C, M...)"
                country={country}
                setCountry={setCountry}
                state={state}
                setState={setState}
                city={city}
                setCity={setCity}
                theme="emerald"
                required={true}
              />
            </div>

            {/* Shop Address & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-slate-700 font-bold block mb-1">Shop Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Shop number, market, street, landmark..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 636001"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Mobile Number with OTP Verification */}
            <div className="pt-1">
              <OtpMobileInput
                mobile={mobile}
                setMobile={setMobile}
                isVerified={isMobileVerified}
                setIsVerified={setIsMobileVerified}
                role="vendor"
                theme="emerald"
                required={true}
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Set password (min 6 chars)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> Confirm Password *
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-bold ${
                        password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {password === confirmPassword ? '✓ Passwords match' : '✕ Do not match'}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-medium ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm mt-3 disabled:opacity-50"
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
