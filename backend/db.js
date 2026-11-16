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

// Initial DB Schema
const defaultDb = {
  clients: [],
  astrologers: [],
  vendors: [],
  company: {
    name: 'Astrojit Technologies (JIT)',
    mobile: '9999999999',
    email: 'admin@astrojit.com',
    role: 'company',
    passwordHash: bcrypt.hashSync('admin123', 8),
  },
  products: [],
  consultations: [],
  matchmakingRequests: [],
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultDb);
      seedInitialData();
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.matchmakingRequests) {
      parsed.matchmakingRequests = [];
    }
    if (!parsed.matrimonyProfiles) {
      parsed.matrimonyProfiles = [];
    }
    if (!parsed.familyMembers) {
      parsed.familyMembers = [];
    }
    if (!parsed.matrimonyInterests) {
      parsed.matrimonyInterests = [];
    }
    if (!parsed.matrimonyShortlists) {
      parsed.matrimonyShortlists = [];
    }
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
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

  // Seed sample astrologers if empty
  if (db.astrologers.length === 0) {
    const salt = bcrypt.genSaltSync(8);
    db.astrologers = [
      {
        id: 'astro-1',
        type: 'individual',
        name: 'Pandit Rajesh Sharma',
        mobile: '9876543210',
        passwordHash: bcrypt.hashSync('astro123', salt),
        address: '14, Gayatri Nagar, Sector 4, Varanasi, UP',
        specializations: ['Vedic Astrology', 'Kundli Analysis', 'Muhurat & Remedies'],
        experience: '22 Years',
        languages: 'Hindi, Sanskrit, English',
        bio: 'Senior Vedic Astrologer certified from Sampurnanand Sanskrit Vishwavidyalaya, specializing in career progression and planetary dosha nivaran.',
        referralCode: 'PANDIT101',
        verified: true,
        rating: 4.9,
        consultationsCount: 148,
        createdAt: '2026-01-15T10:00:00.000Z',
      },
      {
        id: 'astro-2',
        type: 'company',
        name: 'AstroVeda Consultancy LLP',
        contactPerson: 'Dr. Meenakshi Sundaram',
        mobile: '9845012345',
        passwordHash: bcrypt.hashSync('astro123', salt),
        address: 'Plot 42, Temple Road, Malleshwaram, Bengaluru, Karnataka',
        gstNumber: '29ABCDE1234F1Z5',
        specializations: ['Vastu Shastra', 'KP System', 'Corporate Astrology', 'Gemstone Recommendation'],
        experience: '18 Years',
        languages: 'Kannada, Tamil, English, Telugu',
        bio: 'Premier astrology consultancy firm providing institutional and personalized predictive analysis with ancient astrological methodologies.',
        referralCode: 'ASTROVEDA',
        verified: true,
        rating: 4.8,
        consultationsCount: 320,
        createdAt: '2026-02-10T11:30:00.000Z',
      },
    ];
  }

  // Seed sample clients
  if (db.clients.length === 0) {
    const salt = bcrypt.genSaltSync(8);
    db.clients = [
      {
        id: 'client-1',
        name: 'Aarav Kumar Sharma',
        fatherName: 'Vikram Sharma',
        motherName: 'Sunita Sharma',
        dob: '1996-08-15',
        dobTime: '06:30',
        dobPlace: 'New Delhi, India',
        mobile: '9123456789',
        passwordHash: bcrypt.hashSync('client123', salt),
        astrologerReferralCode: 'PANDIT101',
        createdAt: '2026-02-20T14:20:00.000Z',
      },
      {
        id: 'client-2',
        name: 'Pooja Iyer',
        fatherName: 'Narayanan Iyer',
        motherName: 'Lakshmi Iyer',
        dob: '1998-11-23',
        dobTime: '17:45',
        dobPlace: 'Chennai, Tamil Nadu',
        mobile: '9345678901',
        passwordHash: bcrypt.hashSync('client123', salt),
        astrologerReferralCode: 'ASTROVEDA',
        createdAt: '2026-03-01T09:15:00.000Z',
      },
    ];
  }

  // Seed sample vendors
  if (db.vendors.length === 0) {
    const salt = bcrypt.genSaltSync(8);
    db.vendors = [
      {
        id: 'vendor-1',
        shopName: 'Shree Kashi Divine Samagri & Gems',
        contactPerson: 'Suresh Agarwal',
        mobile: '9811223344',
        passwordHash: bcrypt.hashSync('vendor123', salt),
        address: 'Shop 12, Dashashwamedh Ghat Marg',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221001',
        gstNumber: '09AAECR4567M1ZV',
        category: 'Puja Samagri & Gemstones',
        upiId: 'sureshkashi@upi',
        verified: true,
        createdAt: '2026-01-20T08:00:00.000Z',
      },
      {
        id: 'vendor-2',
        shopName: 'MahaYagna Vedic Rituals & Services',
        contactPerson: 'Acharya Vidyadhar',
        mobile: '9765432109',
        passwordHash: bcrypt.hashSync('vendor123', salt),
        address: '88, Agrahara Street, Srirangam',
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        pincode: '620006',
        gstNumber: '33AABCV9876P1ZH',
        category: 'Pooja & Homam Services',
        upiId: 'mahayagna@upi',
        verified: true,
        createdAt: '2026-02-05T12:00:00.000Z',
      },
    ];
  }

  // Seed sample products & services
  if (db.products.length === 0) {
    db.products = [
      {
        id: 'prod-1',
        vendorId: 'vendor-1',
        vendorName: 'Shree Kashi Divine Samagri & Gems',
        title: 'Authentic 5-Mukhi Nepali Rudraksha Mala (108 Beads)',
        type: 'Product',
        category: 'Rudraksha & Gemstones',
        price: 1899,
        description: 'Certified natural Himalayan 5-Mukhi Rudraksha with silver capping, energized at Kashi Vishwanath temple for peace, health, and spiritual focus.',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        stockCount: 45,
        rating: 4.9,
        createdAt: '2026-02-25T10:00:00.000Z',
      },
      {
        id: 'prod-2',
        vendorId: 'vendor-1',
        vendorName: 'Shree Kashi Divine Samagri & Gems',
        title: 'Complete Navagraha Shanti Puja Samagri Kit',
        type: 'Product',
        category: 'Puja Samagri',
        price: 1250,
        description: 'Premium organic kit including 9 planetary cloths, samidha woods, pure cow ghee, camphor, dhoop, navadhanya grains, and copper yantra plate.',
        imageUrl: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        stockCount: 120,
        rating: 4.8,
        createdAt: '2026-02-26T11:00:00.000Z',
      },
      {
        id: 'prod-3',
        vendorId: 'vendor-2',
        vendorName: 'MahaYagna Vedic Rituals & Services',
        title: 'Maha Mrityunjaya Homam & Jaap (11,000 Chants)',
        type: 'Service',
        category: 'Pooja Services',
        price: 5100,
        description: 'Conducted by experienced Vedic Pandits with Sankalpa in client name for long life, alleviation of severe health afflictions, and planetary peace.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        stockCount: 999,
        rating: 5.0,
        createdAt: '2026-03-02T15:00:00.000Z',
      },
      {
        id: 'prod-4',
        vendorId: 'vendor-2',
        vendorName: 'MahaYagna Vedic Rituals & Services',
        title: 'Shani Sade Sati Nivaran Puja with Sesame Oil Archana',
        type: 'Service',
        category: 'Pooja Services',
        price: 3500,
        description: 'Special remedial archana performed on Saturdays at sacred shrine with Shani Tailabhishekam and Black Urad daal offering.',
        imageUrl: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        stockCount: 999,
        rating: 4.9,
        createdAt: '2026-03-03T16:00:00.000Z',
      },
    ];
  }

  // Seed sample consultations
  if (db.consultations.length === 0) {
    db.consultations = [
      {
        id: 'cons-1',
        astrologerId: 'astro-1',
        astrologerName: 'Pandit Rajesh Sharma',
        clientMobile: '9123456789',
        clientName: 'Aarav Kumar Sharma',
        notes: 'Client consulted regarding career transition and job offer from abroad. Lagna lord Sun is well placed in Leo 1st house. Favorable Jupiter transit in 9th house indicates high likelihood of relocation after October.',
        remediesSuggested: 'Offer Arghya (water) with red sandalwood powder to Surya Dev every morning. Wear 5-Mukhi Rudraksha. Chant Aditya Hridaya Stotra on Sundays.',
        date: '2026-03-05T11:00:00.000Z',
      },
    ];
  }

  writeDb(db);
}

// Initial check & seed
readDb();

module.exports = {
  readDb,
  writeDb,
  seedInitialData,
};
