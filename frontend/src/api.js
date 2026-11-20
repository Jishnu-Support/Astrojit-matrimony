/**
 * Astrojit API Client
 */

const API_BASE = import.meta.env?.VITE_API_BASE || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '5000'
    ? `http://${window.location.hostname}:5000/api`
    : '/api'
);

export async function apiRequest(endpoint, method = 'GET', data = null, customToken = null) {
  const token = customToken || localStorage.getItem('astrojit_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  
  let result = {};
  const text = await res.text();
  try {
    result = text ? JSON.parse(text) : {};
  } catch (err) {
    result = { error: text || `Server error (${res.status})` };
  }

  if (!res.ok) {
    throw new Error(result.error || result.message || `API request failed with status ${res.status}`);
  }

  return result;
}

export const API = {
  // Auth
  registerClient: (data) => apiRequest('/auth/register/client', 'POST', data),
  registerAstrologer: (data) => apiRequest('/auth/register/astrologer', 'POST', data),
  registerVendor: (data) => apiRequest('/auth/register/vendor', 'POST', data),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
  forgotPasswordVerify: (data) => apiRequest('/auth/forgot-password/verify', 'POST', data),
  forgotPasswordReset: (data) => apiRequest('/auth/forgot-password/reset', 'POST', data),
  getMe: () => apiRequest('/auth/me', 'GET'),
  updateUserProfile: (data) => apiRequest('/user/profile', 'PUT', data),
  changePassword: (data) => apiRequest('/user/change-password', 'POST', data),
  updateUserSettings: (settings) => apiRequest('/user/settings', 'PUT', { settings }),

  // Daily Panchangam
  getPanchangam: (date) => apiRequest(date ? `/panchangam?date=${date}` : '/panchangam', 'GET'),
  getClientProfileByMobile: (mobile) => apiRequest(`/client/profile-by-mobile/${mobile}`, 'GET'),
  registerClientByAstrologer: (data) => apiRequest('/astrologer/register-client', 'POST', data),
  getClientReceipt: (clientId) => apiRequest(`/astrologer/client-receipt/${clientId}`, 'GET'),

  // 1-A: Matchmaking & Astrologer Review Workflow
  calculateMatch: (boy, girl) => apiRequest('/matchmaking', 'POST', { boy, girl }),
  getMyMatchmakingRequests: () => apiRequest('/matchmaking/my-requests', 'GET'),
  toggleMatchmakingSubscription: (data) => apiRequest('/matchmaking/subscribe', 'POST', data),
  calculateMatchSelf: (boy, girl) => apiRequest('/matchmaking/calculate-self', 'POST', { boy, girl }),
  requestMatchmaking: (data) => apiRequest('/matchmaking/request', 'POST', data),
  getAstrologerMatchmakingRequests: () => apiRequest('/matchmaking/astrologer-requests', 'GET'),
  submitMatchmakingReview: (data) => apiRequest('/matchmaking/submit-review', 'POST', data),

  // 3-A: Alerts & WhatsApp
  subscribeAlerts: (data) => apiRequest('/alerts/subscribe', 'POST', data),

  // 3-B: Slot Booking & Astrologer Status
  getAvailableAstrologers: () => apiRequest('/astrologers/available', 'GET'),
  updateAstrologerStatus: (data) => apiRequest('/astrologer/status', 'PATCH', data),
  bookAppointment: (data) => apiRequest('/appointments/book', 'POST', data),
  completeAppointment: (data) => apiRequest('/appointments/complete', 'POST', data),
  getMyAppointments: () => apiRequest('/appointments/my', 'GET'),

  // Astrologer
  searchClients: (q) => apiRequest(`/astrologer/search-client?q=${encodeURIComponent(q)}`, 'GET'),
  saveConsultationNote: (data) => apiRequest('/astrologer/consultation-note', 'POST', data),
  getReferredClients: () => apiRequest('/astrologer/referred-clients', 'GET'),

  // Vendor
  getVendorProducts: () => apiRequest('/vendor/products', 'GET'),
  addVendorProduct: (data) => apiRequest('/vendor/products', 'POST', data),
  deleteVendorProduct: (id) => apiRequest(`/vendor/products/${id}`, 'DELETE'),

  // Marketplace
  getMarketplace: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/marketplace/products${params ? `?${params}` : ''}`, 'GET');
  },

  // Company (JIT Admin)
  getCompanyOverview: () => apiRequest('/company/overview', 'GET'),
  getCompanyClients: () => apiRequest('/company/clients', 'GET'),
  getCompanyAstrologers: () => apiRequest('/company/astrologers', 'GET'),
  getCompanyVendors: () => apiRequest('/company/vendors', 'GET'),
  getCompanyProducts: () => apiRequest('/company/products', 'GET'),
  getCompanyMatrimonyProfiles: () => apiRequest('/company/matrimony', 'GET'),
  verifyCompanyMatrimonyProfile: (id, isVerified) => apiRequest(`/company/matrimony/${id}/verify`, 'PUT', { isVerified }),
  deleteCompanyMatrimonyProfile: (id) => apiRequest(`/company/matrimony/${id}`, 'DELETE'),

  // Matrimony
  getMyMatrimonyProfile: (mobile, clientId) => {
    const q = new URLSearchParams({ ...(mobile ? { mobile } : {}), ...(clientId ? { clientId } : {}) }).toString();
    return apiRequest(`/matrimony/my-profile${q ? `?${q}` : ''}`, 'GET');
  },
  getMatrimonyAutofillSources: (clientId) => apiRequest(clientId ? `/matrimony/autofill-sources?clientId=${clientId}` : '/matrimony/autofill-sources', 'GET'),
  getFamilyMembers: () => apiRequest('/matrimony/family-members', 'GET'),
  addFamilyMember: (data) => apiRequest('/matrimony/family-members', 'POST', data),
  getMatrimonyProfiles: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/matrimony/profiles${q ? `?${q}` : ''}`, 'GET');
  },
  getMatrimonyProfile: (id) => apiRequest(`/matrimony/profiles/${id}`, 'GET'),
  registerMatrimonyProfile: (data) => apiRequest('/matrimony/register-profile', 'POST', data),
  updateMatrimonyProfile: (id, data) => apiRequest(`/matrimony/profiles/${id}`, 'PUT', data),
  checkMatrimonyCompatibility: (data) => apiRequest('/matrimony/check-compatibility', 'POST', data),
  sendMatrimonyInterest: (data) => apiRequest('/matrimony/interests', 'POST', data),
  getMatrimonyInterests: () => apiRequest('/matrimony/interests', 'GET'),
  updateMatrimonyInterestStatus: (id, status) => apiRequest(`/matrimony/interests/${id}/status`, 'POST', { status }),
  toggleMatrimonyShortlist: (data) => apiRequest('/matrimony/shortlists/toggle', 'POST', data),
  getMatrimonyShortlists: () => apiRequest('/matrimony/shortlists', 'GET'),
};
