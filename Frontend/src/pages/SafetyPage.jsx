import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CreditCard,
  Shield,
  Briefcase,
  TrendingUp,
  Link as LinkIcon,
  Package,
  AlertTriangle,
  Award,
  Heart,
  Terminal,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Languages,
  PhoneCall,
  Search,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SAFETY_LANGUAGES, CATEGORIES_DATA, QUIZ_QUESTIONS } from '../data/safetyGuides';

const ICON_MAP = {
  CreditCard,
  Shield,
  Briefcase,
  TrendingUp,
  Link: LinkIcon,
  Package,
  AlertTriangle,
  Award,
  ShieldAlert,
  Heart,
  Terminal,
};

const UI_TEXT = {
  en: {
    heroTag: 'DEFENSE REPOSITORY & AWARENESS LAB',
    heroTitle: 'Scam Defense Directory & Safety Lab',
    heroSubtitle: 'Deep-dive tactical defense guides covering 11 cyber fraud archetypes, psychological red flags, and an interactive awareness training simulator.',
    allCategories: 'All Guides',
    searchPlaceholder: 'Search warning signs, keywords (e.g. OTP, AnyDesk, CBI, FedEx)...',
    warningSigns: 'Warning Signs & Red Flags',
    whatToAvoid: 'What to Avoid (Never Do This)',
    recommendedActions: 'Defensive Actions',
    reportingOptions: 'Official Reporting',
    reportScamBtn: 'Report This Type',
    quizTitle: 'Interactive Cyber Threat Awareness Lab',
    quizSubtitle: 'Test your scam-detection reflexes against real-world social engineering tactics.',
    questionLabel: 'Scenario',
    of: 'of',
    submitAnswer: 'Select an option to test your reflex',
    correctAnswer: 'Correct Decision!',
    incorrectAnswer: 'Vulnerable Response!',
    explanationLabel: 'Defense Analysis:',
    nextQuestion: 'Next Scenario',
    viewResults: 'Complete Assessment',
    scoreTitle: 'Awareness Reflex Score',
    scorePerfect: 'Cyber Shield Master — Elite Vigilance',
    scoreGood: 'Cyber Aware — Strong Security Reflexes',
    scoreNeedsWork: 'Vulnerability Detected — Review Defensive Guides',
    retakeQuiz: 'Retake Assessment',
    emergencyBannerTitle: 'Already Fallen for a Scam?',
    emergencyBannerText: 'Do not panic. Execute the 5-step Golden Hour protocol immediately to dispute payments and freeze suspect accounts.',
    emergencyBannerBtn: 'Open Emergency Help Center',
  },
  bn: {
    heroTag: 'সুরক্ষা নির্দেশিকা ও সচেতনতা ল্যাব',
    heroTitle: 'সাইবার সুরক্ষা গাইড ও সচেতনতা ল্যাব',
    heroSubtitle: '১১টি প্রধান সাইবার প্রতারণার বিস্তারিত বিশ্লেষণ, মানসিক ফাঁদ চেনার উপায় এবং ইন্টারেক্টিভ কুইজ পরীক্ষা।',
    allCategories: 'সমস্ত নির্দেশিকা',
    searchPlaceholder: 'খুঁজুন (যেমন ওটিপি, কিউআর কোড, পার্সেল, চাকরি)...',
    warningSigns: 'সতর্ক সংকেত (রেড ফ্ল্যাগ)',
    whatToAvoid: 'যা কখনো করবেন না',
    recommendedActions: 'প্রতিরোধমূলক ব্যবস্থা',
    reportingOptions: 'অফিসিয়াল রিপোর্টিং',
    reportScamBtn: 'এই ধরণের প্রতারণা রিপোর্ট করুন',
    quizTitle: 'ইন্টারেক্টিভ সাইবার সচেতনতা পরীক্ষা',
    quizSubtitle: 'বাস্তব জীবনের প্রতারণার পরিস্থিতির মুখোমুখি হয়ে আপনার সাইবার সচেতনতা পরীক্ষা করুন।',
    questionLabel: 'পরিস্থিতি',
    of: 'এর মধ্যে',
    submitAnswer: 'একটি বিকল্প বেছে নিন',
    correctAnswer: 'সঠিক সিদ্ধান্ত!',
    incorrectAnswer: 'বিপজ্জনক সিদ্ধান্ত!',
    explanationLabel: 'নিরাপত্তা বিশ্লেষণ:',
    nextQuestion: 'পরবর্তী পরিস্থিতি',
    viewResults: 'ফলাফল দেখুন',
    scoreTitle: 'আপনার সচেতনতা স্কোর',
    scorePerfect: 'সাইবার শিল্ড মাস্টার — অসাধারণ সচেতনতা',
    scoreGood: 'সাইবার সচেতন — ভালো সুরক্ষা জ্ঞান',
    scoreNeedsWork: 'সতর্কতার অভাব — নির্দেশিকাগুলি মনোযোগ দিয়ে পড়ুন',
    retakeQuiz: 'পুনরায় পরীক্ষা দিন',
    emergencyBannerTitle: 'ইতোমধ্যেই প্রতারিত হয়েছেন?',
    emergencyBannerText: 'আতঙ্কিত হবেন না। টাকা আটকানো এবং অ্যাকাউন্ট সুরক্ষিত করতে অবিলম্বে আমাদের গোল্ডেন আওয়ার প্রোটোকল মেনে চলুন।',
    emergencyBannerBtn: 'জরুরি সহায়তা কেন্দ্রে যান',
  },
  hi: {
    heroTag: 'सुरक्षा निर्देशिका एवं जागरूकता केंद्र',
    heroTitle: 'साइबर सुरक्षा गाइड एवं जागरूकता लैब',
    heroSubtitle: '11 प्रमुख साइबर धोखाधड़ियों की संपूर्ण जानकारी, मनोवैज्ञानिक चालों की पहचान और इंटरैक्टिव जागरूकता क्विज।',
    allCategories: 'सभी गाइड',
    searchPlaceholder: 'खोजें (जैसे ओटीपी, एनीडेस्क, नौकरी, लॉटरी)...',
    warningSigns: 'चेतावनी के संकेत (रेड फ्लैग)',
    whatToAvoid: 'क्या न करें (सावधानियां)',
    recommendedActions: 'सुरक्षात्मक कदम',
    reportingOptions: 'आधिकारिक रिपोर्टिंग',
    reportScamBtn: 'इस प्रकार की रिपोर्ट करें',
    quizTitle: 'इंटरैक्टिव साइबर जागरूकता लैब',
    quizSubtitle: 'वास्तविक जीवन की धोखाधड़ी की स्थितियों में अपनी सुरक्षा सजगता का परीक्षण करें।',
    questionLabel: 'परिदृश्य',
    of: 'में से',
    submitAnswer: 'एक विकल्प चुनें',
    correctAnswer: 'बिल्कुल सही निर्णय!',
    incorrectAnswer: 'असुरक्षित प्रतिक्रिया!',
    explanationLabel: 'सुरक्षा विश्लेषण:',
    nextQuestion: 'अगला परिदृश्य',
    viewResults: 'परिणाम देखें',
    scoreTitle: 'आपका जागरूकता स्कोर',
    scorePerfect: 'साइबर शील्ड मास्टर — उत्कृष्ट सतर्कता',
    scoreGood: 'साइबर जागरूक — मजबूत सुरक्षा समझ',
    scoreNeedsWork: 'सतर्कता की आवश्यकता — गाइड को ध्यानपूर्वक पढ़ें',
    retakeQuiz: 'पुनः प्रयास करें',
    emergencyBannerTitle: 'क्या आप पहले से ठगी के शिकार हो चुके हैं?',
    emergencyBannerText: 'घबराएं नहीं। लेन-देन रोकने और खाता सुरक्षित करने के लिए तुरंत हमारा 5-चरणीय आपातकालीन प्रोटोकॉल अपनाएं।',
    emergencyBannerBtn: 'आपातकालीन सहायता केंद्र खोलें',
  },
};

