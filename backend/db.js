/**
 * Astrojit Database Adapter
 * Supports PostgreSQL via DATABASE_URL with seamless in-memory cache and write-through persistence.
 * Also provides automatic fallback to local persistent JSON file (astrojit_db.json) if DATABASE_URL is not set.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = process.env.DATABASE_FILE || (process.env.DATABASE_URL && process.env.DATABASE_URL.endsWith('.json') ? path.resolve(process.env.DATABASE_URL) : path.join(DATA_DIR, 'astrojit_db.json'));

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

const defaultCompanyAdmin = {
  id: 'company-jit',
  username: 'jit_admin',
  name: 'Astrojit Technologies (JIT)',
  mobile: 'jit_admin',
  email: 'admin@astrojit.com',
  role: 'company',
  adminLevel: 'super_admin',
  isPrimaryRoot: true,
  status: 'active',
  passwordHash: bcrypt.hashSync('Jishnuinfotech@123', 8),
  createdBy: 'system',
};

// Initial DB Schema (Production - Strictly only jit_admin root super admin, no demo data)
const defaultDb = {
  clients: [],
  astrologers: [],
  vendors: [],
  company: { ...defaultCompanyAdmin },
  companyAdmins: [{ ...defaultCompanyAdmin }],
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

const COLLECTIONS = [
  'company',
  'companyAdmins',
  'clients',
  'astrologers',
  'vendors',
  'products',
  'consultations',
  'matchmakingRequests',
  'appointments',
  'subscribers',
  'familyMembers',
  'matrimonyProfiles',
  'matrimonyInterests',
  'matrimonyShortlists',
];

// In-memory working cache
let memoryDb = null;
let pool = null;
let isPgConnected = false;
let pgConnectionError = null;

// Determine if PostgreSQL DATABASE_URL is provided
const rawDbUrl = process.env.DATABASE_URL || '';
const isPostgresUrl = rawDbUrl.startsWith('postgres://') || rawDbUrl.startsWith('postgresql://');

if (isPostgresUrl) {
  const isLocalhost = rawDbUrl.includes('localhost') || rawDbUrl.includes('127.0.0.1');
  pool = new Pool({
    connectionString: rawDbUrl,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL] Unexpected pool client error:', err.message);
  });
}

/**
 * Reads local JSON file as backup or initial bootstrap
 */
function readLocalFileDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      for (const col of COLLECTIONS) {
        if (col === 'company') {
          if (!parsed.company) parsed.company = { ...defaultDb.company };
        } else if (!Array.isArray(parsed[col])) {
          parsed[col] = [];
        }
      }
      return parsed;
    }
  } catch (err) {
    console.warn('[DB] Error reading local JSON fallback:', err.message);
  }
  return JSON.parse(JSON.stringify(defaultDb));
}

/**
 * Writes local JSON file as backup
 */
function writeLocalFileDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing local JSON backup:', err.message);
  }
}

/**
 * Initializes database connection, creates tables if missing, and hydrates memory cache.
 */
async function initDb() {
  // Always initialize memoryDb with local file first for immediate availability
  if (!memoryDb) {
    memoryDb = readLocalFileDb();
  }

  if (!pool) {
    console.log('[DB] No PostgreSQL DATABASE_URL detected. Running on persistent local storage:', DB_FILE);
    seedInitialData();
    return true;
  }

  console.log('[PostgreSQL] Connecting to database specified in DATABASE_URL...');
  try {
    const client = await pool.connect();
    try {
      // 1. Create storage table if it does not exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS astrojit_store (
          key VARCHAR(100) PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Fetch existing records
      const res = await client.query('SELECT key, data FROM astrojit_store;');
      if (res.rows && res.rows.length > 0) {
        // Hydrate from PostgreSQL
        const pgData = {};
        for (const row of res.rows) {
          pgData[row.key] = row.data;
        }

        for (const col of COLLECTIONS) {
          if (pgData[col] !== undefined) {
            memoryDb[col] = pgData[col];
          } else if (memoryDb[col] === undefined) {
            memoryDb[col] = col === 'company' ? { ...defaultDb.company } : [];
          }
        }
        console.log(`[PostgreSQL] Successfully loaded ${res.rows.length} collections from PostgreSQL store.`);
      } else {
        // First run on new PostgreSQL database: seed existing local data to PostgreSQL
        console.log('[PostgreSQL] astrojit_store is empty. Migrating local data to PostgreSQL...');
        for (const col of COLLECTIONS) {
          const val = memoryDb[col] !== undefined ? memoryDb[col] : (col === 'company' ? defaultDb.company : []);
          await client.query(`
            INSERT INTO astrojit_store (key, data, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
          `, [col, JSON.stringify(val)]);
        }
        console.log('[PostgreSQL] Migration of local data to PostgreSQL complete.');
      }

      isPgConnected = true;
      pgConnectionError = null;
      console.log('[PostgreSQL] Connected and synchronized successfully via DATABASE_URL.');
    } finally {
      client.release();
    }
  } catch (err) {
    isPgConnected = false;
    pgConnectionError = err.message;
    console.error('[PostgreSQL] Connection failed:', err.message);
    console.log('[PostgreSQL] Falling back to local file storage for continuity.');
  }

  seedInitialData();
  return isPgConnected;
}

