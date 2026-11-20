/**
 * Geographic Database for Vedic Horoscope Ephemeris Calculations
 * Provides Countries -> States/Provinces -> Cities with exact Latitude, Longitude, and Timezone
 * Covers all 28 States of India + 8 Union Territories + Major International Astrology Centers
 */

export const COUNTRIES = [
  {
    "code": "IN",
    "name": "India",
    "defaultState": "Tamil Nadu",
    "defaultCity": "Hosur"
  },
  {
    "code": "US",
    "name": "United States",
    "defaultState": "California",
    "defaultCity": "San Francisco"
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "defaultState": "England",
    "defaultCity": "London"
  },
  {
    "code": "CA",
    "name": "Canada",
    "defaultState": "Ontario",
    "defaultCity": "Toronto"
  },
  {
    "code": "AU",
    "name": "Australia",
    "defaultState": "New South Wales",
    "defaultCity": "Sydney"
  },
  {
    "code": "SG",
    "name": "Singapore",
    "defaultState": "Singapore",
    "defaultCity": "Singapore"
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "defaultState": "Federal Territory",
    "defaultCity": "Kuala Lumpur"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "defaultState": "Dubai",
    "defaultCity": "Dubai"
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "defaultState": "Western Province",
    "defaultCity": "Colombo"
  },
  {
    "code": "DE",
    "name": "Germany",
    "defaultState": "Berlin",
    "defaultCity": "Berlin"
  },
  {
    "code": "FR",
    "name": "France",
    "defaultState": "Île-de-France",
    "defaultCity": "Paris"
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "defaultState": "Zurich",
    "defaultCity": "Zurich"
  },
  {
    "code": "JP",
    "name": "Japan",
    "defaultState": "Kanto",
    "defaultCity": "Tokyo"
  }
];

