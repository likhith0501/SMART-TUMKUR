"""
Tumakuru City Official Geo & Administrative Seed Data
Source: Tumakuru City Corporation (TCC - Tumakuru Mahanagara Palike), Smart City Mission Karnataka.
Geographic Center: 13.3409° N, 77.1010° E
Total Wards: 35 Wards
"""

TUMAKURU_CITY_INFO = {
    "name": "Tumakuru (ತುಮಕೂರು)",
    "district": "Tumakuru",
    "state": "Karnataka",
    "country": "India",
    "local_body": "Tumakuru City Corporation (Mahanagara Palike)",
    "pin_codes": ["572101", "572102", "572103", "572104", "572105", "572106", "572107"],
    "coordinates": {"lat": 13.3409, "lng": 77.1010},
    "elevation_m": 822,
    "area_sq_km": 48.21,
    "wards_count": 35,
    "smart_city_mission": "Tumakuru Smart City Limited (TSCL)",
    "description": "Tumakuru, known as the 'Kalpataru Nadu' (Land of Coconut Trees) and an emerging industrial, educational and smart city hub of Karnataka, located 70 km northwest of Bengaluru along NH-48."
}

# 35 Official Wards of Tumakuru City Corporation with center GPS & localities
TUMAKURU_WARDS = [
    {
        "ward_no": 1,
        "ward_name": "Melekote",
        "kannada_name": "ಮೇಕೋಟೆ",
        "zone": "North Zone",
        "lat": 13.3582,
        "lng": 77.0850,
        "population": 12840,
        "major_localities": ["Melekote Main Road", "Industrial Area Stage 1", "SIT Extension"]
    },
    {
        "ward_no": 2,
        "ward_name": "Sadashivanagar",
        "kannada_name": "ಸದಾಶಿವನಗರ",
        "zone": "North Zone",
        "lat": 13.3510,
        "lng": 77.0890,
        "population": 11200,
        "major_localities": ["Sadashivanagar Park", "Water Tank Road", "Teachers Colony"]
    },
    {
        "ward_no": 3,
        "ward_name": "Mandipet",
        "kannada_name": "ಮಂಡಿಪೇಟೆ",
        "zone": "Central Zone",
        "lat": 13.3425,
        "lng": 77.1042,
        "population": 15400,
        "major_localities": ["Mandipet Market", "MG Road Wholesale", "Grain Market Bazaar"]
    },
    {
        "ward_no": 4,
        "ward_name": "Chickpet",
        "kannada_name": "ಚಿಕ್ಕಪೇಟೆ",
        "zone": "Central Zone",
        "lat": 13.3395,
        "lng": 77.1030,
        "population": 13800,
        "major_localities": ["Chickpet Temple Street", "Old Post Office Road", "Cloth Bazaar"]
    },
    {
        "ward_no": 5,
        "ward_name": "Someshwarapuram",
        "kannada_name": "ಸೋಮೇಶ್ವರಪುರಂ",
        "zone": "Central Zone",
        "lat": 13.3430,
        "lng": 77.0980,
        "population": 14200,
        "major_localities": ["Someshwara Temple", "2nd Cross", "Govt School Road"]
    },
    {
        "ward_no": 6,
        "ward_name": "Vidyanagar",
        "kannada_name": "ವಿದ್ಯಾನಗರ",
        "zone": "West Zone",
        "lat": 13.3465,
        "lng": 77.0920,
        "population": 12500,
        "major_localities": ["Vidyanagar 1st Main", "Batawadi Cross", "Siddaganga High School"]
    },
    {
        "ward_no": 7,
        "ward_name": "SS Puram (Shankarapura)",
        "kannada_name": "ಎಸ್.ಎಸ್. ಪುರಂ",
        "zone": "West Zone",
        "lat": 13.3482,
        "lng": 77.0980,
        "population": 16500,
        "major_localities": ["SS Puram Main Road", "Junior College Circle", "Ashoka Road Cross"]
    },
    {
        "ward_no": 8,
        "ward_name": "Sapthagiri Extension",
        "kannada_name": "ಸಪ್ತಗಿರಿ ಬಡಾವಣೆ",
        "zone": "West Zone",
        "lat": 13.3530,
        "lng": 77.0950,
        "population": 11800,
        "major_localities": ["Sapthagiri Hospital Lane", "Ring Road link", "1st Stage Extension"]
    },
    {
        "ward_no": 9,
        "ward_name": "Batawadi",
        "kannada_name": "ಬಟವಾಡಿ",
        "zone": "West Zone",
        "lat": 13.3385,
        "lng": 77.0860,
        "population": 14900,
        "major_localities": ["Batawadi Bridge Bypass", "Bangalore-Shimoga Road", "Jayanagar Link"]
    },
    {
        "ward_no": 10,
        "ward_name": "Jayanagar West",
        "kannada_name": "ಜಯನಗರ ಪಶ್ಚಿಮ",
        "zone": "West Zone",
        "lat": 13.3350,
        "lng": 77.0890,
        "population": 13100,
        "major_localities": ["Jayanagar East-West Ring", "Kuvempu Circle", "Community Hall"]
    },
    {
        "ward_no": 11,
        "ward_name": "Jayanagar East",
        "kannada_name": "ಜಯನಗರ ಪೂರ್ವ",
        "zone": "West Zone",
        "lat": 13.3360,
        "lng": 77.0940,
        "population": 12900,
        "major_localities": ["Canara Bank Layout", "KSRTC Depot Road", "Water Reservoir"]
    },
    {
        "ward_no": 12,
        "ward_name": "Hemavathi Nagar",
        "kannada_name": "ಹೇಮಾವತಿ ನಗರ",
        "zone": "Central Zone",
        "lat": 13.3400,
        "lng": 77.0970,
        "population": 10500,
        "major_localities": ["Hemavathi Water Pipeline Channel", "Cauvery Layout", "4th Cross"]
    },
    {
        "ward_no": 13,
        "ward_name": "Barline",
        "kannada_name": "ಬಾರ್‌ಲೈನ್",
        "zone": "Central Zone",
        "lat": 13.3410,
        "lng": 77.1000,
        "population": 11700,
        "major_localities": ["District Court Complex", "Barline Old Hospital Road", "Police Lane"]
    },
    {
        "ward_no": 14,
        "ward_name": "Gandhinagar",
        "kannada_name": "ಗಾಂಧಿನಗರ",
        "zone": "Central Zone",
        "lat": 13.3409,
        "lng": 77.1010,
        "population": 17200,
        "major_localities": ["BH Road Highway", "KSRTC Central Bus Stand", "Town Hall Complex", "MG Road"]
    },
    {
        "ward_no": 15,
        "ward_name": "Amanikere Basin",
        "kannada_name": "ಅಮಾನಿಕೆರೆ ಆವರಣ",
        "zone": "East Zone",
        "lat": 13.3450,
        "lng": 77.1090,
        "population": 9800,
        "major_localities": ["Amanikere Lake Promenade", "Glass House Park", "Lake Road Promenade"]
    },
    {
        "ward_no": 16,
        "ward_name": "Gulpet",
        "kannada_name": "ಗುಲ್‌ಪೇಟೆ",
        "zone": "East Zone",
        "lat": 13.3415,
        "lng": 77.1065,
        "population": 13400,
        "major_localities": ["Gulpet Main Bazaar", "Urdu High School Road", "Jamia Masjid Cross"]
    },
    {
        "ward_no": 17,
        "ward_name": "Horpet",
        "kannada_name": "ಹೊರಪೇಟೆ",
        "zone": "East Zone",
        "lat": 13.3380,
        "lng": 77.1055,
        "population": 14100,
        "major_localities": ["Horpet Circle", "Railway Gate Road", "Maramma Temple"]
    },
    {
        "ward_no": 18,
        "ward_name": "KR Extension",
        "kannada_name": "ಕೆ.ಆರ್. ಬಡಾವಣೆ",
        "zone": "Central Zone",
        "lat": 13.3365,
        "lng": 77.1010,
        "population": 12600,
        "major_localities": ["KR Extension 3rd Main", "Library Road", "Veterinary Hospital"]
    },
    {
        "ward_no": 19,
        "ward_name": "Vinobhanagar",
        "kannada_name": "ವಿನೋಭಾನಗರ",
        "zone": "South Zone",
        "lat": 13.3320,
        "lng": 77.1020,
        "population": 11300,
        "major_localities": ["Vinobhanagar Park", "Community Health Center", "Railway Parallel"]
    },
    {
        "ward_no": 20,
        "ward_name": "Saraswathipuram",
        "kannada_name": "ಸರಸ್ವತಿಪುರಂ",
        "zone": "South Zone",
        "lat": 13.3300,
        "lng": 77.1040,
        "population": 12100,
        "major_localities": ["Saraswathipuram 1st Main", "Government PU College", "Kalyana Mantapa"]
    },
    {
        "ward_no": 21,
        "ward_name": "Kuvempunagar",
        "kannada_name": "ಕುವೆಂಪುನಗರ",
        "zone": "South Zone",
        "lat": 13.3315,
        "lng": 77.1070,
        "population": 13600,
        "major_localities": ["Kuvempu Circle", "Bikasipura Cross", "Rotary Children Park"]
    },
    {
        "ward_no": 22,
        "ward_name": "Ashok Nagar",
        "kannada_name": "ಅಶೋಕ ನಗರ",
        "zone": "South Zone",
        "lat": 13.3340,
        "lng": 77.1085,
        "population": 15800,
        "major_localities": ["Shanthi Park Gate 2", "Ashok Nagar 5th Cross", "BESCOM Substation"]
    },
    {
        "ward_no": 23,
        "ward_name": "Shanthinagar",
        "kannada_name": "ಶಾಂತಿನಗರ",
        "zone": "South-East Zone",
        "lat": 13.3320,
        "lng": 77.1120,
        "population": 11900,
        "major_localities": ["Shanthinagar Main Road", "Church Cross", "Dr. Ambedkar Bhavan"]
    },
    {
        "ward_no": 24,
        "ward_name": "Maralur",
        "kannada_name": "ಮರಳೂರು",
        "zone": "South Zone",
        "lat": 13.3260,
        "lng": 77.1000,
        "population": 14700,
        "major_localities": ["Maralur Lake Ring", "Maralur Dinne", "Ring Road South Junction"]
    },
    {
        "ward_no": 25,
        "ward_name": "Maralur Dinne",
        "kannada_name": "ಮರಳೂರು ದಿಣ್ಣೆ",
        "zone": "South Zone",
        "lat": 13.3220,
        "lng": 77.1020,
        "population": 10800,
        "major_localities": ["Primary Health Unit", "New Layout Stage 2", "Bypass road"]
    },
    {
        "ward_no": 26,
        "ward_name": "Shettihalli",
        "kannada_name": "ಶೆಟ್ಟಿಹಳ್ಳಿ",
        "zone": "South Zone",
        "lat": 13.3190,
        "lng": 77.0950,
        "population": 13200,
        "major_localities": ["Shettihalli Main Village Road", "Industrial Estate Extension", "Gram Panchayat"]
    },
    {
        "ward_no": 27,
        "ward_name": "Dibbur",
        "kannada_name": "ದಿಬ್ಬೂರು",
        "zone": "South-West Zone",
        "lat": 13.3240,
        "lng": 77.0850,
        "population": 11500,
        "major_localities": ["Dibbur Gate", "Kunigal Road Cross", "Lake Bund"]
    },
    {
        "ward_no": 28,
        "ward_name": "Mahalakshmi Nagar",
        "kannada_name": "ಮಹಾಲಕ್ಷ್ಮಿ ನಗರ",
        "zone": "East Zone",
        "lat": 13.3380,
        "lng": 77.1150,
        "population": 12400,
        "major_localities": ["Mahalakshmi Temple", "Anjaneya Swami Road", "3rd Stage Layout"]
    },
    {
        "ward_no": 29,
        "ward_name": "Upparahalli",
        "kannada_name": "ಉಪ್ಪಾರಹಳ್ಳಿ",
        "zone": "East Zone",
        "lat": 13.3420,
        "lng": 77.1180,
        "population": 13900,
        "major_localities": ["Upparahalli Lake Road", "Govt High School", "Water Filtration Plant"]
    },
    {
        "ward_no": 30,
        "ward_name": "Siddaganga Mutt Ward",
        "kannada_name": "ಸಿದ್ಧಗಂಗಾ ಮಠ ಆವರಣ",
        "zone": "East Zone",
        "lat": 13.3280,
        "lng": 77.1300,
        "population": 18200,
        "major_localities": ["Siddaganga Mutt Pilgrim Campus", "Dr. Sri Sri Shivakumara Swamiji Memorial", "Prasad Nilaya", "SIT Campus Main Gate"]
    },
    {
        "ward_no": 31,
        "ward_name": "Kyathsandra",
        "kannada_name": "ಕ್ಯಾತಸಂದ್ರ",
        "zone": "East Zone",
        "lat": 13.3210,
        "lng": 77.1350,
        "population": 16700,
        "major_localities": ["Kyathsandra Toll Junction", "Railway Station Road", "Tatte Idli Heritage Bazaar", "NH-48 Flyover"]
    },
    {
        "ward_no": 32,
        "ward_name": "Hirehalli Industrial Ward",
        "kannada_name": "ಹಿರೇಹಳ್ಳಿ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ",
        "zone": "South-East Zone",
        "lat": 13.3050,
        "lng": 77.1450,
        "population": 10900,
        "major_localities": ["KIADB Industrial Area", "Railway Station", "Export Processing Zone"]
    },
    {
        "ward_no": 33,
        "ward_name": "Antharasanahalli",
        "kannada_name": "ಅಂತರಸನಹಳ್ಳಿ",
        "zone": "North Zone",
        "lat": 13.3680,
        "lng": 77.0950,
        "population": 14300,
        "major_localities": ["KIADB Industrial Area Phase 1 & 2", "RTO Office", "Truck Terminal", "Vasantha Narasapura Link"]
    },
    {
        "ward_no": 34,
        "ward_name": "Belagumba",
        "kannada_name": "ಬೆಳಗುಂಬ",
        "zone": "North-East Zone",
        "lat": 13.3550,
        "lng": 77.1250,
        "population": 11800,
        "major_localities": ["Belagumba Main Road", "Ring Road East", "Lake Feeder Canal"]
    },
    {
        "ward_no": 35,
        "ward_name": "Devarayapatna",
        "kannada_name": "ದೇವರಾಯಪಟ್ಟಣ",
        "zone": "North Zone",
        "lat": 13.3720,
        "lng": 77.1100,
        "population": 9900,
        "major_localities": ["Devarayapatna Lake", "Veterinary College Campus", "NH 48 Bypass North"]
    }
]

