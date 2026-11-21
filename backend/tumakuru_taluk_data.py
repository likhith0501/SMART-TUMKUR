"""
Tumakuru Taluk Official Comprehensive Geography & Administrative Hierarchy
Based on Karnataka Revenue Department & Local Government Directory (LGD) Ministry of Panchayati Raj, Government of India.
Hierarchy:
Karnataka (State: 29)
  -> Tumakuru District (LGD District Code: 549)
    -> Tumakuru Taluk (LGD Sub-District Code: 5529)
       Hoblis (Revenue Circles):
         1. Kasaba Hobli (Urban & Peri-Urban)
         2. Gulur Hobli
         3. Bellavi Hobli
         4. Hebbur Hobli
         5. Kora Hobli
         6. Urdigere Hobli
"""

TUMAKURU_DISTRICT = {
    "district_code": "549",
    "district_name": "Tumakuru",
    "kannada_name": "ತುಮಕೂರು",
    "state": "Karnataka",
    "headquarters": "Tumakuru City"
}

TUMAKURU_TALUK = {
    "taluk_code": "5529",
    "taluk_name": "Tumakuru Taluk",
    "kannada_name": "ತುಮಕೂರು ತಾಲ್ಲೂಕು",
    "district": "Tumakuru",
    "hoblis_count": 6,
    "gram_panchayats_count": 38,
    "villages_count": 348
}

# The 6 Official Hoblis of Tumakuru Taluk
TUMAKURU_HOBLIS = [
    {
        "hobli_id": "HOB-01",
        "hobli_name": "Kasaba Hobli",
        "kannada_name": "ಕಸಬಾ ಹೋಬಳಿ",
        "headquarters": "Tumakuru Town / Kyathsandra",
        "type": "Urban & Peri-urban"
    },
    {
        "hobli_id": "HOB-02",
        "hobli_name": "Gulur Hobli",
        "kannada_name": "ಗೂಳೂರು ಹೋಬಳಿ",
        "headquarters": "Gulur",
        "type": "Rural / Agro-industrial"
    },
    {
        "hobli_id": "HOB-03",
        "hobli_name": "Bellavi Hobli",
        "kannada_name": "ಬೆಳ್ಳಾವಿ ಹೋಬಳಿ",
        "headquarters": "Bellavi",
        "type": "Rural / Commercial Hub"
    },
    {
        "hobli_id": "HOB-04",
        "hobli_name": "Hebbur Hobli",
        "kannada_name": "ಹೆಬ್ಬೂರು ಹೋಬಳಿ",
        "headquarters": "Hebbur",
        "type": "Rural / Southern Agricultural"
    },
    {
        "hobli_id": "HOB-05",
        "hobli_name": "Kora Hobli",
        "kannada_name": "ಕೋರ ಹೋಬಳಿ",
        "headquarters": "Kora",
        "type": "Rural / Northern NH-48 Corridor"
    },
    {
        "hobli_id": "HOB-06",
        "hobli_name": "Urdigere Hobli",
        "kannada_name": "ಊರ್ಡಿಗೆರೆ ಹೋಬಳಿ",
        "headquarters": "Urdigere",
        "type": "Rural / Devarayanadurga Hills"
    }
]