const SafetyPage = () => {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTabByCard, setActiveTabByCard] = useState({});

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredMap, setAnsweredMap] = useState({});

  const t = UI_TEXT[lang] || UI_TEXT.en;
  const categoriesList = Object.entries(CATEGORIES_DATA);

  // Filter categories
  const filteredCategories = categoriesList.filter(([key, cat]) => {
    const data = cat[lang] || cat.en;
    if (selectedCategory !== 'all' && key !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const titleMatch = data.title.toLowerCase().includes(q);
    const summaryMatch = data.summary.toLowerCase().includes(q);
    const warningMatch = data.warningSigns.some((w) => w.toLowerCase().includes(q));
    const avoidMatch = data.whatToAvoid.some((a) => a.toLowerCase().includes(q));

    return titleMatch || summaryMatch || warningMatch || avoidMatch;
  });

  const getActiveTab = (key) => activeTabByCard[key] || 'warnings';
  const setActiveTab = (key, tab) => {
    setActiveTabByCard((prev) => ({ ...prev, [key]: tab }));
  };

  // Quiz Handling
  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const qData = currentQ ? (currentQ[lang] || currentQ.en) : null;
  const isCurrentAnswered = answeredMap[currentQuestionIndex] !== undefined;

  const handleSelectOption = (idx) => {
    if (isCurrentAnswered) return;
    const isCorrect = qData.options[idx].isCorrect;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    setAnsweredMap((prev) => ({
      ...prev,
      [currentQuestionIndex]: { selected: idx, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setAnsweredMap({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Language Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.heroTag}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Language Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 self-start sm:self-auto">
          <Languages className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          {SAFETY_LANGUAGES.map((langItem) => (
            <button
              key={langItem.code}
              onClick={() => setLang(langItem.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                lang === langItem.code
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{langItem.native}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Help Center Link Banner */}
      <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-red-500/15 via-red-600/10 to-transparent border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 mt-0.5">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{t.emergencyBannerTitle}</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5 leading-relaxed">
              {t.emergencyBannerText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
          <a
            href="tel:1930"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 1930
          </a>
          <Link
            to="/emergency"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>{t.emergencyBannerBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Scrollable category selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {t.allCategories} ({categoriesList.length})
          </button>
          {categoriesList.map(([key, cat]) => {
            const data = cat[lang] || cat.en;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{data.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredCategories.map(([key, cat]) => {
          const data = cat[lang] || cat.en;
          const IconComp = ICON_MAP[cat.icon] || ShieldAlert;
          const activeTab = getActiveTab(key);

          return (
            <div
              key={key}
              className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl border border-white/5 text-cyan-400 flex-shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{data.title}</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{data.summary}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex-shrink-0">
                    {data.badge}
                  </span>
                </div>

                {/* Micro Tabs */}
                <div className="flex items-center gap-1 border-b border-white/5 pb-2 mb-4 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab(key, 'warnings')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'warnings'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚠️ {t.warningSigns}
                  </button>
                  <button
                    onClick={() => setActiveTab(key, 'avoid')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'avoid'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🚫 {t.whatToAvoid}
                  </button>
                  <button
                    onClick={() => setActiveTab(key, 'actions')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'actions'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🛡️ {t.recommendedActions}
                  </button>
                  <button
                    onClick={() => setActiveTab(key, 'reporting')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'reporting'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📢 {t.reportingOptions}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="text-xs sm:text-sm text-slate-300 min-h-[140px]">
                  {activeTab === 'warnings' && (
                    <ul className="space-y-2">
                      {data.warningSigns.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'avoid' && (
                    <ul className="space-y-2">
                      {data.whatToAvoid.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'actions' && (
                    <ul className="space-y-2">
                      {data.recommendedActions.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'reporting' && (
                    <ul className="space-y-2">
                      {data.reportingOptions.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs">
                <Link
                  to="/report"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>{t.reportScamBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/check"
                  className="text-slate-400 hover:text-slate-200"
                >
                  Verify Identifier
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Scam Awareness Lab (Quiz Section) */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE AWARENESS LAB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.quizTitle}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            {t.quizSubtitle}
          </p>
        </div>

        {!quizFinished ? (
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>
                {t.questionLabel} {currentQuestionIndex + 1} {t.of} {QUIZ_QUESTIONS.length}
              </span>
              <span>Score: {quizScore}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Card */}
            {qData && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                    Incident Scenario
                  </span>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    "{qData.scenario}"
                  </p>
                  <h4 className="text-xs sm:text-sm font-bold text-cyan-400 pt-1">
                    {qData.question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {qData.options.map((opt, idx) => {
                    const isSelected = isCurrentAnswered && answeredMap[currentQuestionIndex].selected === idx;
                    const isOptionCorrect = opt.isCorrect;

                    let btnClass = 'bg-black/30 border-white/10 hover:border-white/20 text-slate-200';
                    if (isCurrentAnswered) {
                      if (isOptionCorrect) {
                        btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                      } else if (isSelected && !isOptionCorrect) {
                        btnClass = 'bg-red-500/20 border-red-500 text-red-300';
                      } else {
                        btnClass = 'bg-black/20 border-white/5 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isCurrentAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed flex-1">{opt.label}</span>
                        {isCurrentAnswered && isOptionCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                        {isCurrentAnswered && isSelected && !isOptionCorrect && (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback & Explanation */}
                {isCurrentAnswered && (
                  <div
                    className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                      answeredMap[currentQuestionIndex].isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2">
                      {answeredMap[currentQuestionIndex].isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{t.correctAnswer}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span>{t.incorrectAnswer}</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300">
                      <strong>{t.explanationLabel}</strong> {qData.explanation}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
                      >
                        <span>
                          {currentQuestionIndex < QUIZ_QUESTIONS.length - 1
                            ? t.nextQuestion
                            : t.viewResults}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Finished Quiz Summary Card */
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.scoreTitle}</h3>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                {quizScore} / {QUIZ_QUESTIONS.length}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {quizScore === QUIZ_QUESTIONS.length
                  ? t.scorePerfect
                  : quizScore >= 3
                  ? t.scoreGood
                  : t.scoreNeedsWork}
              </p>
            </div>

            <button
              onClick={handleResetQuiz}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs inline-flex items-center gap-2 transition-colors border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.retakeQuiz}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyPage;