# Tumakuru City Civic Infrastructure Points of Interest
TUMAKURU_INFRASTRUCTURE = [
    {
        "id": "INF-01",
        "name": "Tumakuru City Corporation Head Office",
        "category": "Government Office",
        "ward_no": 14,
        "lat": 13.3400,
        "lng": 77.1008,
        "address": "Town Hall Circle, Tumakuru - 572101",
        "status": "Operational"
    },
    {
        "id": "INF-02",
        "name": "District General Hospital Tumakuru",
        "category": "Public Hospital",
        "ward_no": 13,
        "lat": 13.3418,
        "lng": 77.0995,
        "address": "Barline Hospital Road, Tumakuru - 572101",
        "status": "24x7 Emergency Active"
    },
    {
        "id": "INF-03",
        "name": "Siddaganga Institute of Technology (SIT)",
        "category": "Higher Education",
        "ward_no": 30,
        "lat": 13.3285,
        "lng": 77.1265,
        "address": "BH Road, Tumakuru - 572103",
        "status": "Active"
    },
    {
        "id": "INF-04",
        "name": "Amanikere Lake & Glass House Smart Park",
        "category": "Public Park & Lake",
        "ward_no": 15,
        "lat": 13.3455,
        "lng": 77.1102,
        "address": "Lake Promenade, Tumakuru - 572102",
        "status": "Public Access"
    },
    {
        "id": "INF-05",
        "name": "KSRTC Central Bus Terminal Tumakuru",
        "category": "Transit Hub",
        "ward_no": 14,
        "lat": 13.3412,
        "lng": 77.1015,
        "address": "BH Road, Near Town Hall, Tumakuru - 572101",
        "status": "24x7 High Traffic"
    },
    {
        "id": "INF-06",
        "name": "Hemavathi Water Treatment & Balancing Reservoir",
        "category": "Water Supply Infrastructure",
        "ward_no": 11,
        "lat": 13.3368,
        "lng": 77.0945,
        "address": "Jayanagar Reservoir Hill, Tumakuru",
        "status": "Continuous Flow 75 MLD"
    },
    {
        "id": "INF-07",
        "name": "Antharasanahalli Solid Waste Processing Plant",
        "category": "Sanitation & Waste Facility",
        "ward_no": 33,
        "lat": 13.3695,
        "lng": 77.0960,
        "address": "KIADB Phase 2, Tumakuru - 572106",
        "status": "Active 180 TPD Waste"
    },
    {
        "id": "INF-08",
        "name": "Smart City Integrated Command & Control Centre (ICCC)",
        "category": "Smart City Tech Hub",
        "ward_no": 14,
        "lat": 13.3402,
        "lng": 77.1012,
        "address": "Smart City Building, BH Road, Tumakuru",
        "status": "Online Live Telemetry"
    }
]

