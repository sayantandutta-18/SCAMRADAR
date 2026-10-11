// Multilingual Safety Guides and Awareness Lab Dataset
// Supports: English ('en'), Bengali ('bn'), Hindi ('hi')

export const SAFETY_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const CATEGORIES_DATA = {
  upi: {
    icon: 'CreditCard',
    en: {
      title: 'UPI & QR Code Scams',
      badge: 'FINANCIAL',
      summary: 'Manipulative requests where victims are tricked into sending money instead of receiving it.',
      warningSigns: [
        'Buyer on OLX or Facebook Marketplace insists on paying only via QR code or collect request.',
        'Claims that you need to scan a QR code or enter your 4/6 digit UPI PIN to "receive payment".',
        'Receiving urgent UPI collect requests from unknown VPAs with messages like "Refund ₹5000 Approved".',
      ],
      whatToAvoid: [
        'NEVER enter your UPI PIN to receive money. Entering PIN ALWAYS transfers money OUT of your account.',
        'Do not scan QR codes received on WhatsApp or email from prospective buyers.',
        'Avoid clicking payment links sent by strangers promising cashbacks or lottery winnings.',
      ],
      recommendedActions: [
        'Immediately verify receiver account name shown on the UPI confirmation dialog.',
        'Decline unknown UPI collect requests directly in Google Pay, PhonePe, or Paytm.',
        'Set daily UPI transaction limits in your banking app for enhanced safety.',
      ],
      reportingOptions: [
        'Call 1930 National Cyber Crime Helpline within the Golden Hour.',
        'File an incident report on cybercrime.gov.in and block the scammer VPA in your UPI app.',
      ],
    },
    bn: {
      title: 'ইউপিআই এবং কিউআর কোড প্রতারণা',
      badge: 'আর্থিক সুরক্ষা',
      summary: 'প্রতারকরা টাকা পাঠানোর নাম করে কিউআর কোড বা পিন চেয়ে আপনার অ্যাকাউন্ট থেকে টাকা তুলে নেয়।',
      warningSigns: [
        'OLX বা সোশ্যাল মিডিয়ায় ক্রেতা শুধুমাত্র কিউআর কোড বা কালেকশন রিকোয়েস্টের মাধ্যমে টাকা দিতে চায়।',
        'দাবি করে যে টাকা গ্রহণ করার জন্য আপনাকে কিউআর কোড স্ক্যান করতে হবে বা ইউপিআই পিন দিতে হবে।',
        'অপরিচিত ভিপিএ থেকে "Refund Approved" লিখে আকস্মিক পেমেন্ট রিকোয়েস্ট পাঠানো।',
      ],
      whatToAvoid: [
        'টাকা পাওয়ার জন্য কখনই ইউপিআই পিন দেবেন না। পিন দিলে আপনার অ্যাকাউন্ট থেকেই টাকা কেটে যায়।',
        'হোয়াটসঅ্যাপ বা এসএমএসে পাঠানো কোনো কিউআর কোড স্ক্যান করবেন না।',
        'ক্যাশব্যাক বা রিফান্ডের নামে পাঠানো কোনো অজানা লিঙ্কে ক্লিক করবেন না।',
      ],
      recommendedActions: [
        'পেমেন্ট করার আগে সর্বদা প্রাপকের আসল নাম ও ব্যাংক বিশদ যাচাই করুন।',
        'অপরিচিত ব্যক্তির পেমেন্ট রিকোয়েস্ট সঙ্গে সঙ্গে রিজেক্ট (Decline) করুন।',
        'ব্যাংক অ্যাপে আপনার ইউপিআই-এর দৈনিক খরচের সীমা বেঁধে রাখুন।',
      ],
      reportingOptions: [
        'অবিলম্বে ১৯৩০ জাতীয় সাইবার হেল্পলাইনে কল করুন।',
        'cybercrime.gov.in পোর্টালে অভিযোগ নথিভুক্ত করুন এবং ইউপিআই অ্যাপে নম্বরটি ব্লক করুন।',
      ],
    },
    hi: {
      title: 'यूपीआई और क्यूआर कोड धोखाधड़ी',
      badge: 'वित्तीय सुरक्षा',
      summary: 'स्कैमर्स पैसे प्राप्त करने के बहाने आपको क्यूआर कोड स्कैन कराके आपके खाते से पैसे उड़ा लेते हैं।',
      warningSigns: [
        'OLX या ऑनलाइन बाजार में खरीदार सिर्फ क्यूआर कोड से ही भुगतान करने की जिद करता है।',
        'दावा करता है कि पैसा पाने के लिए आपको क्यूआर कोड स्कैन करना होगा या यूपीआई पिन डालना होगा।',
        'अज्ञात वीपीए से "रिफंड स्वीकृत" जैसे मैसेज के साथ अचानक कलेक्ट रिक्वेस्ट आना।',
      ],
      whatToAvoid: [
        'पैसे पाने के लिए कभी भी अपना यूपीआई पिन दर्ज न करें। पिन डालने से हमेशा आपके खाते से पैसा कटता है।',
        'व्हाट्सएप या अनजान चैट पर भेजे गए क्यूआर कोड को कभी स्कैन न करें।',
        'कैशबैक या लॉटरी के वादे वाले संदिग्ध पेमेंट लिंक पर कभी क्लिक न करें।',
      ],
      recommendedActions: [
        'भुगतान की पुष्टि से पहले हमेशा स्क्रीन पर दिख रहे मर्चेंट या व्यक्ति का नाम जांचें।',
        'अनजान कलेक्ट रिक्वेस्ट को तुरंत अस्वीकार (Decline) करें।',
        'अपने बैंक ऐप में दैनिक यूपीआई लेनदेन सीमा निर्धारित करें।',
      ],
      reportingOptions: [
        'गोल्डन ऑवर में तुरंत 1930 राष्ट्रीय साइबर क्राइम हेल्पलाइन पर कॉल करें।',
        'cybercrime.gov.in पर रिपोर्ट दर्ज करें और यूपीआई ऐप में उस आईडी को ब्लॉक करें।',
      ],
    },
  },

  kyc: {
    icon: 'Shield',
    en: {
      title: 'KYC & Bank Account Block Fraud',
      badge: 'IMPERSONATION',
      summary: 'Panicked text messages claiming your bank account, SIM card, or PAN is suspended.',
      warningSigns: [
        'Urgent SMS warning that your account or debit card will be blocked within 24 hours.',
        'Contains an unverified URL (e.g. sbi-kyc-update.apk or pnb-netbanking.club).',
        'Callers requesting remote screen sharing apps (AnyDesk, TeamViewer, RustDesk).',
      ],
      whatToAvoid: [
        'Never install APK files sent over WhatsApp or SMS.',
        'Never allow any caller to view your screen or install remote access software.',
        'Never share net banking passwords, OTPs, or CVV numbers with anyone.',
      ],
      recommendedActions: [
        'Contact your bank directly via the phone number printed on the back of your debit card.',
        'Visit your official branch in person for genuine KYC verification.',
        'Delete and report phishing SMS to 1909 (DoT Do Not Disturb Registry).',
      ],
      reportingOptions: [
        'Report the mobile number and phishing domain on sancharsaathi.gov.in (Chakshu).',
        'Notify your bank fraud desk immediately if any details were disclosed.',
      ],
    },
    bn: {
      title: 'কেওয়াইসি এবং ব্যাংক অ্যাকাউন্ট ব্লক প্রতারণা',
      badge: 'পরিচয় জালিয়াতি',
      summary: 'ব্যাংক বা সিম কার্ড বন্ধ হয়ে যাওয়ার ভুয়ো এসএমএস পাঠিয়ে প্রতারণা করা হয়।',
      warningSigns: [
        'জরুরি বার্তা যে ২৪ ঘণ্টার মধ্যে আপনার ব্যাংক অ্যাকাউন্ট বা প্যান কার্ড ব্লক হয়ে যাবে।',
        'মেসেজে অপরিচিত লিঙ্ক বা APK ফাইল ডাউনলোড করার নির্দেশ (যেমন kyc-update.apk)।',
        'কলার আপনাকে স্ক্রিন শেয়ারিং অ্যাপ (AnyDesk, RustDesk) ইনস্টল করতে বাধ্য করে।',
      ],
      whatToAvoid: [
        'হোয়াটসঅ্যাপ বা এসএমএসের মাধ্যমে আসা কোনো APK ফাইল কখনই ইনস্টল করবেন না।',
        'কাউকে আপনার ফোনের স্ক্রিন দেখার অনুমতি দেবেন না।',
        'কার্ডের পিন, সিভিভি বা ওটিপি কোনো অবস্থাতেই কারও সাথে শেয়ার করবেন না।',
      ],
      recommendedActions: [
        'আপনার ডেবিট কার্ডের পেছনে থাকা অফিসিয়াল কাস্টমার কেয়ার নম্বরে যোগাযোগ করুন।',
        'প্রয়োজনে সরাসরি আপনার ব্যাংক শাখায় গিয়ে কেওয়াইসি তথ্য যাচাই করুন।',
        'সন্দেহজনক এসএমএস ১৯০৯ নম্বরে রিপোর্ট করুন।',
      ],
      reportingOptions: [
        'sancharsaathi.gov.in এর চক্ষু (Chakshu) পোর্টালে প্রতারক ফোন নম্বর রিপোর্ট করুন।',
        'তথ্য প্রকাশ করে ফেললে অবিলম্বে ব্যাংকের ফ্রড ডেস্কে অভিযোগ জানান।',
      ],
    },
    hi: {
      title: 'केवाईसी और बैंक खाता ब्लॉक धोखाधड़ी',
      badge: 'पहचान जालसाजी',
      summary: 'बैंक खाता या सिम कार्ड बंद होने का डर दिखाकर लोगों से गोपनीय जानकारी चुराना।',
      warningSigns: [
        'अति-आवश्यक चेतावनी कि 24 घंटे में आपका खाता या डेबिट कार्ड ब्लॉक कर दिया जाएगा।',
        'मैसेज में संदिग्ध लिंक या एपीके फाइल (जैसे kyc-update.apk) शामिल होना।',
        'कॉलर द्वारा AnyDesk, TeamViewer या RustDesk जैसे स्क्रीन शेयरिंग ऐप डाउनलोड करने का दबाव।',
      ],
      whatToAvoid: [
        'व्हाट्सएप या एसएमएस पर प्राप्त किसी भी एपीके फाइल को कभी इंस्टॉल न करें।',
        'किसी भी अनजान व्यक्ति को अपना मोबाइल स्क्रीन देखने की अनुमति न दें।',
        'नेट बैंकिंग पासवर्ड, ओटीपी या सीवीवी नंबर किसी के साथ साझा न करें।',
      ],
      recommendedActions: [
        'अपने डेबिट कार्ड के पीछे छपे आधिकारिक कस्टमर केयर नंबर पर ही कॉल करें।',
        'असली केवाईसी सत्यापन के लिए सीधे अपनी बैंक शाखा जाएं।',
        'धोखाधड़ी वाले एसएमएस को डिलीट करें और रिपोर्ट करें।',
      ],
      reportingOptions: [
        'sancharsaathi.gov.in (चक्षु) पोर्टल पर मोबाइल नंबर की शिकायत दर्ज करें।',
        'यदि कोई जानकारी साझा हो गई है, तो तुरंत अपने बैंक को सूचित करें।',
      ],
    },
  },

  job: {
    icon: 'Briefcase',
    en: {
      title: 'Work-From-Home & Fake Job Scams',
      badge: 'EMPLOYMENT',
      summary: 'Fraudulent part-time job offers on Telegram promising easy money for liking videos or posting reviews.',
      warningSigns: [
        'Offers of ₹2,000 to ₹5,000 per day for simple tasks like "liking YouTube videos" or "rating hotels".',
        'Communication exclusively on Telegram, WhatsApp, or unregistered numbers.',
        'Requirement to deposit "security fees" or buy "VIP tasks" to withdraw your earnings.',
      ],
      whatToAvoid: [
        'Never pay money to get a job. Legitimate companies never charge candidates.',
        'Do not deposit money into private bank accounts for "task verification".',
        'Never submit scans of original Aadhaar, PAN, or signature to anonymous Telegram channels.',
      ],
      recommendedActions: [
        'Search the hiring firm directly on official job portals (LinkedIn, Naukri).',
        'Verify company domain email addresses (e.g. name@company.com instead of Gmail/Hotmail).',
        'Block Telegram recruiter groups demanding cryptocurrency or prepaid deposits.',
      ],
      reportingOptions: [
        'File an incident complaint on cybercrime.gov.in under Job Fraud.',
        'Report the Telegram channel and associated UPI IDs to ScamRadar.',
      ],
    },
    bn: {
      title: 'ঘরে বসে কাজের ভুয়ো চাকরির প্রতারণা',
      badge: 'কর্মসংস্থান',
      summary: 'ইউটিউব ভিডিও লাইক বা হোটেল রেটিং করার নামে টেলিগ্রামে টাকা আদায়ের ফাঁদ।',
      warningSigns: [
        'সহজ কাজের জন্য দৈনিক ২০০০ থেকে ৫০০০ টাকা আয়ের লোভনীয় প্রস্তাব।',
        'শুধুমাত্র টেলিগ্রাম বা হোয়াটসঅ্যাপের মাধ্যমে যোগাযোগ করা।',
        'উপার্জিত টাকা তোলার জন্য "নিরাপত্তা আমানত" বা "ভিআইপি টাস্ক" কেনার দাবি।',
      ],
      whatToAvoid: [
        'চাকরি পাওয়ার জন্য কোনো টাকা দেবেন না। আসল কোম্পানি কখনো টাকা দাবি করে না।',
        'টাস্ক আনলক করার নামে কোনো ব্যক্তিগত অ্যাকাউন্টে টাকা জমা দেবেন না।',
        'অপরিচিত টেলিগ্রাম চ্যানেলে আধার বা প্যান কার্ডের ছবি পাঠাবেন না।',
      ],
      recommendedActions: [
        'সংশ্লিষ্ট কোম্পানির অফিসিয়াল ওয়েবসাইট বা লিঙ্কডইন প্রোফাইল যাচাই করুন।',
        'নিয়োগকারীর অফিসিয়াল ইমেল ডোমেইন পরীক্ষা করুন (জিমেইল বা ইয়াহু নয়)।',
        'টেলিগ্রাম গ্রুপ থেকে অবিলম্বে বের হয়ে যান এবং রিপোর্ট করুন।',
      ],
      reportingOptions: [
        'cybercrime.gov.in পোর্টালে চাকরির প্রতারণা হিসেবে অভিযোগ করুন।',
        'প্রতারকদের ইউপিআই আইডি এবং যোগাযোগের নম্বর স্ক্যামরাডারে রিপোর্ট করুন।',
      ],
    },
    hi: {
      title: 'वर्क-फ्रॉम-होम और फर्जी नौकरी घोटाला',
      badge: 'रोजगार धोखाधड़ी',
      summary: 'यूट्यूब वीडियो लाइक करने या रिव्यू देने के नाम पर टेलीग्राम के जरिए ठगी।',
      warningSigns: [
        'आसान काम के लिए रोजाना ₹2,000 से ₹5,000 कमाने का लालच देना।',
        'सिर्फ टेलीग्राम या व्हाट्सएप पर ही पूरी बातचीत होना।',
        'कमाई निकालने के लिए "सिक्योरिटी डिपॉजिट" या "वीआईपी टास्क" के नाम पर पैसे मांगना।',
      ],
      whatToAvoid: [
        'नौकरी पाने के लिए कभी पैसे न दें। प्रतिष्ठित कंपनियां कभी फीस नहीं लेतीं।',
        'टास्क पूरा करने के नाम पर किसी निजी खाते में पैसे कभी ट्रांसफर न करें।',
        'टेलीग्राम ग्रुप पर अपने आधार कार्ड या पैन कार्ड की कॉपी कभी न भेजें।',
      ],
      recommendedActions: [
        'कंपनी के आधिकारिक करियर पेज या लिंक्डइन पर भर्ती की पुष्टि करें।',
        'एचआर के आधिकारिक ईमेल पते की जांच करें (जीमेल या आउटलुक नहीं)।',
        'पैसे की मांग करने वाले रिक्रूटर को तुरंत ब्लॉक करें।',
      ],
      reportingOptions: [
        'cybercrime.gov.in पर जॉब फ्रॉड श्रेणी के तहत शिकायत दर्ज करें।',
        'स्कैमराडार पर संबंधित यूपीआई और फोन नंबर की रिपोर्ट करें।',
      ],
    },
  },

  investment: {
    icon: 'TrendingUp',
    en: {
      title: 'Investment & Crypto Ponzi Schemes',
      badge: 'FINANCIAL',
      summary: 'Fabricated stock tips, institutional trading pools, and crypto platforms guaranteeing astronomical profits.',
      warningSigns: [
        'Promises of guaranteed returns (e.g., "double your money in 10 days" or "50% weekly profit").',
        'Invitation to exclusive WhatsApp/Telegram groups by supposed SEBI registered analysts.',
        'Trading occurs on custom APK apps that display fake high-balance dashboards.',
      ],
      whatToAvoid: [
        'Never deposit funds into personal savings bank accounts for institutional stock trading.',
        'Never trust investment advice from unverified social media channels.',
        'Never borrow money or take loans to participate in quick-wealth schemes.',
      ],
      recommendedActions: [
        'Check broker and adviser registration numbers directly on the official SEBI portal (sebi.gov.in).',
        'Trade exclusively through recognized stock exchanges (NSE/BSE registered brokers).',
        'Test withdrawal of your own initial funds early; scammers always block withdrawals.',
      ],
      reportingOptions: [
        'Lodge a formal grievance on SEBI SCORES (scores.gov.in) and RBI Sachet (sachet.rbi.org.in).',
        'File a cybercrime report on cybercrime.gov.in with bank transaction references.',
      ],
    },
    bn: {
      title: 'ভুয়ো বিনিয়োগ ও ক্রিপ্টো স্কিম',
      badge: 'আর্থিক ঝুঁকি',
      summary: 'অস্বাভাবিক মুনাফার মিথ্যা প্রতিশ্রুতি দিয়ে ভুয়ো ট্রেডিং অ্যাপে টাকা আত্মসাৎ।',
      warningSigns: [
        'নিশ্চিত উচ্চ মুনাফার প্রতিশ্রুতি (যেমন "১০ দিনে টাকা দ্বিগুণ")।',
        'সেবি (SEBI) নিবন্ধিত বিশেষজ্ঞ দাবি করে হোয়াটসঅ্যাপ গ্রুপে যুক্ত করা।',
        'ভুয়ো ট্রেডিং অ্যাপের ড্যাশবোর্ডে কৃত্রিম লাভ দেখিয়ে আরও বিনিয়োগে উৎসাহিত করা।',
      ],
      whatToAvoid: [
        'ট্রেডিং বা শেয়ার কেনার জন্য কোনো ব্যক্তির ব্যক্তিগত সেভিংস অ্যাকাউন্টে টাকা পাঠাবেন না।',
        'সোশ্যাল মিডিয়ার টিপস অন্ধভাবে বিশ্বাস করবেন না।',
        'লোভনীয় স্কিমে অংশগ্রহণের জন্য ঋণ বা ধার নেবেন না।',
      ],
      recommendedActions: [
        'সেবির অফিশিয়াল সাইটে (sebi.gov.in) ব্রোকারের লাইসেন্স ও রেজিস্ট্রেশন নম্বর যাচাই করুন।',
        'শুধুমাত্র সরকার অনুমোদিত বৈধ ব্রোকারের মাধ্যমেই বিনিয়োগ করুন।',
        'টাকা তোলার চেষ্টা করে দেখুন; প্রতারকরা কোনো অবস্থাতেই টাকা ফেরত দেয় না।',
      ],
      reportingOptions: [
        'সেবি স্কোরস (SEBI SCORES) এবং আরবিআই সাচেত (sachet.rbi.org.in) এ অভিযোগ করুন।',
        'ব্যাংক ট্রানজ্যাকশন আইডি সহ cybercrime.gov.in পোর্টালে সাইবার অভিযোগ নথিভুক্ত করুন।',
      ],
    },
    hi: {
      title: 'फर्जी निवेश और क्रिप्टो पोंजी योजनाएं',
      badge: 'वित्तीय जोखिम',
      summary: 'अवास्तविक मुनाफे का लालच देकर नकली ट्रेडिंग ऐप के जरिए पैसे हड़पना।',
      warningSigns: [
        'गारंटीड मुनाफे का वादा (जैसे "10 दिनों में पैसा दोगुना" या 50% साप्ताहिक रिटर्न)।',
        'सेबी (SEBI) पंजीकृत विशेषज्ञ बनकर टेलीग्राम या व्हाट्सएप ग्रुप में जोड़ना।',
        'नकली ट्रेडिंग ऐप के डैशबोर्ड पर भारी मुनाफा दिखाकर और पैसे जमा करने का दबाव।',
      ],
      whatToAvoid: [
        'ट्रेडिंग के नाम पर किसी व्यक्तिगत बचत खाते में कभी भी पैसे ट्रांसफर न करें।',
        'सोशल मीडिया पर दी जाने वाली निवेश सलाह पर आंख मूंदकर भरोसा न करें।',
        'जल्दी अमीर बनने के चक्कर में कभी भी कर्ज लेकर निवेश न करें।',
      ],
      recommendedActions: [
        'सेबी की आधिकारिक वेबसाइट (sebi.gov.in) पर ब्रोकर का पंजीकरण नंबर अवश्य जांचें।',
        'केवल एनएसई/बीएसई द्वारा अधिकृत ब्रोकरों के माध्यम से ही व्यापार करें।',
        'शुरुआत में ही निकासी करके देखें; ठग कभी भी पैसा निकालने नहीं देते।',
      ],
      reportingOptions: [
        'SEBI SCORES और RBI सचेत (sachet.rbi.org.in) पोर्टल पर शिकायत दर्ज करें।',
        'लेनदेन के साक्ष्य के साथ cybercrime.gov.in पर रिपोर्ट करें।',
      ],
    },
  },

  phishing: {
    icon: 'Link',
    en: {
      title: 'Phishing Websites & Spoofed Domains',
      badge: 'CYBERSECURITY',
      summary: 'Cloned web pages mimicking official portals to harvest credentials, card numbers, and session cookies.',
      warningSigns: [
        'Subtle domain misspellings (e.g. sbi-support-login.com instead of onlinesbi.sbi).',
        'Shortened URL links (bit.ly, tinyurl) sent via SMS urging immediate verification.',
        'Pages prompting for full debit card number, ATM PIN, and CVV simultaneously.',
      ],
      whatToAvoid: [
        'Never click on login links received via email or text messages.',
        'Never submit credentials on non-HTTPS sites or sites with security warnings.',
        'Do not save sensitive banking credentials in unsecured browser auto-fill.',
      ],
      recommendedActions: [
        'Always bookmark genuine banking and service portals directly.',
        'Inspect domain extensions and SSL certificates before entering login details.',
        'Use ScamRadar or VirusTotal to scan suspicious URLs before accessing them.',
      ],
      reportingOptions: [
        'Report malicious URLs to Google Safe Browsing and CERT-In (incident@cert-in.org.in).',
        'Report the phishing link on ScamRadar to preserve tamper-evident evidence.',
      ],
    },
    bn: {
      title: 'ফিশিং ওয়েবসাইট ও নকল লিঙ্ক',
      badge: 'সাইবার নিরাপত্তা',
      summary: 'আসল ব্যাংকিং বা সরকারি সাইটের মতো দেখতে হুবহু নকল পেজ তৈরি করে পাসওয়ার্ড চুরি।',
      warningSigns: [
        'ডোমেইন বানানে সামান্য ভুল (যেমন sbi-login.com এর জায়গায় sbii-verify.xyz)।',
        'এসএমএসে ছোট করা লিঙ্ক (bit.ly, tinyurl) পাঠিয়ে অবিলম্বে লগইন করার চাপ।',
        'ডেবিট কার্ড নম্বর, এটিএম পিন এবং সিভিভি একসাথে চাওয়া।',
      ],
      whatToAvoid: [
        'এসএমএস বা ইমেলের লিঙ্কে ক্লিক করে কখনো ব্যাংকে লগইন করবেন না।',
        'পাসপোর্টের মতো ব্যক্তিগত তথ্য অনিরাপদ ওয়েবসাইটে দেবেন না।',
        'অচেনা ব্রাউজারে পাসওয়ার্ড সেভ করে রাখবেন না।',
      ],
      recommendedActions: [
        'ব্যাংকের আসল ঠিকানা নিজে টাইপ করে ব্রাউজারে বুকমার্ক করে রাখুন।',
        'যেকোনো পেমেন্ট পেজে এসএসএল সার্টিফিকেট (HTTPS প্যাডলক) ভালো করে দেখুন।',
        'সন্দেহজনক লিঙ্ক স্ক্যামরাডারে চেক করে যাচাই করুন।',
      ],
      reportingOptions: [
        'CERT-In (incident@cert-in.org.in) এ ফিশিং লিঙ্ক রিপোর্ট করুন।',
        'স্ক্যামরাডারে লিঙ্কটি সাবমিট করে অন্য ব্যবহারকারীদের সতর্ক করুন।',
      ],
    },
    hi: {
      title: 'फ़िशिंग वेबसाइट और फर्जी डोमेन',
      badge: 'साइबर सुरक्षा',
      summary: 'असली बैंक या सरकारी पोर्टल जैसी दिखने वाली नकली वेबसाइटों के जरिए पासवर्ड चुराना।',
      warningSigns: [
        'डोमेन की स्पेलिंग में चालाकी से किया गया फेरबदल (जैसे onlinesbi की जगह onlinesbii.net)।',
        'एसएमएस में शॉर्ट किए गए लिंक (bit.ly या tinyurl) भेजकर तुरंत लॉगिन करने का दबाव।',
        'एक ही पेज पर डेबिट कार्ड नंबर, एटीएम पिन और सीवीवी सब कुछ मांगना।',
      ],
      whatToAvoid: [
        'मैसेज या ईमेल में आए लिंक पर क्लिक करके कभी भी बैंक खाते में लॉगिन न करें।',
        'असुरक्षित (बिना HTTPS) वेबसाइटों पर कभी अपनी पहचान दर्ज न करें।',
        'ब्राउज़र में अपना बैंकिंग पासवर्ड कभी ऑटो-सेव न करें।',
      ],
      recommendedActions: [
        'बैंक के आधिकारिक वेब पते को हमेशा याद रखें या बुकमार्क करके रखें।',
        'लॉगिन करने से पहले एड्रेस बार में डोमेन नाम ध्यान से पढ़ें।',
        'संदेहास्पद लिंक को खोलने से पहले स्कैमराडार पर उसकी जांच करें।',
      ],
      reportingOptions: [
        'CERT-In (incident@cert-in.org.in) पर फर्जी वेबसाइट की रिपोर्ट करें।',
        'स्कैमराडार पर लिंक दर्ज करके अन्य नागरिकों को सुरक्षित करें।',
      ],
    },
  },

  delivery: {
    icon: 'Package',
    en: {
      title: 'Courier & Package Delivery Fraud',
      badge: 'LOGISTICS',
      summary: 'Messages falsely claiming a parcel delivery failed and asking for address updates along with a nominal fee.',
      warningSigns: [
        'SMS claiming your India Post, Blue Dart, or FedEx package is held due to incomplete address.',
        'Requires clicking a link to pay a token amount (e.g. ₹5 or ₹10) for re-delivery.',
        'The linked payment page requests net banking credentials or full card CVV details.',
      ],
      whatToAvoid: [
        'Never pay nominal re-delivery fees through unsolicited SMS links.',
        'Never enter bank OTPs when you did not initiate a transaction.',
        'Do not click delivery links if you have not ordered any shipment recently.',
      ],
      recommendedActions: [
        'Verify courier status strictly using your tracking ID on the carrier official website.',
        'Check your e-commerce order status in Amazon, Flipkart, or the merchant app directly.',
        'Block sender numbers sending generic postal delivery warnings.',
      ],
      reportingOptions: [
        'Report the SMS sender ID on Chakshu portal (sancharsaathi.gov.in).',
        'Notify your bank immediately if debit card details were submitted.',
      ],
    },
    bn: {
      title: 'কুরিয়ার ও পার্সেল ডেলিভারি প্রতারণা',
      badge: 'লজিস্টিক ফ্রড',
      summary: 'ঠিকানা ভুল থাকার অজুহাতে মাত্র ৫ বা ১০ টাকা ফি চেয়ে পুরো ব্যাংক অ্যাকাউন্ট সাফ করা।',
      warningSigns: [
        'মেসেজ আসে যে আপনার ইন্ডিয়া পোস্ট বা ব্লু ডার্ট পার্সেল ঠিকানা ভুলের জন্য আটকে আছে।',
        'ডেলিভারির জন্য লিঙ্কে ক্লিক করে মাত্র ৫ বা ১০ টাকা দিতে বলা হয়।',
        'পেমেন্ট পেজে গেলে সম্পূর্ণ ডেবিট কার্ডের তথ্য ও এটিএম পিন চাওয়া হয়।',
      ],
      whatToAvoid: [
        'এসএমএসের লিঙ্কে ক্লিক করে কখনো পার্সেল রি-ডেলিভারি ফি দেবেন না।',
        'ব্যাংকের ওটিপি কোনো অচেনা লিঙ্কে প্রবেশ করাবেন না।',
        'কোনো পণ্য অর্ডার না করে থাকলে এমন বার্তা সম্পূর্ণ উপেক্ষা করুন।',
      ],
      recommendedActions: [
        'অফিসিয়াল কুরিয়ার সাইটে গিয়ে আপনার ট্র্যাকিং নম্বর দিয়ে পার্সেলের স্থিতি দেখুন।',
        'অ্যামাজন বা ফ্লিপকার্ট অ্যাপ খুলে আপনার আসল অর্ডারের স্টেটাস যাচাই করুন।',
        'প্রতারক নম্বরটি তৎক্ষণাৎ ব্লক করুন।',
      ],
      reportingOptions: [
        'sancharsaathi.gov.in (চক্ষু) পোর্টালে প্রতারক এসএমএস রিপোর্ট করুন।',
        'কার্ডের তথ্য দিয়ে ফেললে অবিলম্বে কার্ডটি ব্লক করুন।',
      ],
    },
    hi: {
      title: 'कूरियर और पार्सल डिलीवरी फ्रॉड',
      badge: 'लॉजिस्टिक्स',
      summary: 'पार्सल का पता अधूरा होने का बहाना बनाकर ₹5-₹10 की मामूली फीस के नाम पर खाता खाली करना।',
      warningSigns: [
        'एसएमएस आना कि आपका इंडिया पोस्ट या कूरियर पार्सल पते की गलती के कारण अटका हुआ है।',
        'पता अपडेट करने और दोबारा डिलीवरी के लिए ₹5 या ₹10 शुल्क देने का लिंक देना।',
        'पेमेंट पेज पर डेबिट कार्ड की पूरी जानकारी और ओटीपी मांगना।',
      ],
      whatToAvoid: [
        'एसएमएस में आए लिंक के जरिए कभी भी मामूली डिलीवरी शुल्क न चुकाएं।',
        'बिना सोचे-समझे किसी भी पेमेंट पेज पर ओटीपी दर्ज न करें।',
        'यदि आपने कोई सामान ऑर्डर नहीं किया है, तो ऐसे संदेशों पर ध्यान न दें।',
      ],
      recommendedActions: [
        'कूरियर कंपनी की आधिकारिक वेबसाइट पर अपनी ट्रैकिंग आईडी से स्थिति जांचें।',
        'अमेज़न या फ्लिपकार्ट जैसे शॉपिंग ऐप पर सीधे जाकर ऑर्डर देखें।',
        'फर्जी संदेश भेजने वाले नंबर को तुरंत ब्लॉक करें।',
      ],
      reportingOptions: [
        'चक्षु पोर्टल (sancharsaathi.gov.in) पर एसएमएस भेजने वाले की शिकायत करें।',
        'कार्ड की जानकारी लीक होने पर तुरंत बैंक से कार्ड ब्लॉक कराएं।',
      ],
    },
  },

  loan: {
    icon: 'AlertTriangle',
    en: {
      title: 'Predatory Instant Loan Apps',
      badge: 'EXTORTION',
      summary: 'Unregulated lending apps granting small sums without documents, then blackmailing victims using contact lists.',
      warningSigns: [
        'Loans offered within 2 minutes without CIBIL score or income verification.',
        'The mobile app requires excessive permissions: Contacts, Gallery, SMS, and Location.',
        'Repayment demanded within 5-7 days with 300%+ annualized interest and exorbitant deduction fees.',
      ],
      whatToAvoid: [
        'Never install loan apps distributed via APK files, WhatsApp, or outside Google Play.',
        'Never grant permission to your Contacts or Photo Gallery to any lending application.',
        'Never pay extortion money to stop morphed image threats; they will demand more.',
      ],
      recommendedActions: [
        'Verify if the lending entity is an RBI-registered NBFC on rbi.org.in.',
        'Back up threatening chat messages, recordings, and UPI payment requests.',
        'Revoke app permissions immediately and uninstall the offending application.',
      ],
      reportingOptions: [
        'Report predatory lending apps directly to the RBI Sachet portal (sachet.rbi.org.in).',
        'Lodge a cyber extortion complaint with the local Cyber Police Station and 1930.',
      ],
    },
    bn: {
      title: 'অবৈধ ইনস্ট্যান্ট লোন অ্যাপ প্রতারণা',
      badge: 'ব্ল্যাকমেল ও তোলাবাজি',
      summary: 'সহজে ঋণ দেওয়ার নামে ফোনের কন্টাক্ট ও ছবির অ্যাক্সেস নিয়ে পরে অশ্লীল ছবি বানিয়ে ব্ল্যাকমেল।',
      warningSigns: [
        'কোনো নথিপত্র বা সিবিল স্কোর ছাড়া ২ মিনিটে তাৎক্ষণিক ঋণের প্রতিশ্রুতি।',
        'অ্যাপটি ইনস্টল করার সময় ফোনের কন্টাক্ট লিস্ট এবং ফটো গ্যালারির পারমিশন চায়।',
        '৫-৭ দিনের মধ্যেই উচ্চ সুদে টাকা ফেরত চাওয়া এবং আত্মীয়দের ফোন করার হুমকি দেওয়া।',
      ],
      whatToAvoid: [
        'হোয়াটসঅ্যাপ বা অজানা লিঙ্ক থেকে কোনো লোন APK ফাইল ইনস্টল করবেন না।',
        'কোনো লোন অ্যাপকে আপনার ফোনের কন্টাক্ট বা ছবির অ্যাক্সেস দেবেন না।',
        'ব্ল্যাকমেলের ভয়ে টাকা দেবেন না; টাকা দিলে তারা আরও বেশি টাকা দাবি করবে।',
      ],
      recommendedActions: [
        'আরবিআই-এর ওয়েবসাইটে (rbi.org.in) যাচাই করুন সংস্থাটি নিবন্ধিত এনবিএফসি কিনা।',
        'হুমকির কল রেকর্ডিং এবং চ্যাটের স্ক্রিনশট প্রমাণ হিসেবে সংগ্রহ করে রাখুন।',
        'ফোন থেকে অবিলম্বে অ্যাপের সমস্ত পারমিশন বন্ধ করুন এবং আনইনস্টল করুন।',
      ],
      reportingOptions: [
        'আরবিআই সাচেত পোর্টালে (sachet.rbi.org.in) অভিযোগ জানান।',
        'স্থানীয় সাইবার ক্রাইম থানা ও ১৯৩০ হেল্পলাইনে চাঁদাবাজির এফআইআর দায়ের করুন।',
      ],
    },
    hi: {
      title: 'अवैध इंस्टेंट लोन ऐप सिंडिकेट',
      badge: 'ब्लैकमेलिंग',
      summary: 'बिना दस्तावेज लोन देने के बहाने फोन के कॉन्टैक्ट्स और फोटो चुराना, फिर एडिटेड फोटो से ब्लैकमेल करना।',
      warningSigns: [
        'बिना किसी सिबिल स्कोर या कागजी कार्रवाई के 2 मिनट में लोन का वादा।',
        'ऐप इंस्टॉल करते समय फोन बुक, फोटो गैलरी और लोकेशन की अनुमति मांगना।',
        '5 से 7 दिनों में अत्यधिक ब्याज मांगना और रिश्तेदारों को कॉल करने की धमकी देना।',
      ],
      whatToAvoid: [
        'व्हाट्सएप या अनजान वेबसाइटों से एपीके लोन ऐप कभी डाउनलोड न करें।',
        'किसी भी लोन ऐप को अपनी कॉन्टैक्ट लिस्ट या फोटो गैलरी की अनुमति न दें।',
        'धमकी से डरकर कभी पैसे न दें; पैसे देने पर वे दोबारा और ज्यादा मांगते हैं।',
      ],
      recommendedActions: [
        'आरबीआई की वेबसाइट (rbi.org.in) पर जांचें कि कंपनी पंजीकृत एनबीएफसी है या नहीं।',
        'धमकी भरे मैसेज, कॉल रिकॉर्डिंग और यूपीआई आईडी के सबूत सुरक्षित रखें।',
        'तुरंत ऐप की अनुमतियां रद्द करें और उसे फोन से अनइंस्टॉल करें।',
      ],
      reportingOptions: [
        'आरबीआई सचेत पोर्टल (sachet.rbi.org.in) पर तुरंत शिकायत दर्ज कराएं।',
        '1930 पर साइबर ब्लैकमेलिंग की प्राथमिकी (FIR) दर्ज कराएं।',
      ],
    },
  },

  lottery: {
    icon: 'Award',
    en: {
      title: 'Lottery, Lucky Draw & KBC Scams',
      badge: 'DECEPTION',
      summary: 'Bogus WhatsApp voice notes and letters claiming you won ₹25 Lakh in a national lottery or TV quiz.',
      warningSigns: [
        'WhatsApp voice messages from numbers starting with foreign country codes (e.g. +92, +44).',
        'Fake letters featuring Indian government emblems, KBC logos, and forged signatures.',
        'Instructed to deposit a "registration fee" or "GST processing charge" to release the prize money.',
      ],
      whatToAvoid: [
        'Never pay money to claim a prize or lottery. Legitimate winnings deduct taxes automatically.',
        'Never contact numbers mentioned on suspicious WhatsApp images or audio notes.',
        'Do not forward lottery messages to friends or family.',
      ],
      recommendedActions: [
        'Remember that it is mathematically impossible to win a lottery you never bought a ticket for.',
        'Block and report the offending number directly in WhatsApp.',
        'Educate elderly family members who are often targeted by these audio messages.',
      ],
      reportingOptions: [
        'Report the fraudulent phone number on the Chakshu portal (sancharsaathi.gov.in).',
        'File an incident entry on ScamRadar to preserve the scam number on the blockchain.',
      ],
    },
    bn: {
      title: 'লটারি ও কেবিসি পুরস্কার প্রতারণা',
      badge: 'প্রলোভন',
      summary: 'হোয়াটসঅ্যাপে ভয়েস মেসেজ পাঠিয়ে ২৫ লক্ষ টাকা লটারি জেতার মিথ্যা নাটক।',
      warningSigns: [
        'অপরিচিত বিদেশি কোড (যেমন +92, +44) যুক্ত নম্বর থেকে হোয়াটসঅ্যাপ ভয়েস মেসেজ।',
        'সরকারি সিলমোহর ও অমিতাভ বচ্চনের ছবি দেওয়া জাল শংসাপত্র পাঠানো।',
        'পুরস্কারের টাকা ছাড়ানোর জন্য আগে প্রসেসিং ফি বা জিএসটি জমা দিতে বলা।',
      ],
      whatToAvoid: [
        'লটারির টাকা পেতে কখনো কোনো ফি বা ট্যাক্স বাবদ টাকা দেবেন না।',
        'মেসেজে উল্লিখিত তথাকথিত "ম্যানেজার" নম্বরে কখনই ফোন করবেন না।',
        'এমন বার্তা অন্য কাউকে ফরওয়ার্ড করবেন না।',
      ],
      recommendedActions: [
        'মনে রাখবেন, যে লটারির টিকিট আপনি কাটেননি, তা কখনো জেতা সম্ভব নয়।',
        'হোয়াটসঅ্যাপে নম্বরটি তৎক্ষণাৎ রিপোর্ট ও ব্লক করুন।',
        'পরিবারের বয়োজ্যেষ্ঠ সদস্যদের এই প্রতারণা সম্পর্কে সচেতন করুন।',
      ],
      reportingOptions: [
        'sancharsaathi.gov.in চক্ষু পোর্টালে ভুয়ো নম্বরটি রিপোর্ট করুন।',
        'স্ক্যামরাডারে নম্বরটি সাবমিট করে অন্য নাগরিকদের সতর্ক করুন।',
      ],
    },
    hi: {
      title: 'लॉटरी और केबीसी लकी ड्रॉ घोटाला',
      badge: 'प्रलोभन',
      summary: 'व्हाट्सएप पर फर्जी ऑडियो भेजकर 25 लाख रुपये की लॉटरी या केबीसी इनाम जीतने का झांसा।',
      warningSigns: [
        'विदेशी कोड (जैसे +92, +44) वाले नंबरों से व्हाट्सएप पर फर्जी वॉयस नोट आना।',
        'सरकारी प्रतीक चिह्नों और केबीसी के फर्जी लेटरहेड वाले प्रमाण पत्र भेजना।',
        'इनाम की राशि पाने के लिए "टैक्स", "जीएसटी" या "फाइल चार्ज" जमा करने को कहना।',
      ],
      whatToAvoid: [
        'इनाम पाने के लिए कभी कोई शुल्क न दें। असली लॉटरी में टैक्स राशि काटकर ही मिलती है।',
        'व्हाट्सएप फोटो में दिए गए तथाकथित बैंक मैनेजर के नंबर पर कभी कॉल न करें।',
        'ऐसे संदेशों को आगे किसी को फॉरवर्ड न करें।',
      ],
      recommendedActions: [
        'हमेशा याद रखें: जिस लॉटरी का आपने टिकट ही नहीं खरीदा, वह आप कभी नहीं जीत सकते।',
        'व्हाट्सएप पर उस नंबर को तुरंत रिपोर्ट और ब्लॉक करें।',
        'घर के बुजुर्गों को इस तरह के फर्जी कॉल के प्रति आगाह करें।',
      ],
      reportingOptions: [
        'चक्षु पोर्टल (sancharsaathi.gov.in) पर उस नंबर की शिकायत दर्ज करें।',
        'स्कैमराडार पर रिपोर्ट दर्ज करें।',
      ],
    },
  },

  impersonation: {
    icon: 'ShieldAlert',
    en: {
      title: 'Digital Arrest & Law Enforcement Impersonation',
      badge: 'EXTORTION',
      summary: 'High-pressure video calls impersonating CBI, ED, Police, or Customs officers placing you under "Digital Arrest".',
      warningSigns: [
        'Callers claim a courier with illegal narcotics, fake passports, or money laundering is in your name.',
        'Conducted over Skype or WhatsApp video with fake police station sets and uniform wearers.',
        'Threatens "Digital Arrest" and demands you stay on camera while transferring money to a "safe government escrow account".',
      ],
      whatToAvoid: [
        'Indian law HAS NO PROVISION for "Digital Arrest". Law enforcement NEVER conducts arrests over Skype or WhatsApp.',
        'Never transfer funds to any "court verification" or "RBI clearing" bank accounts.',
        'Do not panic or isolate yourself; do not comply with demands for secrecy.',
      ],
      recommendedActions: [
        'Hang up the video call immediately. Real police issue written physical summons, not WhatsApp calls.',
        'Inform family members or visit your local police station immediately.',
        'Record the caller ID number and handle for official reporting.',
      ],
      reportingOptions: [
        'Call 1930 immediately to alert cyber authorities.',
        'File an emergency complaint on cybercrime.gov.in under Impersonation & Digital Arrest.',
      ],
    },
    bn: {
      title: 'ডিজিটাল অ্যারেস্ট ও পুলিশ পরিচয় জালিয়াতি',
      badge: 'ভীতি প্রদর্শন',
      summary: 'সিবিআই, ইডি বা পুলিশের উর্দি পরে ভিডিও কলে "ডিজিটাল অ্যারেস্ট"-এর ভয় দেখিয়ে টাকা আত্মসাৎ।',
      warningSigns: [
        'দাবি করে আপনার নামে মাদকদ্রব্য বা অবৈধ পার্সেল ধরা পড়েছে এবং আপনার বিরুদ্ধে ওয়ারেন্ট জারি হয়েছে।',
        'হোয়াটসঅ্যাপ বা স্কাইপ ভিডিও কলে থানার মতো ব্যাকগ্রাউন্ড সাজিয়ে ভুয়ো অফিসারের উপস্থিতি।',
        'ক্যামেরার সামনে বসে থাকতে বাধ্য করা এবং "তদন্তের জন্য" তাদের অ্যাকাউন্টে টাকা পাঠাতে বলা।',
      ],
      whatToAvoid: [
        'ভারতীয় আইনে "ডিজিটাল অ্যারেস্ট" বলে কোনো বিধান নেই। পুলিশ কখনো ভিডিও কলে জবানবন্দি বা গ্রেপ্তার করে না।',
        'তদন্তের নামে সরকারি যাচাইকরণের অজুহাতে কারও অ্যাকাউন্টে টাকা পাঠাবেন না।',
        'ভয় পেয়ে পরিবারের লোকজনকে না জানিয়ে একা কোনো সিদ্ধান্ত নেবেন না।',
      ],
      recommendedActions: [
        'অবিলম্বে ভিডিও কলটি কেটে দিন। আসল পুলিশ চিঠি দিয়ে সশরীরে থানায় ডেকে পাঠায়।',
        'নিকটস্থ থানায় গিয়ে সরাসরি বিষয়টি জানান।',
        'প্রতারকদের নম্বর ও স্ক্রিনশট সংগ্রহ করে রাখুন।',
      ],
      reportingOptions: [
        'তৎক্ষণাৎ ১৯৩০ সাইবার হেল্পলাইনে যোগাযোগ করুন।',
        'cybercrime.gov.in পোর্টালে ডিজিটাল অ্যারেস্ট হিসেবে অভিযোগ জানান।',
      ],
    },
    hi: {
      title: 'डिजिटल अरेस्ट और पुलिस अधिकारी बनकर ठगी',
      badge: 'जबरन वसूली',
      summary: 'सीबीआई, ईडी, कस्टम या पुलिस की वर्दी में वीडियो कॉल करके "डिजिटल अरेस्ट" का डर दिखाना और पैसे ऐंठना।',
      warningSigns: [
        'दावा करना कि आपके नाम से ड्रग्स या मनी लॉन्ड्रिंग का पार्सल पकड़ा गया है।',
        'स्काइप या व्हाट्सएप वीडियो कॉल पर नकली पुलिस स्टेशन का सेटअप और फर्जी आईडी कार्ड दिखाना।',
        'घर में बंद रहने ("डिजिटल अरेस्ट") और जांच के लिए "सरकारी सुरक्षा खाते" में पैसे ट्रांसफर करने की धमकी।',
      ],
      whatToAvoid: [
        'भारतीय कानून में "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है। असली पुलिस कभी व्हाट्सएप पर गिरफ्तारी नहीं करती।',
        'सत्यापन या जमानत के नाम पर कभी किसी बैंक खाते में पैसे न भेजें।',
        'डरें नहीं और किसी के दबाव में आकर बात को गोपनीय न रखें।',
      ],
      recommendedActions: [
        'तुरंत कॉल काट दें। असली कानून प्रवर्तन एजेंसियां कानूनी नोटिस भेजती हैं, वीडियो कॉल नहीं करतीं।',
        'तुरंत अपने नजदीकी पुलिस थाने जाएं या 112 पर सूचना दें।',
        'कॉल करने वाले का नंबर सुरक्षित रखें।',
      ],
      reportingOptions: [
        'तुरंत 1930 राष्ट्रीय साइबर हेल्पलाइन पर कॉल करें।',
        'cybercrime.gov.in पर डिजिटल अरेस्ट की आपातकालीन रिपोर्ट दर्ज करें।',
      ],
    },
  },

  romance: {
    icon: 'Heart',
    en: {
      title: 'Romance & Matrimonial Scams',
      badge: 'SOCIAL ENGINEERING',
      summary: 'Online suitors who build romantic trust, then fabricate emergencies or claim valuable gifts are stuck at customs.',
      warningSigns: [
        'Profiles claiming to be wealthy NRI doctors, military personnel, or marine engineers abroad.',
        'Rapid declarations of love and marriage proposals within days, while avoiding in-person or video meetings.',
        'Claims that an expensive gift parcel or foreign currency is detained at Delhi/Mumbai airport customs.',
      ],
      whatToAvoid: [
        'Never send money to someone you have never met in person, no matter how convincing the story.',
        'Do not pay "customs clearance fees" or "anti-money-laundering certificate charges" into private bank accounts.',
        'Never send intimate photographs or financial credentials to online acquaintances.',
      ],
      recommendedActions: [
        'Perform a reverse image search on the suitor\'s profile photos using Google Images.',
        'Demand a verifiable live video call before developing any emotional or financial reliance.',
        'Involve trusted friends or family to evaluate the person\'s background objectively.',
      ],
      reportingOptions: [
        'Report the fraudulent profile directly on the matrimony or dating platform.',
        'File a formal complaint on cybercrime.gov.in with all chat transcripts and bank transfer logs.',
      ],
    },
    bn: {
      title: 'রোম্যান্স ও বৈবাহিক সাইবার প্রতারণা',
      badge: 'মানসিক প্রতারণা',
      summary: 'বিয়ের বা প্রেমের মিথ্যে নাটক করে বিশ্বাস অর্জন, তারপর কাস্টমসে গিফট আটকা পড়ার নামে টাকা দাবি।',
      warningSigns: [
        'প্রোফাইলে নিজেকে ধনী অনাবাসী ভারতীয় (NRI), ডাক্তার বা পাইলট হিসেবে দাবি করা।',
        'কয়েকদিনের মধ্যেই বিয়ের প্রস্তাব দেওয়া কিন্তু সশরীরে দেখা না করা।',
        'দাবি করা যে ভারত ভ্রমণকালে বা কাস্টমসে কোটি টাকার উপহার পার্সেল আটকে গেছে।',
      ],
      whatToAvoid: [
        'সশরীরে দেখা না হওয়া পর্যন্ত কারও কথায় বিশ্বাস করে কখনো টাকা পাঠাবেন না।',
        'কাস্টমস ক্লিয়ারেন্সের নামে কোনো ব্যক্তিগত ব্যাংক অ্যাকাউন্টে টাকা দেবেন না।',
        'অনলাইনে পরিচিত কাউকে ব্যক্তিগত বা অন্তরঙ্গ ছবি পাঠাবেন না।',
      ],
      recommendedActions: [
        'গুগল রিভার্স ইমেজ সার্চ দিয়ে প্রোফাইল ছবির সত্যতা যাচাই করুন।',
        'যেকোনো আর্থিক কথা বলার আগে সরাসরি ভিডিও কল করতে বলুন।',
        'পরিবারের সদস্যদের সাথে আলোচনা করে সত্যতা পরীক্ষা করুন।',
      ],
      reportingOptions: [
        'ম্যাট্রিমোনিয়াল সাইটে ভুয়ো প্রোফাইলটি রিপোর্ট করুন।',
        'ব্যাংক অ্যাকাউন্টের বিবরণ সহ cybercrime.gov.in পোর্টালে অভিযোগ জানান।',
      ],
    },
    hi: {
      title: 'रोमांस और वैवाहिक धोखाधड़ी',
      badge: 'भावनात्मक ठगी',
      summary: 'शादी या प्यार का झूठा नाटक करके विश्वास जीतना, फिर कस्टम में महंगे गिफ्ट फंसे होने के नाम पर वसूली।',
      warningSigns: [
        'विदेशी एनआरआई, डॉक्टर या मर्चेंट नेवी अफसर होने का दावा करने वाली प्रोफाइल।',
        'कुछ ही दिनों में शादी की बात करना लेकिन सामने आकर मिलने या वीडियो कॉल से बचना।',
        'दावा करना कि आपके लिए भेजा गया महंगा पार्सल एयरपोर्ट कस्टम में रुक गया है।',
      ],
      whatToAvoid: [
        'जिसे कभी आमने-सामने न देखा हो, उसे किसी भी परिस्थिति में पैसे न भेजें।',
        'कस्टम ड्यूटी के नाम पर किसी निजी खाते में कभी पैसे ट्रांसफर न करें।',
        'ऑनलाइन दोस्तों के साथ कभी भी निजी तस्वीरें या बैंक विवरण साझा न करें।',
      ],
      recommendedActions: [
        'गूगल पर फोटो का रिवर्स इमेज सर्च करके देखें कि फोटो कहीं चुराई तो नहीं गई।',
        'किसी भी रिश्ते को आगे बढ़ाने से पहले वीडियो कॉल पर बातचीत की मांग करें।',
        'परिवार के किसी समझदार सदस्य को इस बारे में जरूर बताएं।',
      ],
      reportingOptions: [
        'संबंधित मैट्रिमोनियल या डेटिंग ऐप पर प्रोफाइल की शिकायत करें।',
        'cybercrime.gov.in पर चैट और बैंक ट्रांसफर के सबूतों के साथ रिपोर्ट दर्ज करें।',
      ],
    },
  },

  tech_support: {
    icon: 'Terminal',
    en: {
      title: 'Tech Support & Remote Access Fraud',
      badge: 'TECHNICAL',
      summary: 'Pop-up browser alerts claiming your computer is infected with viruses, demanding you call a fake support line.',
      warningSigns: [
        'Full-screen browser locks with loud sirens claiming "Microsoft Defender Alert: Computer Locked".',
        'Toll-free numbers displayed on screen urging you to call immediately to avoid data deletion.',
        'Technician asks you to download remote software (AnyDesk, UltraViewer) and open your net banking to "test security".',
      ],
      whatToAvoid: [
        'Never call phone numbers displayed on browser error pop-ups. Microsoft never includes phone numbers in error alerts.',
        'Never grant remote access to your device to unsolicited technicians.',
        'Never log into bank accounts while someone is remotely connected to your screen.',
      ],
      recommendedActions: [
        'Force quit your browser using Task Manager (Ctrl+Shift+Esc on Windows) to dismiss the scam pop-up.',
        'Keep your genuine operating system security (Windows Defender) updated.',
        'If remote access was granted, immediately disconnect internet and uninstall the remote viewer.',
      ],
      reportingOptions: [
        'Report tech support scams to Microsoft Security at microsoft.com/reportascam.',
        'File an incident complaint on cybercrime.gov.in.',
      ],
    },
    bn: {
      title: 'টেক সাপোর্ট ও রিমোট অ্যাক্সেস প্রতারণা',
      badge: 'প্রযুক্তিগত ফ্রড',
      summary: 'কম্পিউটারে ভাইরাস আছে বলে ভুয়ো পপ-আপ দেখিয়ে রিমোট সফটওয়্যারের মাধ্যমে ব্যাংক অ্যাকাউন্ট চুরি।',
      warningSigns: [
        'কম্পিউটারের স্ক্রিনে হঠাৎ বিকট শব্দ সহ "মাইক্রোসফট ভাইরাস অ্যালার্ট: কম্পিউটার লকড" পপ-আপ।',
        'স্ক্রিনে টোল-ফ্রি নম্বর দেখিয়ে অবিলম্বে টেকনিক্যাল হেল্পলাইনে ফোন করার নির্দেশ।',
        'কলার আপনাকে AnyDesk বা TeamViewer ইনস্টল করিয়ে ব্যাংক অ্যাকাউন্টে লগইন করতে বলে।',
      ],
      whatToAvoid: [
        'ব্রাউজারের পপ-আপে দেওয়া নম্বরে কখনো ফোন করবেন না। আসল মাইক্রোসফট কখনো ফোন নম্বর দেয় না।',
        'কোনো অচেনা ব্যক্তিকে আপনার কম্পিউটার বা ফোনের রিমোট নিয়ন্ত্রণ দেবেন না।',
        'রিমোট সংযোগ চালু থাকা অবস্থায় কখনো ব্যাংক বা পাসওয়ার্ড টাইপ করবেন না।',
      ],
      recommendedActions: [
        'টাস্ক ম্যানেজার (Ctrl+Shift+Esc) খুলে ব্রাউজারটি বন্ধ (End Task) করে দিন।',
        'উইন্ডোজ ডিফেন্ডার বা আসল অ্যান্টিভাইরাস দিয়ে সম্পূর্ণ সিস্টেম স্ক্যান করুন।',
        'রিমোট অ্যাক্সেস দিয়ে ফেললে অবিলম্বে ওয়াই-ফাই বা ইন্টারনেট বন্ধ করুন।',
      ],
      reportingOptions: [
        'microsoft.com/reportascam সাইটে টেক সাপোর্ট ফ্রড রিপোর্ট করুন।',
        'cybercrime.gov.in এ প্রতারণার অভিযোগ জানান।',
      ],
    },
    hi: {
      title: 'टेक सपोर्ट और रिमोट एक्सेस धोखाधड़ी',
      badge: 'तकनीकी फ्रॉड',
      summary: 'कंप्यूटर में वायरस होने का फर्जी पॉप-अप दिखाकर रिमोट सॉफ्टवेयर डाउनलोड कराना और बैंक खाता खाली करना।',
      warningSigns: [
        'स्क्रीन पर सायरन की आवाज के साथ "माइक्रोसॉफ्ट डिफेंडर वार्निंग: सिस्टम हैक" जैसा डरावना पॉप-अप।',
        'समस्या ठीक करने के लिए स्क्रीन पर दिए गए टोल-फ्री नंबर पर कॉल करने का दबाव।',
        'कॉलर द्वारा AnyDesk या UltraViewer डाउनलोड कराकर नेट बैंकिंग खोलने को कहना।',
      ],
      whatToAvoid: [
        'पॉप-अप में दिए गए किसी भी फोन नंबर पर कॉल न करें। माइक्रोसॉफ्ट कभी एरर में फोन नंबर नहीं देता।',
        'किसी अनजान व्यक्ति को अपने कंप्यूटर का रिमोट एक्सेस कभी न दें।',
        'रिमोट एक्सेस चालू होने पर कभी भी बैंकिंग पासवर्ड टाइप न करें।',
      ],
      recommendedActions: [
        'टास्क मैनेजर (Ctrl+Shift+Esc) खोलकर ब्राउज़र को तुरंत बंद (End Task) करें।',
        'अपने कंप्यूटर के असली एंटीवायरस से सिस्टम को पूरी तरह स्कैन करें।',
        'यदि गलती से रिमोट ऐप इंस्टॉल कर दिया है, तो तुरंत इंटरनेट बंद करके उसे हटाएं।',
      ],
      reportingOptions: [
        'microsoft.com/reportascam पर टेक सपोर्ट फ्रॉड की शिकायत करें।',
        'cybercrime.gov.in पर रिपोर्ट दर्ज करें।',
      ],
    },
  },
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    en: {
      scenario: 'You are selling an old sofa on OLX. A buyer offers to pay immediately via UPI and sends you a QR code on WhatsApp, asking you to "Scan this QR code and enter your UPI PIN to claim ₹8,000".',
      question: 'What is the correct action?',
      options: [
        { label: 'Scan the QR code and enter your PIN immediately to receive the money.', isCorrect: false },
        { label: 'Refuse. Entering a UPI PIN ALWAYS transfers money out of your account, never into it.', isCorrect: true },
        { label: 'Forward the QR code to your friend to see if it works for them.', isCorrect: false },
      ],
      explanation: 'Core Rule of UPI: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering your PIN authorises an outgoing debit transaction from your account.',
    },
    bn: {
      scenario: 'আপনি OLX-এ একটি পুরোনো সোফা বিক্রি করছেন। একজন ক্রেতা তৎক্ষণাৎ টাকা পাঠানোর জন্য হোয়াটসঅ্যাপে একটি কিউআর কোড পাঠায় এবং বলে "এই কোডটি স্ক্যান করে ইউপিআই পিন দিন, তাহলে ৮,০০০ টাকা জমা হবে"।',
      question: 'আপনার সঠিক পদক্ষেপ কী হওয়া উচিত?',
      options: [
        { label: 'টাকা পেতে সঙ্গে সঙ্গে কিউআর কোড স্ক্যান করে পিন দেওয়া।', isCorrect: false },
        { label: 'প্রত্যাখ্যান করা। ইউপিআই পিন দিলে সর্বদা নিজের অ্যাকাউন্ট থেকে টাকা কেটে যায়, কখনো টাকা আসে না।', isCorrect: true },
        { label: 'বন্ধুকে কোডটি পাঠিয়ে দেখা টাকা ঢোকে কিনা।', isCorrect: false },
      ],
      explanation: 'ইউপিআই-এর মূল নিয়ম: টাকা পাওয়ার জন্য কখনই কিউআর কোড স্ক্যান করতে হয় না বা ইউপিআই পিন দিতে হয় না। পিন দিলে আপনার অ্যাকাউন্ট থেকেই টাকা কেটে যায়।',
    },
    hi: {
      scenario: 'आप OLX पर पुराना सोफा बेच रहे हैं। खरीदार तुरंत भुगतान करने की बात कहकर व्हाट्सएप पर एक क्यूआर कोड भेजता है और कहता है "इसे स्कैन करके यूपीआई पिन डालें, आपके खाते में ₹8,000 आ जाएंगे"।',
      question: 'सही कदम क्या होगा?',
      options: [
        { label: 'पैसे प्राप्त करने के लिए तुरंत क्यूआर कोड स्कैन करके पिन दर्ज करें।', isCorrect: false },
        { label: 'साफ मना कर दें। यूपीआई पिन डालने से हमेशा आपके खाते से पैसा कटता है, कभी आता नहीं।', isCorrect: true },
        { label: 'यह क्यूआर कोड किसी दोस्त को भेजकर चेक करवाएं।', isCorrect: false },
      ],
      explanation: 'यूपीआई का मुख्य नियम: पैसे प्राप्त करने के लिए कभी भी क्यूआर कोड स्कैन करने या यूपीआई पिन डालने की जरूरत नहीं होती। पिन डालने से पैसा कटता है।',
    },
  },
  {
    id: 2,
    en: {
      scenario: 'You receive a Skype video call from a man in police uniform claiming you are under "Digital Arrest" because a courier with narcotics was sent using your Aadhaar number. He orders you to keep the camera on and transfer ₹1,50,000 to an "RBI verification escrow account".',
      question: 'What is true regarding this situation?',
      options: [
        { label: 'Comply with the transfer to avoid immediate police arrest.', isCorrect: false },
        { label: 'It is a pure scam. Indian law has no provision for "Digital Arrest", and real police never demand money transfers.', isCorrect: true },
        { label: 'Ask for a 50% discount on the verification fee.', isCorrect: false },
      ],
      explanation: 'There is NO legal concept of "Digital Arrest" in India. Law enforcement agencies (CBI, ED, Police) NEVER conduct trials on Skype/WhatsApp and NEVER ask citizens to transfer money to "clear charges".',
    },
    bn: {
      scenario: 'পুলিশের উর্দি পরা এক ব্যক্তি স্কাইপ ভিডিও কলে জানায় যে আপনার আধার নম্বরে একটি মাদকের পার্সেল পাঠানো হয়েছে এবং আপনি "ডিজিটাল অ্যারেস্টে" আছেন। সে ক্যামেরা চালু রাখতে বলে এবং তদন্তের জন্য "আরবিআই ভেরিফিকেশন অ্যাকাউন্টে" ১,৫০,০০০ টাকা পাঠাতে নির্দেশ দেয়।',
      question: 'এই পরিস্থিতিতে কোনটি সঠিক?',
      options: [
        { label: 'গ্রেপ্তার এড়াতে সঙ্গে সঙ্গে টাকা পাঠিয়ে দেওয়া।', isCorrect: false },
        { label: 'এটি একটি পরিকল্পিত প্রতারণা। ভারতীয় আইনে "ডিজিটাল অ্যারেস্ট" বলে কিছু নেই এবং আসল পুলিশ কখনো ভিডিও কলে টাকা চায় না।', isCorrect: true },
        { label: 'টাকার পরিমাণ অর্ধেক করার জন্য দরদাম করা।', isCorrect: false },
      ],
      explanation: 'ভারতে "ডিজিটাল অ্যারেস্ট" বলে কোনো আইন নেই। সিবিআই বা পুলিশ কখনো ভিডিও কলে বিচার করে না বা মামলা নিষ্পত্তির জন্য টাকা দাবি করে না।',
    },
    hi: {
      scenario: 'पुलिस की वर्दी में एक व्यक्ति स्काइप वीडियो कॉल करके दावा करता है कि आपके आधार कार्ड पर ड्रग्स का पार्सल मिला है और आप "डिजिटल अरेस्ट" हैं। वह कैमरा चालू रखने और "आरबीआई सत्यापन खाते" में ₹1,50,000 जमा करने को कहता है।',
      question: 'इस स्थिति में क्या सच है?',
      options: [
        { label: 'गिरफ्तारी से बचने के लिए तुरंत पैसे ट्रांसफर कर दें।', isCorrect: false },
        { label: 'यह एक बड़ा फ्रॉड है। भारतीय कानून में "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है और असली पुलिस कभी पैसे नहीं मांगती।', isCorrect: true },
        { label: 'पैसे कम करने के लिए मोलभाव करें।', isCorrect: false },
      ],
      explanation: 'भारतीय कानून में "डिजिटल अरेस्ट" का कोई अस्तित्व नहीं है। पुलिस या सीबीआई कभी भी व्हाट्सएप/स्काइप पर जांच नहीं करती और न ही पैसे मांगती है।',
    },
  },
  {
    id: 3,
    en: {
      scenario: 'A recruiter on Telegram pays you ₹150 for liking 3 YouTube videos. They now invite you to deposit ₹2,000 into a "VIP Merchant Pool" to get ₹5,000 back within 20 minutes.',
      question: 'What psychological trick is being used here?',
      options: [
        { label: 'Legitimate corporate profit sharing.', isCorrect: false },
        { label: 'Bait-and-Switch scam: small initial payouts build false trust before demanding larger non-refundable deposits.', isCorrect: true },
        { label: 'Government skill-development subsidy.', isCorrect: false },
      ],
      explanation: 'Scammers deliberately give ₹100-₹500 initially to lower your guard. Once you deposit larger sums (₹2,000, ₹10,000, ₹50,000), they freeze your funds and demand more "tax clearance fees".',
    },
    bn: {
      scenario: 'টেলিগ্রামে একজন নিয়োগকারী ৩টি ইউটিউব ভিডিও লাইক করার জন্য আপনাকে ১৫০ টাকা দেয়। এরপর সে বলে একটি "ভিআইপি পুলে" ২,০০০ টাকা জমা দিলে ২০ মিনিটের মধ্যে ৫,০০০ টাকা ফেরত পাওয়া যাবে।',
      question: 'এখানে কোন প্রতারণার কৌশল ব্যবহার করা হচ্ছে?',
      options: [
        { label: 'বৈধ প্রাতিষ্ঠানিক লাভ ভাগাভাগি।', isCorrect: false },
        { label: 'টোপ ফেলার কৌশল (Bait-and-Switch): প্রথমে সামান্য টাকা দিয়ে বিশ্বাস তৈরি করে পরে বড় অঙ্কের টাকা হাতিয়ে নেওয়া।', isCorrect: true },
        { label: 'সরকারি কর্মসংস্থান প্রকল্প।', isCorrect: false },
      ],
      explanation: 'প্রতারকরা বিশ্বাস অর্জনের জন্য প্রথমে ১০০-৫০০ টাকা দেয়। এরপর ভুক্তভোগী যখন বড় অঙ্কের টাকা জমা দেয়, তখন সব টাকা আটকে দিয়ে আরও টাকা দাবি করে।',
    },
    hi: {
      scenario: 'टेलीग्राम पर एक व्यक्ति यूट्यूब वीडियो लाइक करने के लिए आपको ₹150 देता है। फिर वह कहता है कि "वीआईपी पूल" में ₹2,000 जमा करने पर 20 मिनट में ₹5,000 मिलेंगे।',
      question: 'यहां कौन सी चाल चली जा रही है?',
      options: [
        { label: 'असली कंपनी का मुनाफा बांटना।', isCorrect: false },
        { label: 'चारा डालने की रणनीति (Bait-and-Switch): पहले थोड़ा पैसा देकर विश्वास जीतना, फिर बड़ा पैसा हड़प लेना।', isCorrect: true },
        { label: 'सरकारी रोजगार योजना।', isCorrect: false },
      ],
      explanation: 'ठग पहले ₹100-₹500 देकर भरोसा जीतते हैं। जैसे ही आप ₹2,000 या ₹10,000 डालते हैं, वे पैसे फ्रीज कर देते हैं और निकासी के नाम पर और पैसे मांगते हैं।',
    },
  },
  {
    id: 4,
    en: {
      scenario: 'You get an SMS: "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Immediately contact power officer on 9876543210 to update bill."',
      question: 'How should you verify this?',
      options: [
        { label: 'Call 9876543210 immediately and download the support APK file they send.', isCorrect: false },
        { label: 'Check your official electricity provider portal or mobile app directly; ignore the personal phone number.', isCorrect: true },
        { label: 'Send your debit card photo to the sender via WhatsApp.', isCorrect: false },
      ],
      explanation: 'Official power distribution companies send notifications with official alphanumeric sender IDs (e.g., WBSEDCL, BESCOM) and never ask you to call personal 10-digit mobile numbers or install APK apps.',
    },
    bn: {
      scenario: 'একটি এসএমএস এল: "প্রিয় গ্রাহক, বিল বকেয়া থাকার কারণে আজ রাত ৯:৩০ এ বিদ্যুৎ সংযোগ বিচ্ছিন্ন করা হবে। বিল আপডেট করতে অবিলম্বে বিদ্যুৎ আধিকারিককে ৯৮৭৬৫৪৩২১০ নম্বরে কল করুন"।',
      question: 'আপনার কীভাবে এটি যাচাই করা উচিত?',
      options: [
        { label: 'অবিলম্বে ওই নম্বরে কল করে তাদের পাঠানো APK ফাইল ডাউনলোড করা।', isCorrect: false },
        { label: 'বিদ্যুৎ পর্ষদের অফিশিয়াল অ্যাপ বা পোর্টালে সরাসরি বিল চেক করা; ব্যক্তিগত নম্বরে কল না করা।', isCorrect: true },
        { label: 'হোয়াটসঅ্যাপে ডেবিট কার্ডের ছবি পাঠানো।', isCorrect: false },
      ],
      explanation: 'বিদ্যুৎ কোম্পানিগুলি সর্বদা অফিসিয়াল আলফানিউমেরিক আইডি (যেমন WBSEDCL) থেকে বার্তা পাঠায়, কোনো ব্যক্তিগত ১০ ডিজিটের মোবাইল নম্বর থেকে নয়।',
    },
    hi: {
      scenario: 'एसएमएस आया: "प्रिय उपभोक्ता, बिल जमा न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत बिल अपडेट करने के लिए बिजली अधिकारी से 9876543210 पर संपर्क करें"।',
      question: 'इसकी जांच कैसे करनी चाहिए?',
      options: [
        { label: 'तुरंत उस नंबर पर फोन करके उनके द्वारा भेजा गया ऐप डाउनलोड करें।', isCorrect: false },
        { label: 'सीधे बिजली विभाग की आधिकारिक वेबसाइट या ऐप पर जाकर बिल जांचें; निजी नंबर पर कॉल न करें।', isCorrect: true },
        { label: 'व्हाट्सएप पर अपना डेबिट कार्ड फोटो भेजें।', isCorrect: false },
      ],
      explanation: 'बिजली कंपनियां कभी भी 10 अंकों के व्यक्तिगत मोबाइल नंबर से बिजली काटने की धमकी नहीं देतीं और न ही कोई एपीके ऐप डाउनलोड करने को कहती हैं।',
    },
  },
  {
    id: 5,
    en: {
      scenario: 'You receive an SMS from "India Post" stating your parcel failed delivery because of an incorrect house number. It directs you to indiapost-address-verify.com to pay a ₹5 re-delivery charge.',
      question: 'What is the danger here?',
      options: [
        { label: 'Nothing, ₹5 is a negligible amount so it is safe to test.', isCorrect: false },
        { label: 'It is a credential phishing site designed to steal your full card details, CVV, and net banking password.', isCorrect: true },
        { label: 'The postal worker might deliver the parcel to your neighbour.', isCorrect: false },
      ],
      explanation: 'The ₹5 fee is a psychological decoy. The fake payment gateway will steal your card credentials or trigger an unauthorized transaction of ₹5,000+ using a stolen OTP.',
    },
    bn: {
      scenario: '"ইন্ডিয়া পোস্ট" থেকে একটি এসএমএস এল যে ভুল ঠিকানার কারণে পার্সেল ডেলিভারি হয়নি। indiapost-address-verify.com লিঙ্কে গিয়ে ৫ টাকা ফি দিয়ে ঠিকানা ঠিক করতে বলা হলো।',
      question: 'এখানে আসল বিপদ কী?',
      options: [
        { label: 'কোনো বিপদ নেই, মাত্র ৫ টাকা তাই পেমেন্ট করে দেখা যায়।', isCorrect: false },
        { label: 'এটি একটি ফিশিং সাইট যা আপনার সম্পূর্ণ কার্ড নম্বর, সিভিভি ও ব্যাংকিং পাসওয়ার্ড চুরি করার জন্য তৈরি।', isCorrect: true },
        { label: 'পোস্টম্যান পার্সেলটি প্রতিবেশীকে দিয়ে দিতে পারে।', isCorrect: false },
      ],
      explanation: '৫ টাকার ফি কেবল একটি ফাঁদ। ভুয়ো পেমেন্ট পেজে কার্ডের তথ্য দিলে বা ওটিপি বসালে কয়েক হাজার টাকা আপনার অ্যাকাউন্ট থেকে উধাও হয়ে যাবে।',
    },
    hi: {
      scenario: '"इंडिया पोस्ट" से एसएमएस आता है कि पते की गलती के कारण पार्सल नहीं पहुंचा। indiapost-address-verify.com पर जाकर ₹5 शुल्क देकर पता अपडेट करने को कहा गया है।',
      question: 'इसमें क्या खतरा है?',
      options: [
        { label: 'कोई खतरा नहीं, ₹5 बहुत छोटी रकम है इसलिए भुगतान करके देखा जा सकता है।', isCorrect: false },
        { label: 'यह एक फर्जी फ़िशिंग साइट है जो आपके पूरे कार्ड की जानकारी, सीवीवी और पासवर्ड चुराने के लिए बनाई गई है।', isCorrect: true },
        { label: 'डाकिया पार्सल किसी पड़ोसी को दे सकता है।', isCorrect: false },
      ],
      explanation: '₹5 केवल एक लालच है। उस फर्जी पेज पर कार्ड विवरण डालते ही स्कैमर्स आपके खाते से हजारों रुपये उड़ा सकते हैं।',
    },
  },
];