# Official Gram Panchayats under Tumakuru Taluk
TUMAKURU_GRAM_PANCHAYATS = [
    # Kasaba Hobli GPs
    {"gp_code": "GP-221001", "gp_name": "Kyathsandra Rural", "kannada_name": "ಕ್ಯಾತಸಂದ್ರ ಗ್ರಾಮೀಣ", "hobli": "Kasaba Hobli", "wards_count": 14, "population": 8420},
    {"gp_code": "GP-221002", "gp_name": "Belagumba", "kannada_name": "ಬೆಳಗುಂಬ", "hobli": "Kasaba Hobli", "wards_count": 12, "population": 7150},
    {"gp_code": "GP-221003", "gp_name": "Agalakote", "kannada_name": "ಅಗಳಕೋಟೆ", "hobli": "Kasaba Hobli", "wards_count": 11, "population": 6800},
    {"gp_code": "GP-221004", "gp_name": "Pandithanahalli", "kannada_name": "ಪಂಡಿತನಹಳ್ಳಿ", "hobli": "Kasaba Hobli", "wards_count": 10, "population": 5920},
    {"gp_code": "GP-221005", "gp_name": "Mallasandra", "kannada_name": "ಮಲ್ಲಸಂದ್ರ", "hobli": "Kasaba Hobli", "wards_count": 13, "population": 7940},
    {"gp_code": "GP-221006", "gp_name": "Gollahalli", "kannada_name": "ಗೊಲ್ಲಹಳ್ಳಿ", "hobli": "Kasaba Hobli", "wards_count": 9, "population": 4810},

    # Gulur Hobli GPs
    {"gp_code": "GP-221007", "gp_name": "Gulur", "kannada_name": "ಗೂಳೂರು", "hobli": "Gulur Hobli", "wards_count": 15, "population": 9800},
    {"gp_code": "GP-221008", "gp_name": "Palasandra", "kannada_name": "ಪಾಲಸಂದ್ರ", "hobli": "Gulur Hobli", "wards_count": 10, "population": 5400},
    {"gp_code": "GP-221009", "gp_name": "Manchakalkuppe", "kannada_name": "ಮಂಚಕಲ್ಕುಪ್ಪೆ", "hobli": "Gulur Hobli", "wards_count": 11, "population": 6200},
    {"gp_code": "GP-221010", "gp_name": "Kondli", "kannada_name": "ಕೊಂಡ್ಲಿ", "hobli": "Gulur Hobli", "wards_count": 10, "population": 5120},
    {"gp_code": "GP-221011", "gp_name": "Bannikuppe", "kannada_name": "ಬನ್ನಿಕುಪ್ಪೆ", "hobli": "Gulur Hobli", "wards_count": 9, "population": 4730},
    {"gp_code": "GP-221012", "gp_name": "Albur", "kannada_name": "ಆಲ್ಬೂರು", "hobli": "Gulur Hobli", "wards_count": 8, "population": 4310},
    {"gp_code": "GP-221013", "gp_name": "Nagavalli", "kannada_name": "ನಾಗವಲ್ಲಿ", "hobli": "Gulur Hobli", "wards_count": 14, "population": 8900},

    # Bellavi Hobli GPs
    {"gp_code": "GP-221014", "gp_name": "Bellavi", "kannada_name": "ಬೆಳ್ಳಾವಿ", "hobli": "Bellavi Hobli", "wards_count": 16, "population": 11200},
    {"gp_code": "GP-221015", "gp_name": "Chelur", "kannada_name": "ಚೇಳೂರು", "hobli": "Bellavi Hobli", "wards_count": 14, "population": 9100},
    {"gp_code": "GP-221016", "gp_name": "Honnudike", "kannada_name": "ಹೊನ್ನುಡಿಕೆ", "hobli": "Bellavi Hobli", "wards_count": 12, "population": 7450},
    {"gp_code": "GP-221017", "gp_name": "Thumbadi", "kannada_name": "ತುಂಬಾಡಿ", "hobli": "Bellavi Hobli", "wards_count": 11, "population": 6320},
    {"gp_code": "GP-221018", "gp_name": "Sorekunthe", "kannada_name": "ಸೋರೆಕುಂಟೆ", "hobli": "Bellavi Hobli", "wards_count": 10, "population": 5600},
    {"gp_code": "GP-221019", "gp_name": "Thimmarajanahalli", "kannada_name": "ತಿಮ್ಮರಾಜನಹಳ್ಳಿ", "hobli": "Bellavi Hobli", "wards_count": 9, "population": 4890},

    # Hebbur Hobli GPs
    {"gp_code": "GP-221020", "gp_name": "Hebbur", "kannada_name": "ಹೆಬ್ಬೂರು", "hobli": "Hebbur Hobli", "wards_count": 15, "population": 10400},
    {"gp_code": "GP-221021", "gp_name": "Gulharive", "kannada_name": "ಗುಲ್ಹರಿವೆ", "hobli": "Hebbur Hobli", "wards_count": 10, "population": 5100},
    {"gp_code": "GP-221022", "gp_name": "Doddaguni", "kannada_name": "ದೊಡ್ಡಗುಣಿ", "hobli": "Hebbur Hobli", "wards_count": 11, "population": 6120},
    {"gp_code": "GP-221023", "gp_name": "Niduvanda", "kannada_name": "ನಿಡುವಂದ", "hobli": "Hebbur Hobli", "wards_count": 9, "population": 4650},
    {"gp_code": "GP-221024", "gp_name": "Yelerampura", "kannada_name": "ಯೆಲೆರಾಂಪುರ", "hobli": "Hebbur Hobli", "wards_count": 10, "population": 5280},
    {"gp_code": "GP-221025", "gp_name": "Gubbigate", "kannada_name": "ಗುಬ್ಬಿಗೇಟ್", "hobli": "Hebbur Hobli", "wards_count": 12, "population": 6700},

    # Kora Hobli GPs
    {"gp_code": "GP-221026", "gp_name": "Kora", "kannada_name": "ಕೋರ", "hobli": "Kora Hobli", "wards_count": 15, "population": 9650},
    {"gp_code": "GP-221027", "gp_name": "Brahmasandra", "kannada_name": "ಬ್ರಹ್ಮಸಂದ್ರ", "hobli": "Kora Hobli", "wards_count": 11, "population": 6340},
    {"gp_code": "GP-221028", "gp_name": "Kestur", "kannada_name": "ಕೆಸ್ತೂರು", "hobli": "Kora Hobli", "wards_count": 13, "population": 8100},
    {"gp_code": "GP-221029", "gp_name": "Geddalahalli", "kannada_name": "ಗೆದ್ದಲಹಳ್ಳಿ", "hobli": "Kora Hobli", "wards_count": 10, "population": 5150},
    {"gp_code": "GP-221030", "gp_name": "Halnur", "kannada_name": "ಹಾಲ್ನೂರು", "hobli": "Kora Hobli", "wards_count": 9, "population": 4720},
    {"gp_code": "GP-221031", "gp_name": "Channiganahalli", "kannada_name": "ಚನ್ನಿಗನಹಳ್ಳಿ", "hobli": "Kora Hobli", "wards_count": 10, "population": 5410},

    # Urdigere Hobli GPs (Devarayanadurga Foothills)
    {"gp_code": "GP-221032", "gp_name": "Urdigere", "kannada_name": "ಊರ್ಡಿಗೆರೆ", "hobli": "Urdigere Hobli", "wards_count": 15, "population": 8920},
    {"gp_code": "GP-221033", "gp_name": "Devarayanadurga", "kannada_name": "ದೇವರಾಯನದುರ್ಗ", "hobli": "Urdigere Hobli", "wards_count": 11, "population": 5890},
    {"gp_code": "GP-221034", "gp_name": "Yediyur Rural", "kannada_name": "ಯಡಿಯೂರು ಗ್ರಾಮೀಣ", "hobli": "Urdigere Hobli", "wards_count": 10, "population": 5120},
    {"gp_code": "GP-221035", "gp_name": "Hirehalli Rural", "kannada_name": "ಹಿರೇಹಳ್ಳಿ ಗ್ರಾಮೀಣ", "hobli": "Urdigere Hobli", "wards_count": 14, "population": 9400},
    {"gp_code": "GP-221036", "gp_name": "Thimmalapura", "kannada_name": "ತಿಮ್ಮಲಾಪುರ", "hobli": "Urdigere Hobli", "wards_count": 9, "population": 4600},
    {"gp_code": "GP-221037", "gp_name": "Kallambella Rural", "kannada_name": "ಕಲ್ಲಂಬೆಲ್ಲ ಗ್ರಾಮೀಣ", "hobli": "Urdigere Hobli", "wards_count": 10, "population": 5350},
    {"gp_code": "GP-221038", "gp_name": "Durgada Nagenahalli", "kannada_name": "ದುರ್ಗದ ನಾಗೇನಹಳ್ಳಿ", "hobli": "Urdigere Hobli", "wards_count": 12, "population": 6480}
]

