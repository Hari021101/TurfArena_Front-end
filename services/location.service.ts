import AsyncStorage from "@react-native-async-storage/async-storage";

export interface State {
  id: string;
  name: string;
  logo: string;
}

export interface Region {
  id: string;
  stateId: string;
  name: string;
}

const SELECTED_LOCATION_KEY = "turf_arena_selected_location";

export const STATES: State[] = [
  {
    id: "tn",
    name: "Tamil Nadu",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Tanjore_Big_Temple_Tamil_Nadu_India.jpg&width=500",
  },
  {
    id: "kl",
    name: "Kerala",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kerala_Houseboat.jpg&width=500",
  },
  {
    id: "ka",
    name: "Karnataka",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/The_Mysore_Palace.JPG&width=500",
  },
  {
    id: "ap",
    name: "Andhra Pradesh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Tirumala_Venkateswara_temple_entrance_09062015.JPG&width=500",
  },
  {
    id: "ts",
    name: "Telangana",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Charminar.jpg&width=500",
  },
  {
    id: "mh",
    name: "Maharashtra",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Gateway_of_India.jpg&width=500",
  },
  {
    id: "wb",
    name: "West Bengal",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Victoria_Memorial,_Kolkata_India.jpg&width=500",
  },
  {
    id: "gj",
    name: "Gujarat",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Somnath_temple_gujrat.jpg&width=500",
  },
  {
    id: "rj",
    name: "Rajasthan",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Hawa_Mahal_2011.jpg&width=500",
  },
  {
    id: "up",
    name: "Uttar Pradesh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Taj_Mahal_(Edited).jpeg&width=500",
  },
  {
    id: "dl",
    name: "Delhi",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/India_Gate.jpg&width=500",
  },
  {
    id: "pb",
    name: "Punjab",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Golden_Temple_India.jpg&width=500",
  },
  {
    id: "hr",
    name: "Haryana",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Gurgaon_skyline.jpg&width=500",
  },
  {
    id: "br",
    name: "Bihar",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Mahabodhi_Temple_-_Bodh_Gaya.jpg&width=500",
  },
  {
    id: "mp",
    name: "Madhya Pradesh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Khajuraho_Temple,_Khajuraho.jpg&width=500",
  },
  {
    id: "or",
    name: "Odisha",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Konark_Sun_Temple.jpg&width=500",
  },
  {
    id: "ga",
    name: "Goa",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Palolem_Beach_India.jpg&width=500",
  },
  {
    id: "as",
    name: "Assam",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Assam's_Tea_Garden.jpg&width=500",
  },
  // Union Territories
  {
    id: "jk",
    name: "Jammu and Kashmir",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Dal_Lake_Srinagar_Kashmir.jpg&width=500",
  },
  {
    id: "la",
    name: "Ladakh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Thiksey_Monastery,_Ladakh.jpg&width=500",
  },
  {
    id: "py",
    name: "Puducherry",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Beach_Promenade,_Pondicherry,_India.jpg&width=500",
  },
  {
    id: "ch",
    name: "Chandigarh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Rock_Garden_Chandigarh_India_(6).JPG&width=500",
  },
  {
    id: "an",
    name: "Andaman and Nicobar",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Havelock_Island.jpg&width=500",
  },
  {
    id: "ld",
    name: "Lakshadweep",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lakshadweep_-_Agatti_Islands.jpg&width=500",
  },
  {
    id: "dn",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Diu_Fort.JPG&width=500",
  },
  {
    id: "cg",
    name: "Chhattisgarh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Chitrakote_Falls.jpg&width=500",
  },
  {
    id: "hp",
    name: "Himachal Pradesh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Shimla_India_Ridge.JPG&width=500",
  },
  {
    id: "jh",
    name: "Jharkhand",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Hundru_Falls,_Ranchi.jpg&width=500",
  },
  {
    id: "uk",
    name: "Uttarakhand",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kedarnath_Temple.jpg&width=500",
  },
  {
    id: "ar",
    name: "Arunachal Pradesh",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/The_Tawang_Monastery.jpg&width=500",
  },
  {
    id: "mn",
    name: "Manipur",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Loktak_Lake,_Manipur.jpg&width=500",
  },
  {
    id: "ml",
    name: "Meghalaya",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Nohkalikai_Falls_near_Cherrapunji,_India.jpg&width=500",
  },
  {
    id: "mz",
    name: "Mizoram",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Aizawl_Panoramic_View.jpg&width=500",
  },
  {
    id: "nl",
    name: "Nagaland",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Hornbill_Festival_,Nagaland.jpg&width=500",
  },
  {
    id: "sk",
    name: "Sikkim",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kangchenjunga_Sikkim_India.jpg&width=500",
  },
  {
    id: "tr",
    name: "Tripura",
    logo: "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Ujjayanta_Palace.jpg&width=500",
  },
];