export const GEO_DATA = {
  "India": {
    "Tamil Nadu": [
      {
        "name": "Ariyalur",
        "lat": "11° 08' N",
        "lon": "79° 05' E",
        "latDec": 11.1401,
        "lonDec": 79.0786,
        "tz": "+05:30"
      },
      {
        "name": "Chengalpattu",
        "lat": "12° 41' N",
        "lon": "79° 59' E",
        "latDec": 12.6841,
        "lonDec": 79.9836,
        "tz": "+05:30"
      },
      {
        "name": "Chennai",
        "lat": "13° 05' N",
        "lon": "80° 16' E",
        "latDec": 13.0827,
        "lonDec": 80.2707,
        "tz": "+05:30"
      },
      {
        "name": "Chidambaram",
        "lat": "11° 24' N",
        "lon": "79° 42' E",
        "latDec": 11.3992,
        "lonDec": 79.6936,
        "tz": "+05:30"
      },
      {
        "name": "Coimbatore",
        "lat": "11° 01' N",
        "lon": "76° 57' E",
        "latDec": 11.0168,
        "lonDec": 76.9558,
        "tz": "+05:30"
      },
      {
        "name": "Cuddalore",
        "lat": "11° 45' N",
        "lon": "79° 46' E",
        "latDec": 11.748,
        "lonDec": 79.7714,
        "tz": "+05:30"
      },
      {
        "name": "Dharmapuri",
        "lat": "12° 07' N",
        "lon": "78° 09' E",
        "latDec": 12.1211,
        "lonDec": 78.1582,
        "tz": "+05:30"
      },
      {
        "name": "Dindigul",
        "lat": "10° 22' N",
        "lon": "77° 59' E",
        "latDec": 10.3673,
        "lonDec": 77.9803,
        "tz": "+05:30"
      },
      {
        "name": "Erode",
        "lat": "11° 20' N",
        "lon": "77° 43' E",
        "latDec": 11.341,
        "lonDec": 77.7172,
        "tz": "+05:30"
      },
      {
        "name": "Hosur",
        "lat": "12° 43' 30\" N",
        "lon": "77° 49' 30\" E",
        "latDec": 12.725,
        "lonDec": 77.825,
        "tz": "+05:30"
      },
      {
        "name": "Kallakurichi",
        "lat": "11° 44' N",
        "lon": "78° 58' E",
        "latDec": 11.7384,
        "lonDec": 78.9639,
        "tz": "+05:30"
      },
      {
        "name": "Kanchipuram",
        "lat": "12° 50' N",
        "lon": "79° 42' E",
        "latDec": 12.8342,
        "lonDec": 79.7036,
        "tz": "+05:30"
      },
      {
        "name": "Karur",
        "lat": "10° 58' N",
        "lon": "78° 05' E",
        "latDec": 10.9601,
        "lonDec": 78.0766,
        "tz": "+05:30"
      },
      {
        "name": "Krishnagiri",
        "lat": "12° 31' N",
        "lon": "78° 13' E",
        "latDec": 12.5186,
        "lonDec": 78.2137,
        "tz": "+05:30"
      },
      {
        "name": "Kumbakonam",
        "lat": "10° 58' N",
        "lon": "79° 23' E",
        "latDec": 10.9602,
        "lonDec": 79.3845,
        "tz": "+05:30"
      },
      {
        "name": "Madurai",
        "lat": "09° 56' N",
        "lon": "78° 07' E",
        "latDec": 9.9252,
        "lonDec": 78.1198,
        "tz": "+05:30"
      },
      {
        "name": "Mayiladuthurai",
        "lat": "11° 06' N",
        "lon": "79° 39' E",
        "latDec": 11.1075,
        "lonDec": 79.6522,
        "tz": "+05:30"
      },
      {
        "name": "Nagapattinam",
        "lat": "10° 46' N",
        "lon": "79° 51' E",
        "latDec": 10.7672,
        "lonDec": 79.8449,
        "tz": "+05:30"
      },
      {
        "name": "Nagercoil / Kanyakumari",
        "lat": "08° 11' N",
        "lon": "77° 25' E",
        "latDec": 8.1833,
        "lonDec": 77.4119,
        "tz": "+05:30"
      },
      {
        "name": "Namakkal",
        "lat": "11° 13' N",
        "lon": "78° 10' E",
        "latDec": 11.2189,
        "lonDec": 78.1674,
        "tz": "+05:30"
      },
      {
        "name": "Palani",
        "lat": "10° 27' N",
        "lon": "77° 31' E",
        "latDec": 10.4503,
        "lonDec": 77.5197,
        "tz": "+05:30"
      },
      {
        "name": "Perambalur",
        "lat": "11° 14' N",
        "lon": "78° 53' E",
        "latDec": 11.2342,
        "lonDec": 78.8816,
        "tz": "+05:30"
      },
      {
        "name": "Pudukkottai",
        "lat": "10° 23' N",
        "lon": "78° 49' E",
        "latDec": 10.3797,
        "lonDec": 78.8208,
        "tz": "+05:30"
      },
      {
        "name": "Ramanathapuram",
        "lat": "09° 22' N",
        "lon": "78° 50' E",
        "latDec": 9.3639,
        "lonDec": 78.8395,
        "tz": "+05:30"
      },
      {
        "name": "Rameswaram",
        "lat": "09° 17' N",
        "lon": "79° 19' E",
        "latDec": 9.2876,
        "lonDec": 79.3129,
        "tz": "+05:30"
      },
      {
        "name": "Ranipet",
        "lat": "12° 55' N",
        "lon": "79° 20' E",
        "latDec": 12.9224,
        "lonDec": 79.3328,
        "tz": "+05:30"
      },
      {
        "name": "Salem",
        "lat": "11° 39' N",
        "lon": "78° 08' E",
        "latDec": 11.6643,
        "lonDec": 78.146,
        "tz": "+05:30"
      },
      {
        "name": "Samayapuram",
        "lat": "10° 56' N",
        "lon": "78° 44' E",
        "latDec": 10.9255,
        "lonDec": 78.7402,
        "tz": "+05:30"
      },
      {
        "name": "Sankagiri",
        "lat": "11° 28' N",
        "lon": "77° 52' E",
        "latDec": 11.482,
        "lonDec": 77.871,
        "tz": "+05:30"
      },
      {
        "name": "Sivaganga",
        "lat": "09° 51' N",
        "lon": "78° 29' E",
        "latDec": 9.8433,
        "lonDec": 78.4809,
        "tz": "+05:30"
      },
      {
        "name": "Sivakasi",
        "lat": "09° 27' N",
        "lon": "77° 48' E",
        "latDec": 9.4533,
        "lonDec": 77.7946,
        "tz": "+05:30"
      },
      {
        "name": "Srirangam",
        "lat": "10° 52' N",
        "lon": "78° 42' E",
        "latDec": 10.8624,
        "lonDec": 78.6917,
        "tz": "+05:30"
      },
      {
        "name": "Swamimalai",
        "lat": "10° 57' N",
        "lon": "79° 20' E",
        "latDec": 10.9575,
        "lonDec": 79.3276,
        "tz": "+05:30"
      },
      {
        "name": "Tenkasi",
        "lat": "08° 58' N",
        "lon": "77° 19' E",
        "latDec": 8.9594,
        "lonDec": 77.315,
        "tz": "+05:30"
      },
      {
        "name": "Thanjavur",
        "lat": "10° 47' N",
        "lon": "79° 08' E",
        "latDec": 10.787,
        "lonDec": 79.1378,
        "tz": "+05:30"
      },
      {
        "name": "Theni",
        "lat": "10° 01' N",
        "lon": "77° 29' E",
        "latDec": 10.0104,
        "lonDec": 77.4768,
        "tz": "+05:30"
      },
      {
        "name": "Thiruchendur",
        "lat": "08° 30' N",
        "lon": "78° 08' E",
        "latDec": 8.4967,
        "lonDec": 78.1257,
        "tz": "+05:30"
      },
      {
        "name": "Thirunallar",
        "lat": "10° 56' N",
        "lon": "79° 47' E",
        "latDec": 10.9298,
        "lonDec": 79.7891,
        "tz": "+05:30"
      },
      {
        "name": "Thiruparankundram",
        "lat": "09° 53' N",
        "lon": "78° 04' E",
        "latDec": 9.8821,
        "lonDec": 78.0719,
        "tz": "+05:30"
      },
      {
        "name": "Thoothukudi (Tuticorin)",
        "lat": "08° 46' N",
        "lon": "78° 08' E",
        "latDec": 8.7642,
        "lonDec": 78.1348,
        "tz": "+05:30"
      },
      {
        "name": "Tiruchirappalli (Trichy)",
        "lat": "10° 47' N",
        "lon": "78° 42' E",
        "latDec": 10.7905,
        "lonDec": 78.7047,
        "tz": "+05:30"
      },
      {
        "name": "Tirunelveli",
        "lat": "08° 43' N",
        "lon": "77° 45' E",
        "latDec": 8.7139,
        "lonDec": 77.7567,
        "tz": "+05:30"
      },
      {
        "name": "Tirupathur",
        "lat": "12° 30' N",
        "lon": "78° 34' E",
        "latDec": 12.4958,
        "lonDec": 78.5678,
        "tz": "+05:30"
      },
      {
        "name": "Tiruppur",
        "lat": "11° 07' N",
        "lon": "77° 20' E",
        "latDec": 11.1085,
        "lonDec": 77.3411,
        "tz": "+05:30"
      },
      {
        "name": "Tiruttani",
        "lat": "13° 11' N",
        "lon": "79° 37' E",
        "latDec": 13.1783,
        "lonDec": 79.6106,
        "tz": "+05:30"
      },
      {
        "name": "Tiruvallur",
        "lat": "13° 09' N",
        "lon": "79° 54' E",
        "latDec": 13.1433,
        "lonDec": 79.9083,
        "tz": "+05:30"
      },
      {
        "name": "Tiruvannamalai",
        "lat": "12° 14' N",
        "lon": "79° 04' E",
        "latDec": 12.2253,
        "lonDec": 79.0747,
        "tz": "+05:30"
      },
      {
        "name": "Tiruvarur",
        "lat": "10° 46' N",
        "lon": "79° 38' E",
        "latDec": 10.7725,
        "lonDec": 79.6365,
        "tz": "+05:30"
      },
      {
        "name": "Udhagamandalam (Ooty)",
        "lat": "11° 25' N",
        "lon": "76° 42' E",
        "latDec": 11.4102,
        "lonDec": 76.695,
        "tz": "+05:30"
      },
      {
        "name": "Vaitheeswaran Koil",
        "lat": "11° 12' N",
        "lon": "79° 43' E",
        "latDec": 11.2025,
        "lonDec": 79.7128,
        "tz": "+05:30"
      },
      {
        "name": "Velankanni",
        "lat": "10° 41' N",
        "lon": "79° 51' E",
        "latDec": 10.6805,
        "lonDec": 79.8431,
        "tz": "+05:30"
      },
      {
        "name": "Vellore",
        "lat": "12° 55' N",
        "lon": "79° 08' E",
        "latDec": 12.9165,
        "lonDec": 79.1325,
        "tz": "+05:30"
      },
      {
        "name": "Viluppuram",
        "lat": "11° 56' N",
        "lon": "79° 29' E",
        "latDec": 11.9401,
        "lonDec": 79.4861,
        "tz": "+05:30"
      },
      {
        "name": "Virudhunagar",
        "lat": "09° 35' N",
        "lon": "77° 57' E",
        "latDec": 9.5872,
        "lonDec": 77.9579,
        "tz": "+05:30"
      }
    ],
    "Karnataka": [
      {
        "name": "Bagalkot",
        "lat": "16° 11' N",
        "lon": "75° 42' E",
        "latDec": 16.1817,
        "lonDec": 75.6958,
        "tz": "+05:30"
      },
      {
        "name": "Bangalore (Bengaluru)",
        "lat": "12° 58' N",
        "lon": "77° 35' E",
        "latDec": 12.9716,
        "lonDec": 77.5946,
        "tz": "+05:30"
      },
      {
        "name": "Belgaum (Belagavi)",
        "lat": "15° 51' N",
        "lon": "74° 30' E",
        "latDec": 15.8497,
        "lonDec": 74.4977,
        "tz": "+05:30"
      },
      {
        "name": "Bellary (Ballari)",
        "lat": "15° 08' N",
        "lon": "76° 55' E",
        "latDec": 15.1394,
        "lonDec": 76.9214,
        "tz": "+05:30"
      },
      {
        "name": "Bhadravati",
        "lat": "13° 51' N",
        "lon": "75° 42' E",
        "latDec": 13.8488,
        "lonDec": 75.7047,
        "tz": "+05:30"
      },
      {
        "name": "Bidar",
        "lat": "17° 55' N",
        "lon": "77° 31' E",
        "latDec": 17.9104,
        "lonDec": 77.5199,
        "tz": "+05:30"
      },
      {
        "name": "Bijapur (Vijayapura)",
        "lat": "16° 50' N",
        "lon": "75° 43' E",
        "latDec": 16.8302,
        "lonDec": 75.71,
        "tz": "+05:30"
      },
      {
        "name": "Chamrajnagar",
        "lat": "11° 56' N",
        "lon": "76° 57' E",
        "latDec": 11.9261,
        "lonDec": 76.9437,
        "tz": "+05:30"
      },
      {
        "name": "Chikmagalur (Chikkamagaluru)",
        "lat": "13° 19' N",
        "lon": "75° 47' E",
        "latDec": 13.3153,
        "lonDec": 75.7754,
        "tz": "+05:30"
      },
      {
        "name": "Chitradurga",
        "lat": "14° 14' N",
        "lon": "76° 24' E",
        "latDec": 14.2251,
        "lonDec": 76.398,
        "tz": "+05:30"
      },
      {
        "name": "Davanagere",
        "lat": "14° 28' N",
        "lon": "75° 55' E",
        "latDec": 14.4644,
        "lonDec": 75.9218,
        "tz": "+05:30"
      },
      {
        "name": "Dharmasthala",
        "lat": "12° 57' N",
        "lon": "75° 23' E",
        "latDec": 12.9554,
        "lonDec": 75.3783,
        "tz": "+05:30"
      },
      {
        "name": "Gadag-Betageri",
        "lat": "15° 25' N",
        "lon": "75° 38' E",
        "latDec": 15.4167,
        "lonDec": 75.6333,
        "tz": "+05:30"
      },
      {
        "name": "Gangawati",
        "lat": "15° 26' N",
        "lon": "76° 32' E",
        "latDec": 15.4316,
        "lonDec": 76.5298,
        "tz": "+05:30"
      },
      {
        "name": "Gokarna",
        "lat": "14° 33' N",
        "lon": "74° 19' E",
        "latDec": 14.5479,
        "lonDec": 74.3188,
        "tz": "+05:30"
      },
      {
        "name": "Gulbarga (Kalaburagi)",
        "lat": "17° 20' N",
        "lon": "76° 50' E",
        "latDec": 17.3297,
        "lonDec": 76.8343,
        "tz": "+05:30"
      },
      {
        "name": "Hampi",
        "lat": "15° 20' N",
        "lon": "76° 28' E",
        "latDec": 15.335,
        "lonDec": 76.46,
        "tz": "+05:30"
      },
      {
        "name": "Hassan",
        "lat": "13° 00' N",
        "lon": "76° 06' E",
        "latDec": 13.0033,
        "lonDec": 76.1004,
        "tz": "+05:30"
      },
      {
        "name": "Hospet (Hosapete)",
        "lat": "15° 16' N",
        "lon": "76° 23' E",
        "latDec": 15.2689,
        "lonDec": 76.3909,
        "tz": "+05:30"
      },
      {
        "name": "Hubli-Dharwad",
        "lat": "15° 22' N",
        "lon": "75° 07' E",
        "latDec": 15.3647,
        "lonDec": 75.124,
        "tz": "+05:30"
      },
      {
        "name": "Karwar",
        "lat": "14° 49' N",
        "lon": "74° 08' E",
        "latDec": 14.8136,
        "lonDec": 74.1298,
        "tz": "+05:30"
      },
      {
        "name": "Kolar",
        "lat": "13° 08' N",
        "lon": "78° 08' E",
        "latDec": 13.1367,
        "lonDec": 78.134,
        "tz": "+05:30"
      },
      {
        "name": "Kollur",
        "lat": "13° 52' N",
        "lon": "74° 49' E",
        "latDec": 13.8647,
        "lonDec": 74.8144,
        "tz": "+05:30"
      },
      {
        "name": "Kukke Subramanya",
        "lat": "12° 40' N",
        "lon": "75° 37' E",
        "latDec": 12.6644,
        "lonDec": 75.6144,
        "tz": "+05:30"
      },
      {
        "name": "Madikeri (Coorg)",
        "lat": "12° 25' N",
        "lon": "75° 44' E",
        "latDec": 12.4244,
        "lonDec": 75.7382,
        "tz": "+05:30"
      },
      {
        "name": "Mandya",
        "lat": "12° 31' N",
        "lon": "76° 54' E",
        "latDec": 12.5238,
        "lonDec": 76.8969,
        "tz": "+05:30"
      },
      {
        "name": "Mangalore (Mangaluru)",
        "lat": "12° 55' N",
        "lon": "74° 51' E",
        "latDec": 12.9141,
        "lonDec": 74.856,
        "tz": "+05:30"
      },
      {
        "name": "Mysore (Mysuru)",
        "lat": "12° 18' N",
        "lon": "76° 38' E",
        "latDec": 12.2958,
        "lonDec": 76.6394,
        "tz": "+05:30"
      },
      {
        "name": "Raichur",
        "lat": "16° 12' N",
        "lon": "77° 21' E",
        "latDec": 16.2076,
        "lonDec": 77.3463,
        "tz": "+05:30"
      },
      {
        "name": "Ranebennur",
        "lat": "14° 37' N",
        "lon": "75° 37' E",
        "latDec": 14.6231,
        "lonDec": 75.6218,
        "tz": "+05:30"
      },
      {
        "name": "Robertsonpet (KGF)",
        "lat": "12° 57' N",
        "lon": "78° 16' E",
        "latDec": 12.9583,
        "lonDec": 78.2711,
        "tz": "+05:30"
      },
      {
        "name": "Shimoga (Shivamogga)",
        "lat": "13° 56' N",
        "lon": "75° 34' E",
        "latDec": 13.9299,
        "lonDec": 75.5681,
        "tz": "+05:30"
      },
      {
        "name": "Sirsi",
        "lat": "14° 37' N",
        "lon": "74° 50' E",
        "latDec": 14.6195,
        "lonDec": 74.8354,
        "tz": "+05:30"
      },
      {
        "name": "Sringeri",
        "lat": "13° 25' N",
        "lon": "75° 15' E",
        "latDec": 13.4195,
        "lonDec": 75.257,
        "tz": "+05:30"
      },
      {
        "name": "Tumkur (Tumakuru)",
        "lat": "13° 20' N",
        "lon": "77° 06' E",
        "latDec": 13.3379,
        "lonDec": 77.1017,
        "tz": "+05:30"
      },
      {
        "name": "Udupi",
        "lat": "13° 20' N",
        "lon": "74° 45' E",
        "latDec": 13.3409,
        "lonDec": 74.7421,
        "tz": "+05:30"
      }
    ],
    "Andhra Pradesh": [
      {
        "name": "Adoni",
        "lat": "15° 38' N",
        "lon": "77° 16' E",
        "latDec": 15.6322,
        "lonDec": 77.2728,
        "tz": "+05:30"
      },
      {
        "name": "Amaravati",
        "lat": "16° 34' N",
        "lon": "80° 21' E",
        "latDec": 16.5735,
        "lonDec": 80.3575,
        "tz": "+05:30"
      },
      {
        "name": "Anantapur",
        "lat": "14° 41' N",
        "lon": "77° 36' E",
        "latDec": 14.6819,
        "lonDec": 77.6006,
        "tz": "+05:30"
      },
      {
        "name": "Bhimavaram",
        "lat": "16° 33' N",
        "lon": "81° 31' E",
        "latDec": 16.5449,
        "lonDec": 81.5212,
        "tz": "+05:30"
      },
      {
        "name": "Chittoor",
        "lat": "13° 13' N",
        "lon": "79° 06' E",
        "latDec": 13.2172,
        "lonDec": 79.1003,
        "tz": "+05:30"
      },
      {
        "name": "Dharmavaram",
        "lat": "14° 25' N",
        "lon": "77° 43' E",
        "latDec": 14.4137,
        "lonDec": 77.7126,
        "tz": "+05:30"
      },
      {
        "name": "Eluru",
        "lat": "16° 43' N",
        "lon": "81° 06' E",
        "latDec": 16.7107,
        "lonDec": 81.0952,
        "tz": "+05:30"
      },
      {
        "name": "Guntakal",
        "lat": "15° 10' N",
        "lon": "77° 23' E",
        "latDec": 15.1672,
        "lonDec": 77.3789,
        "tz": "+05:30"
      },
      {
        "name": "Guntur",
        "lat": "16° 18' N",
        "lon": "80° 26' E",
        "latDec": 16.3067,
        "lonDec": 80.4365,
        "tz": "+05:30"
      },
      {
        "name": "Hindupur",
        "lat": "13° 50' N",
        "lon": "77° 30' E",
        "latDec": 13.8299,
        "lonDec": 77.493,
        "tz": "+05:30"
      },
      {
        "name": "Kadapa",
        "lat": "14° 28' N",
        "lon": "78° 49' E",
        "latDec": 14.4673,
        "lonDec": 78.8242,
        "tz": "+05:30"
      },
      {
        "name": "Kakinada",
        "lat": "16° 59' N",
        "lon": "82° 15' E",
        "latDec": 16.9891,
        "lonDec": 82.2475,
        "tz": "+05:30"
      },
      {
        "name": "Kurnool",
        "lat": "15° 50' N",
        "lon": "78° 02' E",
        "latDec": 15.8281,
        "lonDec": 78.0373,
        "tz": "+05:30"
      },
      {
        "name": "Machilipatnam",
        "lat": "16° 11' N",
        "lon": "81° 08' E",
        "latDec": 16.1875,
        "lonDec": 81.1389,
        "tz": "+05:30"
      },
      {
        "name": "Madanapalle",
        "lat": "13° 33' N",
        "lon": "78° 30' E",
        "latDec": 13.5563,
        "lonDec": 78.501,
        "tz": "+05:30"
      },
      {
        "name": "Nandyal",
        "lat": "15° 29' N",
        "lon": "78° 29' E",
        "latDec": 15.4886,
        "lonDec": 78.4836,
        "tz": "+05:30"
      },
      {
        "name": "Nellore",
        "lat": "14° 27' N",
        "lon": "79° 59' E",
        "latDec": 14.4426,
        "lonDec": 79.9865,
        "tz": "+05:30"
      },
      {
        "name": "Ongole",
        "lat": "15° 30' N",
        "lon": "80° 03' E",
        "latDec": 15.5057,
        "lonDec": 80.0499,
        "tz": "+05:30"
      },
      {
        "name": "Proddatur",
        "lat": "14° 45' N",
        "lon": "78° 33' E",
        "latDec": 14.7526,
        "lonDec": 78.5523,
        "tz": "+05:30"
      },
      {
        "name": "Puttaparthi",
        "lat": "14° 10' N",
        "lon": "77° 49' E",
        "latDec": 14.167,
        "lonDec": 77.8115,
        "tz": "+05:30"
      },
      {
        "name": "Rajahmundry",
        "lat": "17° 00' N",
        "lon": "81° 48' E",
        "latDec": 17.0005,
        "lonDec": 81.804,
        "tz": "+05:30"
      },
      {
        "name": "Simhachalam",
        "lat": "17° 46' N",
        "lon": "83° 15' E",
        "latDec": 17.7665,
        "lonDec": 83.2506,
        "tz": "+05:30"
      },
      {
        "name": "Srikakulam",
        "lat": "18° 18' N",
        "lon": "83° 54' E",
        "latDec": 18.2949,
        "lonDec": 83.8938,
        "tz": "+05:30"
      },
      {
        "name": "Srisailam",
        "lat": "16° 04' N",
        "lon": "78° 52' E",
        "latDec": 16.0737,
        "lonDec": 78.8686,
        "tz": "+05:30"
      },
      {
        "name": "Tenali",
        "lat": "16° 15' N",
        "lon": "80° 38' E",
        "latDec": 16.2437,
        "lonDec": 80.64,
        "tz": "+05:30"
      },
      {
        "name": "Tirupati",
        "lat": "13° 38' N",
        "lon": "79° 25' E",
        "latDec": 13.6288,
        "lonDec": 79.4192,
        "tz": "+05:30"
      },
      {
        "name": "Vijayawada",
        "lat": "16° 30' N",
        "lon": "80° 39' E",
        "latDec": 16.5062,
        "lonDec": 80.648,
        "tz": "+05:30"
      },
      {
        "name": "Visakhapatnam",
        "lat": "17° 41' N",
        "lon": "83° 13' E",
        "latDec": 17.6868,
        "lonDec": 83.2185,
        "tz": "+05:30"
      },
      {
        "name": "Vizianagaram",
        "lat": "18° 06' N",
        "lon": "83° 24' E",
        "latDec": 18.1067,
        "lonDec": 83.3956,
        "tz": "+05:30"
      }
    ],
    "Telangana": [
      {
        "name": "Adilabad",
        "lat": "19° 40' N",
        "lon": "78° 32' E",
        "latDec": 19.6641,
        "lonDec": 78.532,
        "tz": "+05:30"
      },
      {
        "name": "Alampur",
        "lat": "15° 53' N",
        "lon": "78° 08' E",
        "latDec": 15.8778,
        "lonDec": 78.1367,
        "tz": "+05:30"
      },
      {
        "name": "Basar",
        "lat": "18° 53' N",
        "lon": "77° 57' E",
        "latDec": 18.8789,
        "lonDec": 77.9547,
        "tz": "+05:30"
      },
      {
        "name": "Bhadrachalam",
        "lat": "17° 40' N",
        "lon": "80° 54' E",
        "latDec": 17.6689,
        "lonDec": 80.8936,
        "tz": "+05:30"
      },
      {
        "name": "Hyderabad",
        "lat": "17° 23' N",
        "lon": "78° 29' E",
        "latDec": 17.385,
        "lonDec": 78.4867,
        "tz": "+05:30"
      },
      {
        "name": "Jagtial",
        "lat": "18° 48' N",
        "lon": "78° 55' E",
        "latDec": 18.7946,
        "lonDec": 78.9126,
        "tz": "+05:30"
      },
      {
        "name": "Kamareddy",
        "lat": "18° 19' N",
        "lon": "78° 20' E",
        "latDec": 18.3219,
        "lonDec": 78.3402,
        "tz": "+05:30"
      },
      {
        "name": "Karimnagar",
        "lat": "18° 26' N",
        "lon": "79° 08' E",
        "latDec": 18.4386,
        "lonDec": 79.1288,
        "tz": "+05:30"
      },
      {
        "name": "Khammam",
        "lat": "17° 15' N",
        "lon": "80° 09' E",
        "latDec": 17.2473,
        "lonDec": 80.1514,
        "tz": "+05:30"
      },
      {
        "name": "Kothagudem",
        "lat": "17° 33' N",
        "lon": "80° 37' E",
        "latDec": 17.5524,
        "lonDec": 80.6174,
        "tz": "+05:30"
      },
      {
        "name": "Mahbubnagar",
        "lat": "16° 45' N",
        "lon": "77° 59' E",
        "latDec": 16.7488,
        "lonDec": 77.9856,
        "tz": "+05:30"
      },
      {
        "name": "Mancherial",
        "lat": "18° 52' N",
        "lon": "79° 28' E",
        "latDec": 18.8679,
        "lonDec": 79.4639,
        "tz": "+05:30"
      },
      {
        "name": "Miryalaguda",
        "lat": "16° 52' N",
        "lon": "79° 34' E",
        "latDec": 16.8741,
        "lonDec": 79.5638,
        "tz": "+05:30"
      },
      {
        "name": "Nalgonda",
        "lat": "17° 03' N",
        "lon": "79° 16' E",
        "latDec": 17.0577,
        "lonDec": 79.2684,
        "tz": "+05:30"
      },
      {
        "name": "Nirmal",
        "lat": "19° 06' N",
        "lon": "78° 21' E",
        "latDec": 19.0964,
        "lonDec": 78.3434,
        "tz": "+05:30"
      },
      {
        "name": "Nizamabad",
        "lat": "18° 40' N",
        "lon": "78° 06' E",
        "latDec": 18.6725,
        "lonDec": 78.0941,
        "tz": "+05:30"
      },
      {
        "name": "Ramagundam",
        "lat": "18° 45' N",
        "lon": "79° 31' E",
        "latDec": 18.7557,
        "lonDec": 79.5126,
        "tz": "+05:30"
      },
      {
        "name": "Siddipet",
        "lat": "18° 06' N",
        "lon": "78° 51' E",
        "latDec": 18.1018,
        "lonDec": 78.852,
        "tz": "+05:30"
      },
      {
        "name": "Suryapet",
        "lat": "17° 09' N",
        "lon": "79° 37' E",
        "latDec": 17.1439,
        "lonDec": 79.6239,
        "tz": "+05:30"
      },
      {
        "name": "Vemulawada",
        "lat": "18° 28' N",
        "lon": "78° 52' E",
        "latDec": 18.4686,
        "lonDec": 78.8686,
        "tz": "+05:30"
      },
      {
        "name": "Warangal",
        "lat": "17° 58' N",
        "lon": "79° 36' E",
        "latDec": 17.9689,
        "lonDec": 79.5941,
        "tz": "+05:30"
      },
      {
        "name": "Yadadri (Yadagirigutta)",
        "lat": "17° 35' N",
        "lon": "78° 56' E",
        "latDec": 17.5878,
        "lonDec": 78.9398,
        "tz": "+05:30"
      }
    ],
    "Kerala": [
      {
        "name": "Alappuzha (Alleppey)",
        "lat": "09° 30' N",
        "lon": "76° 20' E",
        "latDec": 9.4981,
        "lonDec": 76.3388,
        "tz": "+05:30"
      },
      {
        "name": "Attukal",
        "lat": "08° 28' N",
        "lon": "76° 57' E",
        "latDec": 8.4719,
        "lonDec": 76.9538,
        "tz": "+05:30"
      },
      {
        "name": "Chengannur",
        "lat": "09° 19' N",
        "lon": "76° 37' E",
        "latDec": 9.3175,
        "lonDec": 76.6111,
        "tz": "+05:30"
      },
      {
        "name": "Chottanikkara",
        "lat": "09° 56' N",
        "lon": "76° 24' E",
        "latDec": 9.9333,
        "lonDec": 76.3917,
        "tz": "+05:30"
      },
      {
        "name": "Guruvayur",
        "lat": "10° 36' N",
        "lon": "76° 02' E",
        "latDec": 10.5946,
        "lonDec": 76.04,
        "tz": "+05:30"
      },
      {
        "name": "Kanhangad",
        "lat": "12° 19' N",
        "lon": "75° 05' E",
        "latDec": 12.3089,
        "lonDec": 75.0911,
        "tz": "+05:30"
      },
      {
        "name": "Kannur",
        "lat": "11° 52' N",
        "lon": "75° 22' E",
        "latDec": 11.8745,
        "lonDec": 75.3704,
        "tz": "+05:30"
      },
      {
        "name": "Kasaragod",
        "lat": "12° 30' N",
        "lon": "74° 59' E",
        "latDec": 12.4996,
        "lonDec": 74.9869,
        "tz": "+05:30"
      },
      {
        "name": "Kochi (Cochin)",
        "lat": "09° 56' N",
        "lon": "76° 16' E",
        "latDec": 9.9312,
        "lonDec": 76.2673,
        "tz": "+05:30"
      },
      {
        "name": "Kollam (Quilon)",
        "lat": "08° 54' N",
        "lon": "76° 37' E",
        "latDec": 8.8932,
        "lonDec": 76.6141,
        "tz": "+05:30"
      },
      {
        "name": "Kottayam",
        "lat": "09° 35' N",
        "lon": "76° 31' E",
        "latDec": 9.5916,
        "lonDec": 76.5222,
        "tz": "+05:30"
      },
      {
        "name": "Kozhikode (Calicut)",
        "lat": "11° 16' N",
        "lon": "75° 47' E",
        "latDec": 11.2588,
        "lonDec": 75.7804,
        "tz": "+05:30"
      },
      {
        "name": "Malappuram",
        "lat": "11° 03' N",
        "lon": "76° 04' E",
        "latDec": 11.051,
        "lonDec": 76.0711,
        "tz": "+05:30"
      },
      {
        "name": "Manjeri",
        "lat": "11° 07' N",
        "lon": "76° 07' E",
        "latDec": 11.1219,
        "lonDec": 76.1214,
        "tz": "+05:30"
      },
      {
        "name": "Palakkad",
        "lat": "10° 47' N",
        "lon": "76° 39' E",
        "latDec": 10.7867,
        "lonDec": 76.6548,
        "tz": "+05:30"
      },
      {
        "name": "Payyanur",
        "lat": "12° 06' N",
        "lon": "75° 12' E",
        "latDec": 12.1,
        "lonDec": 75.2,
        "tz": "+05:30"
      },
      {
        "name": "Ponnani",
        "lat": "10° 46' N",
        "lon": "75° 56' E",
        "latDec": 10.7672,
        "lonDec": 75.9259,
        "tz": "+05:30"
      },
      {
        "name": "Sabarimala",
        "lat": "09° 26' N",
        "lon": "77° 05' E",
        "latDec": 9.4406,
        "lonDec": 77.0811,
        "tz": "+05:30"
      },
      {
        "name": "Thalassery",
        "lat": "11° 45' N",
        "lon": "75° 29' E",
        "latDec": 11.7491,
        "lonDec": 75.489,
        "tz": "+05:30"
      },
      {
        "name": "Thiruvananthapuram (Trivandrum)",
        "lat": "08° 31' N",
        "lon": "76° 56' E",
        "latDec": 8.5241,
        "lonDec": 76.9366,
        "tz": "+05:30"
      },
      {
        "name": "Thrissur",
        "lat": "10° 32' N",
        "lon": "76° 13' E",
        "latDec": 10.5276,
        "lonDec": 76.2144,
        "tz": "+05:30"
      },
      {
        "name": "Vaikom",
        "lat": "09° 45' N",
        "lon": "76° 24' E",
        "latDec": 9.7497,
        "lonDec": 76.3961,
        "tz": "+05:30"
      },
      {
        "name": "Vatakara",
        "lat": "11° 36' N",
        "lon": "75° 36' E",
        "latDec": 11.6083,
        "lonDec": 75.5917,
        "tz": "+05:30"
      }
    ],
    "Maharashtra": [
      {
        "name": "Ahmednagar (Ahilyanagar)",
        "lat": "19° 06' N",
        "lon": "74° 45' E",
        "latDec": 19.0952,
        "lonDec": 74.748,
        "tz": "+05:30"
      },
      {
        "name": "Akola",
        "lat": "20° 42' N",
        "lon": "77° 00' E",
        "latDec": 20.7002,
        "lonDec": 77.0082,
        "tz": "+05:30"
      },
      {
        "name": "Alandi",
        "lat": "18° 41' N",
        "lon": "73° 54' E",
        "latDec": 18.6769,
        "lonDec": 73.8964,
        "tz": "+05:30"
      },
      {
        "name": "Amravati",
        "lat": "20° 56' N",
        "lon": "77° 45' E",
        "latDec": 20.932,
        "lonDec": 77.7523,
        "tz": "+05:30"
      },
      {
        "name": "Aurangabad (Chhatrapati Sambhajinagar)",
        "lat": "19° 53' N",
        "lon": "75° 21' E",
        "latDec": 19.8762,
        "lonDec": 75.3433,
        "tz": "+05:30"
      },
      {
        "name": "Beed",
        "lat": "18° 59' N",
        "lon": "75° 46' E",
        "latDec": 18.9891,
        "lonDec": 75.7601,
        "tz": "+05:30"
      },
      {
        "name": "Bhiwandi",
        "lat": "19° 18' N",
        "lon": "73° 04' E",
        "latDec": 19.2967,
        "lonDec": 73.0631,
        "tz": "+05:30"
      },
      {
        "name": "Chandrapur",
        "lat": "19° 58' N",
        "lon": "79° 18' E",
        "latDec": 19.9615,
        "lonDec": 79.2961,
        "tz": "+05:30"
      },
      {
        "name": "Dhule",
        "lat": "20° 54' N",
        "lon": "74° 46' E",
        "latDec": 20.9042,
        "lonDec": 74.7749,
        "tz": "+05:30"
      },
      {
        "name": "Ichalkaranji",
        "lat": "16° 42' N",
        "lon": "74° 27' E",
        "latDec": 16.6922,
        "lonDec": 74.4578,
        "tz": "+05:30"
      },
      {
        "name": "Jalgaon",
        "lat": "21° 00' N",
        "lon": "75° 34' E",
        "latDec": 21.0077,
        "lonDec": 75.5626,
        "tz": "+05:30"
      },
      {
        "name": "Jalna",
        "lat": "19° 50' N",
        "lon": "75° 53' E",
        "latDec": 19.841,
        "lonDec": 75.8864,
        "tz": "+05:30"
      },
      {
        "name": "Kalyan-Dombivli",
        "lat": "19° 14' N",
        "lon": "73° 08' E",
        "latDec": 19.2403,
        "lonDec": 73.1305,
        "tz": "+05:30"
      },
      {
        "name": "Kolhapur",
        "lat": "16° 42' N",
        "lon": "74° 15' E",
        "latDec": 16.705,
        "lonDec": 74.2433,
        "tz": "+05:30"
      },
      {
        "name": "Latur",
        "lat": "18° 25' N",
        "lon": "76° 34' E",
        "latDec": 18.4088,
        "lonDec": 76.5604,
        "tz": "+05:30"
      },
      {
        "name": "Malegaon",
        "lat": "20° 33' N",
        "lon": "74° 31' E",
        "latDec": 20.5579,
        "lonDec": 74.5089,
        "tz": "+05:30"
      },
      {
        "name": "Mira-Bhayandar",
        "lat": "19° 18' N",
        "lon": "72° 51' E",
        "latDec": 19.2952,
        "lonDec": 72.8544,
        "tz": "+05:30"
      },
      {
        "name": "Mumbai",
        "lat": "19° 05' N",
        "lon": "72° 53' E",
        "latDec": 19.076,
        "lonDec": 72.8777,
        "tz": "+05:30"
      },
      {
        "name": "Nagpur",
        "lat": "21° 09' N",
        "lon": "79° 05' E",
        "latDec": 21.1458,
        "lonDec": 79.0882,
        "tz": "+05:30"
      },
      {
        "name": "Nanded",
        "lat": "19° 08' N",
        "lon": "77° 19' E",
        "latDec": 19.1383,
        "lonDec": 77.321,
        "tz": "+05:30"
      },
      {
        "name": "Nashik",
        "lat": "19° 60' N",
        "lon": "73° 47' E",
        "latDec": 19.9975,
        "lonDec": 73.7898,
        "tz": "+05:30"
      },
      {
        "name": "Navi Mumbai",
        "lat": "19° 02' N",
        "lon": "73° 02' E",
        "latDec": 19.033,
        "lonDec": 73.0297,
        "tz": "+05:30"
      },
      {
        "name": "Osmanabad (Dharashiv)",
        "lat": "18° 11' N",
        "lon": "76° 03' E",
        "latDec": 18.1861,
        "lonDec": 76.0419,
        "tz": "+05:30"
      },
      {
        "name": "Pandharpur",
        "lat": "17° 41' N",
        "lon": "75° 20' E",
        "latDec": 17.6778,
        "lonDec": 75.3267,
        "tz": "+05:30"
      },
      {
        "name": "Panvel",
        "lat": "18° 59' N",
        "lon": "73° 07' E",
        "latDec": 18.9894,
        "lonDec": 73.1175,
        "tz": "+05:30"
      },
      {
        "name": "Parbhani",
        "lat": "19° 16' N",
        "lon": "76° 46' E",
        "latDec": 19.2608,
        "lonDec": 76.7748,
        "tz": "+05:30"
      },
      {
        "name": "Pune",
        "lat": "18° 31' N",
        "lon": "73° 51' E",
        "latDec": 18.5204,
        "lonDec": 73.8567,
        "tz": "+05:30"
      },
      {
        "name": "Sangli-Miraj",
        "lat": "16° 51' N",
        "lon": "74° 35' E",
        "latDec": 16.8524,
        "lonDec": 74.5815,
        "tz": "+05:30"
      },
      {
        "name": "Satara",
        "lat": "17° 41' N",
        "lon": "73° 60' E",
        "latDec": 17.6805,
        "lonDec": 73.9926,
        "tz": "+05:30"
      },
      {
        "name": "Shirdi",
        "lat": "19° 46' N",
        "lon": "74° 29' E",
        "latDec": 19.7667,
        "lonDec": 74.4764,
        "tz": "+05:30"
      },
      {
        "name": "Solapur",
        "lat": "17° 40' N",
        "lon": "75° 54' E",
        "latDec": 17.6599,
        "lonDec": 75.9064,
        "tz": "+05:30"
      },
      {
        "name": "Thane",
        "lat": "19° 13' N",
        "lon": "72° 59' E",
        "latDec": 19.2183,
        "lonDec": 72.9781,
        "tz": "+05:30"
      },
      {
        "name": "Trimbakeshwar",
        "lat": "19° 56' N",
        "lon": "73° 32' E",
        "latDec": 19.9383,
        "lonDec": 73.5303,
        "tz": "+05:30"
      },
      {
        "name": "Ulhasnagar",
        "lat": "19° 13' N",
        "lon": "73° 10' E",
        "latDec": 19.2215,
        "lonDec": 73.1645,
        "tz": "+05:30"
      },
      {
        "name": "Vasai-Virar",
        "lat": "19° 24' N",
        "lon": "72° 50' E",
        "latDec": 19.3919,
        "lonDec": 72.8397,
        "tz": "+05:30"
      },
      {
        "name": "Wardha",
        "lat": "20° 45' N",
        "lon": "78° 36' E",
        "latDec": 20.7453,
        "lonDec": 78.6022,
        "tz": "+05:30"
      },
      {
        "name": "Yavatmal",
        "lat": "20° 23' N",
        "lon": "78° 07' E",
        "latDec": 20.3888,
        "lonDec": 78.1204,
        "tz": "+05:30"
      }
    ],
    "Gujarat": [
      {
        "name": "Ahmedabad",
        "lat": "23° 01' N",
        "lon": "72° 34' E",
        "latDec": 23.0225,
        "lonDec": 72.5714,
        "tz": "+05:30"
      },
      {
        "name": "Ambaji",
        "lat": "24° 20' N",
        "lon": "72° 51' E",
        "latDec": 24.3314,
        "lonDec": 72.8525,
        "tz": "+05:30"
      },
      {
        "name": "Amreli",
        "lat": "21° 36' N",
        "lon": "71° 13' E",
        "latDec": 21.6032,
        "lonDec": 71.2221,
        "tz": "+05:30"
      },
      {
        "name": "Anand",
        "lat": "22° 34' N",
        "lon": "72° 56' E",
        "latDec": 22.5645,
        "lonDec": 72.9289,
        "tz": "+05:30"
      },
      {
        "name": "Bharuch",
        "lat": "21° 42' N",
        "lon": "72° 60' E",
        "latDec": 21.7051,
        "lonDec": 72.9959,
        "tz": "+05:30"
      },
      {
        "name": "Bhavnagar",
        "lat": "21° 46' N",
        "lon": "72° 09' E",
        "latDec": 21.7645,
        "lonDec": 72.1519,
        "tz": "+05:30"
      },
      {
        "name": "Bhuj",
        "lat": "23° 15' N",
        "lon": "69° 40' E",
        "latDec": 23.242,
        "lonDec": 69.6669,
        "tz": "+05:30"
      },
      {
        "name": "Botad",
        "lat": "22° 10' N",
        "lon": "71° 40' E",
        "latDec": 22.1704,
        "lonDec": 71.6669,
        "tz": "+05:30"
      },
      {
        "name": "Dahod",
        "lat": "22° 50' N",
        "lon": "74° 15' E",
        "latDec": 22.8326,
        "lonDec": 74.2568,
        "tz": "+05:30"
      },
      {
        "name": "Dakor",
        "lat": "22° 45' N",
        "lon": "73° 09' E",
        "latDec": 22.7533,
        "lonDec": 73.1492,
        "tz": "+05:30"
      },
      {
        "name": "Dwarka",
        "lat": "22° 15' N",
        "lon": "68° 58' E",
        "latDec": 22.2442,
        "lonDec": 68.9685,
        "tz": "+05:30"
      },
      {
        "name": "Gandhinagar",
        "lat": "23° 13' N",
        "lon": "72° 38' E",
        "latDec": 23.2156,
        "lonDec": 72.6369,
        "tz": "+05:30"
      },
      {
        "name": "Godhra",
        "lat": "22° 47' N",
        "lon": "73° 37' E",
        "latDec": 22.7758,
        "lonDec": 73.6149,
        "tz": "+05:30"
      },
      {
        "name": "Gondal",
        "lat": "21° 58' N",
        "lon": "70° 48' E",
        "latDec": 21.9619,
        "lonDec": 70.7997,
        "tz": "+05:30"
      },
      {
        "name": "Jamnagar",
        "lat": "22° 28' N",
        "lon": "70° 03' E",
        "latDec": 22.4707,
        "lonDec": 70.0577,
        "tz": "+05:30"
      },
      {
        "name": "Junagadh",
        "lat": "21° 31' N",
        "lon": "70° 27' E",
        "latDec": 21.5222,
        "lonDec": 70.4579,
        "tz": "+05:30"
      },
      {
        "name": "Mehsana",
        "lat": "23° 35' N",
        "lon": "72° 22' E",
        "latDec": 23.588,
        "lonDec": 72.3693,
        "tz": "+05:30"
      },
      {
        "name": "Morbi",
        "lat": "22° 49' N",
        "lon": "70° 50' E",
        "latDec": 22.8173,
        "lonDec": 70.837,
        "tz": "+05:30"
      },
      {
        "name": "Nadiad",
        "lat": "22° 41' N",
        "lon": "72° 52' E",
        "latDec": 22.6916,
        "lonDec": 72.8634,
        "tz": "+05:30"
      },
      {
        "name": "Navsari",
        "lat": "20° 57' N",
        "lon": "72° 56' E",
        "latDec": 20.9507,
        "lonDec": 72.9328,
        "tz": "+05:30"
      },
      {
        "name": "Palanpur",
        "lat": "24° 10' N",
        "lon": "72° 26' E",
        "latDec": 24.1725,
        "lonDec": 72.4346,
        "tz": "+05:30"
      },
      {
        "name": "Palitana",
        "lat": "21° 31' N",
        "lon": "71° 50' E",
        "latDec": 21.5225,
        "lonDec": 71.8267,
        "tz": "+05:30"
      },
      {
        "name": "Patan",
        "lat": "23° 51' N",
        "lon": "72° 08' E",
        "latDec": 23.8493,
        "lonDec": 72.1266,
        "tz": "+05:30"
      },
      {
        "name": "Porbandar",
        "lat": "21° 39' N",
        "lon": "69° 38' E",
        "latDec": 21.6417,
        "lonDec": 69.6293,
        "tz": "+05:30"
      },
      {
        "name": "Rajkot",
        "lat": "22° 18' N",
        "lon": "70° 48' E",
        "latDec": 22.3039,
        "lonDec": 70.8022,
        "tz": "+05:30"
      },
      {
        "name": "Surat",
        "lat": "21° 10' N",
        "lon": "72° 50' E",
        "latDec": 21.1702,
        "lonDec": 72.8311,
        "tz": "+05:30"
      },
      {
        "name": "Surendranagar",
        "lat": "22° 44' N",
        "lon": "71° 38' E",
        "latDec": 22.7278,
        "lonDec": 71.637,
        "tz": "+05:30"
      },
      {
        "name": "Vadodara",
        "lat": "22° 18' N",
        "lon": "73° 11' E",
        "latDec": 22.3072,
        "lonDec": 73.1812,
        "tz": "+05:30"
      },
      {
        "name": "Valsad",
        "lat": "20° 36' N",
        "lon": "72° 56' E",
        "latDec": 20.5992,
        "lonDec": 72.9342,
        "tz": "+05:30"
      },
      {
        "name": "Vapi",
        "lat": "20° 23' N",
        "lon": "72° 55' E",
        "latDec": 20.3893,
        "lonDec": 72.9106,
        "tz": "+05:30"
      },
      {
        "name": "Veraval (Somnath)",
        "lat": "20° 54' N",
        "lon": "70° 22' E",
        "latDec": 20.9077,
        "lonDec": 70.3678,
        "tz": "+05:30"
      }
    ],
    "Uttar Pradesh": [
      {
        "name": "Agra",
        "lat": "27° 11' N",
        "lon": "78° 00' E",
        "latDec": 27.1767,
        "lonDec": 78.0081,
        "tz": "+05:30"
      },
      {
        "name": "Aligarh",
        "lat": "27° 54' N",
        "lon": "78° 05' E",
        "latDec": 27.8974,
        "lonDec": 78.088,
        "tz": "+05:30"
      },
      {
        "name": "Ayodhya",
        "lat": "26° 48' N",
        "lon": "82° 12' E",
        "latDec": 26.7922,
        "lonDec": 82.1998,
        "tz": "+05:30"
      },
      {
        "name": "Azamgarh",
        "lat": "26° 04' N",
        "lon": "83° 11' E",
        "latDec": 26.0689,
        "lonDec": 83.1836,
        "tz": "+05:30"
      },
      {
        "name": "Bahraich",
        "lat": "27° 34' N",
        "lon": "81° 36' E",
        "latDec": 27.5706,
        "lonDec": 81.5975,
        "tz": "+05:30"
      },
      {
        "name": "Ballia",
        "lat": "25° 46' N",
        "lon": "84° 09' E",
        "latDec": 25.7594,
        "lonDec": 84.1489,
        "tz": "+05:30"
      },
      {
        "name": "Banda",
        "lat": "25° 29' N",
        "lon": "80° 20' E",
        "latDec": 25.4754,
        "lonDec": 80.3347,
        "tz": "+05:30"
      },
      {
        "name": "Barabanki",
        "lat": "26° 56' N",
        "lon": "81° 11' E",
        "latDec": 26.9272,
        "lonDec": 81.1834,
        "tz": "+05:30"
      },
      {
        "name": "Bareilly",
        "lat": "28° 22' N",
        "lon": "79° 26' E",
        "latDec": 28.367,
        "lonDec": 79.4304,
        "tz": "+05:30"
      },
      {
        "name": "Basti",
        "lat": "26° 48' N",
        "lon": "82° 45' E",
        "latDec": 26.7989,
        "lonDec": 82.7483,
        "tz": "+05:30"
      },
      {
        "name": "Bijnor",
        "lat": "29° 22' N",
        "lon": "78° 08' E",
        "latDec": 29.3732,
        "lonDec": 78.1358,
        "tz": "+05:30"
      },
      {
        "name": "Budaun",
        "lat": "28° 02' N",
        "lon": "79° 07' E",
        "latDec": 28.0336,
        "lonDec": 79.1246,
        "tz": "+05:30"
      },
      {
        "name": "Bulandshahr",
        "lat": "28° 24' N",
        "lon": "77° 51' E",
        "latDec": 28.4069,
        "lonDec": 77.8498,
        "tz": "+05:30"
      },
      {
        "name": "Chitrakoot",
        "lat": "25° 11' N",
        "lon": "80° 52' E",
        "latDec": 25.1764,
        "lonDec": 80.8711,
        "tz": "+05:30"
      },
      {
        "name": "Deoria",
        "lat": "26° 30' N",
        "lon": "83° 47' E",
        "latDec": 26.5024,
        "lonDec": 83.7791,
        "tz": "+05:30"
      },
      {
        "name": "Etawah",
        "lat": "26° 47' N",
        "lon": "79° 01' E",
        "latDec": 26.7855,
        "lonDec": 79.0154,
        "tz": "+05:30"
      },
      {
        "name": "Farrukhabad",
        "lat": "27° 23' N",
        "lon": "79° 35' E",
        "latDec": 27.3828,
        "lonDec": 79.5847,
        "tz": "+05:30"
      },
      {
        "name": "Fatehpur",
        "lat": "25° 56' N",
        "lon": "80° 49' E",
        "latDec": 25.9289,
        "lonDec": 80.8128,
        "tz": "+05:30"
      },
      {
        "name": "Firozabad",
        "lat": "27° 10' N",
        "lon": "78° 24' E",
        "latDec": 27.1591,
        "lonDec": 78.3957,
        "tz": "+05:30"
      },
      {
        "name": "Ghaziabad",
        "lat": "28° 40' N",
        "lon": "77° 27' E",
        "latDec": 28.6692,
        "lonDec": 77.4538,
        "tz": "+05:30"
      },
      {
        "name": "Ghazipur",
        "lat": "25° 35' N",
        "lon": "83° 35' E",
        "latDec": 25.5861,
        "lonDec": 83.5772,
        "tz": "+05:30"
      },
      {
        "name": "Gonda",
        "lat": "27° 08' N",
        "lon": "81° 58' E",
        "latDec": 27.1333,
        "lonDec": 81.9667,
        "tz": "+05:30"
      },
      {
        "name": "Gorakhpur",
        "lat": "26° 46' N",
        "lon": "83° 22' E",
        "latDec": 26.7606,
        "lonDec": 83.3732,
        "tz": "+05:30"
      },
      {
        "name": "Hapur",
        "lat": "28° 44' N",
        "lon": "77° 47' E",
        "latDec": 28.7306,
        "lonDec": 77.7759,
        "tz": "+05:30"
      },
      {
        "name": "Hardoi",
        "lat": "27° 24' N",
        "lon": "80° 08' E",
        "latDec": 27.3989,
        "lonDec": 80.1306,
        "tz": "+05:30"
      },
      {
        "name": "Hathras",
        "lat": "27° 36' N",
        "lon": "78° 03' E",
        "latDec": 27.5968,
        "lonDec": 78.0519,
        "tz": "+05:30"
      },
      {
        "name": "Jaunpur",
        "lat": "25° 45' N",
        "lon": "82° 41' E",
        "latDec": 25.7464,
        "lonDec": 82.6837,
        "tz": "+05:30"
      },
      {
        "name": "Jhansi",
        "lat": "25° 27' N",
        "lon": "78° 34' E",
        "latDec": 25.4484,
        "lonDec": 78.5685,
        "tz": "+05:30"
      },
      {
        "name": "Kanpur",
        "lat": "26° 27' N",
        "lon": "80° 20' E",
        "latDec": 26.4499,
        "lonDec": 80.3319,
        "tz": "+05:30"
      },
      {
        "name": "Lakhimpur",
        "lat": "27° 57' N",
        "lon": "80° 47' E",
        "latDec": 27.9472,
        "lonDec": 80.7787,
        "tz": "+05:30"
      },
      {
        "name": "Lucknow",
        "lat": "26° 51' N",
        "lon": "80° 57' E",
        "latDec": 26.8467,
        "lonDec": 80.9462,
        "tz": "+05:30"
      },
      {
        "name": "Mathura",
        "lat": "27° 30' N",
        "lon": "77° 40' E",
        "latDec": 27.4924,
        "lonDec": 77.6737,
        "tz": "+05:30"
      },
      {
        "name": "Meerut",
        "lat": "28° 59' N",
        "lon": "77° 42' E",
        "latDec": 28.9845,
        "lonDec": 77.7064,
        "tz": "+05:30"
      },
      {
        "name": "Mirzapur",
        "lat": "25° 08' N",
        "lon": "82° 34' E",
        "latDec": 25.1337,
        "lonDec": 82.5644,
        "tz": "+05:30"
      },
      {
        "name": "Moradabad",
        "lat": "28° 50' N",
        "lon": "78° 46' E",
        "latDec": 28.8386,
        "lonDec": 78.7733,
        "tz": "+05:30"
      },
      {
        "name": "Muzaffarnagar",
        "lat": "29° 28' N",
        "lon": "77° 43' E",
        "latDec": 29.4727,
        "lonDec": 77.7085,
        "tz": "+05:30"
      },
      {
        "name": "Naimisharanya",
        "lat": "27° 21' N",
        "lon": "80° 29' E",
        "latDec": 27.35,
        "lonDec": 80.4833,
        "tz": "+05:30"
      },
      {
        "name": "Noida",
        "lat": "28° 32' N",
        "lon": "77° 23' E",
        "latDec": 28.5355,
        "lonDec": 77.391,
        "tz": "+05:30"
      },
      {
        "name": "Orai",
        "lat": "25° 60' N",
        "lon": "79° 27' E",
        "latDec": 25.9926,
        "lonDec": 79.4533,
        "tz": "+05:30"
      },
      {
        "name": "Pilibhit",
        "lat": "28° 38' N",
        "lon": "79° 48' E",
        "latDec": 28.6312,
        "lonDec": 79.8034,
        "tz": "+05:30"
      },
      {
        "name": "Prayagraj (Allahabad)",
        "lat": "25° 26' N",
        "lon": "81° 51' E",
        "latDec": 25.4358,
        "lonDec": 81.8463,
        "tz": "+05:30"
      },
      {
        "name": "Raebareli",
        "lat": "26° 14' N",
        "lon": "81° 14' E",
        "latDec": 26.2303,
        "lonDec": 81.2409,
        "tz": "+05:30"
      },
      {
        "name": "Rampur",
        "lat": "28° 49' N",
        "lon": "79° 02' E",
        "latDec": 28.8154,
        "lonDec": 79.0257,
        "tz": "+05:30"
      },
      {
        "name": "Saharanpur",
        "lat": "29° 58' N",
        "lon": "77° 33' E",
        "latDec": 29.9679,
        "lonDec": 77.551,
        "tz": "+05:30"
      },
      {
        "name": "Shahjahanpur",
        "lat": "27° 53' N",
        "lon": "79° 55' E",
        "latDec": 27.8805,
        "lonDec": 79.9126,
        "tz": "+05:30"
      },
      {
        "name": "Sitapur",
        "lat": "27° 35' N",
        "lon": "80° 41' E",
        "latDec": 27.5752,
        "lonDec": 80.6829,
        "tz": "+05:30"
      },
      {
        "name": "Unnao",
        "lat": "26° 33' N",
        "lon": "80° 29' E",
        "latDec": 26.5463,
        "lonDec": 80.4878,
        "tz": "+05:30"
      },
      {
        "name": "Varanasi (Kashi)",
        "lat": "25° 19' N",
        "lon": "82° 58' E",
        "latDec": 25.3176,
        "lonDec": 82.9739,
        "tz": "+05:30"
      },
      {
        "name": "Vindhyachal",
        "lat": "25° 10' N",
        "lon": "82° 30' E",
        "latDec": 25.1633,
        "lonDec": 82.4939,
        "tz": "+05:30"
      },
      {
        "name": "Vrindavan",
        "lat": "27° 35' N",
        "lon": "77° 42' E",
        "latDec": 27.5806,
        "lonDec": 77.7006,
        "tz": "+05:30"
      }
    ],
    "Delhi (NCR)": [
      {
        "name": "Central Delhi",
        "lat": "28° 38' N",
        "lon": "77° 13' E",
        "latDec": 28.64,
        "lonDec": 77.22,
        "tz": "+05:30"
      },
      {
        "name": "Delhi",
        "lat": "28° 42' N",
        "lon": "77° 06' E",
        "latDec": 28.7041,
        "lonDec": 77.1025,
        "tz": "+05:30"
      },
      {
        "name": "Dwarka",
        "lat": "28° 36' N",
        "lon": "77° 03' E",
        "latDec": 28.5921,
        "lonDec": 77.046,
        "tz": "+05:30"
      },
      {
        "name": "East Delhi",
        "lat": "28° 38' N",
        "lon": "77° 18' E",
        "latDec": 28.63,
        "lonDec": 77.3,
        "tz": "+05:30"
      },
      {
        "name": "Faridabad",
        "lat": "28° 25' N",
        "lon": "77° 19' E",
        "latDec": 28.4089,
        "lonDec": 77.3178,
        "tz": "+05:30"
      },
      {
        "name": "Ghaziabad",
        "lat": "28° 40' N",
        "lon": "77° 27' E",
        "latDec": 28.6692,
        "lonDec": 77.4538,
        "tz": "+05:30"
      },
      {
        "name": "Greater Noida",
        "lat": "28° 28' N",
        "lon": "77° 30' E",
        "latDec": 28.4744,
        "lonDec": 77.504,
        "tz": "+05:30"
      },
      {
        "name": "Gurgaon (Gurugram)",
        "lat": "28° 28' N",
        "lon": "77° 02' E",
        "latDec": 28.4595,
        "lonDec": 77.0266,
        "tz": "+05:30"
      },
      {
        "name": "New Delhi",
        "lat": "28° 37' N",
        "lon": "77° 13' E",
        "latDec": 28.6139,
        "lonDec": 77.209,
        "tz": "+05:30"
      },
      {
        "name": "Noida",
        "lat": "28° 32' N",
        "lon": "77° 23' E",
        "latDec": 28.5355,
        "lonDec": 77.391,
        "tz": "+05:30"
      },
      {
        "name": "North Delhi",
        "lat": "28° 45' N",
        "lon": "77° 09' E",
        "latDec": 28.75,
        "lonDec": 77.15,
        "tz": "+05:30"
      },
      {
        "name": "Rohini",
        "lat": "28° 45' N",
        "lon": "77° 03' E",
        "latDec": 28.7495,
        "lonDec": 77.0565,
        "tz": "+05:30"
      },
      {
        "name": "South Delhi",
        "lat": "28° 32' N",
        "lon": "77° 12' E",
        "latDec": 28.53,
        "lonDec": 77.2,
        "tz": "+05:30"
      },
      {
        "name": "West Delhi",
        "lat": "28° 40' N",
        "lon": "77° 05' E",
        "latDec": 28.66,
        "lonDec": 77.08,
        "tz": "+05:30"
      }
    ],
    "Rajasthan": [
      {
        "name": "Ajmer",
        "lat": "26° 27' N",
        "lon": "74° 38' E",
        "latDec": 26.4499,
        "lonDec": 74.6399,
        "tz": "+05:30"
      },
      {
        "name": "Alwar",
        "lat": "27° 33' N",
        "lon": "76° 38' E",
        "latDec": 27.553,
        "lonDec": 76.6346,
        "tz": "+05:30"
      },
      {
        "name": "Baran",
        "lat": "25° 06' N",
        "lon": "76° 31' E",
        "latDec": 25.1011,
        "lonDec": 76.5132,
        "tz": "+05:30"
      },
      {
        "name": "Barmer",
        "lat": "25° 45' N",
        "lon": "71° 24' E",
        "latDec": 25.7532,
        "lonDec": 71.3967,
        "tz": "+05:30"
      },
      {
        "name": "Beawar",
        "lat": "26° 06' N",
        "lon": "74° 19' E",
        "latDec": 26.1013,
        "lonDec": 74.3204,
        "tz": "+05:30"
      },
      {
        "name": "Bharatpur",
        "lat": "27° 13' N",
        "lon": "77° 30' E",
        "latDec": 27.2152,
        "lonDec": 77.503,
        "tz": "+05:30"
      },
      {
        "name": "Bhilwara",
        "lat": "25° 20' N",
        "lon": "74° 38' E",
        "latDec": 25.3407,
        "lonDec": 74.6313,
        "tz": "+05:30"
      },
      {
        "name": "Bhiwadi",
        "lat": "28° 13' N",
        "lon": "76° 52' E",
        "latDec": 28.2104,
        "lonDec": 76.8606,
        "tz": "+05:30"
      },
      {
        "name": "Bikaner",
        "lat": "28° 01' N",
        "lon": "73° 19' E",
        "latDec": 28.0229,
        "lonDec": 73.3119,
        "tz": "+05:30"
      },
      {
        "name": "Bundi",
        "lat": "25° 26' N",
        "lon": "75° 39' E",
        "latDec": 25.4415,
        "lonDec": 75.645,
        "tz": "+05:30"
      },
      {
        "name": "Chittorgarh",
        "lat": "24° 53' N",
        "lon": "74° 38' E",
        "latDec": 24.8887,
        "lonDec": 74.6269,
        "tz": "+05:30"
      },
      {
        "name": "Churu",
        "lat": "28° 17' N",
        "lon": "74° 58' E",
        "latDec": 28.29,
        "lonDec": 74.96,
        "tz": "+05:30"
      },
      {
        "name": "Dhaulpur",
        "lat": "26° 42' N",
        "lon": "77° 54' E",
        "latDec": 26.7025,
        "lonDec": 77.8934,
        "tz": "+05:30"
      },
      {
        "name": "Hanumangarh",
        "lat": "29° 35' N",
        "lon": "74° 19' E",
        "latDec": 29.5817,
        "lonDec": 74.3197,
        "tz": "+05:30"
      },
      {
        "name": "Jaipur",
        "lat": "26° 55' N",
        "lon": "75° 47' E",
        "latDec": 26.9124,
        "lonDec": 75.7873,
        "tz": "+05:30"
      },
      {
        "name": "Jaisalmer",
        "lat": "26° 55' N",
        "lon": "70° 54' E",
        "latDec": 26.9157,
        "lonDec": 70.9083,
        "tz": "+05:30"
      },
      {
        "name": "Jhunjhunu",
        "lat": "28° 08' N",
        "lon": "75° 24' E",
        "latDec": 28.1289,
        "lonDec": 75.3995,
        "tz": "+05:30"
      },
      {
        "name": "Jodhpur",
        "lat": "26° 14' N",
        "lon": "73° 01' E",
        "latDec": 26.2389,
        "lonDec": 73.0243,
        "tz": "+05:30"
      },
      {
        "name": "Khatu Shyamji",
        "lat": "27° 22' N",
        "lon": "75° 18' E",
        "latDec": 27.3667,
        "lonDec": 75.3,
        "tz": "+05:30"
      },
      {
        "name": "Kota",
        "lat": "25° 13' N",
        "lon": "75° 52' E",
        "latDec": 25.2138,
        "lonDec": 75.8648,
        "tz": "+05:30"
      },
      {
        "name": "Nagaur",
        "lat": "27° 12' N",
        "lon": "73° 45' E",
        "latDec": 27.207,
        "lonDec": 73.7423,
        "tz": "+05:30"
      },
      {
        "name": "Nathdwara",
        "lat": "24° 56' N",
        "lon": "73° 49' E",
        "latDec": 24.9317,
        "lonDec": 73.8183,
        "tz": "+05:30"
      },
      {
        "name": "Pali",
        "lat": "25° 46' N",
        "lon": "73° 19' E",
        "latDec": 25.7711,
        "lonDec": 73.3234,
        "tz": "+05:30"
      },
      {
        "name": "Pushkar",
        "lat": "26° 29' N",
        "lon": "74° 33' E",
        "latDec": 26.4897,
        "lonDec": 74.5511,
        "tz": "+05:30"
      },
      {
        "name": "Salasar Balaji",
        "lat": "27° 43' N",
        "lon": "74° 43' E",
        "latDec": 27.7167,
        "lonDec": 74.7167,
        "tz": "+05:30"
      },
      {
        "name": "Sawai Madhopur",
        "lat": "25° 60' N",
        "lon": "76° 21' E",
        "latDec": 25.9928,
        "lonDec": 76.3533,
        "tz": "+05:30"
      },
      {
        "name": "Sikar",
        "lat": "27° 37' N",
        "lon": "75° 08' E",
        "latDec": 27.6094,
        "lonDec": 75.1398,
        "tz": "+05:30"
      },
      {
        "name": "Sri Ganganagar",
        "lat": "29° 55' N",
        "lon": "73° 53' E",
        "latDec": 29.9094,
        "lonDec": 73.8799,
        "tz": "+05:30"
      },
      {
        "name": "Tonk",
        "lat": "26° 10' N",
        "lon": "75° 47' E",
        "latDec": 26.1664,
        "lonDec": 75.7885,
        "tz": "+05:30"
      },
      {
        "name": "Udaipur",
        "lat": "24° 35' N",
        "lon": "73° 43' E",
        "latDec": 24.5854,
        "lonDec": 73.7125,
        "tz": "+05:30"
      }
    ],
    "West Bengal": [
      {
        "name": "Asansol",
        "lat": "23° 40' N",
        "lon": "86° 57' E",
        "latDec": 23.6739,
        "lonDec": 86.9524,
        "tz": "+05:30"
      },
      {
        "name": "Baharampur",
        "lat": "24° 06' N",
        "lon": "88° 16' E",
        "latDec": 24.0988,
        "lonDec": 88.2685,
        "tz": "+05:30"
      },
      {
        "name": "Balurghat",
        "lat": "25° 13' N",
        "lon": "88° 46' E",
        "latDec": 25.2167,
        "lonDec": 88.7667,
        "tz": "+05:30"
      },
      {
        "name": "Bankura",
        "lat": "23° 14' N",
        "lon": "87° 05' E",
        "latDec": 23.2319,
        "lonDec": 87.0784,
        "tz": "+05:30"
      },
      {
        "name": "Bardhaman",
        "lat": "23° 14' N",
        "lon": "87° 52' E",
        "latDec": 23.2324,
        "lonDec": 87.8615,
        "tz": "+05:30"
      },
      {
        "name": "Dakshineswar",
        "lat": "22° 39' N",
        "lon": "88° 21' E",
        "latDec": 22.6547,
        "lonDec": 88.3575,
        "tz": "+05:30"
      },
      {
        "name": "Darjeeling",
        "lat": "27° 02' N",
        "lon": "88° 16' E",
        "latDec": 27.041,
        "lonDec": 88.2663,
        "tz": "+05:30"
      },
      {
        "name": "Durgapur",
        "lat": "23° 31' N",
        "lon": "87° 19' E",
        "latDec": 23.5204,
        "lonDec": 87.3119,
        "tz": "+05:30"
      },
      {
        "name": "Habra",
        "lat": "22° 51' N",
        "lon": "88° 38' E",
        "latDec": 22.8458,
        "lonDec": 88.6322,
        "tz": "+05:30"
      },
      {
        "name": "Haldia",
        "lat": "22° 04' N",
        "lon": "88° 04' E",
        "latDec": 22.0667,
        "lonDec": 88.0698,
        "tz": "+05:30"
      },
      {
        "name": "Howrah",
        "lat": "22° 36' N",
        "lon": "88° 16' E",
        "latDec": 22.5958,
        "lonDec": 88.2636,
        "tz": "+05:30"
      },
      {
        "name": "Jalpaiguri",
        "lat": "26° 32' N",
        "lon": "88° 43' E",
        "latDec": 26.5411,
        "lonDec": 88.7196,
        "tz": "+05:30"
      },
      {
        "name": "Kalighat",
        "lat": "22° 31' N",
        "lon": "88° 21' E",
        "latDec": 22.5208,
        "lonDec": 88.3431,
        "tz": "+05:30"
      },
      {
        "name": "Kalimpong",
        "lat": "27° 04' N",
        "lon": "88° 28' E",
        "latDec": 27.0667,
        "lonDec": 88.4667,
        "tz": "+05:30"
      },
      {
        "name": "Kamarpukur",
        "lat": "22° 54' N",
        "lon": "87° 39' E",
        "latDec": 22.9,
        "lonDec": 87.65,
        "tz": "+05:30"
      },
      {
        "name": "Kharagpur",
        "lat": "22° 21' N",
        "lon": "87° 14' E",
        "latDec": 22.346,
        "lonDec": 87.232,
        "tz": "+05:30"
      },
      {
        "name": "Kolkata",
        "lat": "22° 34' N",
        "lon": "88° 22' E",
        "latDec": 22.5726,
        "lonDec": 88.3639,
        "tz": "+05:30"
      },
      {
        "name": "Krishnanagar",
        "lat": "23° 24' N",
        "lon": "88° 30' E",
        "latDec": 23.4013,
        "lonDec": 88.5002,
        "tz": "+05:30"
      },
      {
        "name": "Malda (English Bazar)",
        "lat": "25° 01' N",
        "lon": "88° 08' E",
        "latDec": 25.0108,
        "lonDec": 88.1411,
        "tz": "+05:30"
      },
      {
        "name": "Mayapur",
        "lat": "23° 25' N",
        "lon": "88° 23' E",
        "latDec": 23.4244,
        "lonDec": 88.39,
        "tz": "+05:30"
      },
      {
        "name": "Midnapore (Medinipur)",
        "lat": "22° 26' N",
        "lon": "87° 19' E",
        "latDec": 22.4257,
        "lonDec": 87.3199,
        "tz": "+05:30"
      },
      {
        "name": "Nabadwip",
        "lat": "23° 24' N",
        "lon": "88° 22' E",
        "latDec": 23.4072,
        "lonDec": 88.3667,
        "tz": "+05:30"
      },
      {
        "name": "Raiganj",
        "lat": "25° 37' N",
        "lon": "88° 07' E",
        "latDec": 25.6178,
        "lonDec": 88.1242,
        "tz": "+05:30"
      },
      {
        "name": "Siliguri",
        "lat": "26° 44' N",
        "lon": "88° 24' E",
        "latDec": 26.7271,
        "lonDec": 88.3953,
        "tz": "+05:30"
      },
      {
        "name": "Tarapith",
        "lat": "24° 07' N",
        "lon": "87° 48' E",
        "latDec": 24.1136,
        "lonDec": 87.8,
        "tz": "+05:30"
      }
    ],
    "Bihar": [
      {
        "name": "Arrah",
        "lat": "25° 33' N",
        "lon": "84° 40' E",
        "latDec": 25.556,
        "lonDec": 84.6603,
        "tz": "+05:30"
      },
      {
        "name": "Aurangabad",
        "lat": "24° 45' N",
        "lon": "84° 22' E",
        "latDec": 24.7539,
        "lonDec": 84.3742,
        "tz": "+05:30"
      },
      {
        "name": "Begusarai",
        "lat": "25° 25' N",
        "lon": "86° 08' E",
        "latDec": 25.4182,
        "lonDec": 86.1272,
        "tz": "+05:30"
      },
      {
        "name": "Bettiah",
        "lat": "26° 48' N",
        "lon": "84° 30' E",
        "latDec": 26.8024,
        "lonDec": 84.5028,
        "tz": "+05:30"
      },
      {
        "name": "Bhagalpur",
        "lat": "25° 15' N",
        "lon": "87° 01' E",
        "latDec": 25.2425,
        "lonDec": 87.0169,
        "tz": "+05:30"
      },
      {
        "name": "Bihar Sharif",
        "lat": "25° 12' N",
        "lon": "85° 31' E",
        "latDec": 25.1982,
        "lonDec": 85.5149,
        "tz": "+05:30"
      },
      {
        "name": "Bodh Gaya",
        "lat": "24° 42' N",
        "lon": "84° 59' E",
        "latDec": 24.6961,
        "lonDec": 84.9869,
        "tz": "+05:30"
      },
      {
        "name": "Buxar",
        "lat": "25° 35' N",
        "lon": "83° 59' E",
        "latDec": 25.5788,
        "lonDec": 83.9777,
        "tz": "+05:30"
      },
      {
        "name": "Chhapra",
        "lat": "25° 47' N",
        "lon": "84° 44' E",
        "latDec": 25.7848,
        "lonDec": 84.7274,
        "tz": "+05:30"
      },
      {
        "name": "Danapur",
        "lat": "25° 38' N",
        "lon": "85° 03' E",
        "latDec": 25.6333,
        "lonDec": 85.05,
        "tz": "+05:30"
      },
      {
        "name": "Darbhanga",
        "lat": "26° 09' N",
        "lon": "85° 54' E",
        "latDec": 26.1542,
        "lonDec": 85.8918,
        "tz": "+05:30"
      },
      {
        "name": "Dehri",
        "lat": "24° 55' N",
        "lon": "84° 11' E",
        "latDec": 24.9089,
        "lonDec": 84.1856,
        "tz": "+05:30"
      },
      {
        "name": "Gaya",
        "lat": "24° 47' N",
        "lon": "85° 00' E",
        "latDec": 24.7914,
        "lonDec": 85.0002,
        "tz": "+05:30"
      },
      {
        "name": "Hajipur",
        "lat": "25° 41' N",
        "lon": "85° 13' E",
        "latDec": 25.6858,
        "lonDec": 85.2146,
        "tz": "+05:30"
      },
      {
        "name": "Jamalpur",
        "lat": "25° 19' N",
        "lon": "86° 29' E",
        "latDec": 25.3117,
        "lonDec": 86.4883,
        "tz": "+05:30"
      },
      {
        "name": "Jehanabad",
        "lat": "25° 13' N",
        "lon": "84° 59' E",
        "latDec": 25.2142,
        "lonDec": 84.9856,
        "tz": "+05:30"
      },
      {
        "name": "Katihar",
        "lat": "25° 32' N",
        "lon": "87° 34' E",
        "latDec": 25.5411,
        "lonDec": 87.567,
        "tz": "+05:30"
      },
      {
        "name": "Kishanganj",
        "lat": "26° 06' N",
        "lon": "87° 56' E",
        "latDec": 26.0968,
        "lonDec": 87.9406,
        "tz": "+05:30"
      },
      {
        "name": "Madhubani",
        "lat": "26° 21' N",
        "lon": "86° 04' E",
        "latDec": 26.3537,
        "lonDec": 86.0719,
        "tz": "+05:30"
      },
      {
        "name": "Motihari",
        "lat": "26° 39' N",
        "lon": "84° 55' E",
        "latDec": 26.647,
        "lonDec": 84.9089,
        "tz": "+05:30"
      },
      {
        "name": "Munger",
        "lat": "25° 23' N",
        "lon": "86° 28' E",
        "latDec": 25.3757,
        "lonDec": 86.4744,
        "tz": "+05:30"
      },
      {
        "name": "Muzaffarpur",
        "lat": "26° 07' N",
        "lon": "85° 22' E",
        "latDec": 26.1209,
        "lonDec": 85.3647,
        "tz": "+05:30"
      },
      {
        "name": "Nawada",
        "lat": "24° 53' N",
        "lon": "85° 33' E",
        "latDec": 24.8872,
        "lonDec": 85.5422,
        "tz": "+05:30"
      },
      {
        "name": "Patna",
        "lat": "25° 36' N",
        "lon": "85° 08' E",
        "latDec": 25.5941,
        "lonDec": 85.1376,
        "tz": "+05:30"
      },
      {
        "name": "Purnia",
        "lat": "25° 47' N",
        "lon": "87° 29' E",
        "latDec": 25.7771,
        "lonDec": 87.4753,
        "tz": "+05:30"
      },
      {
        "name": "Rajgir",
        "lat": "25° 02' N",
        "lon": "85° 25' E",
        "latDec": 25.0306,
        "lonDec": 85.4217,
        "tz": "+05:30"
      },
      {
        "name": "Saharsa",
        "lat": "25° 53' N",
        "lon": "86° 36' E",
        "latDec": 25.8835,
        "lonDec": 86.6006,
        "tz": "+05:30"
      },
      {
        "name": "Sasaram",
        "lat": "24° 57' N",
        "lon": "84° 02' E",
        "latDec": 24.9522,
        "lonDec": 84.0317,
        "tz": "+05:30"
      },
      {
        "name": "Sitamarhi",
        "lat": "26° 36' N",
        "lon": "85° 30' E",
        "latDec": 26.5936,
        "lonDec": 85.4925,
        "tz": "+05:30"
      },
      {
        "name": "Siwan",
        "lat": "26° 13' N",
        "lon": "84° 22' E",
        "latDec": 26.2243,
        "lonDec": 84.36,
        "tz": "+05:30"
      }
    ],
    "Madhya Pradesh": [
      {
        "name": "Amarkantak",
        "lat": "22° 40' N",
        "lon": "81° 46' E",
        "latDec": 22.67,
        "lonDec": 81.76,
        "tz": "+05:30"
      },
      {
        "name": "Betul",
        "lat": "21° 54' N",
        "lon": "77° 54' E",
        "latDec": 21.9042,
        "lonDec": 77.9014,
        "tz": "+05:30"
      },
      {
        "name": "Bhind",
        "lat": "26° 34' N",
        "lon": "78° 47' E",
        "latDec": 26.5652,
        "lonDec": 78.7891,
        "tz": "+05:30"
      },
      {
        "name": "Bhopal",
        "lat": "23° 16' N",
        "lon": "77° 25' E",
        "latDec": 23.2599,
        "lonDec": 77.4126,
        "tz": "+05:30"
      },
      {
        "name": "Burhanpur",
        "lat": "21° 19' N",
        "lon": "76° 14' E",
        "latDec": 21.3145,
        "lonDec": 76.2299,
        "tz": "+05:30"
      },
      {
        "name": "Chhatarpur",
        "lat": "24° 55' N",
        "lon": "79° 35' E",
        "latDec": 24.9161,
        "lonDec": 79.5883,
        "tz": "+05:30"
      },
      {
        "name": "Chhindwara",
        "lat": "22° 03' N",
        "lon": "78° 56' E",
        "latDec": 22.0574,
        "lonDec": 78.9382,
        "tz": "+05:30"
      },
      {
        "name": "Damoh",
        "lat": "23° 50' N",
        "lon": "79° 27' E",
        "latDec": 23.8323,
        "lonDec": 79.4422,
        "tz": "+05:30"
      },
      {
        "name": "Datia",
        "lat": "25° 40' N",
        "lon": "78° 28' E",
        "latDec": 25.6681,
        "lonDec": 78.4608,
        "tz": "+05:30"
      },
      {
        "name": "Dewas",
        "lat": "22° 58' N",
        "lon": "76° 03' E",
        "latDec": 22.9676,
        "lonDec": 76.0534,
        "tz": "+05:30"
      },
      {
        "name": "Guna",
        "lat": "24° 39' N",
        "lon": "77° 18' E",
        "latDec": 24.6542,
        "lonDec": 77.3078,
        "tz": "+05:30"
      },
      {
        "name": "Gwalior",
        "lat": "26° 13' N",
        "lon": "78° 11' E",
        "latDec": 26.2183,
        "lonDec": 78.1828,
        "tz": "+05:30"
      },
      {
        "name": "Hoshangabad (Narmadapuram)",
        "lat": "22° 45' N",
        "lon": "77° 44' E",
        "latDec": 22.7519,
        "lonDec": 77.7289,
        "tz": "+05:30"
      },
      {
        "name": "Indore",
        "lat": "22° 43' N",
        "lon": "75° 51' E",
        "latDec": 22.7196,
        "lonDec": 75.8577,
        "tz": "+05:30"
      },
      {
        "name": "Itarsi",
        "lat": "22° 37' N",
        "lon": "77° 46' E",
        "latDec": 22.6128,
        "lonDec": 77.7611,
        "tz": "+05:30"
      },
      {
        "name": "Jabalpur",
        "lat": "23° 11' N",
        "lon": "79° 59' E",
        "latDec": 23.1815,
        "lonDec": 79.9864,
        "tz": "+05:30"
      },
      {
        "name": "Katni (Murwara)",
        "lat": "23° 50' N",
        "lon": "80° 24' E",
        "latDec": 23.8343,
        "lonDec": 80.3956,
        "tz": "+05:30"
      },
      {
        "name": "Khandwa",
        "lat": "21° 50' N",
        "lon": "76° 21' E",
        "latDec": 21.8314,
        "lonDec": 76.3498,
        "tz": "+05:30"
      },
      {
        "name": "Khargone",
        "lat": "21° 49' N",
        "lon": "75° 37' E",
        "latDec": 21.8239,
        "lonDec": 75.6144,
        "tz": "+05:30"
      },
      {
        "name": "Maihar",
        "lat": "24° 16' N",
        "lon": "80° 45' E",
        "latDec": 24.2667,
        "lonDec": 80.75,
        "tz": "+05:30"
      },
      {
        "name": "Mandsaur",
        "lat": "24° 04' N",
        "lon": "75° 04' E",
        "latDec": 24.0722,
        "lonDec": 75.0694,
        "tz": "+05:30"
      },
      {
        "name": "Neemuch",
        "lat": "24° 27' N",
        "lon": "74° 52' E",
        "latDec": 24.4578,
        "lonDec": 74.8722,
        "tz": "+05:30"
      },
      {
        "name": "Omkareshwar",
        "lat": "22° 15' N",
        "lon": "76° 09' E",
        "latDec": 22.2436,
        "lonDec": 76.1517,
        "tz": "+05:30"
      },
      {
        "name": "Ratlam",
        "lat": "23° 20' N",
        "lon": "75° 02' E",
        "latDec": 23.3315,
        "lonDec": 75.0367,
        "tz": "+05:30"
      },
      {
        "name": "Rewa",
        "lat": "24° 32' N",
        "lon": "81° 18' E",
        "latDec": 24.5373,
        "lonDec": 81.3042,
        "tz": "+05:30"
      },
      {
        "name": "Sagar",
        "lat": "23° 50' N",
        "lon": "78° 44' E",
        "latDec": 23.8388,
        "lonDec": 78.7378,
        "tz": "+05:30"
      },
      {
        "name": "Satna",
        "lat": "24° 36' N",
        "lon": "80° 50' E",
        "latDec": 24.6005,
        "lonDec": 80.8322,
        "tz": "+05:30"
      },
      {
        "name": "Sehore",
        "lat": "23° 12' N",
        "lon": "77° 05' E",
        "latDec": 23.2031,
        "lonDec": 77.0844,
        "tz": "+05:30"
      },
      {
        "name": "Shivpuri",
        "lat": "25° 26' N",
        "lon": "77° 40' E",
        "latDec": 25.4319,
        "lonDec": 77.6649,
        "tz": "+05:30"
      },
      {
        "name": "Singrauli",
        "lat": "24° 12' N",
        "lon": "82° 40' E",
        "latDec": 24.1992,
        "lonDec": 82.6645,
        "tz": "+05:30"
      },
      {
        "name": "Ujjain",
        "lat": "23° 11' N",
        "lon": "75° 47' E",
        "latDec": 23.1765,
        "lonDec": 75.7885,
        "tz": "+05:30"
      },
      {
        "name": "Vidisha",
        "lat": "23° 31' N",
        "lon": "77° 49' E",
        "latDec": 23.5239,
        "lonDec": 77.8144,
        "tz": "+05:30"
      }
    ],
    "Odisha": [
      {
        "name": "Balasore (Baleswar)",
        "lat": "21° 30' N",
        "lon": "86° 55' E",
        "latDec": 21.4934,
        "lonDec": 86.9135,
        "tz": "+05:30"
      },
      {
        "name": "Bargarh",
        "lat": "21° 20' N",
        "lon": "83° 37' E",
        "latDec": 21.3333,
        "lonDec": 83.6167,
        "tz": "+05:30"
      },
      {
        "name": "Baripada",
        "lat": "21° 56' N",
        "lon": "86° 44' E",
        "latDec": 21.9322,
        "lonDec": 86.7369,
        "tz": "+05:30"
      },
      {
        "name": "Berhampur (Brahmapur)",
        "lat": "19° 19' N",
        "lon": "84° 48' E",
        "latDec": 19.315,
        "lonDec": 84.7941,
        "tz": "+05:30"
      },
      {
        "name": "Bhadrak",
        "lat": "21° 03' N",
        "lon": "86° 31' E",
        "latDec": 21.0574,
        "lonDec": 86.5173,
        "tz": "+05:30"
      },
      {
        "name": "Bhubaneswar",
        "lat": "20° 18' N",
        "lon": "85° 49' E",
        "latDec": 20.2961,
        "lonDec": 85.8245,
        "tz": "+05:30"
      },
      {
        "name": "Bolangir (Balangir)",
        "lat": "20° 43' N",
        "lon": "83° 29' E",
        "latDec": 20.7106,
        "lonDec": 83.4844,
        "tz": "+05:30"
      },
      {
        "name": "Cuttack",
        "lat": "20° 28' N",
        "lon": "85° 53' E",
        "latDec": 20.4625,
        "lonDec": 85.8828,
        "tz": "+05:30"
      },
      {
        "name": "Dhenkanal",
        "lat": "20° 40' N",
        "lon": "85° 36' E",
        "latDec": 20.6667,
        "lonDec": 85.6,
        "tz": "+05:30"
      },
      {
        "name": "Jeypore",
        "lat": "18° 51' N",
        "lon": "82° 34' E",
        "latDec": 18.8561,
        "lonDec": 82.5694,
        "tz": "+05:30"
      },
      {
        "name": "Jharsuguda",
        "lat": "21° 51' N",
        "lon": "84° 00' E",
        "latDec": 21.8553,
        "lonDec": 84.0061,
        "tz": "+05:30"
      },
      {
        "name": "Kendrapara",
        "lat": "20° 30' N",
        "lon": "86° 25' E",
        "latDec": 20.5019,
        "lonDec": 86.4222,
        "tz": "+05:30"
      },
      {
        "name": "Konark",
        "lat": "19° 53' N",
        "lon": "86° 06' E",
        "latDec": 19.8876,
        "lonDec": 86.0945,
        "tz": "+05:30"
      },
      {
        "name": "Puri",
        "lat": "19° 49' N",
        "lon": "85° 50' E",
        "latDec": 19.8135,
        "lonDec": 85.8312,
        "tz": "+05:30"
      },
      {
        "name": "Rayagada",
        "lat": "19° 10' N",
        "lon": "83° 25' E",
        "latDec": 19.1667,
        "lonDec": 83.4167,
        "tz": "+05:30"
      },
      {
        "name": "Rourkela",
        "lat": "22° 16' N",
        "lon": "84° 51' E",
        "latDec": 22.2604,
        "lonDec": 84.8536,
        "tz": "+05:30"
      },
      {
        "name": "Sambalpur",
        "lat": "21° 28' N",
        "lon": "83° 59' E",
        "latDec": 21.4669,
        "lonDec": 83.9812,
        "tz": "+05:30"
      }
    ],
    "Punjab": [
      {
        "name": "Abohar",
        "lat": "30° 09' N",
        "lon": "74° 12' E",
        "latDec": 30.1453,
        "lonDec": 74.1994,
        "tz": "+05:30"
      },
      {
        "name": "Amritsar",
        "lat": "31° 38' N",
        "lon": "74° 52' E",
        "latDec": 31.634,
        "lonDec": 74.8723,
        "tz": "+05:30"
      },
      {
        "name": "Anandpur Sahib",
        "lat": "31° 14' N",
        "lon": "76° 30' E",
        "latDec": 31.2361,
        "lonDec": 76.4989,
        "tz": "+05:30"
      },
      {
        "name": "Barnala",
        "lat": "30° 23' N",
        "lon": "75° 33' E",
        "latDec": 30.3819,
        "lonDec": 75.5469,
        "tz": "+05:30"
      },
      {
        "name": "Batala",
        "lat": "31° 49' N",
        "lon": "75° 12' E",
        "latDec": 31.8186,
        "lonDec": 75.2028,
        "tz": "+05:30"
      },
      {
        "name": "Bathinda",
        "lat": "30° 13' N",
        "lon": "74° 57' E",
        "latDec": 30.211,
        "lonDec": 74.9455,
        "tz": "+05:30"
      },
      {
        "name": "Firozpur",
        "lat": "30° 55' N",
        "lon": "74° 37' E",
        "latDec": 30.9237,
        "lonDec": 74.6122,
        "tz": "+05:30"
      },
      {
        "name": "Hoshiarpur",
        "lat": "31° 32' N",
        "lon": "75° 55' E",
        "latDec": 31.5273,
        "lonDec": 75.9149,
        "tz": "+05:30"
      },
      {
        "name": "Jalandhar",
        "lat": "31° 20' N",
        "lon": "75° 35' E",
        "latDec": 31.326,
        "lonDec": 75.5762,
        "tz": "+05:30"
      },
      {
        "name": "Kapurthala",
        "lat": "31° 23' N",
        "lon": "75° 23' E",
        "latDec": 31.38,
        "lonDec": 75.38,
        "tz": "+05:30"
      },
      {
        "name": "Khanna",
        "lat": "30° 42' N",
        "lon": "76° 13' E",
        "latDec": 30.7072,
        "lonDec": 76.2169,
        "tz": "+05:30"
      },
      {
        "name": "Ludhiana",
        "lat": "30° 54' N",
        "lon": "75° 51' E",
        "latDec": 30.901,
        "lonDec": 75.8573,
        "tz": "+05:30"
      },
      {
        "name": "Malerkotla",
        "lat": "30° 31' N",
        "lon": "75° 53' E",
        "latDec": 30.525,
        "lonDec": 75.89,
        "tz": "+05:30"
      },
      {
        "name": "Moga",
        "lat": "30° 49' N",
        "lon": "75° 10' E",
        "latDec": 30.8165,
        "lonDec": 75.1717,
        "tz": "+05:30"
      },
      {
        "name": "Mohali (SAS Nagar)",
        "lat": "30° 42' N",
        "lon": "76° 43' E",
        "latDec": 30.7046,
        "lonDec": 76.7179,
        "tz": "+05:30"
      },
      {
        "name": "Muktsar",
        "lat": "30° 28' N",
        "lon": "74° 31' E",
        "latDec": 30.4744,
        "lonDec": 74.5161,
        "tz": "+05:30"
      },
      {
        "name": "Pathankot",
        "lat": "32° 16' N",
        "lon": "75° 39' E",
        "latDec": 32.2684,
        "lonDec": 75.6529,
        "tz": "+05:30"
      },
      {
        "name": "Patiala",
        "lat": "30° 20' N",
        "lon": "76° 23' E",
        "latDec": 30.3398,
        "lonDec": 76.3869,
        "tz": "+05:30"
      },
      {
        "name": "Phagwara",
        "lat": "31° 13' N",
        "lon": "75° 46' E",
        "latDec": 31.224,
        "lonDec": 75.7708,
        "tz": "+05:30"
      },
      {
        "name": "Rajpura",
        "lat": "30° 29' N",
        "lon": "76° 36' E",
        "latDec": 30.4839,
        "lonDec": 76.5939,
        "tz": "+05:30"
      }
    ],
    "Haryana": [
      {
        "name": "Ambala",
        "lat": "30° 23' N",
        "lon": "76° 47' E",
        "latDec": 30.3782,
        "lonDec": 76.7767,
        "tz": "+05:30"
      },
      {
        "name": "Bahadurgarh",
        "lat": "28° 42' N",
        "lon": "76° 55' E",
        "latDec": 28.6925,
        "lonDec": 76.924,
        "tz": "+05:30"
      },
      {
        "name": "Bhiwani",
        "lat": "28° 48' N",
        "lon": "76° 08' E",
        "latDec": 28.7932,
        "lonDec": 76.139,
        "tz": "+05:30"
      },
      {
        "name": "Faridabad",
        "lat": "28° 25' N",
        "lon": "77° 19' E",
        "latDec": 28.4089,
        "lonDec": 77.3178,
        "tz": "+05:30"
      },
      {
        "name": "Fatehabad",
        "lat": "29° 31' N",
        "lon": "75° 27' E",
        "latDec": 29.515,
        "lonDec": 75.4544,
        "tz": "+05:30"
      },
      {
        "name": "Gurgaon (Gurugram)",
        "lat": "28° 28' N",
        "lon": "77° 02' E",
        "latDec": 28.4595,
        "lonDec": 77.0266,
        "tz": "+05:30"
      },
      {
        "name": "Hisar",
        "lat": "29° 09' N",
        "lon": "75° 43' E",
        "latDec": 29.1492,
        "lonDec": 75.7217,
        "tz": "+05:30"
      },
      {
        "name": "Jind",
        "lat": "29° 19' N",
        "lon": "76° 19' E",
        "latDec": 29.315,
        "lonDec": 76.315,
        "tz": "+05:30"
      },
      {
        "name": "Kaithal",
        "lat": "29° 48' N",
        "lon": "76° 24' E",
        "latDec": 29.8015,
        "lonDec": 76.3999,
        "tz": "+05:30"
      },
      {
        "name": "Karnal",
        "lat": "29° 41' N",
        "lon": "76° 59' E",
        "latDec": 29.6857,
        "lonDec": 76.9905,
        "tz": "+05:30"
      },
      {
        "name": "Kurukshetra (Thanesar)",
        "lat": "29° 58' N",
        "lon": "76° 53' E",
        "latDec": 29.9695,
        "lonDec": 76.8783,
        "tz": "+05:30"
      },
      {
        "name": "Palwal",
        "lat": "28° 09' N",
        "lon": "77° 20' E",
        "latDec": 28.1447,
        "lonDec": 77.326,
        "tz": "+05:30"
      },
      {
        "name": "Panchkula",
        "lat": "30° 42' N",
        "lon": "76° 52' E",
        "latDec": 30.6942,
        "lonDec": 76.8606,
        "tz": "+05:30"
      },
      {
        "name": "Panipat",
        "lat": "29° 23' N",
        "lon": "76° 58' E",
        "latDec": 29.3909,
        "lonDec": 76.9635,
        "tz": "+05:30"
      },
      {
        "name": "Rewari",
        "lat": "28° 12' N",
        "lon": "76° 37' E",
        "latDec": 28.192,
        "lonDec": 76.6191,
        "tz": "+05:30"
      },
      {
        "name": "Rohtak",
        "lat": "28° 54' N",
        "lon": "76° 36' E",
        "latDec": 28.8955,
        "lonDec": 76.6066,
        "tz": "+05:30"
      },
      {
        "name": "Sirsa",
        "lat": "29° 32' N",
        "lon": "75° 02' E",
        "latDec": 29.5349,
        "lonDec": 75.0286,
        "tz": "+05:30"
      },
      {
        "name": "Sonipat",
        "lat": "28° 60' N",
        "lon": "77° 01' E",
        "latDec": 28.9931,
        "lonDec": 77.0151,
        "tz": "+05:30"
      },
      {
        "name": "Yamunanagar",
        "lat": "30° 08' N",
        "lon": "77° 16' E",
        "latDec": 30.129,
        "lonDec": 77.2674,
        "tz": "+05:30"
      }
    ],
    "Jharkhand": [
      {
        "name": "Bokaro Steel City",
        "lat": "23° 40' N",
        "lon": "86° 09' E",
        "latDec": 23.6693,
        "lonDec": 86.1511,
        "tz": "+05:30"
      },
      {
        "name": "Chaibasa",
        "lat": "22° 33' N",
        "lon": "85° 49' E",
        "latDec": 22.5539,
        "lonDec": 85.8089,
        "tz": "+05:30"
      },
      {
        "name": "Deoghar (Baidyanath Dham)",
        "lat": "24° 29' N",
        "lon": "86° 42' E",
        "latDec": 24.4826,
        "lonDec": 86.7001,
        "tz": "+05:30"
      },
      {
        "name": "Dhanbad",
        "lat": "23° 48' N",
        "lon": "86° 26' E",
        "latDec": 23.7957,
        "lonDec": 86.4304,
        "tz": "+05:30"
      },
      {
        "name": "Dumka",
        "lat": "24° 16' N",
        "lon": "87° 15' E",
        "latDec": 24.2689,
        "lonDec": 87.2489,
        "tz": "+05:30"
      },
      {
        "name": "Giridih",
        "lat": "24° 11' N",
        "lon": "86° 18' E",
        "latDec": 24.1869,
        "lonDec": 86.3075,
        "tz": "+05:30"
      },
      {
        "name": "Hazaribagh",
        "lat": "23° 60' N",
        "lon": "85° 22' E",
        "latDec": 23.9961,
        "lonDec": 85.3644,
        "tz": "+05:30"
      },
      {
        "name": "Jamshedpur",
        "lat": "22° 48' N",
        "lon": "86° 12' E",
        "latDec": 22.8046,
        "lonDec": 86.2029,
        "tz": "+05:30"
      },
      {
        "name": "Medininagar (Daltonganj)",
        "lat": "24° 02' N",
        "lon": "84° 04' E",
        "latDec": 24.0375,
        "lonDec": 84.0722,
        "tz": "+05:30"
      },
      {
        "name": "Parasnath (Sammed Shikharji)",
        "lat": "23° 58' N",
        "lon": "86° 08' E",
        "latDec": 23.9633,
        "lonDec": 86.1367,
        "tz": "+05:30"
      },
      {
        "name": "Ramgarh",
        "lat": "23° 38' N",
        "lon": "85° 31' E",
        "latDec": 23.6289,
        "lonDec": 85.5144,
        "tz": "+05:30"
      },
      {
        "name": "Ranchi",
        "lat": "23° 21' N",
        "lon": "85° 19' E",
        "latDec": 23.3441,
        "lonDec": 85.3096,
        "tz": "+05:30"
      },
      {
        "name": "Sahibganj",
        "lat": "25° 15' N",
        "lon": "87° 39' E",
        "latDec": 25.2444,
        "lonDec": 87.6433,
        "tz": "+05:30"
      }
    ],
    "Chhattisgarh": [
      {
        "name": "Ambikapur",
        "lat": "23° 07' N",
        "lon": "83° 12' E",
        "latDec": 23.1186,
        "lonDec": 83.1978,
        "tz": "+05:30"
      },
      {
        "name": "Bhilai-Durg",
        "lat": "21° 12' N",
        "lon": "81° 17' E",
        "latDec": 21.1938,
        "lonDec": 81.2849,
        "tz": "+05:30"
      },
      {
        "name": "Bilaspur",
        "lat": "22° 05' N",
        "lon": "82° 08' E",
        "latDec": 22.0797,
        "lonDec": 82.1409,
        "tz": "+05:30"
      },
      {
        "name": "Champa",
        "lat": "22° 02' N",
        "lon": "82° 39' E",
        "latDec": 22.04,
        "lonDec": 82.65,
        "tz": "+05:30"
      },
      {
        "name": "Dhamtari",
        "lat": "20° 42' N",
        "lon": "81° 33' E",
        "latDec": 20.7072,
        "lonDec": 81.5497,
        "tz": "+05:30"
      },
      {
        "name": "Jagdalpur",
        "lat": "19° 04' N",
        "lon": "82° 00' E",
        "latDec": 19.0744,
        "lonDec": 82.0081,
        "tz": "+05:30"
      },
      {
        "name": "Kanker",
        "lat": "20° 16' N",
        "lon": "81° 30' E",
        "latDec": 20.2719,
        "lonDec": 81.4931,
        "tz": "+05:30"
      },
      {
        "name": "Korba",
        "lat": "22° 22' N",
        "lon": "82° 45' E",
        "latDec": 22.3595,
        "lonDec": 82.7501,
        "tz": "+05:30"
      },
      {
        "name": "Mahasamund",
        "lat": "21° 07' N",
        "lon": "82° 06' E",
        "latDec": 21.1094,
        "lonDec": 82.0967,
        "tz": "+05:30"
      },
      {
        "name": "Raigarh",
        "lat": "21° 54' N",
        "lon": "83° 24' E",
        "latDec": 21.8974,
        "lonDec": 83.395,
        "tz": "+05:30"
      },
      {
        "name": "Raipur",
        "lat": "21° 15' N",
        "lon": "81° 38' E",
        "latDec": 21.2514,
        "lonDec": 81.6296,
        "tz": "+05:30"
      },
      {
        "name": "Rajnandgaon",
        "lat": "21° 06' N",
        "lon": "81° 02' E",
        "latDec": 21.0972,
        "lonDec": 81.0319,
        "tz": "+05:30"
      }
    ],
    "Assam": [
      {
        "name": "Bongaigaon",
        "lat": "26° 30' N",
        "lon": "90° 33' E",
        "latDec": 26.5028,
        "lonDec": 90.5572,
        "tz": "+05:30"
      },
      {
        "name": "Dhubri",
        "lat": "26° 01' N",
        "lon": "89° 58' E",
        "latDec": 26.0204,
        "lonDec": 89.9744,
        "tz": "+05:30"
      },
      {
        "name": "Dibrugarh",
        "lat": "27° 28' N",
        "lon": "94° 55' E",
        "latDec": 27.4728,
        "lonDec": 94.912,
        "tz": "+05:30"
      },
      {
        "name": "Diphu",
        "lat": "25° 51' N",
        "lon": "93° 26' E",
        "latDec": 25.8458,
        "lonDec": 93.4322,
        "tz": "+05:30"
      },
      {
        "name": "Goalpara",
        "lat": "26° 11' N",
        "lon": "90° 37' E",
        "latDec": 26.1772,
        "lonDec": 90.6247,
        "tz": "+05:30"
      },
      {
        "name": "Guwahati",
        "lat": "26° 09' N",
        "lon": "91° 44' E",
        "latDec": 26.1445,
        "lonDec": 91.7362,
        "tz": "+05:30"
      },
      {
        "name": "Jorhat",
        "lat": "26° 45' N",
        "lon": "94° 12' E",
        "latDec": 26.7509,
        "lonDec": 94.2037,
        "tz": "+05:30"
      },
      {
        "name": "Kamakhya",
        "lat": "26° 10' N",
        "lon": "91° 42' E",
        "latDec": 26.1664,
        "lonDec": 91.7058,
        "tz": "+05:30"
      },
      {
        "name": "Karimganj",
        "lat": "24° 52' N",
        "lon": "92° 21' E",
        "latDec": 24.8667,
        "lonDec": 92.35,
        "tz": "+05:30"
      },
      {
        "name": "Nagaon",
        "lat": "26° 21' N",
        "lon": "92° 41' E",
        "latDec": 26.3467,
        "lonDec": 92.684,
        "tz": "+05:30"
      },
      {
        "name": "North Lakhimpur",
        "lat": "27° 14' N",
        "lon": "94° 06' E",
        "latDec": 27.2344,
        "lonDec": 94.1044,
        "tz": "+05:30"
      },
      {
        "name": "Silchar",
        "lat": "24° 50' N",
        "lon": "92° 47' E",
        "latDec": 24.8333,
        "lonDec": 92.7789,
        "tz": "+05:30"
      },
      {
        "name": "Sivasagar",
        "lat": "26° 59' N",
        "lon": "94° 39' E",
        "latDec": 26.9822,
        "lonDec": 94.6425,
        "tz": "+05:30"
      },
      {
        "name": "Tezpur",
        "lat": "26° 39' N",
        "lon": "92° 48' E",
        "latDec": 26.6528,
        "lonDec": 92.7926,
        "tz": "+05:30"
      },
      {
        "name": "Tinsukia",
        "lat": "27° 30' N",
        "lon": "95° 21' E",
        "latDec": 27.4922,
        "lonDec": 95.3467,
        "tz": "+05:30"
      }
    ],
    "Himachal Pradesh": [
      {
        "name": "Baddi",
        "lat": "30° 57' N",
        "lon": "76° 47' E",
        "latDec": 30.9578,
        "lonDec": 76.7914,
        "tz": "+05:30"
      },
      {
        "name": "Bilaspur",
        "lat": "31° 20' N",
        "lon": "76° 46' E",
        "latDec": 31.3323,
        "lonDec": 76.7589,
        "tz": "+05:30"
      },
      {
        "name": "Chamba",
        "lat": "32° 33' N",
        "lon": "76° 08' E",
        "latDec": 32.5534,
        "lonDec": 76.1258,
        "tz": "+05:30"
      },
      {
        "name": "Dharamshala",
        "lat": "32° 13' N",
        "lon": "76° 19' E",
        "latDec": 32.219,
        "lonDec": 76.3234,
        "tz": "+05:30"
      },
      {
        "name": "Hamirpur",
        "lat": "31° 41' N",
        "lon": "76° 31' E",
        "latDec": 31.6862,
        "lonDec": 76.5213,
        "tz": "+05:30"
      },
      {
        "name": "Kangra",
        "lat": "32° 06' N",
        "lon": "76° 16' E",
        "latDec": 32.0998,
        "lonDec": 76.2691,
        "tz": "+05:30"
      },
      {
        "name": "Kullu",
        "lat": "31° 57' N",
        "lon": "77° 07' E",
        "latDec": 31.9579,
        "lonDec": 77.1095,
        "tz": "+05:30"
      },
      {
        "name": "Manali",
        "lat": "32° 15' N",
        "lon": "77° 11' E",
        "latDec": 32.2432,
        "lonDec": 77.1892,
        "tz": "+05:30"
      },
      {
        "name": "Mandi",
        "lat": "31° 35' N",
        "lon": "76° 55' E",
        "latDec": 31.5892,
        "lonDec": 76.9182,
        "tz": "+05:30"
      },
      {
        "name": "Nahan",
        "lat": "30° 34' N",
        "lon": "77° 18' E",
        "latDec": 30.5599,
        "lonDec": 77.2965,
        "tz": "+05:30"
      },
      {
        "name": "Palampur",
        "lat": "32° 07' N",
        "lon": "76° 32' E",
        "latDec": 32.1109,
        "lonDec": 76.5363,
        "tz": "+05:30"
      },
      {
        "name": "Shimla",
        "lat": "31° 06' N",
        "lon": "77° 10' E",
        "latDec": 31.1048,
        "lonDec": 77.1734,
        "tz": "+05:30"
      },
      {
        "name": "Solan",
        "lat": "30° 54' N",
        "lon": "77° 06' E",
        "latDec": 30.9045,
        "lonDec": 77.0967,
        "tz": "+05:30"
      },
      {
        "name": "Una",
        "lat": "31° 28' N",
        "lon": "76° 16' E",
        "latDec": 31.4685,
        "lonDec": 76.2708,
        "tz": "+05:30"
      }
    ],
    "Uttarakhand": [
      {
        "name": "Almora",
        "lat": "29° 36' N",
        "lon": "79° 40' E",
        "latDec": 29.5971,
        "lonDec": 79.6591,
        "tz": "+05:30"
      },
      {
        "name": "Badrinath",
        "lat": "30° 45' N",
        "lon": "79° 30' E",
        "latDec": 30.7433,
        "lonDec": 79.4938,
        "tz": "+05:30"
      },
      {
        "name": "Dehradun",
        "lat": "30° 19' N",
        "lon": "78° 02' E",
        "latDec": 30.3165,
        "lonDec": 78.0322,
        "tz": "+05:30"
      },
      {
        "name": "Gangotri",
        "lat": "30° 60' N",
        "lon": "78° 56' E",
        "latDec": 30.9947,
        "lonDec": 78.9398,
        "tz": "+05:30"
      },
      {
        "name": "Haldwani-Kathgodam",
        "lat": "29° 13' N",
        "lon": "79° 31' E",
        "latDec": 29.2183,
        "lonDec": 79.513,
        "tz": "+05:30"
      },
      {
        "name": "Haridwar",
        "lat": "29° 57' N",
        "lon": "78° 10' E",
        "latDec": 29.9457,
        "lonDec": 78.1642,
        "tz": "+05:30"
      },
      {
        "name": "Kashipur",
        "lat": "29° 13' N",
        "lon": "78° 58' E",
        "latDec": 29.2104,
        "lonDec": 78.9619,
        "tz": "+05:30"
      },
      {
        "name": "Kedarnath",
        "lat": "30° 44' N",
        "lon": "79° 04' E",
        "latDec": 30.7352,
        "lonDec": 79.0669,
        "tz": "+05:30"
      },
      {
        "name": "Mussoorie",
        "lat": "30° 28' N",
        "lon": "78° 04' E",
        "latDec": 30.4598,
        "lonDec": 78.0644,
        "tz": "+05:30"
      },
      {
        "name": "Nainital",
        "lat": "29° 24' N",
        "lon": "79° 27' E",
        "latDec": 29.3919,
        "lonDec": 79.4542,
        "tz": "+05:30"
      },
      {
        "name": "Pithoragarh",
        "lat": "29° 35' N",
        "lon": "80° 13' E",
        "latDec": 29.5828,
        "lonDec": 80.2181,
        "tz": "+05:30"
      },
      {
        "name": "Rishikesh",
        "lat": "30° 05' N",
        "lon": "78° 16' E",
        "latDec": 30.0869,
        "lonDec": 78.2676,
        "tz": "+05:30"
      },
      {
        "name": "Roorkee",
        "lat": "29° 51' N",
        "lon": "77° 53' E",
        "latDec": 29.8543,
        "lonDec": 77.888,
        "tz": "+05:30"
      },
      {
        "name": "Rudrapur",
        "lat": "28° 59' N",
        "lon": "79° 24' E",
        "latDec": 28.98,
        "lonDec": 79.4,
        "tz": "+05:30"
      },
      {
        "name": "Yamunotri",
        "lat": "31° 01' N",
        "lon": "78° 28' E",
        "latDec": 31.0142,
        "lonDec": 78.46,
        "tz": "+05:30"
      }
    ],
    "Goa": [
      {
        "name": "Bicholim",
        "lat": "15° 36' N",
        "lon": "73° 57' E",
        "latDec": 15.5936,
        "lonDec": 73.9553,
        "tz": "+05:30"
      },
      {
        "name": "Canacona",
        "lat": "15° 01' N",
        "lon": "74° 03' E",
        "latDec": 15.0167,
        "lonDec": 74.05,
        "tz": "+05:30"
      },
      {
        "name": "Curchorem",
        "lat": "15° 16' N",
        "lon": "74° 07' E",
        "latDec": 15.26,
        "lonDec": 74.11,
        "tz": "+05:30"
      },
      {
        "name": "Mapusa",
        "lat": "15° 36' N",
        "lon": "73° 49' E",
        "latDec": 15.5937,
        "lonDec": 73.8142,
        "tz": "+05:30"
      },
      {
        "name": "Margao (Madgaon)",
        "lat": "15° 17' N",
        "lon": "73° 59' E",
        "latDec": 15.2832,
        "lonDec": 73.9862,
        "tz": "+05:30"
      },
      {
        "name": "Panaji (Panjim)",
        "lat": "15° 29' N",
        "lon": "73° 50' E",
        "latDec": 15.4909,
        "lonDec": 73.8278,
        "tz": "+05:30"
      },
      {
        "name": "Ponda",
        "lat": "15° 24' N",
        "lon": "74° 01' E",
        "latDec": 15.4019,
        "lonDec": 74.015,
        "tz": "+05:30"
      },
      {
        "name": "Vasco da Gama",
        "lat": "15° 24' N",
        "lon": "73° 49' E",
        "latDec": 15.3982,
        "lonDec": 73.8113,
        "tz": "+05:30"
      }
    ],
    "Jammu and Kashmir": [
      {
        "name": "Amarnath Cave",
        "lat": "34° 13' N",
        "lon": "75° 30' E",
        "latDec": 34.2156,
        "lonDec": 75.5036,
        "tz": "+05:30"
      },
      {
        "name": "Anantnag",
        "lat": "33° 44' N",
        "lon": "75° 09' E",
        "latDec": 33.7311,
        "lonDec": 75.1522,
        "tz": "+05:30"
      },
      {
        "name": "Baramulla",
        "lat": "34° 12' N",
        "lon": "74° 22' E",
        "latDec": 34.198,
        "lonDec": 74.3636,
        "tz": "+05:30"
      },
      {
        "name": "Jammu",
        "lat": "32° 44' N",
        "lon": "74° 51' E",
        "latDec": 32.7266,
        "lonDec": 74.857,
        "tz": "+05:30"
      },
      {
        "name": "Kathua",
        "lat": "32° 22' N",
        "lon": "75° 31' E",
        "latDec": 32.3716,
        "lonDec": 75.5186,
        "tz": "+05:30"
      },
      {
        "name": "Katra (Vaishno Devi)",
        "lat": "32° 60' N",
        "lon": "74° 56' E",
        "latDec": 32.9922,
        "lonDec": 74.9317,
        "tz": "+05:30"
      },
      {
        "name": "Poonch",
        "lat": "33° 46' N",
        "lon": "74° 06' E",
        "latDec": 33.7719,
        "lonDec": 74.0931,
        "tz": "+05:30"
      },
      {
        "name": "Rajouri",
        "lat": "33° 22' N",
        "lon": "74° 19' E",
        "latDec": 33.3719,
        "lonDec": 74.3144,
        "tz": "+05:30"
      },
      {
        "name": "Sopore",
        "lat": "34° 18' N",
        "lon": "74° 28' E",
        "latDec": 34.2989,
        "lonDec": 74.4697,
        "tz": "+05:30"
      },
      {
        "name": "Srinagar",
        "lat": "34° 05' N",
        "lon": "74° 48' E",
        "latDec": 34.0837,
        "lonDec": 74.7973,
        "tz": "+05:30"
      },
      {
        "name": "Udhampur",
        "lat": "32° 56' N",
        "lon": "75° 08' E",
        "latDec": 32.9255,
        "lonDec": 75.1416,
        "tz": "+05:30"
      }
    ],
    "Ladakh": [
      {
        "name": "Diskit (Nubra)",
        "lat": "34° 33' N",
        "lon": "77° 33' E",
        "latDec": 34.5456,
        "lonDec": 77.5583,
        "tz": "+05:30"
      },
      {
        "name": "Kargil",
        "lat": "34° 33' N",
        "lon": "76° 08' E",
        "latDec": 34.5539,
        "lonDec": 76.1344,
        "tz": "+05:30"
      },
      {
        "name": "Leh",
        "lat": "34° 09' N",
        "lon": "77° 35' E",
        "latDec": 34.1526,
        "lonDec": 77.5771,
        "tz": "+05:30"
      }
    ],
    "Puducherry": [
      {
        "name": "Auroville",
        "lat": "11° 59' N",
        "lon": "79° 49' E",
        "latDec": 11.9866,
        "lonDec": 79.8117,
        "tz": "+05:30"
      },
      {
        "name": "Karaikal",
        "lat": "10° 56' N",
        "lon": "79° 50' E",
        "latDec": 10.9254,
        "lonDec": 79.838,
        "tz": "+05:30"
      },
      {
        "name": "Mahe",
        "lat": "11° 42' N",
        "lon": "75° 32' E",
        "latDec": 11.7006,
        "lonDec": 75.5344,
        "tz": "+05:30"
      },
      {
        "name": "Puducherry (Pondicherry)",
        "lat": "11° 56' N",
        "lon": "79° 48' E",
        "latDec": 11.9416,
        "lonDec": 79.8083,
        "tz": "+05:30"
      },
      {
        "name": "Yanam",
        "lat": "16° 44' N",
        "lon": "82° 13' E",
        "latDec": 16.7333,
        "lonDec": 82.2167,
        "tz": "+05:30"
      }
    ],
    "Chandigarh": [
      {
        "name": "Chandigarh",
        "lat": "30° 44' N",
        "lon": "76° 47' E",
        "latDec": 30.7333,
        "lonDec": 76.7794,
        "tz": "+05:30"
      }
    ],
    "Andaman and Nicobar Islands": [
      {
        "name": "Car Nicobar",
        "lat": "09° 10' N",
        "lon": "92° 49' E",
        "latDec": 9.1667,
        "lonDec": 92.8167,
        "tz": "+05:30"
      },
      {
        "name": "Diglipur",
        "lat": "13° 16' N",
        "lon": "92° 59' E",
        "latDec": 13.2667,
        "lonDec": 92.9833,
        "tz": "+05:30"
      },
      {
        "name": "Havelock Island (Swaraj Dweep)",
        "lat": "11° 59' N",
        "lon": "92° 59' E",
        "latDec": 11.98,
        "lonDec": 92.98,
        "tz": "+05:30"
      },
      {
        "name": "Port Blair",
        "lat": "11° 37' N",
        "lon": "92° 44' E",
        "latDec": 11.6234,
        "lonDec": 92.7265,
        "tz": "+05:30"
      }
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
      {
        "name": "Daman",
        "lat": "20° 24' N",
        "lon": "72° 50' E",
        "latDec": 20.3974,
        "lonDec": 72.8328,
        "tz": "+05:30"
      },
      {
        "name": "Diu",
        "lat": "20° 43' N",
        "lon": "70° 59' E",
        "latDec": 20.7144,
        "lonDec": 70.9874,
        "tz": "+05:30"
      },
      {
        "name": "Silvassa",
        "lat": "20° 17' N",
        "lon": "73° 00' E",
        "latDec": 20.2763,
        "lonDec": 73.0083,
        "tz": "+05:30"
      }
    ],
    "Lakshadweep": [
      {
        "name": "Agatti",
        "lat": "10° 51' N",
        "lon": "72° 12' E",
        "latDec": 10.8533,
        "lonDec": 72.1933,
        "tz": "+05:30"
      },
      {
        "name": "Amini",
        "lat": "11° 07' N",
        "lon": "72° 44' E",
        "latDec": 11.1239,
        "lonDec": 72.7306,
        "tz": "+05:30"
      },
      {
        "name": "Kavaratti",
        "lat": "10° 34' N",
        "lon": "72° 39' E",
        "latDec": 10.5667,
        "lonDec": 72.6417,
        "tz": "+05:30"
      }
    ],
    "Sikkim": [
      {
        "name": "Gangtok",
        "lat": "27° 20' N",
        "lon": "88° 36' E",
        "latDec": 27.3389,
        "lonDec": 88.6065,
        "tz": "+05:30"
      },
      {
        "name": "Geyzing",
        "lat": "27° 17' N",
        "lon": "88° 15' E",
        "latDec": 27.2833,
        "lonDec": 88.25,
        "tz": "+05:30"
      },
      {
        "name": "Mangan",
        "lat": "27° 30' N",
        "lon": "88° 32' E",
        "latDec": 27.5,
        "lonDec": 88.5333,
        "tz": "+05:30"
      },
      {
        "name": "Namchi",
        "lat": "27° 10' N",
        "lon": "88° 21' E",
        "latDec": 27.1667,
        "lonDec": 88.35,
        "tz": "+05:30"
      },
      {
        "name": "Ravangla",
        "lat": "27° 18' N",
        "lon": "88° 22' E",
        "latDec": 27.3078,
        "lonDec": 88.3639,
        "tz": "+05:30"
      }
    ],
    "Tripura": [
      {
        "name": "Agartala",
        "lat": "23° 50' N",
        "lon": "91° 17' E",
        "latDec": 23.8315,
        "lonDec": 91.2868,
        "tz": "+05:30"
      },
      {
        "name": "Ambassa",
        "lat": "23° 55' N",
        "lon": "91° 51' E",
        "latDec": 23.9244,
        "lonDec": 91.8542,
        "tz": "+05:30"
      },
      {
        "name": "Dharmanagar",
        "lat": "24° 23' N",
        "lon": "92° 10' E",
        "latDec": 24.3767,
        "lonDec": 92.1644,
        "tz": "+05:30"
      },
      {
        "name": "Kailasahar",
        "lat": "24° 20' N",
        "lon": "92° 00' E",
        "latDec": 24.33,
        "lonDec": 92,
        "tz": "+05:30"
      },
      {
        "name": "Udaipur (Tripura Sundari)",
        "lat": "23° 32' N",
        "lon": "91° 29' E",
        "latDec": 23.5333,
        "lonDec": 91.4833,
        "tz": "+05:30"
      }
    ],
    "Meghalaya": [
      {
        "name": "Cherrapunji (Sohra)",
        "lat": "25° 16' N",
        "lon": "91° 44' E",
        "latDec": 25.27,
        "lonDec": 91.73,
        "tz": "+05:30"
      },
      {
        "name": "Jowai",
        "lat": "25° 27' N",
        "lon": "92° 12' E",
        "latDec": 25.4467,
        "lonDec": 92.2033,
        "tz": "+05:30"
      },
      {
        "name": "Nongpoh",
        "lat": "25° 54' N",
        "lon": "91° 53' E",
        "latDec": 25.9,
        "lonDec": 91.8833,
        "tz": "+05:30"
      },
      {
        "name": "Shillong",
        "lat": "25° 35' N",
        "lon": "91° 54' E",
        "latDec": 25.5788,
        "lonDec": 91.8933,
        "tz": "+05:30"
      },
      {
        "name": "Tura",
        "lat": "25° 31' N",
        "lon": "90° 12' E",
        "latDec": 25.5142,
        "lonDec": 90.2036,
        "tz": "+05:30"
      }
    ],
    "Manipur": [
      {
        "name": "Churachandpur",
        "lat": "24° 20' N",
        "lon": "93° 41' E",
        "latDec": 24.3333,
        "lonDec": 93.6833,
        "tz": "+05:30"
      },
      {
        "name": "Imphal",
        "lat": "24° 49' N",
        "lon": "93° 56' E",
        "latDec": 24.817,
        "lonDec": 93.9368,
        "tz": "+05:30"
      },
      {
        "name": "Kakching",
        "lat": "24° 29' N",
        "lon": "93° 59' E",
        "latDec": 24.4833,
        "lonDec": 93.9833,
        "tz": "+05:30"
      },
      {
        "name": "Thoubal",
        "lat": "24° 38' N",
        "lon": "93° 59' E",
        "latDec": 24.63,
        "lonDec": 93.99,
        "tz": "+05:30"
      },
      {
        "name": "Ukhrul",
        "lat": "25° 07' N",
        "lon": "94° 22' E",
        "latDec": 25.1167,
        "lonDec": 94.3667,
        "tz": "+05:30"
      }
    ],
    "Nagaland": [
      {
        "name": "Dimapur",
        "lat": "25° 55' N",
        "lon": "93° 44' E",
        "latDec": 25.9094,
        "lonDec": 93.7266,
        "tz": "+05:30"
      },
      {
        "name": "Kohima",
        "lat": "25° 41' N",
        "lon": "94° 07' E",
        "latDec": 25.6751,
        "lonDec": 94.1086,
        "tz": "+05:30"
      },
      {
        "name": "Mokokchung",
        "lat": "26° 19' N",
        "lon": "94° 31' E",
        "latDec": 26.325,
        "lonDec": 94.52,
        "tz": "+05:30"
      },
      {
        "name": "Tuensang",
        "lat": "26° 17' N",
        "lon": "94° 50' E",
        "latDec": 26.28,
        "lonDec": 94.83,
        "tz": "+05:30"
      },
      {
        "name": "Wokha",
        "lat": "26° 06' N",
        "lon": "94° 16' E",
        "latDec": 26.1,
        "lonDec": 94.26,
        "tz": "+05:30"
      }
    ],
    "Mizoram": [
      {
        "name": "Aizawl",
        "lat": "23° 44' N",
        "lon": "92° 43' E",
        "latDec": 23.7271,
        "lonDec": 92.7176,
        "tz": "+05:30"
      },
      {
        "name": "Champhai",
        "lat": "23° 27' N",
        "lon": "93° 20' E",
        "latDec": 23.45,
        "lonDec": 93.3333,
        "tz": "+05:30"
      },
      {
        "name": "Kolasib",
        "lat": "24° 14' N",
        "lon": "92° 41' E",
        "latDec": 24.2333,
        "lonDec": 92.6833,
        "tz": "+05:30"
      },
      {
        "name": "Lunglei",
        "lat": "22° 53' N",
        "lon": "92° 44' E",
        "latDec": 22.8833,
        "lonDec": 92.7333,
        "tz": "+05:30"
      },
      {
        "name": "Serchhip",
        "lat": "23° 18' N",
        "lon": "92° 50' E",
        "latDec": 23.3,
        "lonDec": 92.8333,
        "tz": "+05:30"
      }
    ],
    "Arunachal Pradesh": [
      {
        "name": "Bomdila",
        "lat": "27° 16' N",
        "lon": "92° 25' E",
        "latDec": 27.2644,
        "lonDec": 92.4178,
        "tz": "+05:30"
      },
      {
        "name": "Itanagar",
        "lat": "27° 05' N",
        "lon": "93° 36' E",
        "latDec": 27.0844,
        "lonDec": 93.6053,
        "tz": "+05:30"
      },
      {
        "name": "Naharlagun",
        "lat": "27° 06' N",
        "lon": "93° 42' E",
        "latDec": 27.1067,
        "lonDec": 93.6936,
        "tz": "+05:30"
      },
      {
        "name": "Namsai",
        "lat": "27° 40' N",
        "lon": "95° 52' E",
        "latDec": 27.6667,
        "lonDec": 95.8667,
        "tz": "+05:30"
      },
      {
        "name": "Pasighat",
        "lat": "28° 04' N",
        "lon": "95° 20' E",
        "latDec": 28.0667,
        "lonDec": 95.3333,
        "tz": "+05:30"
      },
      {
        "name": "Tawang",
        "lat": "27° 35' N",
        "lon": "91° 52' E",
        "latDec": 27.5861,
        "lonDec": 91.8594,
        "tz": "+05:30"
      },
      {
        "name": "Ziro",
        "lat": "27° 32' N",
        "lon": "93° 50' E",
        "latDec": 27.53,
        "lonDec": 93.83,
        "tz": "+05:30"
      }
    ]
  },
  "United States": {
    "California": [
      {
        "name": "Fremont",
        "lat": "37° 33' N",
        "lon": "121° 59' W",
        "latDec": 37.5485,
        "lonDec": -121.9886,
        "tz": "-08:00"
      },
      {
        "name": "Irvine",
        "lat": "33° 41' N",
        "lon": "117° 50' W",
        "latDec": 33.6846,
        "lonDec": -117.8265,
        "tz": "-08:00"
      },
      {
        "name": "Los Angeles",
        "lat": "34° 03' N",
        "lon": "118° 15' W",
        "latDec": 34.0522,
        "lonDec": -118.2437,
        "tz": "-08:00"
      },
      {
        "name": "Sacramento",
        "lat": "38° 35' N",
        "lon": "121° 30' W",
        "latDec": 38.5816,
        "lonDec": -121.4944,
        "tz": "-08:00"
      },
      {
        "name": "San Diego",
        "lat": "32° 43' N",
        "lon": "117° 10' W",
        "latDec": 32.7157,
        "lonDec": -117.1611,
        "tz": "-08:00"
      },
      {
        "name": "San Francisco",
        "lat": "37° 46' N",
        "lon": "122° 25' W",
        "latDec": 37.7749,
        "lonDec": -122.4194,
        "tz": "-08:00"
      },
      {
        "name": "San Jose",
        "lat": "37° 20' N",
        "lon": "121° 53' W",
        "latDec": 37.3382,
        "lonDec": -121.8863,
        "tz": "-08:00"
      },
      {
        "name": "Sunnyvale",
        "lat": "37° 22' N",
        "lon": "122° 02' W",
        "latDec": 37.3688,
        "lonDec": -122.0363,
        "tz": "-08:00"
      }
    ],
    "New York": [
      {
        "name": "Albany",
        "lat": "42° 39' N",
        "lon": "73° 45' W",
        "latDec": 42.6526,
        "lonDec": -73.7562,
        "tz": "-05:00"
      },
      {
        "name": "Buffalo",
        "lat": "42° 53' N",
        "lon": "78° 53' W",
        "latDec": 42.8864,
        "lonDec": -78.8784,
        "tz": "-05:00"
      },
      {
        "name": "New York City",
        "lat": "40° 43' N",
        "lon": "74° 00' W",
        "latDec": 40.7128,
        "lonDec": -74.006,
        "tz": "-05:00"
      },
      {
        "name": "Rochester",
        "lat": "43° 09' N",
        "lon": "77° 37' W",
        "latDec": 43.1566,
        "lonDec": -77.6088,
        "tz": "-05:00"
      }
    ],
    "Texas": [
      {
        "name": "Austin",
        "lat": "30° 16' N",
        "lon": "97° 45' W",
        "latDec": 30.2672,
        "lonDec": -97.7431,
        "tz": "-06:00"
      },
      {
        "name": "Dallas",
        "lat": "32° 47' N",
        "lon": "96° 48' W",
        "latDec": 32.7767,
        "lonDec": -96.797,
        "tz": "-06:00"
      },
      {
        "name": "Frisco",
        "lat": "33° 09' N",
        "lon": "96° 49' W",
        "latDec": 33.1507,
        "lonDec": -96.8236,
        "tz": "-06:00"
      },
      {
        "name": "Houston",
        "lat": "29° 46' N",
        "lon": "95° 22' W",
        "latDec": 29.7604,
        "lonDec": -95.3698,
        "tz": "-06:00"
      },
      {
        "name": "Irving",
        "lat": "32° 49' N",
        "lon": "96° 57' W",
        "latDec": 32.814,
        "lonDec": -96.9489,
        "tz": "-06:00"
      },
      {
        "name": "Plano",
        "lat": "33° 01' N",
        "lon": "96° 42' W",
        "latDec": 33.0198,
        "lonDec": -96.6989,
        "tz": "-06:00"
      },
      {
        "name": "San Antonio",
        "lat": "29° 25' N",
        "lon": "98° 30' W",
        "latDec": 29.4241,
        "lonDec": -98.4936,
        "tz": "-06:00"
      }
    ],
    "New Jersey": [
      {
        "name": "Edison",
        "lat": "40° 31' N",
        "lon": "74° 25' W",
        "latDec": 40.5187,
        "lonDec": -74.4121,
        "tz": "-05:00"
      },
      {
        "name": "Jersey City",
        "lat": "40° 43' N",
        "lon": "74° 03' W",
        "latDec": 40.7178,
        "lonDec": -74.0431,
        "tz": "-05:00"
      },
      {
        "name": "Newark",
        "lat": "40° 44' N",
        "lon": "74° 10' W",
        "latDec": 40.7357,
        "lonDec": -74.1724,
        "tz": "-05:00"
      },
      {
        "name": "Princeton",
        "lat": "40° 21' N",
        "lon": "74° 40' W",
        "latDec": 40.3573,
        "lonDec": -74.6672,
        "tz": "-05:00"
      }
    ],
    "Illinois": [
      {
        "name": "Chicago",
        "lat": "41° 53' N",
        "lon": "87° 38' W",
        "latDec": 41.8781,
        "lonDec": -87.6298,
        "tz": "-06:00"
      },
      {
        "name": "Naperville",
        "lat": "41° 45' N",
        "lon": "88° 09' W",
        "latDec": 41.7508,
        "lonDec": -88.1535,
        "tz": "-06:00"
      },
      {
        "name": "Schaumburg",
        "lat": "42° 02' N",
        "lon": "88° 05' W",
        "latDec": 42.0334,
        "lonDec": -88.0834,
        "tz": "-06:00"
      }
    ],
    "Washington": [
      {
        "name": "Bellevue",
        "lat": "47° 37' N",
        "lon": "122° 12' W",
        "latDec": 47.6101,
        "lonDec": -122.2015,
        "tz": "-08:00"
      },
      {
        "name": "Redmond",
        "lat": "47° 40' N",
        "lon": "122° 07' W",
        "latDec": 47.674,
        "lonDec": -122.1215,
        "tz": "-08:00"
      },
      {
        "name": "Seattle",
        "lat": "47° 36' N",
        "lon": "122° 20' W",
        "latDec": 47.6062,
        "lonDec": -122.3321,
        "tz": "-08:00"
      }
    ],
    "Florida": [
      {
        "name": "Miami",
        "lat": "25° 46' N",
        "lon": "80° 12' W",
        "latDec": 25.7617,
        "lonDec": -80.1918,
        "tz": "-05:00"
      },
      {
        "name": "Orlando",
        "lat": "28° 32' N",
        "lon": "81° 23' W",
        "latDec": 28.5383,
        "lonDec": -81.3792,
        "tz": "-05:00"
      },
      {
        "name": "Tampa",
        "lat": "27° 57' N",
        "lon": "82° 27' W",
        "latDec": 27.9506,
        "lonDec": -82.4572,
        "tz": "-05:00"
      }
    ],
    "Georgia": [
      {
        "name": "Alpharetta",
        "lat": "34° 05' N",
        "lon": "84° 18' W",
        "latDec": 34.0754,
        "lonDec": -84.2941,
        "tz": "-05:00"
      },
      {
        "name": "Atlanta",
        "lat": "33° 45' N",
        "lon": "84° 23' W",
        "latDec": 33.749,
        "lonDec": -84.388,
        "tz": "-05:00"
      }
    ]
  },
  "United Kingdom": {
    "England": [
      {
        "name": "Birmingham",
        "lat": "52° 29' N",
        "lon": "01° 53' W",
        "latDec": 52.4862,
        "lonDec": -1.8904,
        "tz": "+00:00"
      },
      {
        "name": "Harrow",
        "lat": "51° 35' N",
        "lon": "00° 21' W",
        "latDec": 51.5806,
        "lonDec": -0.342,
        "tz": "+00:00"
      },
      {
        "name": "Leeds",
        "lat": "53° 48' N",
        "lon": "01° 33' W",
        "latDec": 53.8008,
        "lonDec": -1.5491,
        "tz": "+00:00"
      },
      {
        "name": "Leicester",
        "lat": "52° 38' N",
        "lon": "01° 08' W",
        "latDec": 52.6369,
        "lonDec": -1.1398,
        "tz": "+00:00"
      },
      {
        "name": "London",
        "lat": "51° 30' N",
        "lon": "00° 08' W",
        "latDec": 51.5074,
        "lonDec": -0.1278,
        "tz": "+00:00"
      },
      {
        "name": "Manchester",
        "lat": "53° 29' N",
        "lon": "02° 15' W",
        "latDec": 53.4808,
        "lonDec": -2.2426,
        "tz": "+00:00"
      },
      {
        "name": "Slough",
        "lat": "51° 31' N",
        "lon": "00° 36' W",
        "latDec": 51.5105,
        "lonDec": -0.595,
        "tz": "+00:00"
      },
      {
        "name": "Wembley",
        "lat": "51° 33' N",
        "lon": "00° 18' W",
        "latDec": 51.5505,
        "lonDec": -0.3048,
        "tz": "+00:00"
      }
    ],
    "Scotland": [
      {
        "name": "Edinburgh",
        "lat": "55° 57' N",
        "lon": "03° 11' W",
        "latDec": 55.9533,
        "lonDec": -3.1883,
        "tz": "+00:00"
      },
      {
        "name": "Glasgow",
        "lat": "55° 52' N",
        "lon": "04° 15' W",
        "latDec": 55.8642,
        "lonDec": -4.2518,
        "tz": "+00:00"
      }
    ],
    "Wales": [
      {
        "name": "Cardiff",
        "lat": "51° 29' N",
        "lon": "03° 11' W",
        "latDec": 51.4816,
        "lonDec": -3.1791,
        "tz": "+00:00"
      }
    ]
  },
  "Canada": {
    "Ontario": [
      {
        "name": "Brampton",
        "lat": "43° 44' N",
        "lon": "79° 46' W",
        "latDec": 43.7315,
        "lonDec": -79.7624,
        "tz": "-05:00"
      },
      {
        "name": "Markham",
        "lat": "43° 51' N",
        "lon": "79° 20' W",
        "latDec": 43.8561,
        "lonDec": -79.337,
        "tz": "-05:00"
      },
      {
        "name": "Mississauga",
        "lat": "43° 35' N",
        "lon": "79° 39' W",
        "latDec": 43.589,
        "lonDec": -79.6441,
        "tz": "-05:00"
      },
      {
        "name": "Ottawa",
        "lat": "45° 25' N",
        "lon": "75° 42' W",
        "latDec": 45.4215,
        "lonDec": -75.6972,
        "tz": "-05:00"
      },
      {
        "name": "Scarborough",
        "lat": "43° 47' N",
        "lon": "79° 14' W",
        "latDec": 43.7764,
        "lonDec": -79.2318,
        "tz": "-05:00"
      },
      {
        "name": "Toronto",
        "lat": "43° 39' N",
        "lon": "79° 23' W",
        "latDec": 43.6532,
        "lonDec": -79.3832,
        "tz": "-05:00"
      }
    ],
    "British Columbia": [
      {
        "name": "Richmond",
        "lat": "49° 10' N",
        "lon": "123° 08' W",
        "latDec": 49.1666,
        "lonDec": -123.1336,
        "tz": "-08:00"
      },
      {
        "name": "Surrey",
        "lat": "49° 11' N",
        "lon": "122° 51' W",
        "latDec": 49.1913,
        "lonDec": -122.849,
        "tz": "-08:00"
      },
      {
        "name": "Vancouver",
        "lat": "49° 17' N",
        "lon": "123° 07' W",
        "latDec": 49.2827,
        "lonDec": -123.1207,
        "tz": "-08:00"
      }
    ],
    "Alberta": [
      {
        "name": "Calgary",
        "lat": "51° 03' N",
        "lon": "114° 04' W",
        "latDec": 51.0447,
        "lonDec": -114.0719,
        "tz": "-07:00"
      },
      {
        "name": "Edmonton",
        "lat": "53° 33' N",
        "lon": "113° 30' W",
        "latDec": 53.5461,
        "lonDec": -113.4938,
        "tz": "-07:00"
      }
    ],
    "Quebec": [
      {
        "name": "Montreal",
        "lat": "45° 30' N",
        "lon": "73° 34' W",
        "latDec": 45.5017,
        "lonDec": -73.5673,
        "tz": "-05:00"
      }
    ]
  },
  "Australia": {
    "New South Wales": [
      {
        "name": "Blacktown",
        "lat": "33° 46' S",
        "lon": "150° 54' E",
        "latDec": -33.7711,
        "lonDec": 150.9064,
        "tz": "+10:00"
      },
      {
        "name": "Parramatta",
        "lat": "33° 49' S",
        "lon": "151° 00' E",
        "latDec": -33.815,
        "lonDec": 151.0011,
        "tz": "+10:00"
      },
      {
        "name": "Sydney",
        "lat": "33° 52' S",
        "lon": "151° 13' E",
        "latDec": -33.8688,
        "lonDec": 151.2093,
        "tz": "+10:00"
      }
    ],
    "Victoria": [
      {
        "name": "Dandenong",
        "lat": "37° 59' S",
        "lon": "145° 13' E",
        "latDec": -37.981,
        "lonDec": 145.215,
        "tz": "+10:00"
      },
      {
        "name": "Melbourne",
        "lat": "37° 49' S",
        "lon": "144° 58' E",
        "latDec": -37.8136,
        "lonDec": 144.9631,
        "tz": "+10:00"
      }
    ],
    "Queensland": [
      {
        "name": "Brisbane",
        "lat": "27° 28' S",
        "lon": "153° 02' E",
        "latDec": -27.4698,
        "lonDec": 153.0251,
        "tz": "+10:00"
      },
      {
        "name": "Gold Coast",
        "lat": "28° 01' S",
        "lon": "153° 24' E",
        "latDec": -28.0167,
        "lonDec": 153.4,
        "tz": "+10:00"
      }
    ],
    "Western Australia": [
      {
        "name": "Perth",
        "lat": "31° 57' S",
        "lon": "115° 52' E",
        "latDec": -31.9505,
        "lonDec": 115.8605,
        "tz": "+08:00"
      }
    ]
  },
  "Singapore": {
    "Singapore": [
      {
        "name": "Jurong",
        "lat": "01° 20' N",
        "lon": "103° 45' E",
        "latDec": 1.3329,
        "lonDec": 103.7436,
        "tz": "+08:00"
      },
      {
        "name": "Little India",
        "lat": "01° 18' N",
        "lon": "103° 51' E",
        "latDec": 1.3068,
        "lonDec": 103.8519,
        "tz": "+08:00"
      },
      {
        "name": "Singapore (City Central)",
        "lat": "01° 21' N",
        "lon": "103° 49' E",
        "latDec": 1.3521,
        "lonDec": 103.8198,
        "tz": "+08:00"
      },
      {
        "name": "Tampines",
        "lat": "01° 21' N",
        "lon": "103° 57' E",
        "latDec": 1.3533,
        "lonDec": 103.9452,
        "tz": "+08:00"
      },
      {
        "name": "Woodlands",
        "lat": "01° 26' N",
        "lon": "103° 47' E",
        "latDec": 1.4361,
        "lonDec": 103.7865,
        "tz": "+08:00"
      }
    ]
  },
  "Malaysia": {
    "Federal Territory": [
      {
        "name": "Batu Caves",
        "lat": "03° 14' N",
        "lon": "101° 41' E",
        "latDec": 3.2374,
        "lonDec": 101.6839,
        "tz": "+08:00"
      },
      {
        "name": "Kuala Lumpur",
        "lat": "03° 08' N",
        "lon": "101° 41' E",
        "latDec": 3.139,
        "lonDec": 101.6869,
        "tz": "+08:00"
      }
    ],
    "Penang": [
      {
        "name": "Butterworth",
        "lat": "05° 24' N",
        "lon": "100° 22' E",
        "latDec": 5.3991,
        "lonDec": 100.3638,
        "tz": "+08:00"
      },
      {
        "name": "George Town",
        "lat": "05° 25' N",
        "lon": "100° 20' E",
        "latDec": 5.4141,
        "lonDec": 100.3288,
        "tz": "+08:00"
      }
    ],
    "Selangor": [
      {
        "name": "Klang",
        "lat": "03° 03' N",
        "lon": "101° 27' E",
        "latDec": 3.0449,
        "lonDec": 101.4456,
        "tz": "+08:00"
      },
      {
        "name": "Petaling Jaya",
        "lat": "03° 06' N",
        "lon": "101° 36' E",
        "latDec": 3.1073,
        "lonDec": 101.6067,
        "tz": "+08:00"
      },
      {
        "name": "Subang Jaya",
        "lat": "03° 03' N",
        "lon": "101° 35' E",
        "latDec": 3.0567,
        "lonDec": 101.5851,
        "tz": "+08:00"
      }
    ],
    "Johor": [
      {
        "name": "Johor Bahru",
        "lat": "01° 30' N",
        "lon": "103° 44' E",
        "latDec": 1.4927,
        "lonDec": 103.7414,
        "tz": "+08:00"
      }
    ]
  },
  "United Arab Emirates": {
    "Dubai": [
      {
        "name": "Deira",
        "lat": "25° 16' N",
        "lon": "55° 19' E",
        "latDec": 25.2697,
        "lonDec": 55.3094,
        "tz": "+04:00"
      },
      {
        "name": "Dubai (Bur Dubai)",
        "lat": "25° 12' N",
        "lon": "55° 16' E",
        "latDec": 25.2048,
        "lonDec": 55.2708,
        "tz": "+04:00"
      }
    ],
    "Abu Dhabi": [
      {
        "name": "Abu Dhabi",
        "lat": "24° 27' N",
        "lon": "54° 23' E",
        "latDec": 24.4539,
        "lonDec": 54.3773,
        "tz": "+04:00"
      },
      {
        "name": "Al Ain",
        "lat": "24° 12' N",
        "lon": "55° 45' E",
        "latDec": 24.2075,
        "lonDec": 55.7447,
        "tz": "+04:00"
      }
    ],
    "Sharjah": [
      {
        "name": "Sharjah",
        "lat": "25° 21' N",
        "lon": "55° 24' E",
        "latDec": 25.3573,
        "lonDec": 55.4033,
        "tz": "+04:00"
      }
    ],
    "Ajman": [
      {
        "name": "Ajman",
        "lat": "25° 24' N",
        "lon": "55° 31' E",
        "latDec": 25.4052,
        "lonDec": 55.5136,
        "tz": "+04:00"
      }
    ],
    "Ras Al Khaimah": [
      {
        "name": "Ras Al Khaimah",
        "lat": "25° 47' N",
        "lon": "55° 57' E",
        "latDec": 25.7895,
        "lonDec": 55.9432,
        "tz": "+04:00"
      }
    ]
  },
  "Sri Lanka": {
    "Western Province": [
      {
        "name": "Colombo",
        "lat": "06° 56' N",
        "lon": "79° 52' E",
        "latDec": 6.9271,
        "lonDec": 79.8612,
        "tz": "+05:30"
      },
      {
        "name": "Negombo",
        "lat": "07° 12' N",
        "lon": "79° 52' E",
        "latDec": 7.2008,
        "lonDec": 79.8736,
        "tz": "+05:30"
      }
    ],
    "Northern Province": [
      {
        "name": "Jaffna (Nallur)",
        "lat": "09° 40' N",
        "lon": "80° 02' E",
        "latDec": 9.6615,
        "lonDec": 80.0255,
        "tz": "+05:30"
      },
      {
        "name": "Kilinochchi",
        "lat": "09° 23' N",
        "lon": "80° 23' E",
        "latDec": 9.3803,
        "lonDec": 80.377,
        "tz": "+05:30"
      },
      {
        "name": "Mannar (Thiruketheeswaram)",
        "lat": "08° 59' N",
        "lon": "79° 54' E",
        "latDec": 8.981,
        "lonDec": 79.9044,
        "tz": "+05:30"
      },
      {
        "name": "Vavuniya",
        "lat": "08° 45' N",
        "lon": "80° 30' E",
        "latDec": 8.7514,
        "lonDec": 80.4971,
        "tz": "+05:30"
      }
    ],
    "Central Province": [
      {
        "name": "Kandy",
        "lat": "07° 17' N",
        "lon": "80° 38' E",
        "latDec": 7.2906,
        "lonDec": 80.6337,
        "tz": "+05:30"
      },
      {
        "name": "Matale",
        "lat": "07° 28' N",
        "lon": "80° 37' E",
        "latDec": 7.4675,
        "lonDec": 80.6234,
        "tz": "+05:30"
      },
      {
        "name": "Nuwara Eliya",
        "lat": "06° 57' N",
        "lon": "80° 47' E",
        "latDec": 6.9497,
        "lonDec": 80.7891,
        "tz": "+05:30"
      }
    ],
    "Eastern Province": [
      {
        "name": "Batticaloa",
        "lat": "07° 44' N",
        "lon": "81° 40' E",
        "latDec": 7.731,
        "lonDec": 81.6747,
        "tz": "+05:30"
      },
      {
        "name": "Trincomalee (Koneswaram)",
        "lat": "08° 35' N",
        "lon": "81° 13' E",
        "latDec": 8.5874,
        "lonDec": 81.2152,
        "tz": "+05:30"
      }
    ],
    "Southern Province": [
      {
        "name": "Galle",
        "lat": "06° 03' N",
        "lon": "80° 13' E",
        "latDec": 6.0535,
        "lonDec": 80.221,
        "tz": "+05:30"
      },
      {
        "name": "Kataragama",
        "lat": "06° 25' N",
        "lon": "81° 20' E",
        "latDec": 6.4167,
        "lonDec": 81.3333,
        "tz": "+05:30"
      }
    ]
  },
  "Germany": {
    "Berlin": [
      {
        "name": "Berlin",
        "lat": "52° 31' N",
        "lon": "13° 24' E",
        "latDec": 52.52,
        "lonDec": 13.405,
        "tz": "+01:00"
      }
    ],
    "Bavaria": [
      {
        "name": "Munich",
        "lat": "48° 08' N",
        "lon": "11° 35' E",
        "latDec": 48.1351,
        "lonDec": 11.582,
        "tz": "+01:00"
      },
      {
        "name": "Nuremberg",
        "lat": "49° 27' N",
        "lon": "11° 05' E",
        "latDec": 49.4521,
        "lonDec": 11.0767,
        "tz": "+01:00"
      }
    ],
    "Hesse": [
      {
        "name": "Frankfurt",
        "lat": "50° 07' N",
        "lon": "08° 41' E",
        "latDec": 50.1109,
        "lonDec": 8.6821,
        "tz": "+01:00"
      }
    ],
    "North Rhine-Westphalia": [
      {
        "name": "Cologne",
        "lat": "50° 56' N",
        "lon": "06° 58' E",
        "latDec": 50.9375,
        "lonDec": 6.9603,
        "tz": "+01:00"
      },
      {
        "name": "Dusseldorf",
        "lat": "51° 14' N",
        "lon": "06° 46' E",
        "latDec": 51.2277,
        "lonDec": 6.7735,
        "tz": "+01:00"
      }
    ]
  },
  "France": {
    "Île-de-France": [
      {
        "name": "Paris",
        "lat": "48° 51' N",
        "lon": "02° 21' E",
        "latDec": 48.8566,
        "lonDec": 2.3522,
        "tz": "+01:00"
      }
    ]
  },
  "Switzerland": {
    "Zurich": [
      {
        "name": "Zurich",
        "lat": "47° 23' N",
        "lon": "08° 33' E",
        "latDec": 47.3769,
        "lonDec": 8.5417,
        "tz": "+01:00"
      }
    ],
    "Geneva": [
      {
        "name": "Geneva",
        "lat": "46° 12' N",
        "lon": "06° 09' E",
        "latDec": 46.2044,
        "lonDec": 6.1432,
        "tz": "+01:00"
      }
    ]
  },
  "Japan": {
    "Kanto": [
      {
        "name": "Tokyo",
        "lat": "35° 41' N",
        "lon": "139° 39' E",
        "latDec": 35.6762,
        "lonDec": 139.6503,
        "tz": "+09:00"
      },
      {
        "name": "Yokohama",
        "lat": "35° 27' N",
        "lon": "139° 38' E",
        "latDec": 35.4437,
        "lonDec": 139.638,
        "tz": "+09:00"
      }
    ],
    "Kansai": [
      {
        "name": "Kyoto",
        "lat": "35° 01' N",
        "lon": "135° 46' E",
        "latDec": 35.0116,
        "lonDec": 135.7681,
        "tz": "+09:00"
      },
      {
        "name": "Osaka",
        "lat": "34° 42' N",
        "lon": "135° 30' E",
        "latDec": 34.6937,
        "lonDec": 135.5023,
        "tz": "+09:00"
      }
    ]
  }
};