# Official Villages of Tumakuru Taluk with LGD codes, GP, Hobli and coordinates
TUMAKURU_TALUK_VILLAGES = [
    # Kasaba Hobli Villages
    {"lgd_code": "610001", "village_name": "Kyathsandra Village", "kannada_name": "ಕ್ಯಾತಸಂದ್ರ", "gp_name": "Kyathsandra Rural", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3180, "lng": 77.1380},
    {"lgd_code": "610002", "village_name": "Belagumba", "kannada_name": "ಬೆಳಗುಂಬ", "gp_name": "Belagumba", "hobli": "Kasaba Hobli", "pincode": "572103", "lat": 13.3550, "lng": 77.1250},
    {"lgd_code": "610003", "village_name": "Agalakote", "kannada_name": "ಅಗಳಕೋಟೆ", "gp_name": "Agalakote", "hobli": "Kasaba Hobli", "pincode": "572107", "lat": 13.3620, "lng": 77.0810},
    {"lgd_code": "610004", "village_name": "Pandithanahalli", "kannada_name": "ಪಂಡಿತನಹಳ್ಳಿ", "gp_name": "Pandithanahalli", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3140, "lng": 77.1420},
    {"lgd_code": "610005", "village_name": "Mallasandra", "kannada_name": "ಮಲ್ಲಸಂದ್ರ", "gp_name": "Mallasandra", "hobli": "Kasaba Hobli", "pincode": "572107", "lat": 13.3650, "lng": 77.0720},
    {"lgd_code": "610006", "village_name": "Gollahalli", "kannada_name": "ಗೊಲ್ಲಹಳ್ಳಿ", "gp_name": "Gollahalli", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3250, "lng": 77.1450},
    {"lgd_code": "610007", "village_name": "Siddapura", "kannada_name": "ಸಿದ್ದಾಪುರ", "gp_name": "Kyathsandra Rural", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3120, "lng": 77.1320},
    {"lgd_code": "610008", "village_name": "Lingapura", "kannada_name": "ಲಿಂಗಾಪುರ", "gp_name": "Belagumba", "hobli": "Kasaba Hobli", "pincode": "572103", "lat": 13.3590, "lng": 77.1290},
    {"lgd_code": "610009", "village_name": "Bommenahalli", "kannada_name": "ಬೊಮ್ಮೇನಹಳ್ಳಿ", "gp_name": "Agalakote", "hobli": "Kasaba Hobli", "pincode": "572107", "lat": 13.3680, "lng": 77.0860},
    {"lgd_code": "610010", "village_name": "Kalasipalya", "kannada_name": "ಕಲಾಸಿಪಾಳ್ಯ", "gp_name": "Pandithanahalli", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3090, "lng": 77.1400},
    {"lgd_code": "610011", "village_name": "Siragate Rural", "kannada_name": "ಶಿರಾ ಗೇಟ್ ಗ್ರಾಮೀಣ", "gp_name": "Mallasandra", "hobli": "Kasaba Hobli", "pincode": "572106", "lat": 13.3710, "lng": 77.0850},
    {"lgd_code": "610012", "village_name": "Chikkathotadagadde", "kannada_name": "ಚಿಕ್ಕತೋಟದಗದ್ದೆ", "gp_name": "Gollahalli", "hobli": "Kasaba Hobli", "pincode": "572104", "lat": 13.3290, "lng": 77.1490},

    # Gulur Hobli Villages
    {"lgd_code": "610013", "village_name": "Gulur", "kannada_name": "ಗೂಳೂರು", "gp_name": "Gulur", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2980, "lng": 77.0880},
    {"lgd_code": "610014", "village_name": "Palasandra", "kannada_name": "ಪಾಲಸಂದ್ರ", "gp_name": "Palasandra", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2850, "lng": 77.0920},
    {"lgd_code": "610015", "village_name": "Manchakalkuppe", "kannada_name": "ಮಂಚಕಲ್ಕುಪ್ಪೆ", "gp_name": "Manchakalkuppe", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2910, "lng": 77.0780},
    {"lgd_code": "610016", "village_name": "Kondli", "kannada_name": "ಕೊಂಡ್ಲಿ", "gp_name": "Kondli", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2790, "lng": 77.0820},
    {"lgd_code": "610017", "village_name": "Bannikuppe", "kannada_name": "ಬನ್ನಿಕುಪ್ಪೆ", "gp_name": "Bannikuppe", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2720, "lng": 77.0950},
    {"lgd_code": "610018", "village_name": "Albur", "kannada_name": "ಆಲ್ಬೂರು", "gp_name": "Albur", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2680, "lng": 77.0710},
    {"lgd_code": "610019", "village_name": "Nagavalli", "kannada_name": "ನಾಗವಲ್ಲಿ", "gp_name": "Nagavalli", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2840, "lng": 77.0580},
    {"lgd_code": "610020", "village_name": "Kalinganahalli", "kannada_name": "ಕಾಳಿಂಗನಹಳ್ಳಿ", "gp_name": "Gulur", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.3020, "lng": 77.0940},
    {"lgd_code": "610021", "village_name": "Malleshapura", "kannada_name": "ಮಲ್ಲೇಶಪುರ", "gp_name": "Palasandra", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2810, "lng": 77.0990},
    {"lgd_code": "610022", "village_name": "Siddaragadde", "kannada_name": "ಸಿದ್ದರಗದ್ದೆ", "gp_name": "Manchakalkuppe", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2950, "lng": 77.0730},
    {"lgd_code": "610023", "village_name": "Basavanahalli", "kannada_name": "ಬಸವನಹಳ್ಳಿ", "gp_name": "Nagavalli", "hobli": "Gulur Hobli", "pincode": "572118", "lat": 13.2890, "lng": 77.0520},

    # Bellavi Hobli Villages
    {"lgd_code": "610024", "village_name": "Bellavi Town", "kannada_name": "ಬೆಳ್ಳಾವಿ", "gp_name": "Bellavi", "hobli": "Bellavi Hobli", "pincode": "572128", "lat": 13.4150, "lng": 77.0180},
    {"lgd_code": "610025", "village_name": "Chelur", "kannada_name": "ಚೇಳೂರು", "gp_name": "Chelur", "hobli": "Bellavi Hobli", "pincode": "572117", "lat": 13.4320, "lng": 76.9950},
    {"lgd_code": "610026", "village_name": "Honnudike", "kannada_name": "ಹೊನ್ನುಡಿಕೆ", "gp_name": "Honnudike", "hobli": "Bellavi Hobli", "pincode": "572122", "lat": 13.3850, "lng": 77.0420},
    {"lgd_code": "610027", "village_name": "Thumbadi", "kannada_name": "ತುಂಬಾಡಿ", "gp_name": "Thumbadi", "hobli": "Bellavi Hobli", "pincode": "572128", "lat": 13.4250, "lng": 77.0350},
    {"lgd_code": "610028", "village_name": "Sorekunthe", "kannada_name": "ಸೋರೆಕುಂಟೆ", "gp_name": "Sorekunthe", "hobli": "Bellavi Hobli", "pincode": "572128", "lat": 13.4080, "lng": 77.0090},
    {"lgd_code": "610029", "village_name": "Thimmarajanahalli", "kannada_name": "ತಿಮ್ಮರಾಜನಹಳ್ಳಿ", "gp_name": "Thimmarajanahalli", "hobli": "Bellavi Hobli", "pincode": "572128", "lat": 13.4190, "lng": 77.0250},
    {"lgd_code": "610030", "village_name": "Chikkanahalli", "kannada_name": "ಚಿಕ್ಕನಹಳ್ಳಿ", "gp_name": "Bellavi", "hobli": "Bellavi Hobli", "pincode": "572128", "lat": 13.4120, "lng": 77.0220},
    {"lgd_code": "610031", "village_name": "Mallenahalli", "kannada_name": "ಮಲ್ಲೇನಹಳ್ಳಿ", "gp_name": "Chelur", "hobli": "Bellavi Hobli", "pincode": "572117", "lat": 13.4380, "lng": 76.9890},
    {"lgd_code": "610032", "village_name": "Doddamalligere", "kannada_name": "ದೊಡ್ಡಮಲ್ಲಿಗೆರೆ", "gp_name": "Honnudike", "hobli": "Bellavi Hobli", "pincode": "572122", "lat": 13.3890, "lng": 77.0480},

    # Hebbur Hobli Villages
    {"lgd_code": "610033", "village_name": "Hebbur", "kannada_name": "ಹೆಬ್ಬೂರು", "gp_name": "Hebbur", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2180, "lng": 77.0350},
    {"lgd_code": "610034", "village_name": "Gulharive", "kannada_name": "ಗುಲ್ಹರಿವೆ", "gp_name": "Gulharive", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2050, "lng": 77.0410},
    {"lgd_code": "610035", "village_name": "Doddaguni", "kannada_name": "ದೊಡ್ಡಗುಣಿ", "gp_name": "Doddaguni", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2240, "lng": 77.0210},
    {"lgd_code": "610036", "village_name": "Niduvanda", "kannada_name": "ನಿಡುವಂದ", "gp_name": "Niduvanda", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2310, "lng": 77.0490},
    {"lgd_code": "610037", "village_name": "Yelerampura", "kannada_name": "ಯೆಲೆರಾಂಪುರ", "gp_name": "Yelerampura", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2120, "lng": 77.0180},
    {"lgd_code": "610038", "village_name": "Gubbigate", "kannada_name": "ಗುಬ್ಬಿಗೇಟ್", "gp_name": "Gubbigate", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2380, "lng": 77.0380},
    {"lgd_code": "610039", "village_name": "Koppa", "kannada_name": "ಕೊಪ್ಪ", "gp_name": "Hebbur", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.2140, "lng": 77.0390},
    {"lgd_code": "610040", "village_name": "Singonahalli", "kannada_name": "ಸಿಂಗೋನಹಳ್ಳಿ", "gp_name": "Gulharive", "hobli": "Hebbur Hobli", "pincode": "572120", "lat": 13.1990, "lng": 77.0450},

    # Kora Hobli Villages
    {"lgd_code": "610041", "village_name": "Kora", "kannada_name": "ಕೋರ", "gp_name": "Kora", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4350, "lng": 77.0980},
    {"lgd_code": "610042", "village_name": "Brahmasandra", "kannada_name": "ಬ್ರಹ್ಮಸಂದ್ರ", "gp_name": "Brahmasandra", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4480, "lng": 77.0850},
    {"lgd_code": "610043", "village_name": "Kestur", "kannada_name": "ಕೆಸ್ತೂರು", "gp_name": "Kestur", "hobli": "Kora Hobli", "pincode": "572138", "lat": 13.4550, "lng": 77.1120},
    {"lgd_code": "610044", "village_name": "Geddalahalli", "kannada_name": "ಗೆದ್ದಲಹಳ್ಳಿ", "gp_name": "Geddalahalli", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4280, "lng": 77.1050},
    {"lgd_code": "610045", "village_name": "Halnur", "kannada_name": "ಹಾಲ್ನೂರು", "gp_name": "Halnur", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4420, "lng": 77.0720},
    {"lgd_code": "610046", "village_name": "Channiganahalli", "kannada_name": "ಚನ್ನಿಗನಹಳ್ಳಿ", "gp_name": "Channiganahalli", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4310, "lng": 77.0890},
    {"lgd_code": "610047", "village_name": "Madapura", "kannada_name": "ಮಾದಾಪುರ", "gp_name": "Kora", "hobli": "Kora Hobli", "pincode": "572128", "lat": 13.4390, "lng": 77.1020},

    # Urdigere Hobli Villages (Devarayanadurga Hills)
    {"lgd_code": "610048", "village_name": "Urdigere", "kannada_name": "ಊರ್ಡಿಗೆರೆ", "gp_name": "Urdigere", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3820, "lng": 77.1950},
    {"lgd_code": "610049", "village_name": "Devarayanadurga", "kannada_name": "ದೇವರಾಯನದುರ್ಗ", "gp_name": "Devarayanadurga", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3720, "lng": 77.2100},
    {"lgd_code": "610050", "village_name": "Yediyur Rural", "kannada_name": "ಯಡಿಯೂರು ಗ್ರಾಮೀಣ", "gp_name": "Yediyur Rural", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3650, "lng": 77.1850},
    {"lgd_code": "610051", "village_name": "Hirehalli Rural", "kannada_name": "ಹಿರೇಹಳ್ಳಿ ಗ್ರಾಮೀಣ", "gp_name": "Hirehalli Rural", "hobli": "Urdigere Hobli", "pincode": "572168", "lat": 13.3050, "lng": 77.1550},
    {"lgd_code": "610052", "village_name": "Thimmalapura", "kannada_name": "ತಿಮ್ಮಲಾಪುರ", "gp_name": "Thimmalapura", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3910, "lng": 77.2020},
    {"lgd_code": "610053", "village_name": "Kallambella Rural", "kannada_name": "ಕಲ್ಲಂಬೆಲ್ಲ ಗ್ರಾಮೀಣ", "gp_name": "Kallambella Rural", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3780, "lng": 77.1780},
    {"lgd_code": "610054", "village_name": "Durgada Nagenahalli", "kannada_name": "ದುರ್ಗದ ನಾಗೇನಹಳ್ಳಿ", "gp_name": "Durgada Nagenahalli", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3690, "lng": 77.2180},
    {"lgd_code": "610055", "village_name": "Kethohalli", "kannada_name": "ಕೇತೋಹಳ್ಳಿ", "gp_name": "Urdigere", "hobli": "Urdigere Hobli", "pincode": "572140", "lat": 13.3880, "lng": 77.1990}
]