export const REGIONS: Record<string, Region[]> = {
  tn: [
    { id: "tn-ch", stateId: "tn", name: "Chennai" },
    { id: "tn-co", stateId: "tn", name: "Coimbatore" },
    { id: "tn-md", stateId: "tn", name: "Madurai" },
    { id: "tn-tr", stateId: "tn", name: "Tiruchirappalli (Trichy)" },
    { id: "tn-sl", stateId: "tn", name: "Salem" },
    { id: "tn-er", stateId: "tn", name: "Erode" },
    { id: "tn-ti", stateId: "tn", name: "Tirunelveli" },
    { id: "tn-ve", stateId: "tn", name: "Vellore" },
    { id: "tn-th", stateId: "tn", name: "Thoothukudi" },
    { id: "tn-di", stateId: "tn", name: "Dindigul" },
    { id: "tn-ta", stateId: "tn", name: "Thanjavur" },
    { id: "tn-ka", stateId: "tn", name: "Kanyakumari" },
  ],
  kl: [
    { id: "kl-tv", stateId: "kl", name: "Thiruvananthapuram" },
    { id: "kl-ko", stateId: "kl", name: "Kochi" },
    { id: "kl-cl", stateId: "kl", name: "Kozhikode (Calicut)" },
    { id: "kl-tr", stateId: "kl", name: "Thrissur" },
    { id: "kl-ka", stateId: "kl", name: "Kannur" },
    { id: "kl-al", stateId: "kl", name: "Alappuzha" },
    { id: "kl-ko", stateId: "kl", name: "Kollam" },
    { id: "kl-pl", stateId: "kl", name: "Palakkad" },
    { id: "kl-ml", stateId: "kl", name: "Malappuram" },
    { id: "kl-kt", stateId: "kl", name: "Kottayam" },
  ],
  ka: [
    { id: "ka-bl", stateId: "ka", name: "Bengaluru (Bangalore)" },
    { id: "ka-my", stateId: "ka", name: "Mysuru (Mysore)" },
    { id: "ka-ma", stateId: "ka", name: "Mangaluru (Mangalore)" },
    { id: "ka-hu", stateId: "ka", name: "Hubballi-Dharwad" },
    { id: "ka-be", stateId: "ka", name: "Belagavi (Belgaum)" },
    { id: "ka-da", stateId: "ka", name: "Davanagere" },
    { id: "ka-ba", stateId: "ka", name: "Ballari (Bellary)" },
    { id: "ka-ud", stateId: "ka", name: "Udupi" },
    { id: "ka-sh", stateId: "ka", name: "Shivamogga" },
  ],
  ap: [
    { id: "ap-vi", stateId: "ap", name: "Visakhapatnam" },
    { id: "ap-vj", stateId: "ap", name: "Vijayawada" },
    { id: "ap-gu", stateId: "ap", name: "Guntur" },
    { id: "ap-ne", stateId: "ap", name: "Nellore" },
    { id: "ap-ku", stateId: "ap", name: "Kurnool" },
    { id: "ap-ra", stateId: "ap", name: "Rajahmundry" },
    { id: "ap-ti", stateId: "ap", name: "Tirupati" },
    { id: "ap-ka", stateId: "ap", name: "Kadapa" },
    { id: "ap-an", stateId: "ap", name: "Anantapur" },
  ],
  ts: [
    { id: "ts-hy", stateId: "ts", name: "Hyderabad" },
    { id: "ts-wa", stateId: "ts", name: "Warangal" },
    { id: "ts-ni", stateId: "ts", name: "Nizamabad" },
    { id: "ts-ka", stateId: "ts", name: "Karimnagar" },
    { id: "ts-kh", stateId: "ts", name: "Khammam" },
    { id: "ts-ra", stateId: "ts", name: "Ramagundam" },
  ],
  mh: [
    { id: "mh-mu", stateId: "mh", name: "Mumbai" },
    { id: "mh-pu", stateId: "mh", name: "Pune" },
    { id: "mh-na", stateId: "mh", name: "Nagpur" },
    { id: "mh-th", stateId: "mh", name: "Thane" },
    { id: "mh-ns", stateId: "mh", name: "Nashik" },
    { id: "mh-au", stateId: "mh", name: "Aurangabad" },
    { id: "mh-so", stateId: "mh", name: "Solapur" },
    { id: "mh-ko", stateId: "mh", name: "Kolhapur" },
    { id: "mh-am", stateId: "mh", name: "Amravati" },
  ],
  wb: [
    { id: "wb-ko", stateId: "wb", name: "Kolkata" },
    { id: "wb-ho", stateId: "wb", name: "Howrah" },
    { id: "wb-si", stateId: "wb", name: "Siliguri" },
    { id: "wb-du", stateId: "wb", name: "Durgapur" },
    { id: "wb-as", stateId: "wb", name: "Asansol" },
    { id: "wb-da", stateId: "wb", name: "Darjeeling" },
  ],
  gj: [
    { id: "gj-ah", stateId: "gj", name: "Ahmedabad" },
    { id: "gj-su", stateId: "gj", name: "Surat" },
    { id: "gj-va", stateId: "gj", name: "Vadodara" },
    { id: "gj-ra", stateId: "gj", name: "Rajkot" },
    { id: "gj-bh", stateId: "gj", name: "Bhavnagar" },
    { id: "gj-ja", stateId: "gj", name: "Jamnagar" },
    { id: "gj-ju", stateId: "gj", name: "Junagadh" },
    { id: "gj-ga", stateId: "gj", name: "Gandhinagar" },
  ],
  rj: [
    { id: "rj-ja", stateId: "rj", name: "Jaipur" },
    { id: "rj-jo", stateId: "rj", name: "Jodhpur" },
    { id: "rj-ud", stateId: "rj", name: "Udaipur" },
    { id: "rj-ko", stateId: "rj", name: "Kota" },
    { id: "rj-bi", stateId: "rj", name: "Bikaner" },
    { id: "rj-aj", stateId: "rj", name: "Ajmer" },
    { id: "rj-bh", stateId: "rj", name: "Bhilwara" },
  ],
  up: [
    { id: "up-lu", stateId: "up", name: "Lucknow" },
    { id: "up-ka", stateId: "up", name: "Kanpur" },
    { id: "up-va", stateId: "up", name: "Varanasi" },
    { id: "up-ag", stateId: "up", name: "Agra" },
    { id: "up-no", stateId: "up", name: "Noida" },
    { id: "up-gh", stateId: "up", name: "Ghaziabad" },
    { id: "up-me", stateId: "up", name: "Meerut" },
    { id: "up-pr", stateId: "up", name: "Prayagraj (Allahabad)" },
    { id: "up-ba", stateId: "up", name: "Bareilly" },
    { id: "up-al", stateId: "up", name: "Aligarh" },
  ],
  dl: [
    { id: "dl-nd", stateId: "dl", name: "New Delhi" },
    { id: "dl-ea", stateId: "dl", name: "East Delhi" },
    { id: "dl-so", stateId: "dl", name: "South Delhi" },
    { id: "dl-no", stateId: "dl", name: "North Delhi" },
    { id: "dl-we", stateId: "dl", name: "West Delhi" },
    { id: "dl-ce", stateId: "dl", name: "Central Delhi" },
  ],
  pb: [
    { id: "pb-lu", stateId: "pb", name: "Ludhiana" },
    { id: "pb-am", stateId: "pb", name: "Amritsar" },
    { id: "pb-ch", stateId: "pb", name: "Chandigarh" },
    { id: "pb-ja", stateId: "pb", name: "Jalandhar" },
    { id: "pb-pa", stateId: "pb", name: "Patiala" },
    { id: "pb-mo", stateId: "pb", name: "Mohali" },
  ],
  hr: [
    { id: "hr-gu", stateId: "hr", name: "Gurugram (Gurgaon)" },
    { id: "hr-fa", stateId: "hr", name: "Faridabad" },
    { id: "hr-pa", stateId: "hr", name: "Panipat" },
    { id: "hr-ka", stateId: "hr", name: "Karnal" },
    { id: "hr-hi", stateId: "hr", name: "Hisar" },
    { id: "hr-ro", stateId: "hr", name: "Rohtak" },
  ],
  br: [
    { id: "br-pa", stateId: "br", name: "Patna" },
    { id: "br-ga", stateId: "br", name: "Gaya" },
    { id: "br-mu", stateId: "br", name: "Muzaffarpur" },
    { id: "br-bh", stateId: "br", name: "Bhagalpur" },
    { id: "br-pu", stateId: "br", name: "Purnia" },
  ],
  mp: [
    { id: "mp-in", stateId: "mp", name: "Indore" },
    { id: "mp-bh", stateId: "mp", name: "Bhopal" },
    { id: "mp-gw", stateId: "mp", name: "Gwalior" },
    { id: "mp-ja", stateId: "mp", name: "Jabalpur" },
    { id: "mp-uj", stateId: "mp", name: "Ujjain" },
    { id: "mp-sa", stateId: "mp", name: "Sagar" },
  ],
  or: [
    { id: "or-bh", stateId: "or", name: "Bhubaneswar" },
    { id: "or-cu", stateId: "or", name: "Cuttack" },
    { id: "or-ro", stateId: "or", name: "Rourkela" },
    { id: "or-be", stateId: "or", name: "Berhampur" },
    { id: "or-pu", stateId: "or", name: "Puri" },
  ],
  ga: [
    { id: "ga-pj", stateId: "ga", name: "Panaji" },
    { id: "ga-ma", stateId: "ga", name: "Margao" },
    { id: "ga-va", stateId: "ga", name: "Vasco da Gama" },
    { id: "ga-po", stateId: "ga", name: "Ponda" },
  ],
  as: [
    { id: "as-gu", stateId: "as", name: "Guwahati" },
    { id: "as-si", stateId: "as", name: "Silchar" },
    { id: "as-di", stateId: "as", name: "Dibrugarh" },
    { id: "as-jo", stateId: "as", name: "Jorhat" },
    { id: "as-te", stateId: "as", name: "Tezpur" },
  ],
  jk: [
    { id: "jk-sr", stateId: "jk", name: "Srinagar" },
    { id: "jk-ja", stateId: "jk", name: "Jammu" },
    { id: "jk-an", stateId: "jk", name: "Anantnag" },
    { id: "jk-ba", stateId: "jk", name: "Baramulla" },
    { id: "jk-ud", stateId: "jk", name: "Udhampur" },
  ],
  la: [
    { id: "la-le", stateId: "la", name: "Leh" },
    { id: "la-ka", stateId: "la", name: "Kargil" },
  ],
  py: [
    { id: "py-pu", stateId: "py", name: "Puducherry" },
    { id: "py-ka", stateId: "py", name: "Karaikal" },
    { id: "py-ma", stateId: "py", name: "Mahe" },
    { id: "py-ya", stateId: "py", name: "Yanam" },
  ],
  ch: [{ id: "ch-ch", stateId: "ch", name: "Chandigarh" }],
  an: [
    { id: "an-pb", stateId: "an", name: "Port Blair" },
    { id: "an-ha", stateId: "an", name: "Havelock Island (Swaraj Dweep)" },
  ],
  ld: [
    { id: "ld-ka", stateId: "ld", name: "Kavaratti" },
    { id: "ld-ag", stateId: "ld", name: "Agatti" },
  ],
  dn: [
    { id: "dn-da", stateId: "dn", name: "Daman" },
    { id: "dn-di", stateId: "dn", name: "Diu" },
    { id: "dn-si", stateId: "dn", name: "Silvassa" },
  ],
  cg: [
    { id: "cg-ra", stateId: "cg", name: "Raipur" },
    { id: "cg-bh", stateId: "cg", name: "Bhilai" },
    { id: "cg-bi", stateId: "cg", name: "Bilaspur" },
  ],
  hp: [
    { id: "hp-sh", stateId: "hp", name: "Shimla" },
    { id: "hp-ma", stateId: "hp", name: "Manali" },
    { id: "hp-dh", stateId: "hp", name: "Dharamshala" },
  ],
  jh: [
    { id: "jh-ra", stateId: "jh", name: "Ranchi" },
    { id: "jh-ja", stateId: "jh", name: "Jamshedpur" },
    { id: "jh-dh", stateId: "jh", name: "Dhanbad" },
  ],
  uk: [
    { id: "uk-de", stateId: "uk", name: "Dehradun" },
    { id: "uk-ha", stateId: "uk", name: "Haridwar" },
    { id: "uk-na", stateId: "uk", name: "Nainital" },
    { id: "uk-ri", stateId: "uk", name: "Rishikesh" },
  ],
  ar: [
    { id: "ar-it", stateId: "ar", name: "Itanagar" },
    { id: "ar-ta", stateId: "ar", name: "Tawang" },
    { id: "ar-pa", stateId: "ar", name: "Pasighat" },
    { id: "ar-zi", stateId: "ar", name: "Ziro" },
    { id: "ar-bo", stateId: "ar", name: "Bomdila" },
    { id: "ar-al", stateId: "ar", name: "Along (Aalo)" },
  ],
  mn: [
    { id: "mn-im", stateId: "mn", name: "Imphal" },
    { id: "mn-bi", stateId: "mn", name: "Bishnupur" },
    { id: "mn-th", stateId: "mn", name: "Thoubal" },
    { id: "mn-ch", stateId: "mn", name: "Churachandpur" },
    { id: "mn-uk", stateId: "mn", name: "Ukhrul" },
  ],
  ml: [
    { id: "ml-sh", stateId: "ml", name: "Shillong" },
    { id: "ml-tu", stateId: "ml", name: "Tura" },
    { id: "ml-jo", stateId: "ml", name: "Jowai" },
    { id: "ml-no", stateId: "ml", name: "Nongpoh" },
    { id: "ml-wi", stateId: "ml", name: "Williamnagar" },
  ],
  mz: [
    { id: "mz-ai", stateId: "mz", name: "Aizawl" },
    { id: "mz-lu", stateId: "mz", name: "Lunglei" },
    { id: "mz-ch", stateId: "mz", name: "Champhai" },
    { id: "mz-ko", stateId: "mz", name: "Kolasib" },
  ],
  nl: [
    { id: "nl-ko", stateId: "nl", name: "Kohima" },
    { id: "nl-di", stateId: "nl", name: "Dimapur" },
    { id: "nl-mo", stateId: "nl", name: "Mokokchung" },
    { id: "nl-tu", stateId: "nl", name: "Tuensang" },
    { id: "nl-wo", stateId: "nl", name: "Wokha" },
    { id: "nl-mn", stateId: "nl", name: "Mon" },
  ],
  sk: [
    { id: "sk-ga", stateId: "sk", name: "Gangtok" },
    { id: "sk-na", stateId: "sk", name: "Namchi" },
    { id: "sk-ge", stateId: "sk", name: "Geyzing" },
    { id: "sk-ma", stateId: "sk", name: "Mangan" },
  ],
  tr: [
    { id: "tr-ag", stateId: "tr", name: "Agartala" },
    { id: "tr-ud", stateId: "tr", name: "Udaipur" },
    { id: "tr-dh", stateId: "tr", name: "Dharamnagar" },
    { id: "tr-ka", stateId: "tr", name: "Kailashahar" },
    { id: "tr-am", stateId: "tr", name: "Ambassa" },
  ],
};

export const saveSelectedLocation = async (region: Region, state: State) => {
  try {
    const locationData = { region, state };
    await AsyncStorage.setItem(
      SELECTED_LOCATION_KEY,
      JSON.stringify(locationData),
    );
  } catch (error) {
    console.error("Error saving location:", error);
  }
};

export const getSelectedLocation = async (): Promise<{
  region: Region;
  state: State;
} | null> => {
  try {
    const data = await AsyncStorage.getItem(SELECTED_LOCATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};