/**
 * Synchronous readDb for zero-refactor compatibility with server.js endpoints
 */
function readDb() {
  if (!memoryDb) {
    memoryDb = readLocalFileDb();
  }
  for (const col of COLLECTIONS) {
    if (col === 'company') {
      if (!memoryDb.company) memoryDb.company = { ...defaultDb.company };
    } else if (!Array.isArray(memoryDb[col])) {
      memoryDb[col] = [];
    }
  }
  return memoryDb;
}

// Write debounce queue to avoid hammering PostgreSQL
let saveTimeout = null;
let pendingCollections = new Set();

/**
 * Synchronous writeDb with instant memory update + async PostgreSQL persistence
 */
function writeDb(data) {
  memoryDb = data;
  writeLocalFileDb(data);

  if (pool && isPgConnected) {
    for (const col of COLLECTIONS) {
      if (data[col] !== undefined) {
        pendingCollections.add(col);
      }
    }

    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(flushPendingToPostgres, 100);
  }
}

async function flushPendingToPostgres() {
  if (!pool || !isPgConnected || pendingCollections.size === 0) return;
  const colsToSave = Array.from(pendingCollections);
  pendingCollections.clear();

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const col of colsToSave) {
        const val = memoryDb[col];
        if (val !== undefined) {
          await client.query(`
            INSERT INTO astrojit_store (key, data, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
          `, [col, JSON.stringify(val)]);
        }
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[PostgreSQL] Error writing collections to PostgreSQL:', err.message);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[PostgreSQL] Failed to acquire client for saving:', err.message);
  }
}

/**
 * Ensures company admin and required arrays are initialized
 */
function seedInitialData() {
  const db = readDb();
  let modified = false;

  // 1. Enforce root Company Super Admin credentials: jit_admin / Jishnuinfotech@123
  if (!db.company) {
    db.company = { ...defaultCompanyAdmin };
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
    if (db.company.adminLevel !== 'super_admin' || !db.company.id || !db.company.isPrimaryRoot) {
      db.company.id = 'company-jit';
      db.company.adminLevel = 'super_admin';
      db.company.isPrimaryRoot = true;
      db.company.status = 'active';
      modified = true;
    }
  }

  // 2. Ensure companyAdmins collection exists and contains primary root super admin
  if (!Array.isArray(db.companyAdmins)) {
    db.companyAdmins = [];
    modified = true;
  }

  const rootIdx = db.companyAdmins.findIndex(
    (a) => a && (a.id === 'company-jit' || a.isPrimaryRoot || String(a.username || '').toLowerCase() === 'jit_admin')
  );
  if (rootIdx === -1) {
    db.companyAdmins.unshift({
      ...db.company,
      id: 'company-jit',
      role: 'company',
      adminLevel: 'super_admin',
      isPrimaryRoot: true,
      status: 'active',
      createdAt: db.company.createdAt || new Date().toISOString(),
    });
    modified = true;
  } else {
    const existingRoot = db.companyAdmins[rootIdx];
    const mergedRoot = {
      ...db.company,
      ...existingRoot,
      id: 'company-jit',
      username: 'jit_admin',
      mobile: 'jit_admin',
      role: 'company',
      adminLevel: 'super_admin',
      isPrimaryRoot: true,
      status: 'active',
      passwordHash: db.company.passwordHash,
    };
    if (JSON.stringify(existingRoot) !== JSON.stringify(mergedRoot)) {
      db.companyAdmins[rootIdx] = mergedRoot;
      modified = true;
    }
  }

  // Normalize any other admin entries missing defaults
  db.companyAdmins = db.companyAdmins.map((a, idx) => {
    const level = a.adminLevel === 'super_admin' ? 'super_admin' : 'admin';
    const normStatus = a.status === 'disabled' ? 'disabled' : 'active';
    const nextId = a.id || `company-admin-${idx + 1}`;
    if (a.role !== 'company' || a.adminLevel !== level || a.status !== normStatus || a.id !== nextId) {
      modified = true;
      return { ...a, id: nextId, role: 'company', adminLevel: level, status: normStatus };
    }
    return a;
  });

  // 3. Ensure all collections exist as arrays
  for (const col of COLLECTIONS) {
    if (col !== 'company' && !Array.isArray(db[col])) {
      db[col] = [];
      modified = true;
    }
  }

  if (modified) {
    writeDb(db);
  }
}

// Initial bootstrap
readDb();
initDb().catch((e) => console.error('[DB] Initial bootstrap error:', e));

module.exports = {
  readDb,
  writeDb,
  initDb,
  seedInitialData,
  pool,
  isPgConnected: () => isPgConnected,
  getPgStatus: () => ({
    configured: isPostgresUrl,
    connected: isPgConnected,
    error: pgConnectionError,
    activeCollections: COLLECTIONS.length,
    dbFile: DB_FILE
  })
};
