# Astrojit (JIT) - Multi-Role Vedic Astrology Platform

**Astrojit** is a Vedic Astrology and Spiritual Commerce web platform with role-based access for:
1. **Clients (End Users)**
2. **Astrologers (Individual & Firms)**
3. **Vendors (Puja Samagri & Sacred Rituals)**
4. **Company (JIT Super Admin)**

---

## 🌟 Key Features Built According to Specification

### 1. Client Registration & Portal
* **Registration Fields:** Full Name, Father's Name, Mother's Name, D.O.B (Date of Birth), D.O.B Time, D.O.B Place, Mobile Number (as username), Password, Astrologer Referral Code.
* **Daily Panchangam:** Real-time calculation of the 5 Angas: Tithi (with paksha & percentage), Vaara (weekday & deity), Nakshatra & Pada, Yoga, and Karana. Plus Auspicious Muhurats (Abhijit, Brahma, Amrit) and Inauspicious Periods (Rahu Kalam, Yamagandam, Gulika Kalam, Dur Muhurat).
* **Certified One-Page Janma Kundli (Horoscope):** Dynamically generated using the client's registered birth details:
  - North Indian Diamond Kundli Chart
  - Navagraha Planetary Positions table (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu with Degrees, Houses, Dignity & Retrograde motion)
  - Vimshottari Mahadasha balance calculation at birth
  - Manglik Dosha Analysis
  - Core predictions (Personality, Career, Wealth, Health & Remedies)
  * Auspicious elements (Lucky Gemstone, Auspicious Color, Lucky Number, Deity)
  - Dedicated **Print / Save PDF** styling for official one-page export.
* **Spiritual Marketplace:** Browse and order authentic puja items, energized gemstones, rudraksha, and sacred ritual services.

### 2. Astrologer Portal (Individual & Company)
* **Registration:**
  - **Individual Astrologer:** Name, Mobile (username), Address, Experience, Specializations, Languages, Bio.
  - **Company / Firm:** Firm Name, Contact Person, Mobile (username), Address, Registration/GSTIN, Specializations, Bio.
* **Referral Code System:** Unique practitioner code (e.g. `PANDIT101`, `ASTROVEDA`) generated automatically. Tracks clients who registered using their code.
* **Client Search by Mobile Number:** Astrologers can search any client's mobile number, view matching records, and click to inspect their complete birth dossier & One-Page Kundli.
* **Consultation Notes & Remedial Prescriptions:** Astrologers can log consultations, remedies, and gemstone advice directly to the client's record.

### 3. Vendor Portal
* **Registration:** Shop Name, Contact Person, Mobile (username), Business Address, City, State, Pincode, GSTIN / MSME Reg, Category, and UPI / Bank details.
* **Catalog Management:** Add and manage physical products (Puja Samagri, Gemstones, Rudraksha, Yantras, Books) and booking for sacred ritual services (Homam, Jaap, Archana) with live pricing and stock status.

### 4. Company (JIT Admin) Portal
* Super Admin governance dashboard:
  - High-level KPIs: Total Clients, Astrologers, Vendors, Marketplace Listings, and Consultations.
  - **Client Management:** View all user records, birth parameters, and inspect their generated Kundli charts.
  - **Astrologer Management:** Overview of Individual vs Firm practitioners, verification badges, and referral performance.
  - **Vendor Management:** Verify shops, view inventory depth and payout details.
  - **Marketplace Master:** Platform-wide catalog oversight.

---

## 🚀 Running the Platform

### Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Pre-Configured Demo Credentials for Testing

| Role | Mobile / Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Client** | `9123456789` | `client123` | Aarav Sharma (Full Kundli generated) |
| **Astrologer (Individual)** | `9876543210` | `astro123` | Pandit Rajesh Sharma (Referral: `PANDIT101`) |
| **Astrologer (Company)** | `9845012345` | `astro123` | AstroVeda Consultancy LLP (Referral: `ASTROVEDA`) |
| **Vendor** | `9811223344` | `vendor123` | Shree Kashi Divine Samagri & Gems |
| **Company (JIT Admin)** | `9999999999` | `admin123` | Super Admin / Central Oversight |

*(You can also use the 1-click **"Switch Demo Role"** dropdown button in the header at any time!)*