# Municipal Departments Configuration
MUNICIPAL_DEPARTMENTS = [
    {
        "id": "DEPT-ROAD",
        "name": "Road and Infrastructure Department",
        "kannada_name": "ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ ಇಲಾಖೆ",
        "head": "Chief Engineer M. R. Shivananda",
        "contact_phone": "+91 816 2278101",
        "email": "roads@tumakurucitycorp.gov.in",
        "active_complaints": 48,
        "avg_resolution_hrs": 18
    },
    {
        "id": "DEPT-SANI",
        "name": "Sanitation Department",
        "kannada_name": "ನೈರ್ಮಲ್ಯ ಮತ್ತು ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಇಲಾಖೆ",
        "head": "Executive Health Officer Dr. K. Ramesh",
        "contact_phone": "+91 816 2278102",
        "email": "sanitation@tumakurucitycorp.gov.in",
        "active_complaints": 34,
        "avg_resolution_hrs": 8
    },
    {
        "id": "DEPT-WATER",
        "name": "Water Supply Department",
        "kannada_name": "ಕುಡಿಯುವ ನೀರು ಸರಬರಾಜು ಇಲಾಖೆ",
        "head": "Asst. Exec. Engineer G. Venkatesh",
        "contact_phone": "+91 816 2278103",
        "email": "watersupply@tumakurucitycorp.gov.in",
        "active_complaints": 27,
        "avg_resolution_hrs": 12
    },
    {
        "id": "DEPT-ELEC",
        "name": "Electricity and Streetlight Department",
        "kannada_name": "ವಿದ್ಯುತ್ ಮತ್ತು ಬೀದಿದೀಪಗಳ ಇಲಾಖೆ",
        "head": "Electrical Engineer C. Kumar",
        "contact_phone": "+91 816 2278104",
        "email": "streetlights@tumakurucitycorp.gov.in",
        "active_complaints": 19,
        "avg_resolution_hrs": 14
    },
    {
        "id": "DEPT-DRAIN",
        "name": "Drainage Department",
        "kannada_name": "ಒಳಚರಂಡಿ ಮತ್ತು ಚರಂಡಿ ಇಲಾಖೆ",
        "head": "Env. Engineer S. Manjula",
        "contact_phone": "+91 816 2278105",
        "email": "drainage@tumakurucitycorp.gov.in",
        "active_complaints": 22,
        "avg_resolution_hrs": 24
    },
    {
        "id": "DEPT-HEALTH",
        "name": "Public Health Department",
        "kannada_name": "ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಇಲಾಖೆ",
        "head": "Chief Health Officer Dr. B. N. Chandrashekar",
        "contact_phone": "+91 816 2278106",
        "email": "health@tumakurucitycorp.gov.in",
        "active_complaints": 15,
        "avg_resolution_hrs": 16
    },
    {
        "id": "DEPT-TRAFFIC",
        "name": "Traffic and Road Safety Department",
        "kannada_name": "ಸಂಚಾರ ಮತ್ತು ರಸ್ತೆ ಸುರಕ್ಷತೆ ಇಲಾಖೆ",
        "head": "Traffic Inspector N. Siddaraju",
        "contact_phone": "+91 816 2278107",
        "email": "traffic@tumakurucitycorp.gov.in",
        "active_complaints": 12,
        "avg_resolution_hrs": 10
    },
    {
        "id": "DEPT-PARKS",
        "name": "Parks and Public Spaces Department",
        "kannada_name": "ಉದ್ಯಾನವನ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸ್ಥಳಗಳ ಇಲಾಖೆ",
        "head": "Horticulture Officer Rekha Patil",
        "contact_phone": "+91 816 2278108",
        "email": "parks@tumakurucitycorp.gov.in",
        "active_complaints": 9,
        "avg_resolution_hrs": 36
    }
]
