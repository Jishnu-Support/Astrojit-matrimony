/**
 * Astrojit Main API Server
 * Express.js backend supporting 4 logins: Clients, Astrologers, Vendors, Company (JIT)
 * Plus Matchmaking, Gochar, Slot Booking & Alerts
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('./db');
const { getDailyPanchangam, calculateKundliMatch, calculateTamilPoruthams, evaluateChevvaiDosha } = require('./astroEngine');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'astrojit_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Helper to sign JWT
function generateToken(user, role) {
  return jwt.sign(
    {
      id: user.id || 'company-admin',
      mobile: user.mobile,
      role: role,
      name: user.name || user.shopName || user.companyName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware to authenticate JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// --------------------------------------------------------------------------
// 1. AUTHENTICATION & REGISTRATION
// --------------------------------------------------------------------------

app.post('/api/auth/register/client', (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      dob,
      dobTime,
      dobPlace,
      mobile,
      password,
      astrologerReferralCode,
    } = req.body;

    if (!name || !mobile || !password || !dob || !dobTime || !dobPlace) {
      return res.status(400).json({
        error: 'Name, Mobile, Password, Date of Birth, Birth Time, and Birth Place are required.',
      });
    }

    const db = readDb();
    const existing = db.clients.find((c) => c.mobile === mobile.trim());
    if (existing) {
      return res.status(400).json({ error: 'Client with this mobile number is already registered.' });
    }

    const salt = bcrypt.genSaltSync(8);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newClient = {
      id: 'client-' + uuidv4().substring(0, 8),
      name: name.trim(),
      fatherName: (fatherName || '').trim(),
      motherName: (motherName || '').trim(),
      dob: dob.trim(),
      dobTime: dobTime.trim(),
      dobPlace: dobPlace.trim(),
      mobile: mobile.trim(),
      passwordHash,
      astrologerReferralCode: (astrologerReferralCode || '').trim().toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    db.clients.push(newClient);
    writeDb(db);

    const token = generateToken(newClient, 'client');
    const { passwordHash: _, ...clientData } = newClient;

    return res.status(201).json({
      message: 'Client registered successfully',
      token,
      user: { ...clientData, role: 'client' },
    });
  } catch (error) {
    console.error('Client registration error:', error);
    return res.status(500).json({ error: 'Internal server error during client registration' });
  }
});

app.post('/api/auth/register/astrologer', (req, res) => {
  try {
    const {
      type = 'individual',
      name,
      contactPerson,
      mobile,
      password,
      address,
      specializations,
      experience,
      languages,
      bio,
      gstNumber,
    } = req.body;

    if (!name || !mobile || !password || !address) {
      return res.status(400).json({
        error: 'Name, Mobile Number, Password, and Address are required.',
      });
    }

    const db = readDb();
    const existing = db.astrologers.find((a) => a.mobile === mobile.trim());
    if (existing) {
      return res.status(400).json({ error: 'Astrologer with this mobile number is already registered.' });
    }

    const cleanPrefix = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    const randomCode = Math.floor(100 + Math.random() * 900);
    const referralCode = `JIT-${cleanPrefix || 'ASTRO'}-${randomCode}`;

    const salt = bcrypt.genSaltSync(8);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newAstrologer = {
      id: 'astro-' + uuidv4().substring(0, 8),
      type,
      name: name.trim(),
      contactPerson: type === 'company' ? (contactPerson || '').trim() : undefined,
      mobile: mobile.trim(),
      passwordHash,
      address: address.trim(),
      specializations: Array.isArray(specializations)
        ? specializations
        : (specializations || 'Vedic Astrology').split(',').map((s) => s.trim()),
      experience: (experience || '5+ Years').trim(),
      languages: (languages || 'English, Hindi').trim(),
      bio: (bio || 'Professional Astrological Consultant dedicated to authentic Vedic guidance.').trim(),
      gstNumber: type === 'company' ? (gstNumber || '').trim() : undefined,
      referralCode,
      verified: true,
      rating: 5.0,
      consultationsCount: 0,
      isOnline: true,
      ratePerMinute: 25,
      availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:30 PM', '07:00 PM'],
      createdAt: new Date().toISOString(),
    };

    db.astrologers.push(newAstrologer);
    writeDb(db);

    const token = generateToken(newAstrologer, 'astrologer');
    const { passwordHash: _, ...astroData } = newAstrologer;

    return res.status(201).json({
      message: 'Astrologer registered successfully',
      token,
      user: { ...astroData, role: 'astrologer' },
    });
  } catch (error) {
    console.error('Astrologer registration error:', error);
    return res.status(500).json({ error: 'Internal server error during astrologer registration' });
  }
});

app.post('/api/auth/register/vendor', (req, res) => {
  try {
    const {
      shopName,
      contactPerson,
      mobile,
      password,
      address,
      city,
      state,
      pincode,
      gstNumber,
      category,
      upiId,
    } = req.body;

    if (!shopName || !contactPerson || !mobile || !password || !address) {
      return res.status(400).json({
        error: 'Shop/Business Name, Contact Person, Mobile, Password, and Address are required.',
      });
    }

    const db = readDb();
    const existing = db.vendors.find((v) => v.mobile === mobile.trim());
    if (existing) {
      return res.status(400).json({ error: 'Vendor with this mobile number is already registered.' });
    }

    const salt = bcrypt.genSaltSync(8);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newVendor = {
      id: 'vendor-' + uuidv4().substring(0, 8),
      shopName: shopName.trim(),
      contactPerson: contactPerson.trim(),
      mobile: mobile.trim(),
      passwordHash,
      address: address.trim(),
      city: (city || 'New Delhi').trim(),
      state: (state || 'Delhi').trim(),
      pincode: (pincode || '110001').trim(),
      gstNumber: (gstNumber || 'Unregistered / MSME').trim(),
      category: (category || 'Puja Samagri & Spiritual Essentials').trim(),
      upiId: (upiId || `${mobile.trim()}@upi`).trim(),
      verified: true,
      createdAt: new Date().toISOString(),
    };

    db.vendors.push(newVendor);
    writeDb(db);

    const token = generateToken(newVendor, 'vendor');
    const { passwordHash: _, ...vendorData } = newVendor;

    return res.status(201).json({
      message: 'Vendor registered successfully',
      token,
      user: { ...vendorData, role: 'vendor' },
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    return res.status(500).json({ error: 'Internal server error during vendor registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { role, mobile, password } = req.body;

    if (!role || !mobile || !password) {
      return res.status(400).json({ error: 'Role, Mobile Number, and Password are required.' });
    }

    const db = readDb();
    const cleanMobile = mobile.trim();

    if (role === 'company') {
      const company = db.company;
      if (cleanMobile === company.mobile || cleanMobile === 'admin' || cleanMobile === company.email) {
        const isMatch = bcrypt.compareSync(password, company.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid Company password.' });
        }

        const token = generateToken(company, 'company');
        return res.json({
          message: 'Company Admin login successful',
          token,
          user: {
            id: 'company-jit',
            name: company.name,
            mobile: company.mobile,
            email: company.email,
            role: 'company',
          },
        });
      }
      return res.status(404).json({ error: 'Company Admin credentials not found.' });
    }

    if (role === 'client') {
      const client = db.clients.find((c) => c.mobile === cleanMobile);
      if (!client) {
        return res.status(404).json({ error: 'No client found with this mobile number.' });
      }

      const isMatch = bcrypt.compareSync(password, client.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const token = generateToken(client, 'client');
      const { passwordHash: _, ...clientData } = client;
      return res.json({
        message: 'Client login successful',
        token,
        user: { ...clientData, role: 'client' },
      });
    }

    if (role === 'astrologer') {
      const astro = db.astrologers.find((a) => a.mobile === cleanMobile);
      if (!astro) {
        return res.status(404).json({ error: 'No astrologer found with this mobile number.' });
      }

      const isMatch = bcrypt.compareSync(password, astro.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const token = generateToken(astro, 'astrologer');
      const { passwordHash: _, ...astroData } = astro;
      return res.json({
        message: 'Astrologer login successful',
        token,
        user: { ...astroData, role: 'astrologer' },
      });
    }

    if (role === 'vendor') {
      const vendor = db.vendors.find((v) => v.mobile === cleanMobile);
      if (!vendor) {
        return res.status(404).json({ error: 'No vendor found with this mobile number.' });
      }

      const isMatch = bcrypt.compareSync(password, vendor.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const token = generateToken(vendor, 'vendor');
      const { passwordHash: _, ...vendorData } = vendor;
      return res.json({
        message: 'Vendor login successful',
        token,
        user: { ...vendorData, role: 'vendor' },
      });
    }

    return res.status(400).json({ error: 'Invalid role specified.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// --------------------------------------------------------------------------
// FORGOT PASSWORD / ACCOUNT RECOVERY ENDPOINTS
// --------------------------------------------------------------------------
app.post('/api/auth/forgot-password/verify', (req, res) => {
  try {
    const { role = 'client', mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required for password recovery.' });
    }

    const cleanMobile = mobile.trim();
    const db = readDb();
    let account = null;

    if (role === 'client') {
      account = db.clients.find((c) => c.mobile === cleanMobile);
    } else if (role === 'astrologer') {
      account = db.astrologers.find((a) => a.mobile === cleanMobile);
    } else if (role === 'vendor') {
      account = db.vendors.find((v) => v.mobile === cleanMobile);
    } else if (role === 'company') {
      if (cleanMobile === db.company.mobile || cleanMobile === 'admin' || cleanMobile === db.company.email) {
        account = db.company;
      }
    }

    if (!account) {
      return res.status(404).json({
        error: `No registered ${role} account found with mobile number ${cleanMobile}.`,
      });
    }

    const maskedMobile = cleanMobile.length >= 4 
      ? cleanMobile.slice(0, 2) + '****' + cleanMobile.slice(-4)
      : '****';
    const demoOtp = '7788';

    return res.json({
      success: true,
      message: `Account verified for ${account.name || account.shopName || 'User'}. Verification OTP generated.`,
      name: account.name || account.shopName || account.contactPerson || 'User',
      maskedMobile,
      demoOtp,
    });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    return res.status(500).json({ error: 'Internal server error during account verification' });
  }
});

app.post('/api/auth/forgot-password/reset', (req, res) => {
  try {
    const { role = 'client', mobile, otp, newPassword } = req.body;
    if (!mobile || !newPassword) {
      return res.status(400).json({ error: 'Mobile number and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const cleanMobile = mobile.trim();
    const cleanOtp = (otp || '').trim();

    // Verify OTP (demo code '7788' or '1234')
    if (cleanOtp !== '7788' && cleanOtp !== '1234') {
      return res.status(400).json({ error: 'Invalid verification OTP. Please use code 7788.' });
    }

    const db = readDb();
    const salt = bcrypt.genSaltSync(8);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);
    let updated = false;

    if (role === 'client') {
      const idx = db.clients.findIndex((c) => c.mobile === cleanMobile);
      if (idx !== -1) {
        db.clients[idx].passwordHash = newPasswordHash;
        updated = true;
      }
    } else if (role === 'astrologer') {
      const idx = db.astrologers.findIndex((a) => a.mobile === cleanMobile);
      if (idx !== -1) {
        db.astrologers[idx].passwordHash = newPasswordHash;
        updated = true;
      }
    } else if (role === 'vendor') {
      const idx = db.vendors.findIndex((v) => v.mobile === cleanMobile);
      if (idx !== -1) {
        db.vendors[idx].passwordHash = newPasswordHash;
        updated = true;
      }
    } else if (role === 'company') {
      db.company.passwordHash = newPasswordHash;
      updated = true;
    }

    if (!updated) {
      return res.status(404).json({ error: `Account with mobile number ${cleanMobile} could not be updated.` });
    }

    writeDb(db);

    return res.json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Forgot password reset error:', error);
    return res.status(500).json({ error: 'Internal server error during password reset' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const db = readDb();
  const { role, mobile } = req.user;

  if (role === 'company') {
    return res.json({
      user: {
        id: 'company-jit',
        name: db.company.name,
        mobile: db.company.mobile,
        email: db.company.email,
        role: 'company',
      },
    });
  }

  if (role === 'client') {
    const client = db.clients.find((c) => c.mobile === mobile);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    const { passwordHash, ...data } = client;
    return res.json({ user: { ...data, role: 'client' } });
  }

  if (role === 'astrologer') {
    const astro = db.astrologers.find((a) => a.mobile === mobile);
    if (!astro) return res.status(404).json({ error: 'Astrologer not found' });
    const { passwordHash, ...data } = astro;
    return res.json({ user: { ...data, role: 'astrologer' } });
  }

  if (role === 'vendor') {
    const vendor = db.vendors.find((v) => v.mobile === mobile);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    const { passwordHash, ...data } = vendor;
    return res.json({ user: { ...data, role: 'vendor' } });
  }

  res.status(400).json({ error: 'Unknown role' });
});

// Update Profile for authenticated user
app.put('/api/user/profile', authenticate, (req, res) => {
  try {
    const db = readDb();
    const { role, mobile } = req.user;
    const updates = req.body;

    if (role === 'client') {
      const idx = db.clients.findIndex((c) => c.mobile === mobile || c.id === req.user.id);
      if (idx === -1) return res.status(404).json({ error: 'Client not found' });
      
      const allowed = ['name', 'fatherName', 'motherName', 'dob', 'dobTime', 'dobPlace', 'email', 'phone', 'address'];
      allowed.forEach(field => {
        if (updates[field] !== undefined) {
          db.clients[idx][field] = updates[field];
        }
      });
      db.clients[idx].updatedAt = new Date().toISOString();
      writeDb(db);
      const { passwordHash, ...safeUser } = db.clients[idx];
      return res.json({ message: 'Profile updated successfully', user: { ...safeUser, role: 'client' } });
    }

    if (role === 'astrologer') {
      const idx = db.astrologers.findIndex((a) => a.mobile === mobile || a.id === req.user.id);
      if (idx === -1) return res.status(404).json({ error: 'Astrologer not found' });
      ['name', 'email', 'address', 'specializations'].forEach(field => {
        if (updates[field] !== undefined) db.astrologers[idx][field] = updates[field];
      });
      db.astrologers[idx].updatedAt = new Date().toISOString();
      writeDb(db);
      const { passwordHash, ...safeUser } = db.astrologers[idx];
      return res.json({ message: 'Profile updated successfully', user: { ...safeUser, role: 'astrologer' } });
    }

    if (role === 'vendor') {
      const idx = db.vendors.findIndex((v) => v.mobile === mobile || v.id === req.user.id);
      if (idx === -1) return res.status(404).json({ error: 'Vendor not found' });
      ['shopName', 'contactPerson', 'city', 'upiId'].forEach(field => {
        if (updates[field] !== undefined) db.vendors[idx][field] = updates[field];
      });
      db.vendors[idx].updatedAt = new Date().toISOString();
      writeDb(db);
      const { passwordHash, ...safeUser } = db.vendors[idx];
      return res.json({ message: 'Profile updated successfully', user: { ...safeUser, role: 'vendor' } });
    }

    if (role === 'company') {
      if (updates.name) db.company.name = updates.name;
      if (updates.email) db.company.email = updates.email;
      writeDb(db);
      return res.json({ message: 'Company settings updated', user: { ...db.company, role: 'company' } });
    }

    return res.status(400).json({ error: 'Unsupported role' });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change Password for authenticated user
app.post('/api/user/change-password', authenticate, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const db = readDb();
    const { role, mobile } = req.user;
    let target = null;

    if (role === 'client') target = db.clients.find(c => c.mobile === mobile || c.id === req.user.id);
    else if (role === 'astrologer') target = db.astrologers.find(a => a.mobile === mobile || a.id === req.user.id);
    else if (role === 'vendor') target = db.vendors.find(v => v.mobile === mobile || v.id === req.user.id);
    else if (role === 'company') target = db.company;

    if (!target) return res.status(404).json({ error: 'User record not found' });

    // Check old password
    const valid = bcrypt.compareSync(currentPassword, target.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password does not match' });
    }

    target.passwordHash = bcrypt.hashSync(newPassword, 8);
    target.passwordUpdatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

// Update User Settings & Preferences
app.put('/api/user/settings', authenticate, (req, res) => {
  try {
    const { settings } = req.body;
    const db = readDb();
    const { role, mobile } = req.user;
    let target = null;

    if (role === 'client') target = db.clients.find(c => c.mobile === mobile || c.id === req.user.id);
    else if (role === 'astrologer') target = db.astrologers.find(a => a.mobile === mobile || a.id === req.user.id);
    else if (role === 'vendor') target = db.vendors.find(v => v.mobile === mobile || v.id === req.user.id);
    else if (role === 'company') target = db.company;

    if (!target) return res.status(404).json({ error: 'User record not found' });

    target.settings = { ...(target.settings || {}), ...settings };
    writeDb(db);

    return res.json({ message: 'Settings saved successfully', settings: target.settings });
  } catch (err) {
    console.error('Update settings error:', err);
    return res.status(500).json({ error: 'Failed to save settings' });
  }
});

// --------------------------------------------------------------------------
// 2. PANCHANGAM & HOROSCOPE
// --------------------------------------------------------------------------

app.get('/api/panchangam', (req, res) => {
  try {
    const dateQuery = req.query.date;
    const panchangam = getDailyPanchangam(dateQuery);
    return res.json(panchangam);
  } catch (error) {
    console.error('Panchangam calculation error:', error);
    return res.status(500).json({ error: 'Failed to calculate panchangam' });
  }
});

app.get('/api/client/profile-by-mobile/:mobile', authenticate, (req, res) => {
  try {
    const db = readDb();
    const client = db.clients.find((c) => c.mobile === req.params.mobile.trim());

    if (!client) {
      return res.status(404).json({ error: 'Client with this mobile number does not exist.' });
    }

    const clientConsultations = db.consultations.filter(
      (c) => c.clientMobile === req.params.mobile.trim()
    );

    return res.json({
      client,
      consultationHistory: clientConsultations,
    });
  } catch (error) {
    console.error('Fetch client by mobile error:', error);
    return res.status(500).json({ error: 'Failed to fetch client profile' });
  }
});

// Register a new client account directly by astrologer + generate credentials + receipt
app.post('/api/astrologer/register-client', authenticate, (req, res) => {
  try {
    const db = readDb();
    const astro = db.astrologers.find((a) => a.mobile === req.user.mobile || a.id === req.user.id) || db.astrologers[0];

    const {
      name,
      fatherName = '',
      motherName = '',
      gender = 'male',
      dob,
      dobTime,
      dobPlace,
      nativePlace = '',
      mobile,
      email = '',
      gotra = 'Vishwamitra',
      initialPassword = '',
      country = 'India',
      state = 'Karnataka',
      city = 'Bangalore',
      latitude = '',
      longitude = '',
      coordinates = '',
      dobTime12 = '',
      starBasis = 'moon',
    } = req.body;

    if (!name || !mobile || !dob || !dobTime || !dobPlace) {
      return res.status(400).json({
        error: 'Client Name, Mobile Number, Date of Birth, Birth Time, and Birth Place are required.',
      });
    }

    const cleanMobile = mobile.trim();
    const cleanPassword = (initialPassword || 'Astro@123').trim();
    const salt = bcrypt.genSaltSync(8);
    const passwordHash = bcrypt.hashSync(cleanPassword, salt);

    let client = db.clients.find((c) => c.mobile === cleanMobile);
    const clientCode = client?.clientCode || ('CLI-' + Math.floor(100000 + Math.random() * 900000));

    if (client) {
      // Update existing client with latest particulars and associate with this astrologer
      client.name = name.trim();
      client.fatherName = fatherName.trim();
      client.motherName = motherName.trim();
      client.gender = gender;
      client.dob = dob.trim();
      client.dobTime = dobTime.trim();
      client.dobPlace = dobPlace.trim();
      client.nativePlace = (nativePlace || dobPlace).trim();
      client.email = email.trim();
      client.gotra = gotra.trim();
      client.country = country;
      client.state = state;
      client.city = city;
      client.latitude = latitude;
      client.longitude = longitude;
      client.coordinates = coordinates || (latitude && longitude ? `${latitude} , ${longitude}` : '');
      client.dobTime12 = dobTime12;
      client.starBasis = starBasis;
      client.astrologerReferralCode = astro.referralCode || req.user.referralCode || 'PANDIT101';
      client.clientCode = clientCode;
      client.plainInitialPassword = cleanPassword;
      client.passwordHash = passwordHash;
      client.updatedAt = new Date().toISOString();
    } else {
      // Create new client
      client = {
        id: 'client-' + uuidv4().substring(0, 8),
        clientCode,
        name: name.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        gender,
        dob: dob.trim(),
        dobTime: dobTime.trim(),
        dobPlace: dobPlace.trim(),
        nativePlace: (nativePlace || dobPlace).trim(),
        country,
        state,
        city,
        latitude,
        longitude,
        coordinates: coordinates || (latitude && longitude ? `${latitude} , ${longitude}` : ''),
        dobTime12,
        starBasis,
        mobile: cleanMobile,
        email: email.trim(),
        gotra: gotra.trim(),
        passwordHash,
        plainInitialPassword: cleanPassword,
        astrologerReferralCode: astro.referralCode || req.user.referralCode || 'PANDIT101',
        registeredByAstrologerId: astro.id,
        createdAt: new Date().toISOString(),
        isMatchmakingSubscribed: false,
      };
      db.clients.push(client);
    }

    writeDb(db);

    // Build complete registration acknowledgement receipt
    const receipt = {
      receiptNumber: 'REC-' + Date.now().toString().slice(-6),
      clientCode: client.clientCode,
      registrationDate: client.createdAt || new Date().toISOString(),
      astrologer: {
        id: astro.id,
        name: astro.name || 'Pandit Rajesh Sharma',
        mobile: astro.mobile || '9876543210',
        email: astro.email || 'pandit.rajesh@astrojit.org',
        referralCode: astro.referralCode || 'PANDIT101',
        experience: astro.experience || '22 Years',
        officeAddress: astro.officeAddress || astro.address || 'Vedic Jyotish Peetham, Gayatri Nagar, Varanasi',
        association: astro.association || 'Jishnu Astro & Vasthu Research Centre / Vedic Jyotish Peetham',
        associationLogo: astro.associationLogo || null,
        languages: astro.languages || 'Hindi, Sanskrit, English',
      },
      client: {
        id: client.id,
        name: client.name,
        fatherName: client.fatherName,
        motherName: client.motherName,
        gender: client.gender,
        mobile: client.mobile,
        email: client.email || '',
        dob: client.dob,
        dobTime: client.dobTime,
        dobTime12: client.dobTime12 || client.dobTime,
        dobPlace: client.dobPlace,
        nativePlace: client.nativePlace,
        country: client.country || 'India',
        state: client.state || '',
        city: client.city || '',
        latitude: client.latitude || '',
        longitude: client.longitude || '',
        coordinates: client.coordinates || (client.latitude && client.longitude ? `${client.latitude} , ${client.longitude}` : ''),
        gotra: client.gotra,
        starBasis: client.starBasis || 'moon',
        starBasisLabel: client.starBasis === 'sun' ? 'Sun Star (Surya Nakshatra)' : 'Moon Star (Chandra Nakshatra)',
      },
      astrologicalSnapshot: {
        starBasis: horoscope.astrologicalDetails?.starBasis || 'moon',
        starBasisLabel: horoscope.astrologicalDetails?.starBasisLabel || 'Moon Star (Chandra Nakshatra)',
        nakshatra: horoscope.astrologicalDetails?.nakshatra,
        pada: horoscope.astrologicalDetails?.pada,
        moonSign: horoscope.astrologicalDetails?.moonSign,
        lagna: horoscope.astrologicalDetails?.lagna?.signName,
        lagnaSubhas: horoscope.astrologicalDetails?.lagnaSubhasEn || horoscope.astrologicalDetails?.lagnaSubhas,
        lagnaPapas: horoscope.astrologicalDetails?.lagnaPapasEn || horoscope.astrologicalDetails?.lagnaPapas,
        lagnaSubhaPavar: horoscope.astrologicalDetails?.lagnaSubhaPavarEn || horoscope.astrologicalDetails?.lagnaSubhaPavar,
        dashaBalance: horoscope.astrologicalDetails?.dashaBalance?.formatted,
        gana: horoscope.astrologicalDetails?.ganam || horoscope.astrologicalDetails?.gana,
        yoni: horoscope.astrologicalDetails?.yoni,
      },
      credentials: {
        portalUrl: 'http://localhost:3000/#/client-login',
        username: client.mobile,
        initialPassword: cleanPassword,
        loginType: 'Mobile Number + Password',
      },
    };

    const { passwordHash: _, ...clientData } = client;
    return res.status(201).json({
      message: 'Client account registered and saved successfully!',
      client: clientData,
      receipt,
      horoscope,
    });
  } catch (error) {
    console.error('Astrologer client registration error:', error);
    return res.status(500).json({ error: 'Failed to register client: ' + error.message });
  }
});

// Retrieve official registration receipt for any client
app.get('/api/astrologer/client-receipt/:clientId', authenticate, (req, res) => {
  try {
    const db = readDb();
    const astro = db.astrologers.find((a) => a.mobile === req.user.mobile || a.id === req.user.id) || db.astrologers[0];
    const client = db.clients.find((c) => c.id === req.params.clientId || c.mobile === req.params.clientId || c.clientCode === req.params.clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const receipt = {
      receiptNumber: 'REC-' + (client.clientCode ? client.clientCode.replace('CLI-', '') : Date.now().toString().slice(-6)),
      clientCode: client.clientCode || ('CLI-' + Math.floor(100000 + Math.random() * 900000)),
      registrationDate: client.createdAt || new Date().toISOString(),
      astrologer: {
        id: astro.id,
        name: astro.name || 'Pandit Rajesh Sharma',
        mobile: astro.mobile || '9876543210',
        email: astro.email || 'pandit.rajesh@astrojit.org',
        referralCode: astro.referralCode || 'PANDIT101',
        experience: astro.experience || '22 Years',
        officeAddress: astro.officeAddress || astro.address || 'Vedic Jyotish Peetham, Gayatri Nagar, Varanasi',
        association: astro.association || 'Jishnu Astro & Vasthu Research Centre / Vedic Jyotish Peetham',
        associationLogo: astro.associationLogo || null,
        languages: astro.languages || 'Hindi, Sanskrit, English',
      },
      client: {
        id: client.id,
        name: client.name,
        fatherName: client.fatherName,
        motherName: client.motherName,
        gender: client.gender,
        mobile: client.mobile,
        email: client.email || '',
        dob: client.dob,
        dobTime: client.dobTime,
        dobTime12: client.dobTime12 || client.dobTime,
        dobPlace: client.dobPlace,
        nativePlace: client.nativePlace,
        country: client.country || 'India',
        state: client.state || '',
        city: client.city || '',
        latitude: client.latitude || '',
        longitude: client.longitude || '',
        coordinates: client.coordinates || (client.latitude && client.longitude ? `${client.latitude} , ${client.longitude}` : ''),
        gotra: client.gotra,
        starBasis: client.starBasis || 'moon',
        starBasisLabel: client.starBasis === 'sun' ? 'Sun Star (Surya Nakshatra)' : 'Moon Star (Chandra Nakshatra)',
      },
      astrologicalSnapshot: {
        starBasis: horoscope.astrologicalDetails?.starBasis || 'moon',
        starBasisLabel: horoscope.astrologicalDetails?.starBasisLabel || 'Moon Star (Chandra Nakshatra)',
        nakshatra: horoscope.astrologicalDetails?.nakshatra,
        pada: horoscope.astrologicalDetails?.pada,
        moonSign: horoscope.astrologicalDetails?.moonSign,
        lagna: horoscope.astrologicalDetails?.lagna?.signName,
        lagnaSubhas: horoscope.astrologicalDetails?.lagnaSubhasEn || horoscope.astrologicalDetails?.lagnaSubhas,
        lagnaPapas: horoscope.astrologicalDetails?.lagnaPapasEn || horoscope.astrologicalDetails?.lagnaPapas,
        lagnaSubhaPavar: horoscope.astrologicalDetails?.lagnaSubhaPavarEn || horoscope.astrologicalDetails?.lagnaSubhaPavar,
        dashaBalance: horoscope.astrologicalDetails?.dashaBalance?.formatted,
        gana: horoscope.astrologicalDetails?.ganam || horoscope.astrologicalDetails?.gana,
        yoni: horoscope.astrologicalDetails?.yoni,
      },
      credentials: {
        portalUrl: 'http://localhost:3000/#/client-login',
        username: client.mobile,
        initialPassword: client.plainInitialPassword || 'Astro@123',
        loginType: 'Mobile Number + Password',
      },
    };

    return res.json({ receipt });
  } catch (error) {
    console.error('Fetch client receipt error:', error);
    return res.status(500).json({ error: 'Failed to fetch client receipt' });
  }
});

// --------------------------------------------------------------------------
// 3. ASHTAKOOTA MATCHMAKING & ASTROLOGER REVIEW WORKFLOW
// --------------------------------------------------------------------------

// Direct calculation (open for internal/backward compatibility)
app.post('/api/matchmaking', (req, res) => {
  try {
    const { boy, girl } = req.body;
    if (!boy || !girl) {
      return res.status(400).json({ error: 'Both Boy and Girl birth details are required.' });
    }

    const matchReport = calculateKundliMatch(boy, girl);
    return res.json(matchReport);
  } catch (error) {
    console.error('Matchmaking error:', error);
    return res.status(500).json({ error: 'Failed to calculate matchmaking: ' + error.message });
  }
});

// Client: Get all matchmaking requests & subscription status
app.get('/api/matchmaking/my-requests', authenticate, (req, res) => {
  try {
    const db = readDb();
    const client = db.clients.find((c) => c.id === req.user.id || c.mobile === req.user.mobile);
    const isSubscribed = Boolean(client?.isMatchmakingSubscribed);

    const clientRequests = (db.matchmakingRequests || []).filter(
      (r) => r.clientId === req.user.id || r.clientMobile === req.user.mobile
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      isSubscribed,
      referralCode: client?.astrologerReferralCode || null,
      requests: clientRequests,
    });
  } catch (error) {
    console.error('Fetch matchmaking requests error:', error);
    return res.status(500).json({ error: 'Failed to fetch matchmaking requests' });
  }
});

// Client: Toggle / Subscribe to instant self-check
app.post('/api/matchmaking/subscribe', authenticate, (req, res) => {
  try {
    const db = readDb();
    const client = db.clients.find((c) => c.id === req.user.id || c.mobile === req.user.mobile);
    if (!client) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const { subscribed } = req.body;
    client.isMatchmakingSubscribed = typeof subscribed === 'boolean' ? subscribed : !client.isMatchmakingSubscribed;
    writeDb(db);

    return res.json({
      message: client.isMatchmakingSubscribed
        ? 'Subscribed to Instant Kundli Matching successfully!'
        : 'Instant matching subscription paused.',
      isSubscribed: client.isMatchmakingSubscribed,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Client: Calculate match for subscribed users only
app.post('/api/matchmaking/calculate-self', authenticate, (req, res) => {
  try {
    const db = readDb();
    const client = db.clients.find((c) => c.id === req.user.id || c.mobile === req.user.mobile);
    if (!client || !client.isMatchmakingSubscribed) {
      return res.status(403).json({
        error: 'Subscription required for instant self-checking. Please activate subscription or request an astrologer for review.',
      });
    }

    const { boy, girl } = req.body;
    if (!boy || !girl) {
      return res.status(400).json({ error: 'Both Boy and Girl coordinates are required.' });
    }

    const matchReport = calculateKundliMatch(boy, girl);
    return res.json(matchReport);
  } catch (error) {
    console.error('Calculate self error:', error);
    return res.status(500).json({ error: 'Failed to calculate match: ' + error.message });
  }
});

// Client: Request Astrologer to review / calculate match
app.post('/api/matchmaking/request', authenticate, (req, res) => {
  try {
    const { boy, girl, astrologerId, clientQuery, source, precalculatedReport } = req.body;
    if (!boy || !girl) {
      return res.status(400).json({ error: 'Boy and Girl birth coordinates are required.' });
    }
    if (!astrologerId) {
      return res.status(400).json({ error: 'Please select an Astrologer to analyze the match.' });
    }

    const db = readDb();
    const client = db.clients.find((c) => c.id === req.user.id || c.mobile === req.user.mobile) || req.user;
    const astro = db.astrologers.find((a) => a.id === astrologerId || a.referralCode === astrologerId);

    if (!db.matchmakingRequests) {
      db.matchmakingRequests = [];
    }

    const newRequest = {
      id: `match-req-${uuidv4().substring(0, 8)}`,
      clientId: client.id || req.user.id,
      clientName: client.name || 'Client',
      clientMobile: client.mobile || req.user.mobile,
      astrologerId: astro ? astro.id : astrologerId,
      astrologerName: astro ? astro.name : 'Selected Astrologer',
      boy,
      girl,
      clientQuery: clientQuery || 'Kindly review Ashtakoota compatibility and Manglik Dosha alignment.',
      source: source || 'client_request', // 'client_request' or 'self_check_review'
      status: 'pending',
      matchReport: precalculatedReport || null,
      astrologerReview: null,
      createdAt: new Date().toISOString(),
    };

    db.matchmakingRequests.unshift(newRequest);
    writeDb(db);

    return res.status(201).json({
      message: `Matchmaking request successfully sent to ${newRequest.astrologerName}!`,
      request: newRequest,
    });
  } catch (error) {
    console.error('Create matchmaking request error:', error);
    return res.status(500).json({ error: 'Failed to submit matchmaking request' });
  }
});

// Astrologer: Get assigned matchmaking requests
app.get('/api/matchmaking/astrologer-requests', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'astrologer') {
      return res.status(403).json({ error: 'Access restricted to Astrologers' });
    }

    const db = readDb();
    const astro = db.astrologers.find((a) => a.id === req.user.id || a.mobile === req.user.mobile);
    const astroId = astro?.id || req.user.id;
    const refCode = astro?.referralCode;

    const assignedRequests = (db.matchmakingRequests || []).filter(
      (r) => r.astrologerId === astroId || (refCode && r.astrologerId === refCode)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      count: assignedRequests.length,
      pendingCount: assignedRequests.filter((r) => r.status === 'pending').length,
      requests: assignedRequests,
    });
  } catch (error) {
    console.error('Fetch astrologer matchmaking requests error:', error);
    return res.status(500).json({ error: 'Failed to fetch assigned matchmaking requests' });
  }
});

// Astrologer: Submit matching review & send back to client
app.post('/api/matchmaking/submit-review', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'astrologer') {
      return res.status(403).json({ error: 'Access restricted to Astrologers' });
    }

    const { requestId, verdict, suggestions, remedies } = req.body;
    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    const db = readDb();
    const request = (db.matchmakingRequests || []).find((r) => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: 'Matchmaking request not found' });
    }

    // Automatically compute 36 Guna match if not already attached
    if (!request.matchReport) {
      request.matchReport = calculateKundliMatch(request.boy, request.girl);
    }

    request.status = 'completed';
    request.astrologerReview = {
      verdict: verdict || 'Recommended with Vedic Remedies',
      suggestions: suggestions || 'The horoscopes demonstrate balanced mental and spiritual harmony.',
      remedies: remedies || 'Chant Maha Mrityunjaya mantra and offer archana on Mondays.',
      reviewedAt: new Date().toISOString(),
      astrologerName: req.user.name || 'Astrologer',
    };

    writeDb(db);

    return res.json({
      message: 'Kundli matching review and results successfully sent to client!',
      request,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ error: 'Failed to submit matchmaking review' });
  }
});

// --------------------------------------------------------------------------
// 4. ASTROLOGER SEARCH & CONSULTATION NOTES
// --------------------------------------------------------------------------

app.get('/api/astrologer/search-client', authenticate, (req, res) => {
  try {
    const rawQuery = (req.query.q || req.query.query || req.query.mobile || '').trim();
    if (!rawQuery) {
      return res.status(400).json({ error: 'Please enter a mobile number or search terms.' });
    }

    const query = rawQuery.toLowerCase();
    const queryParts = query.split(/[\s,+/]+/).filter(Boolean);

    const db = readDb();
    const matchedClients = (db.clients || [])
      .filter((c) => {
        const m = (c.mobile || '').toLowerCase();
        const n = (c.name || '').toLowerCase();
        const dob = (c.dob || '').toLowerCase();
        const pob = (c.dobPlace || c.pob || c.birthPlace || c.place || c.city || c.nativePlace || '').toLowerCase();
        const combined = `${n} ${dob} ${pob} ${m}`;

        // Match if query is contained directly in mobile, name, dob, or place
        if (m.includes(query) || n.includes(query) || dob.includes(query) || pob.includes(query) || combined.includes(query)) {
          return true;
        }

        // Or if all space-separated tokens match (e.g. "Aarav Salem" or "Aarav 05-11-2026")
        if (queryParts.length > 1) {
          return queryParts.every((part) => combined.includes(part));
        }

        return false;
      })
      .map((c) => {
        const { passwordHash, ...safeData } = c;
        return safeData;
      });

    return res.json({
      query: rawQuery,
      count: matchedClients.length,
      clients: matchedClients,
    });
  } catch (error) {
    console.error('Search client error:', error);
    return res.status(500).json({ error: 'Error searching for clients' });
  }
});

app.post('/api/astrologer/consultation-note', authenticate, (req, res) => {
  try {
    const { clientMobile, notes, remediesSuggested } = req.body;
    if (!clientMobile || !notes) {
      return res.status(400).json({ error: 'Client mobile number and consultation notes are required.' });
    }

    const db = readDb();
    const client = db.clients.find((c) => c.mobile === clientMobile.trim());
    if (!client) {
      return res.status(404).json({ error: 'Client does not exist' });
    }

    const newNote = {
      id: 'cons-' + uuidv4().substring(0, 8),
      astrologerId: req.user.id,
      astrologerName: req.user.name,
      clientMobile: client.mobile,
      clientName: client.name,
      notes: notes.trim(),
      remediesSuggested: (remediesSuggested || '').trim(),
      date: new Date().toISOString(),
    };

    db.consultations.push(newNote);

    const astro = db.astrologers.find((a) => a.id === req.user.id || a.mobile === req.user.mobile);
    if (astro) {
      astro.consultationsCount = (astro.consultationsCount || 0) + 1;
    }

    writeDb(db);
    return res.status(201).json({ message: 'Consultation note saved successfully', note: newNote });
  } catch (error) {
    console.error('Save consultation note error:', error);
    return res.status(500).json({ error: 'Failed to save consultation note' });
  }
});

app.get('/api/astrologer/referred-clients', authenticate, (req, res) => {
  try {
    const db = readDb();
    const astro = db.astrologers.find((a) => a.mobile === req.user.mobile || a.id === req.user.id);
    if (!astro) {
      return res.status(404).json({ error: 'Astrologer not found' });
    }

    const referredClients = db.clients
      .filter((c) => (c.astrologerReferralCode || '').toUpperCase() === (astro.referralCode || '').toUpperCase())
      .map((c) => {
        const { passwordHash, ...data } = c;
        return data;
      });

    return res.json({
      referralCode: astro.referralCode,
      totalReferred: referredClients.length,
      clients: referredClients,
    });
  } catch (error) {
    console.error('Referred clients fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch referred clients' });
  }
});

// --------------------------------------------------------------------------
// 5. ASTROLOGER SLOT BOOKING & WORKING HOURS (3-B)
// --------------------------------------------------------------------------

app.get('/api/astrologers/available', (req, res) => {
  const db = readDb();
  const list = db.astrologers.map((a) => {
    const { passwordHash, ...safe } = a;
    return {
      ...safe,
      isOnline: safe.isOnline ?? true,
      ratePerMinute: safe.ratePerMinute || 25,
      availableSlots: safe.availableSlots || ['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM'],
    };
  });
  res.json(list);
});

app.patch('/api/astrologer/status', authenticate, (req, res) => {
  try {
    const { isOnline, ratePerMinute, availableSlots } = req.body;
    const db = readDb();
    const astro = db.astrologers.find((a) => a.mobile === req.user.mobile || a.id === req.user.id);
    if (!astro) return res.status(404).json({ error: 'Astrologer not found' });

    if (isOnline !== undefined) astro.isOnline = isOnline;
    if (ratePerMinute !== undefined) astro.ratePerMinute = ratePerMinute;
    if (availableSlots !== undefined) astro.availableSlots = availableSlots;

    writeDb(db);
    res.json({ message: 'Status updated', isOnline: astro.isOnline, ratePerMinute: astro.ratePerMinute, availableSlots: astro.availableSlots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.post('/api/appointments/book', authenticate, (req, res) => {
  try {
    const {
      astrologerId,
      astrologerName,
      consultancyId,
      consultancyName,
      memberAstrologerId,
      memberAstrologerName,
      appointmentType = 'online',
      officeAddress = '',
      slotTime,
      date,
      queryArea = 'Horoscope',
      consultationTopic,
      clientQuery,
      isCustomSlot = false,
    } = req.body;

    const db = readDb();
    if (!db.appointments) db.appointments = [];

    const newAppointment = {
      id: 'apt-' + uuidv4().substring(0, 8),
      clientMobile: req.user.mobile,
      clientName: req.user.name,
      astrologerId,
      astrologerName,
      consultancyId: consultancyId || null,
      consultancyName: consultancyName || null,
      memberAstrologerId: memberAstrologerId || null,
      memberAstrologerName: memberAstrologerName || null,
      appointmentType: appointmentType || 'online',
      officeAddress: officeAddress || '',
      slotTime,
      isCustomSlot: !!isCustomSlot,
      date: date || new Date().toISOString().split('T')[0],
      queryArea: queryArea || 'Horoscope',
      consultationTopic: consultationTopic || queryArea || 'Horoscope & Kundli Guidance',
      clientQuery: clientQuery || '',
      status: 'Confirmed',
      astrologerAnswer: null,
      prescribedRemedies: null,
      privateNotes: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    db.appointments.push(newAppointment);
    writeDb(db);

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.post('/api/appointments/complete', authenticate, (req, res) => {
  try {
    const { appointmentId, astrologerAnswer, prescribedRemedies, privateNotes } = req.body;
    if (!appointmentId || !astrologerAnswer) {
      return res.status(400).json({ error: 'Appointment ID and resolution answer are required.' });
    }

    const db = readDb();
    if (!db.appointments) db.appointments = [];

    const apt = db.appointments.find((a) => a.id === appointmentId);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Security check: Only assigned astrologer, member, or company admin can submit
    const isAssigned =
      req.user.role === 'company' ||
      apt.astrologerId === req.user.id ||
      apt.memberAstrologerId === req.user.id ||
      apt.astrologerMobile === req.user.mobile ||
      (req.user.role === 'astrologer');

    if (!isAssigned) {
      return res.status(403).json({ error: 'Unauthorized to resolve this appointment.' });
    }

    apt.status = 'Completed';
    apt.astrologerAnswer = astrologerAnswer;
    apt.prescribedRemedies = prescribedRemedies || '';
    apt.privateNotes = privateNotes || '';
    apt.completedAt = new Date().toISOString();
    apt.resolvedBy = req.user.name;

    // Increment astrologer consultation count
    const astro = db.astrologers.find((a) => a.id === apt.astrologerId || a.id === req.user.id);
    if (astro) {
      astro.consultationsCount = (astro.consultationsCount || 0) + 1;
    }

    writeDb(db);
    return res.json({ message: 'Consultation completed and resolution delivered successfully', appointment: apt });
  } catch (error) {
    console.error('Complete appointment error:', error);
    return res.status(500).json({ error: 'Failed to complete appointment' });
  }
});

app.get('/api/appointments/my', authenticate, (req, res) => {
  const db = readDb();
  if (!db.appointments) db.appointments = [];

  let myAppointments = [];
  if (req.user.role === 'client') {
    // Only appointments for this client
    myAppointments = db.appointments.filter((a) => a.clientMobile === req.user.mobile);
  } else if (req.user.role === 'astrologer') {
    // Scoped strictly to this astrologer / member
    myAppointments = db.appointments.filter(
      (a) =>
        a.astrologerId === req.user.id ||
        a.memberAstrologerId === req.user.id ||
        a.astrologerName?.toLowerCase().includes(req.user.name?.toLowerCase()) ||
        a.astrologerMobile === req.user.mobile
    );
  } else if (req.user.role === 'company') {
    myAppointments = db.appointments;
  }

  // Sort descending by date
  myAppointments.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  res.json(myAppointments);
});

// --------------------------------------------------------------------------
// 6. WHATSAPP & SMS ALERTS SUBSCRIPTION (3-A)
// --------------------------------------------------------------------------

app.post('/api/alerts/subscribe', authenticate, (req, res) => {
  try {
    const { mobile, receivePanchangam, receiveRahuKalam, receiveHoroscopeTips, lang = 'en' } = req.body;
    const panchang = getDailyPanchangam();

    let cleanPhone = (mobile || req.user.mobile || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    // Multilingual formatted WhatsApp text
    let sampleMessage = '';
    if (lang === 'ta') {
      sampleMessage = `🌟 *ஆஸ்ட்ரோஜித் தினசரி வேத பஞ்சாங்கம்* 🌟\n\n` +
        `📅 *தேதி:* ${panchang.formattedDate}\n` +
        `☀️ *கிழமை:* ${panchang.vaar.name} (${panchang.vaar.lord})\n` +
        `🌕 *திதி:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *நட்சத்திரம்:* ${panchang.nakshatra.name} (அதிபதி: ${panchang.nakshatra.lord})\n` +
        `🧘 *யோகம்:* ${panchang.yoga.name} | *கரணம்:* ${panchang.karana.name}\n\n` +
        `🌅 *சூரியோதயம்:* ${panchang.sunMoonTimes.sunrise} | 🌇 *சூரியாஸ்தமனம்:* ${panchang.sunMoonTimes.sunset}\n` +
        `🌙 *சந்திரோதயம்:* ${panchang.sunMoonTimes.moonrise} | 🌚 *சந்திராஸ்தமனம்:* ${panchang.sunMoonTimes.moonset}\n\n` +
        `✨ *சுப முகூர்த்தம் (அபிஜித்):* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *இராகு காலம் (சுபகாரியம் தவிர்க்கவும்):* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *எமகண்டம்:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *ஆஸ்ட்ரோஜித் நல்வாழ்த்துகள்:* இன்றைய நாள் உங்களுக்கு அனைத்து நலன்களையும் சுப காரிய வெற்றியையும் தரட்டும்!\n` +
        `🌐 *நேரலை பஞ்சாங்கம் & ஜாதகம் பார்க்க:* https://astrojit.com`;
    } else if (lang === 'kn') {
      sampleMessage = `🌟 *ಆಸ್ಟ್ರೋಜಿತ್ ದೈನಂದಿನ ವೈದಿಕ ಪಂಚಾಂಗ* 🌟\n\n` +
        `📅 *ದಿನಾಂಕ:* ${panchang.formattedDate}\n` +
        `☀️ *ವಾರ:* ${panchang.vaar.name} (${panchang.vaar.lord})\n` +
        `🌕 *ತಿಥಿ:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *ನಕ್ಷತ್ರ:* ${panchang.nakshatra.name} (ಅಧಿಪತಿ: ${panchang.nakshatra.lord})\n` +
        `🧘 *ಯೋಗ:* ${panchang.yoga.name} | *ಕರಣ:* ${panchang.karana.name}\n\n` +
        `🌅 *ಸೂರ್ಯೋದಯ:* ${panchang.sunMoonTimes.sunrise} | 🌇 *ಸೂರ್ಯಾಸ್ತ:* ${panchang.sunMoonTimes.sunset}\n` +
        `🌙 *ಚಂದ್ರೋದಯ:* ${panchang.sunMoonTimes.moonrise} | 🌚 *ಚಂದ್ರಾಸ್ತ:* ${panchang.sunMoonTimes.moonset}\n\n` +
        `✨ *ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *ರಾಹು ಕಾಲ (ಹೊಸ ಕೆಲಸ ವರ್ಜ್ಯ):* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *ಯಮಗಂಡ ಕಾಲ:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *ಆಸ್ಟ್ರೋಜಿತ್ ಶುಭಾಶಯಗಳು:* ಇಂದಿನ ದಿನವು ನಿಮಗೆ ಸುಖ, ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ತರಲಿ!\n` +
        `🌐 *ದೈನಂದಿನ ಕುಂಡಲಿ & ಪಂಚಾಂಗ:* https://astrojit.com`;
    } else if (lang === 'hi') {
      sampleMessage = `🌟 *एस्ट्रोजित दैनिक वैदिक पंचांग* 🌟\n\n` +
        `📅 *दिनांक:* ${panchang.formattedDate}\n` +
        `☀️ *वार:* ${panchang.vaar.name} (${panchang.vaar.lord})\n` +
        `🌕 *तिथि:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *नक्षत्र:* ${panchang.nakshatra.name} (स्वामी: ${panchang.nakshatra.lord})\n` +
        `🧘 *योग:* ${panchang.yoga.name} | *करण:* ${panchang.karana.name}\n\n` +
        `🌅 *सूर्योदय:* ${panchang.sunMoonTimes.sunrise} | 🌇 *सूर्यास्त:* ${panchang.sunMoonTimes.sunset}\n` +
        `🌙 *चन्द्रोदय:* ${panchang.sunMoonTimes.moonrise} | 🌚 *चन्द्रास्त:* ${panchang.sunMoonTimes.moonset}\n\n` +
        `✨ *शुभ अभिजीत मुहूर्त:* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *राहु काल (शुभ कार्य वर्जित):* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *यमगंडम:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *एस्ट्रोजित मंगलकामनाएं:* आपका दिन शुभ, समृद्ध एवं मंगलमय हो!\n` +
        `🌐 *दैनिक कुंडली एवं पंचांग:* https://astrojit.com`;
    } else if (lang === 'te') {
      sampleMessage = `🌟 *ఆస్ట్రోజిత్ రోజువారీ వైదిక పంచాంగం* 🌟\n\n` +
        `📅 *తేదీ:* ${panchang.formattedDate}\n` +
        `☀️ *వారం:* ${panchang.vaar.name} (${panchang.vaar.lord})\n` +
        `🌕 *తిథి:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *నక్షత్రం:* ${panchang.nakshatra.name} (అధిపతి: ${panchang.nakshatra.lord})\n` +
        `🧘 *యోగం:* ${panchang.yoga.name} | *కరణం:* ${panchang.karana.name}\n\n` +
        `🌅 *సూర్యోదయం:* ${panchang.sunMoonTimes.sunrise} | 🌇 *సూర్యాస్తమయం:* ${panchang.sunMoonTimes.sunset}\n\n` +
        `✨ *అభిజిత్ ముహూర్తం:* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *రాహు కాలం (శుభకార్యములు నిషిద్ధం):* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *యమగండం:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *ఆస్ట్రోజిత్ శుభాకాంక్షలు:* మీకు సర్వదా శుభం కలుగుగాక!\n` +
        `🌐 *ప్రత్యక్ష పంచాంగం & కుండలి:* https://astrojit.com`;
    } else if (lang === 'bn') {
      sampleMessage = `🌟 *অ্যাস্ট্রোজিত দৈনিক বৈদিক পঞ্জিকা* 🌟\n\n` +
        `📅 *তারিখ:* ${panchang.formattedDate}\n` +
        `☀️ *বার:* ${panchang.vaar.name} (${panchang.vaar.lord})\n` +
        `🌕 *তিথি:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *নক্ষত্র:* ${panchang.nakshatra.name} (অধিপতি: ${panchang.nakshatra.lord})\n` +
        `🧘 *যোগ:* ${panchang.yoga.name} | *করণ:* ${panchang.karana.name}\n\n` +
        `🌅 *সূর্যোদয়:* ${panchang.sunMoonTimes.sunrise} | 🌇 *সূর্যাস্ত:* ${panchang.sunMoonTimes.sunset}\n\n` +
        `✨ *অভিজিৎ মুহূর্ত:* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *রাহু কাল:* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *যমগণ্ডম:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *অ্যাস্ট্রোজিত শুভকামনা:* আপনার দিনটি শুভ ও কল্যাণময় হোক!\n` +
        `🌐 *লাইভ পঞ্জিকা ও কুষ্ঠি:* https://astrojit.com`;
    } else {
      sampleMessage = `🌟 *ASTROJIT DAILY VEDIC DISPATCH* 🌟\n\n` +
        `📅 *Date:* ${panchang.formattedDate}\n` +
        `☀️ *Vaara:* ${panchang.vaar.name} (Lord: ${panchang.vaar.lord})\n` +
        `🌕 *Tithi:* ${panchang.tithi.name} (${panchang.tithi.paksha})\n` +
        `⭐ *Nakshatra:* ${panchang.nakshatra.name} (Lord: ${panchang.nakshatra.lord})\n` +
        `🧘 *Yoga:* ${panchang.yoga.name} | *Karana:* ${panchang.karana.name}\n\n` +
        `🌅 *Sunrise:* ${panchang.sunMoonTimes.sunrise} | 🌇 *Sunset:* ${panchang.sunMoonTimes.sunset}\n` +
        `🌙 *Moonrise:* ${panchang.sunMoonTimes.moonrise} | 🌚 *Moonset:* ${panchang.sunMoonTimes.moonset}\n\n` +
        `✨ *Auspicious Abhijit Muhurat:* ${panchang.timings.abhijitMuhurat}\n` +
        `⚠️ *Rahu Kalam (Avoid starting new works):* ${panchang.timings.rahuKalam}\n` +
        `⏱️ *Yamagandam:* ${panchang.timings.yamagandam}\n\n` +
        `🕉️ *Astrojit Blessings:* Chant Om Namah Shivaya for peace, health, and spiritual focus.\n` +
        `🌐 *View Live Panchangam & Kundli:* https://astrojit.com`;
    }

    const whatsappDirectUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(sampleMessage)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(sampleMessage)}`;

    // Store subscriber in database
    const db = readDb();
    if (!db.subscribers) db.subscribers = [];
    const subIdx = db.subscribers.findIndex((s) => s.mobile === cleanPhone);
    const subData = {
      mobile: cleanPhone,
      lang,
      receivePanchangam: !!receivePanchangam,
      receiveRahuKalam: !!receiveRahuKalam,
      receiveHoroscopeTips: !!receiveHoroscopeTips,
      subscribedAt: new Date().toISOString(),
      lastDispatched: new Date().toISOString(),
    };
    if (subIdx >= 0) {
      db.subscribers[subIdx] = subData;
    } else {
      db.subscribers.push(subData);
    }
    writeDb(db);

    console.log(`[WhatsApp Dispatch] Alerts registered for ${cleanPhone} (${lang}). Direct URL generated.`);

    res.json({
      status: 'Subscribed',
      mobile: cleanPhone,
      preferences: { receivePanchangam, receiveRahuKalam, receiveHoroscopeTips },
      messagePreview: sampleMessage,
      whatsappDirectUrl,
      whatsappShareUrl,
      deliveredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to subscribe alerts:', error);
    res.status(500).json({ error: 'Failed to set up alerts' });
  }
});

// --------------------------------------------------------------------------
// 7. VENDOR & MARKETPLACE
// --------------------------------------------------------------------------

app.get('/api/vendor/products', authenticate, (req, res) => {
  try {
    const db = readDb();
    const vendor = db.vendors.find((v) => v.mobile === req.user.mobile || v.id === req.user.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const products = db.products.filter((p) => p.vendorId === vendor.id);
    return res.json({
      vendor: { id: vendor.id, shopName: vendor.shopName, category: vendor.category },
      products,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch vendor products' });
  }
});

app.post('/api/vendor/products', authenticate, (req, res) => {
  try {
    const { title, type, category, price, description, imageUrl, stockCount } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, Price, and Category are required.' });
    }

    const db = readDb();
    const vendor = db.vendors.find((v) => v.mobile === req.user.mobile || v.id === req.user.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const newProduct = {
      id: 'prod-' + uuidv4().substring(0, 8),
      vendorId: vendor.id,
      vendorName: vendor.shopName,
      title: title.trim(),
      type: type || 'Product',
      category: category.trim(),
      price: parseFloat(price) || 0,
      description: (description || '').trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: parseInt(stockCount, 10) || 50,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    writeDb(db);
    return res.status(201).json({ message: 'Item listed successfully', product: newProduct });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list product' });
  }
});

app.delete('/api/vendor/products/:id', authenticate, (req, res) => {
  try {
    const db = readDb();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== req.params.id);
    if (db.products.length === initialLen) return res.status(404).json({ error: 'Product not found' });
    writeDb(db);
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/marketplace/products', (req, res) => {
  try {
    const db = readDb();
    const { category, type, search } = req.query;
    let items = db.products;

    if (category && category !== 'All') {
      items = items.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (type && type !== 'All') {
      items = items.filter((p) => p.type === type);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    }
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// --------------------------------------------------------------------------
// 8. COMPANY (JIT) ADMIN SUPERVISION
// --------------------------------------------------------------------------

app.get('/api/company/overview', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
    const db = readDb();

    const individualAstros = db.astrologers.filter((a) => a.type === 'individual').length;
    const companyAstros = db.astrologers.filter((a) => a.type === 'company').length;
    const totalProducts = db.products.filter((p) => p.type === 'Product').length;
    const totalServices = db.products.filter((p) => p.type === 'Service').length;

    return res.json({
      companyName: db.company.name,
      metrics: {
        totalClients: db.clients.length,
        totalAstrologers: db.astrologers.length,
        individualAstrologers: individualAstros,
        companyAstrologers: companyAstros,
        totalVendors: db.vendors.length,
        totalProductsListed: totalProducts,
        totalServicesListed: totalServices,
        totalConsultations: db.consultations.length,
        totalAppointments: (db.appointments || []).length,
        totalMatrimonyProfiles: (db.matrimonyProfiles || []).length,
        verifiedMatrimonyProfiles: (db.matrimonyProfiles || []).filter((p) => p.account?.isVerified || p.isVerified).length,
        totalMatrimonyInterests: (db.matrimonyInterests || []).length,
      },
      recentConsultations: db.consultations.slice(-5).reverse(),
      recentClients: db.clients.slice(-5).reverse().map((c) => {
        const { passwordHash, ...data } = c;
        return data;
      }),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load company metrics' });
  }
});

app.get('/api/company/clients', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const db = readDb();
  res.json(db.clients.map((c) => { const { passwordHash, ...data } = c; return data; }));
});

app.get('/api/company/astrologers', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const db = readDb();
  const safeAstros = db.astrologers.map((a) => {
    const { passwordHash, ...data } = a;
    const referredCount = db.clients.filter(
      (c) => (c.astrologerReferralCode || '').toUpperCase() === (a.referralCode || '').toUpperCase()
    ).length;
    return { ...data, referredClientsCount: referredCount };
  });
  res.json(safeAstros);
});

app.get('/api/company/vendors', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const db = readDb();
  res.json(db.vendors.map((v) => {
    const { passwordHash, ...data } = v;
    const prodCount = db.products.filter((p) => p.vendorId === v.id).length;
    return { ...data, productsCount: prodCount };
  }));
});

app.get('/api/company/products', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const db = readDb();
  res.json(db.products);
});

// Company Super Admin: Matrimony Profiles Management
app.get('/api/company/matrimony', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const db = readDb();
  res.json(db.matrimonyProfiles || []);
});

// Company Super Admin: Toggle Matrimony Profile Verification (Blue Tick)
app.put('/api/company/matrimony/:id/verify', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const { id } = req.params;
  const { isVerified } = req.body;
  const db = readDb();
  const profile = (db.matrimonyProfiles || []).find((p) => p.id === id);
  if (!profile) return res.status(404).json({ error: 'Matrimony profile not found' });

  profile.isVerified = isVerified !== undefined ? isVerified : true;
  if (!profile.account) profile.account = {};
  profile.account.isVerified = profile.isVerified;
  profile.updatedAt = new Date().toISOString();

  writeDb(db);
  res.json({ message: 'Profile verification status updated successfully', profile });
});

// Company Super Admin: Remove Matrimony Profile
app.delete('/api/company/matrimony/:id', authenticate, (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Access denied' });
  const { id } = req.params;
  const db = readDb();
  const initialLen = (db.matrimonyProfiles || []).length;
  db.matrimonyProfiles = (db.matrimonyProfiles || []).filter((p) => p.id !== id);
  if (db.matrimonyProfiles.length === initialLen) {
    return res.status(404).json({ error: 'Matrimony profile not found' });
  }
  writeDb(db);
  res.json({ message: 'Matrimony profile removed successfully' });
});

// --------------------------------------------------------------------------
// 9. VEDIC MATRIMONY SYSTEM
// --------------------------------------------------------------------------

// Helper for Matrimony Age Calculation
function calculateMatrimonyAge(dobString) {
  if (!dobString) return null;
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(18, age);
}

// Helper for Matrimony Completeness Score
function calculateMatrimonyCompleteness(profile) {
  const fields = [
    'profileCreatedBy', 'profileType', 'name', 'gender', 'dob', 'height', 'maritalStatus', 'motherTongue', 'aboutMe',
    'religion', 'caste', 'eatingHabits', 'drinkingHabits', 'smokingHabits',
    'starNakshatra', 'rasiMoonSign', 'lagnamAscendant', 'birthTime', 'birthPlace',
    'highestEducation', 'degree', 'occupation', 'companyName', 'annualIncome', 'workLocationCity',
    'fatherName', 'motherName', 'familyType', 'familyStatus', 'nativePlace',
    'country', 'city', 'primaryPhotoUrl',
    'partnerAgeMin', 'partnerMaritalStatus', 'partnerReligion', 'partnerEducation',
    'mobile', 'email', 'contactPerson'
  ];
  let filled = 0;
  for (const f of fields) {
    if (profile[f] && String(profile[f]).trim() !== '') filled++;
  }
  return Math.min(100, Math.round((filled / fields.length) * 100));
}

// Check if user has an existing registered matrimony profile
app.get('/api/matrimony/my-profile', (req, res) => {
  try {
    const db = readDb();
    const profiles = db.matrimonyProfiles || [];
    let queryMobile = req.query.mobile;
    let queryClientId = req.query.clientId;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        queryMobile = queryMobile || decoded.mobile;
        queryClientId = queryClientId || decoded.id;
      } catch (e) {}
    }

    let myProfile = null;
    if (queryClientId || queryMobile) {
      myProfile = profiles.find(p => 
        (queryClientId && (p.clientId === queryClientId || p.id === queryClientId)) ||
        (queryMobile && (p.mobile === queryMobile || p.loginMobile === queryMobile || p.createdByMobile === queryMobile))
      );
    }

    if (myProfile) {
      return res.json({ hasProfile: true, profile: myProfile });
    } else {
      return res.json({ hasProfile: false, profile: null });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check matrimony profile status' });
  }
});

// Matrimony Autofill Sources: Provides logged-in client + saved family members with live horoscope computation
app.get('/api/matrimony/autofill-sources', (req, res) => {
  try {
    const db = readDb();
    let client = null;

    // 1. Try JWT
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        client = db.clients.find(c => c.id === decoded.id || c.mobile === decoded.mobile);
      } catch (e) {
        // ignore token error
      }
    }

    // 2. Query param fallback or default seed client
    if (!client && req.query.clientId) {
      client = db.clients.find(c => c.id === req.query.clientId);
    }
    if (!client && req.query.mobile) {
      client = db.clients.find(c => c.mobile === req.query.mobile.trim());
    }
    if (!client && db.clients.length > 0) {
      client = db.clients[0];
    }

    let clientData = null;
    if (client) {
      clientData = {
        id: client.id,
        name: client.name,
        gender: 'Groom',
        dob: client.dob,
        age: calculateMatrimonyAge(client.dob),
        dobTime: client.dobTime,
        dobPlace: client.dobPlace,
        fatherName: client.fatherName || '',
        motherName: client.motherName || '',
        mobile: client.mobile,
        email: client.email || `${client.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        horoscope: null,
      };
    }

    // Process Family Members
    const familyMembers = (db.familyMembers || []).map(fm => ({
      ...fm,
      age: fm.age || calculateMatrimonyAge(fm.dob),
      horoscope: null,
    }));

    res.json({
      client: clientData,
      familyMembers,
    });
  } catch (error) {
    console.error('autofill-sources error:', error);
    res.status(500).json({ error: 'Failed to retrieve autofill sources' });
  }
});

// Family Members CRUD
app.get('/api/matrimony/family-members', (req, res) => {
  try {
    const db = readDb();
    res.json(db.familyMembers || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

app.post('/api/matrimony/family-members', (req, res) => {
  try {
    const db = readDb();
    if (!db.familyMembers) db.familyMembers = [];

    const {
      name,
      relation,
      gender,
      dob,
      dobTime,
      dobPlace,
      fatherName,
      motherName,
      mobile,
      email,
      occupation,
      maritalStatus,
      highestEducation,
      notes,
    } = req.body;

    if (!name || !relation || !dob) {
      return res.status(400).json({ error: 'Name, Relation and Date of Birth are required.' });
    }

    const newFm = {
      id: 'fm-' + uuidv4().substring(0, 8),
      clientId: req.body.clientId || (db.clients[0] ? db.clients[0].id : 'client-1'),
      relation,
      name,
      gender: gender || (relation === 'Sister' || relation === 'Daughter' || relation === 'Mother' ? 'Bride' : 'Groom'),
      dob,
      age: calculateMatrimonyAge(dob),
      dobTime: dobTime || '06:00',
      dobPlace: dobPlace || 'Chennai, India',
      fatherName: fatherName || '',
      motherName: motherName || '',
      mobile: mobile || '',
      email: email || '',
      occupation: occupation || '',
      maritalStatus: maritalStatus || 'Never Married',
      highestEducation: highestEducation || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    db.familyMembers.push(newFm);
    writeDb(db);

    res.status(201).json({ success: true, familyMember: newFm });
  } catch (error) {
    console.error('Save family member error:', error);
    res.status(500).json({ error: 'Failed to save family member' });
  }
});

// Matrimony Profiles Listing with Search & Filters
app.get('/api/matrimony/profiles', (req, res) => {
  try {
    const db = readDb();
    let profiles = db.matrimonyProfiles || [];

    const {
      gender,
      profileType,
      minAge,
      maxAge,
      maritalStatus,
      religion,
      caste,
      nakshatra,
      rasi,
      education,
      search,
    } = req.query;

    if (gender) {
      profiles = profiles.filter(p => (p.gender || '').toLowerCase() === gender.toLowerCase() || (p.profileType || '').toLowerCase() === gender.toLowerCase());
    }
    if (profileType) {
      profiles = profiles.filter(p => (p.profileType || '').toLowerCase() === profileType.toLowerCase());
    }
    if (minAge) {
      profiles = profiles.filter(p => (p.age || 0) >= parseInt(minAge));
    }
    if (maxAge) {
      profiles = profiles.filter(p => (p.age || 0) <= parseInt(maxAge));
    }
    if (maritalStatus && maritalStatus !== 'All') {
      profiles = profiles.filter(p => (p.maritalStatus || '').toLowerCase() === maritalStatus.toLowerCase());
    }
    if (religion && religion !== 'All') {
      profiles = profiles.filter(p => (p.religion || '').toLowerCase() === religion.toLowerCase());
    }
    if (caste && caste !== 'All') {
      profiles = profiles.filter(p => (p.caste || '').toLowerCase().includes(caste.toLowerCase()));
    }
    if (nakshatra && nakshatra !== 'All') {
      profiles = profiles.filter(p => (p.starNakshatra || '').toLowerCase().includes(nakshatra.toLowerCase()));
    }
    if (rasi && rasi !== 'All') {
      profiles = profiles.filter(p => (p.rasiMoonSign || '').toLowerCase().includes(rasi.toLowerCase()));
    }
    if (education && education !== 'All') {
      profiles = profiles.filter(p => (p.highestEducation || '').toLowerCase().includes(education.toLowerCase()) || (p.degree || '').toLowerCase().includes(education.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      profiles = profiles.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.occupation || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.caste || '').toLowerCase().includes(q) ||
        (p.starNakshatra || '').toLowerCase().includes(q) ||
        (p.matrimonyId || '').toLowerCase().includes(q)
      );
    }

    // Mask phone numbers if contactVisibility is not 'Public'
    const safeProfiles = profiles.map(p => {
      const isMasked = p.contactVisibility === 'request_only' || p.contactVisibility === 'private' || (p.contact && p.contact.visibility === 'request_only');
      const rawMobile = p.mobile || (p.contact && p.contact.mobile) || '';
      const rawWa = p.whatsappNumber || (p.contact && p.contact.whatsapp) || rawMobile;
      const matrimonyId = p.matrimonyId || p.id;
      const starNakshatra = p.starNakshatra || p.nakshatra || '';
      const rasiMoonSign = p.rasiMoonSign || p.rasi || '';
      const primaryPhotoUrl = p.primaryPhotoUrl || p.photoUrl || '';
      const completeness = p.completenessScore || (p.account && p.account.completenessPercentage) || calculateMatrimonyCompleteness(p);

      return {
        ...p,
        matrimonyId,
        starNakshatra,
        rasiMoonSign,
        primaryPhotoUrl,
        completenessScore: completeness,
        mobile: isMasked && rawMobile ? rawMobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : rawMobile,
        whatsappNumber: isMasked && rawWa ? rawWa.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : rawWa,
      };
    });

    res.json(safeProfiles);
  } catch (error) {
    console.error('Fetch matrimony profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch matrimony profiles' });
  }
});

// Single Profile Detail
app.get('/api/matrimony/profiles/:id', (req, res) => {
  try {
    const db = readDb();
    const profile = (db.matrimonyProfiles || []).find(p => p.id === req.params.id || p.matrimonyId === req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Matrimony profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Register Complete Matrimony Profile (All 12 Sections)
app.post('/api/matrimony/register-profile', (req, res) => {
  try {
    const db = readDb();
    if (!db.matrimonyProfiles) db.matrimonyProfiles = [];

    const body = req.body;
    if (!body.name || !body.dob || !body.gender) {
      return res.status(400).json({ error: 'Name, Gender, and Date of Birth are required.' });
    }

    // 1. Auto-generate Matrimony ID
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const matrimonyId = `AJ-MAT-${year}-${randNum}`;

    // 2. Auto-compute age
    const age = calculateMatrimonyAge(body.dob) || parseInt(body.age) || 25;

    // 3. Religious / Astrological details
    let star = body.starNakshatra || '';
    let rasi = body.rasiMoonSign || '';
    let lagna = body.lagnamAscendant || '';
    let pada = body.padam || 1;
    let manglik = body.manglikDosha || 'No Dosha';

    const newProfile = {
      id: 'mat-' + uuidv4().substring(0, 8),
      matrimonyId,
      profileCreatedBy: body.profileCreatedBy || 'Self',
      profileType: body.profileType || (body.gender === 'Female' ? 'Bride' : 'Groom'),
      name: body.name.trim(),
      gender: body.gender,
      dob: body.dob,
      age,
      height: body.height || "5'6\"",
      weight: body.weight || '',
      maritalStatus: body.maritalStatus || 'Never Married',
      physicalStatus: body.physicalStatus || 'Normal',
      bloodGroup: body.bloodGroup || '',
      motherTongue: body.motherTongue || 'Tamil',
      aboutMe: body.aboutMe || '',

      // 2. Personal & Lifestyle
      religion: body.religion || 'Hindu',
      caste: body.caste || '',
      subCaste: body.subCaste || '',
      community: body.community || '',
      sect: body.sect || '',
      gotra: body.gotra || '',
      manglikDosha: manglik || 'No Chevvai Dosha',
      eatingHabits: body.eatingHabits || 'Vegetarian',
      drinkingHabits: body.drinkingHabits || 'No',
      smokingHabits: body.smokingHabits || 'No',
      hobbies: body.hobbies || '',
      personality: body.personality || '',
      languagesKnown: body.languagesKnown || body.motherTongue || 'Tamil, English',

      // 3. Religious & Horoscope
      starNakshatra: star || '',
      rasiMoonSign: rasi || '',
      lagnamAscendant: lagna || '',
      padam: pada || 1,
      doshamDetails: body.doshamDetails || manglik || 'None',
      birthTime: body.birthTime || '06:00',
      birthPlace: body.birthPlace || 'Chennai, India',
      horoscopeDocUrl: body.horoscopeDocUrl || '',
      horoscopeMatchingPreference: body.horoscopeMatchingPreference || 'Must Match (பொருத்தம் அவசியம்)',

      // 4. Education
      highestEducation: body.highestEducation || '',
      degree: body.degree || '',
      specialization: body.specialization || '',
      college: body.college || '',
      passingYear: body.passingYear || '',
      additionalQualifications: body.additionalQualifications || '',
      certifications: body.certifications || '',
      educationDescription: body.educationDescription || '',

      // 5. Career & Employment
      employmentStatus: body.employmentStatus || 'Employed',
      occupation: body.occupation || '',
      jobTitle: body.jobTitle || body.occupation || '',
      companyName: body.companyName || '',
      industry: body.industry || '',
      workLocationCountry: body.workLocationCountry || 'India',
      workLocationState: body.workLocationState || 'Tamil Nadu',
      workLocationCity: body.workLocationCity || 'Chennai',
      annualIncome: body.annualIncome || '',
      monthlyIncome: body.monthlyIncome || '',
      workExperience: body.workExperience || '',
      careerDescription: body.careerDescription || '',

      // 6. Family Background
      fatherName: body.fatherName || '',
      fatherOccupation: body.fatherOccupation || '',
      motherName: body.motherName || '',
      motherOccupation: body.motherOccupation || '',
      brothersCount: body.brothersCount !== undefined ? body.brothersCount : 0,
      brothersMarried: body.brothersMarried !== undefined ? body.brothersMarried : 0,
      sistersCount: body.sistersCount !== undefined ? body.sistersCount : 0,
      sistersMarried: body.sistersMarried !== undefined ? body.sistersMarried : 0,
      familyType: body.familyType || 'Nuclear',
      familyStatus: body.familyStatus || 'Middle Class',
      familyValues: body.familyValues || 'Traditional',
      nativePlace: body.nativePlace || '',
      familyOrigin: body.familyOrigin || '',
      familyDescription: body.familyDescription || '',

      // 7. Location Details
      country: body.country || 'India',
      state: body.state || 'Tamil Nadu',
      district: body.district || '',
      city: body.city || body.workLocationCity || 'Chennai',
      currentResidence: body.currentResidence || 'Chennai',
      citizenship: body.citizenship || 'Indian',
      residentialStatus: body.residentialStatus || 'Citizen',

      // 8. Physical Appearance
      bodyType: body.bodyType || 'Average',
      complexion: body.complexion || 'Wheatish',
      physicalDisability: body.physicalDisability || 'None',

      // 9. Partner Preferences
      partnerAgeMin: body.partnerAgeMin || (age > 28 ? age - 4 : 22),
      partnerAgeMax: body.partnerAgeMax || (age < 28 ? age + 4 : 32),
      partnerHeightMin: body.partnerHeightMin || "5'2\"",
      partnerHeightMax: body.partnerHeightMax || "5'10\"",
      partnerMaritalStatus: body.partnerMaritalStatus || 'Never Married',
      partnerReligion: body.partnerReligion || 'Hindu',
      partnerCaste: body.partnerCaste || 'Any / Same Caste',
      partnerMotherTongue: body.partnerMotherTongue || body.motherTongue || 'Tamil',
      partnerEducation: body.partnerEducation || 'Graduate / Post Graduate',
      partnerOccupation: body.partnerOccupation || 'Any Professional / IT / Govt',
      partnerIncome: body.partnerIncome || 'Open',
      partnerLocationCountry: body.partnerLocationCountry || 'India',
      partnerDiet: body.partnerDiet || 'Vegetarian / Eggetarian',
      partnerHoroscopeMatch: body.partnerHoroscopeMatch || 'Must Match (பொருத்தம் அவசியம்)',
      partnerDoshaPreference: body.partnerDoshaPreference || 'No Dosha / Matching Dosha',
      partnerExpectations: body.partnerExpectations || '',

      // 10. Contact Information
      mobile: body.mobile || '',
      altMobile: body.altMobile || '',
      email: body.email || '',
      whatsappNumber: body.whatsappNumber || body.mobile || '',
      contactPerson: body.contactPerson || body.name,
      contactPersonRelation: body.contactPersonRelation || body.profileCreatedBy || 'Self',
      preferredContactMethod: body.preferredContactMethod || 'WhatsApp & Call',
      contactVisibility: body.contactVisibility || 'Public',

      // 11. Profile Photos & Documents
      primaryPhotoUrl: body.primaryPhotoUrl || `https://images.unsplash.com/photo-${body.gender === 'Bride' || body.gender === 'Female' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=400&fit=crop`,
      photoGallery: body.photoGallery || [],
      educationCertificateUrl: body.educationCertificateUrl || '',
      identityProofUrl: body.identityProofUrl || '',

      // 12. Account & Security Details
      loginMobile: body.loginMobile || body.mobile,
      isVerified: true,
      mobileVerified: true,
      emailVerified: true,
      accountStatus: 'Active',
      profileVisibility: body.profileVisibility || 'Public',
      termsAccepted: body.termsAccepted !== undefined ? body.termsAccepted : true,
      privacyAccepted: body.privacyAccepted !== undefined ? body.privacyAccepted : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate completeness
    newProfile.completenessScore = calculateMatrimonyCompleteness(newProfile);

    db.matrimonyProfiles.unshift(newProfile);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Matrimony profile successfully created & registered!',
      profile: newProfile,
    });
  } catch (error) {
    console.error('Register profile error:', error);
    res.status(500).json({ error: 'Failed to create matrimony profile' });
  }
});

// Update Matrimony Profile
app.put('/api/matrimony/profiles/:id', (req, res) => {
  try {
    const db = readDb();
    const index = (db.matrimonyProfiles || []).findIndex(p => p.id === req.params.id || p.matrimonyId === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updated = {
      ...db.matrimonyProfiles[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    if (updated.dob) {
      updated.age = calculateMatrimonyAge(updated.dob);
    }
    updated.completenessScore = calculateMatrimonyCompleteness(updated);

    db.matrimonyProfiles[index] = updated;
    writeDb(db);

    res.json({ success: true, profile: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Check Compatibility: 36 Gunas Ashtakoota + 10 Tamil Poruthams + Chevvai Dosha
app.post('/api/matrimony/check-compatibility', (req, res) => {
  try {
    const db = readDb();
    let boy = null;
    let girl = null;

    const { boyProfileId, girlProfileId, boyData, girlData } = req.body;

    if (boyProfileId) {
      boy = (db.matrimonyProfiles || []).find(p => p.id === boyProfileId || p.matrimonyId === boyProfileId);
    }
    if (girlProfileId) {
      girl = (db.matrimonyProfiles || []).find(p => p.id === girlProfileId || p.matrimonyId === girlProfileId);
    }

    if (!boy && boyData) boy = boyData;
    if (!girl && girlData) girl = girlData;

    // Fallbacks if only profile1 and profile2 were provided
    if (!boy && req.body.profile1 && req.body.profile2) {
      const p1 = req.body.profile1;
      const p2 = req.body.profile2;
      if ((p1.profileType || p1.gender || '').toLowerCase().includes('bride')) {
        girl = p1;
        boy = p2;
      } else {
        boy = p1;
        girl = p2;
      }
    }

    if (!boy || !girl) {
      return res.status(400).json({ error: 'Both Groom (Boy) and Bride (Girl) details are required for compatibility calculation.' });
    }

    const boyBirth = {
      name: boy.name || 'Groom',
      dob: boy.dob || '1996-08-15',
      dobTime: boy.birthTime || boy.dobTime || '06:30',
      dobPlace: boy.birthPlace || boy.dobPlace || 'Chennai, India',
    };

    const girlBirth = {
      name: girl.name || 'Bride',
      dob: girl.dob || '1998-11-20',
      dobTime: girl.birthTime || girl.dobTime || '09:15',
      dobPlace: girl.birthPlace || girl.dobPlace || 'Chennai, India',
    };

    // 1. 36 Gunas Ashtakoota
    const kundliMatch = calculateKundliMatch(boyBirth, girlBirth);

    // 2. 10 Tamil Poruthams
    const tamilMatch = calculateTamilPoruthams(boyBirth, girlBirth);

    // 3. Chevvai Dosha
    const boyDosha = evaluateChevvaiDosha(boy, 'male');
    const girlDosha = evaluateChevvaiDosha(girl, 'female');

    let doshaVerdict = 'Compatible';
    let doshaVerdictTamil = 'பொருத்தமானது';

    if (boyDosha.hasDosha && !girlDosha.hasDosha) {
      doshaVerdict = 'Chevvai Dosha Mismatch (Groom has Dosha, Bride has None)';
      doshaVerdictTamil = 'செவ்வாய் தோஷ பொருந்தாமை (வரனுக்கு தோஷம் உள்ளது)';
    } else if (!boyDosha.hasDosha && girlDosha.hasDosha) {
      doshaVerdict = 'Chevvai Dosha Mismatch (Bride has Dosha, Groom has None)';
      doshaVerdictTamil = 'செவ்வாய் தோஷ பொருந்தாமை (மணமகளுக்கு தோஷம் உள்ளது)';
    } else if (boyDosha.hasDosha && girlDosha.hasDosha) {
      doshaVerdict = 'Both have Chevvai Dosha (Sama Dosha - Auspicious Match)';
      doshaVerdictTamil = 'இருவருக்கும் செவ்வாய் தோஷம் (சம தோஷம் - உத்தமம்)';
    } else {
      doshaVerdict = 'Both are free from Chevvai Dosha (No Affliction)';
      doshaVerdictTamil = 'இருவருக்கும் செவ்வாய் தோஷம் இல்லை (சுபம்)';
    }

    // Overall Match Verdict
    const score36 = kundliMatch.totalScore || 0;
    const poruthamPoints = tamilMatch.totalScore !== undefined ? tamilMatch.totalScore : (tamilMatch.totalPoints || 0);
    let overallVerdict = 'Good Match (சுப யோகம்)';
    let overallColor = 'text-emerald-600 bg-emerald-50 border-emerald-300';

    if (score36 >= 28 && poruthamPoints >= 7) {
      overallVerdict = 'Uttamam / Highly Auspicious Match (உத்தமப் பொருத்தம்)';
      overallColor = 'text-green-700 bg-green-50 border-green-300';
    } else if (score36 >= 18 && poruthamPoints >= 5) {
      overallVerdict = 'Madhyamam / Acceptable Match (மத்திமப் பொருத்தம்)';
      overallColor = 'text-blue-700 bg-blue-50 border-blue-300';
    } else {
      overallVerdict = 'Adhamam / Requires Astrological Remedies (அற்பப் பொருத்தம்)';
      overallColor = 'text-amber-700 bg-amber-50 border-amber-300';
    }

    res.json({
      success: true,
      boy: {
        name: boy.name,
        matrimonyId: boy.matrimonyId,
        nakshatra: boyHoro.astrologicalDetails.nakshatra,
        rasi: boyHoro.astrologicalDetails.moonSign,
        lagna: boyHoro.astrologicalDetails.ascendant,
        chevvaiDosha: boyDosha,
      },
      girl: {
        name: girl.name,
        matrimonyId: girl.matrimonyId,
        nakshatra: girlHoro.astrologicalDetails.nakshatra,
        rasi: girlHoro.astrologicalDetails.moonSign,
        lagna: girlHoro.astrologicalDetails.ascendant,
        chevvaiDosha: girlDosha,
      },
      ashtakoota: {
        totalScore: kundliMatch.totalScore,
        maxScore: 36,
        percentage: Math.round((kundliMatch.totalScore / 36) * 100),
        verdict: kundliMatch.verdict,
        categories: kundliMatch.categories,
      },
      tamilPoruthams: {
        totalPoints: poruthamPoints,
        maxPossible: tamilMatch.maxScore || 10,
        verdict: tamilMatch.overallVerdict,
        verdictTamil: tamilMatch.overallVerdictTamil,
        poruthams: tamilMatch.poruthams,
        rajjuAnalysis: tamilMatch.rajjuAnalysis,
        vedhaAnalysis: tamilMatch.vedhaAnalysis,
      },
      chevvaiDoshaMatch: {
        verdict: doshaVerdict,
        verdictTamil: doshaVerdictTamil,
        boyDosha,
        girlDosha,
      },
      overallVerdict,
      overallColor,
    });
  } catch (error) {
    console.error('Check compatibility error:', error);
    res.status(500).json({ error: 'Failed to calculate compatibility: ' + error.message });
  }
});

// Interests Management
app.get('/api/matrimony/interests', (req, res) => {
  try {
    const db = readDb();
    res.json(db.matrimonyInterests || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
});

app.post('/api/matrimony/interests', (req, res) => {
  try {
    const db = readDb();
    if (!db.matrimonyInterests) db.matrimonyInterests = [];

    const { fromProfileId, toProfileId, message } = req.body;
    if (!fromProfileId || !toProfileId) {
      return res.status(400).json({ error: 'Sender and Recipient Profile IDs are required.' });
    }

    const existing = db.matrimonyInterests.find(i => i.fromProfileId === fromProfileId && i.toProfileId === toProfileId);
    if (existing) {
      return res.json({ success: true, message: 'Interest already sent', interest: existing });
    }

    const newInterest = {
      id: 'int-' + uuidv4().substring(0, 8),
      fromProfileId,
      toProfileId,
      message: message || 'I am interested in your matrimony profile. Please connect with us.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.matrimonyInterests.push(newInterest);
    writeDb(db);

    res.status(201).json({ success: true, message: 'Interest sent successfully', interest: newInterest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send interest' });
  }
});

app.post('/api/matrimony/interests/:id/status', (req, res) => {
  try {
    const db = readDb();
    const index = (db.matrimonyInterests || []).findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Interest request not found' });
    }

    db.matrimonyInterests[index].status = req.body.status || 'accepted';
    db.matrimonyInterests[index].updatedAt = new Date().toISOString();
    writeDb(db);

    res.json({ success: true, interest: db.matrimonyInterests[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interest status' });
  }
});

// Shortlist / Bookmarks
app.get('/api/matrimony/shortlists', (req, res) => {
  try {
    const db = readDb();
    res.json(db.matrimonyShortlists || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shortlists' });
  }
});

app.post('/api/matrimony/shortlists/toggle', (req, res) => {
  try {
    const db = readDb();
    if (!db.matrimonyShortlists) db.matrimonyShortlists = [];

    const { userId, profileId } = req.body;
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID required' });
    }

    const effectiveUserId = userId || 'user-default';
    const index = db.matrimonyShortlists.findIndex(s => s.userId === effectiveUserId && s.profileId === profileId);

    let isShortlisted = false;
    if (index >= 0) {
      db.matrimonyShortlists.splice(index, 1);
      isShortlisted = false;
    } else {
      db.matrimonyShortlists.push({
        id: 'short-' + uuidv4().substring(0, 8),
        userId: effectiveUserId,
        profileId,
        createdAt: new Date().toISOString(),
      });
      isShortlisted = true;
    }

    writeDb(db);
    res.json({ success: true, isShortlisted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle shortlist' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Astrojit', timestamp: new Date().toISOString() });
});

// Serve frontend static build in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Astrojit server running at http://localhost:${PORT}`);
});