export function parseCoordinateToDec(val, fallback = 0) {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val) return fallback;
  const str = String(val).trim();
  // Check DMS pattern: e.g. 12° 43' 30" N or 77° 49' 30" E
  const dms = str.match(/([0-9.]+)\s*[°ddeg\s]+\s*([0-9.]+)?\s*['mmin\s]*\s*([0-9.]+)?\s*["ssec\s]*\s*([NSEW])?/i);
  if (dms) {
    const d = parseFloat(dms[1] || '0');
    const m = parseFloat(dms[2] || '0');
    const s = parseFloat(dms[3] || '0');
    const dir = (dms[4] || '').toUpperCase();
    let dec = d + m / 60 + s / 3600;
    if (dir === 'S' || dir === 'W') dec = -dec;
    return isNaN(dec) ? fallback : dec;
  }
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

export function lookupCoordinates(arg1 = 'India', arg2 = 'Tamil Nadu', arg3 = 'Hosur') {
  // Support both (country, state, city) and (city, state, country)
  let country = 'India';
  let state = 'Tamil Nadu';
  let city = 'Hosur';

  if (GEO_DATA[arg1]) {
    country = arg1;
    state = arg2 || 'Tamil Nadu';
    city = arg3 || 'Hosur';
  } else if (GEO_DATA[arg3]) {
    country = arg3;
    state = arg2 || 'Tamil Nadu';
    city = arg1 || 'Hosur';
  } else {
    city = arg1 || 'Hosur';
    state = arg2 || 'Tamil Nadu';
    country = arg3 || 'India';
  }

  // Clean city name (e.g. "Krishnagiri (Tamil Nadu, India)" -> "Krishnagiri")
  const cleanCity = String(city).replace(/\(.*\)/g, '').split(/[,/-]/)[0].trim().toLowerCase();

  const stateData = GEO_DATA[country]?.[state];
  if (stateData) {
    const cityObj = stateData.find(c => {
      const cLow = c.name.toLowerCase();
      return cLow === cleanCity || cleanCity.includes(cLow) || cLow.includes(cleanCity);
    });
    if (cityObj) {
      return {
        ...cityObj,
        latDec: parseCoordinateToDec(cityObj.latDec !== undefined ? cityObj.latDec : cityObj.lat, 12.725),
        lonDec: parseCoordinateToDec(cityObj.lonDec !== undefined ? cityObj.lonDec : cityObj.lon, 77.825)
      };
    }
  }

  // Fallback scan across all states in country
  const allStates = GEO_DATA[country];
  if (allStates) {
    for (const [stName, cities] of Object.entries(allStates)) {
      const cityObj = cities.find(c => {
        const cLow = c.name.toLowerCase();
        return cLow === cleanCity || cleanCity.includes(cLow) || cLow.includes(cleanCity);
      });
      if (cityObj) {
        return {
          ...cityObj,
          state: stName,
          latDec: parseCoordinateToDec(cityObj.latDec !== undefined ? cityObj.latDec : cityObj.lat, 12.725),
          lonDec: parseCoordinateToDec(cityObj.lonDec !== undefined ? cityObj.lonDec : cityObj.lon, 77.825)
        };
      }
    }
  }

  // Default Hosur coordinates (Traditional temple benchmark)
  return {
    name: city || 'Hosur',
    lat: "12° 43' 30\" N",
    lon: "77° 49' 30\" E",
    latDec: 12.725,
    lonDec: 77.825,
    tz: '+05:30',
  };
}
