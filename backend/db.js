/**
 * Astrojit Persistent File Database
 * Stores clients, astrologers, vendors, company admin, products, and consultations
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'astrojit_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB Schema (Production - Strictly only jit_admin, no demo data)
const defaultDb = {
  clients: [],
  astrologers: [],
  vendors: [],
  company: {
    username: 'jit_admin',
    name: 'Astrojit Technologies (JIT)',
    mobile: 'jit_admin',
    email: 'admin@astrojit.com',
    role: 'company',
    passwordHash: bcrypt.hashSync('Jishnuinfotech@123', 8),
  },
  products: [],
  consultations: [],
  matchmakingRequests: [],
  appointments: [],
  subscribers: [],
  familyMembers: [],
  matrimonyProfiles: [],
  matrimonyInterests: [],
  matrimonyShortlists: [],
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultDb);
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.matchmakingRequests) parsed.matchmakingRequests = [];
    if (!parsed.matrimonyProfiles) parsed.matrimonyProfiles = [];
    if (!parsed.familyMembers) parsed.familyMembers = [];
    if (!parsed.matrimonyInterests) parsed.matrimonyInterests = [];
    if (!parsed.matrimonyShortlists) parsed.matrimonyShortlists = [];
    if (!parsed.appointments) parsed.appointments = [];
    if (!parsed.subscribers) parsed.subscribers = [];
    if (!parsed.clients) parsed.clients = [];
    if (!parsed.astrologers) parsed.astrologers = [];
    if (!parsed.vendors) parsed.vendors = [];
    if (!parsed.products) parsed.products = [];
    if (!parsed.consultations) parsed.consultations = [];
    return parsed;
  } catch (err) {
    console.error('Error reading DB:', err);
    return defaultDb;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

function seedInitialData() {
  const db = readDb();
  let modified = false;

  // 1. Enforce Company Admin credentials: jit_admin / Jishnuinfotech@123
  if (!db.company) {
    db.company = {
      username: 'jit_admin',
      name: 'Astrojit Technologies (JIT)',
      mobile: 'jit_admin',
      email: 'admin@astrojit.com',
      role: 'company',
      passwordHash: bcrypt.hashSync('Jishnuinfotech@123', 8),
    };
    modified = true;
  } else {
    if (db.company.username !== 'jit_admin') {
      db.company.username = 'jit_admin';
      db.company.mobile = 'jit_admin';
      modified = true;
    }
    if (!bcrypt.compareSync('Jishnuinfotech@123', db.company.passwordHash)) {
      db.company.passwordHash = bcrypt.hashSync('Jishnuinfotech@123', 8);
      modified = true;
    }
  }

  // 2. Ensure all collections exist as arrays, but NEVER wipe existing client or user data!
  const collections = [
    'clients', 'astrologers', 'vendors', 'products', 'consultations',
    'matchmakingRequests', 'appointments', 'subscribers', 'familyMembers',
    'matrimonyProfiles', 'matrimonyInterests', 'matrimonyShortlists'
  ];

  for (const col of collections) {
    if (!Array.isArray(db[col])) {
      db[col] = [];
      modified = true;
    }
  }

  if (modified) {
    writeDb(db);
  }
}

// Initial check & seed on load
readDb();
seedInitialData();

module.exports = {
  readDb,
  writeDb,
  seedInitialData,
};
