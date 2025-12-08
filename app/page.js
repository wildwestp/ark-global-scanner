'use client';
import React, { useState, useCallback, useMemo } from 'react';

// Comprehensive icon system
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    loader: <path d="M12 2v4m0 12v4m-8-10H2m20 0h-2m-2.93-6.36l-1.41 1.41m-9.9 9.9l-1.41 1.41m0-12.73l1.41 1.41m9.9 9.9l1.41 1.41" />,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    gift: <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>,
    sparkles: <path d="M12 3v18M5.5 8.5l13 7M5.5 15.5l13-7" />,
    trendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronUp: <polyline points="18 15 12 9 6 15" />,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    barChart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    dollarSign: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
    calculator: <><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="16" y2="18" /></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    award: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    messageSquare: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    truck: <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    brain: <><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" /><path d="M16 8V5c0-1.1.9-2 2-2" /><path d="M12 13h4" /><path d="M12 18h6a2 2 0 0 1 2 2v1" /><path d="M12 8h8" /><path d="M20.5 8a.5 .5 0 1 1-1 0 .5 .5 0 0 1 1 0Z" /></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></>,
    lightbulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
    timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="m5 3 14 0" /><path d="m9 1 0 2" /><path d="m15 1 0 2" /></>,
    percent: <><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>,
    store: <><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></>,
    bug: <><rect width="8" height="14" x="8" y="6" rx="4" /><path d="m19 7-3 2" /><path d="m5 7 3 2" /><path d="m19 19-3-2" /><path d="m5 19 3-2" /><path d="M20 13h-4" /><path d="M4 13h4" /><path d="m10 4 1 2" /><path d="m14 4-1 2" /></>,
    code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
    trendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

export default function ArkBundleHubV4() {
  const ADMIN_PASSWORD = 'Ark2024Global!';
  
  // Auth state
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  
  // Main state
  const [activeTab, setActiveTab] = useState('discover');
  const [products, setProducts] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [saved, setSaved] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [savedBundles, setSavedBundles] = useState([]);
  const [bundleName, setBundleName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(null);
  
  // V4.0 Phase 1 New Features
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showRetailStock, setShowRetailStock] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalSearches: 0,
    productsFound: 0,
    avgValidationScore: 0,
    topCategory: ''
  });
  
  // V4.3 Phase 2 Lite Features
  const [bundleSuggestions, setBundleSuggestions] = useState([]);
  const [showBundleAI, setShowBundleAI] = useState(false);
  
  // Calculator state
  const [calc, setCalc] = useState({
    cost: 10,
    sellPrice: 30,
    weight: 1,
    size: 'standard',
    ppcBudget: 300,
  });
  
  // Competitor tracking
  const [newAsin, setNewAsin] = useState('');
  
  // Notification
  const [notif, setNotif] = useState(null);
  const notify = (m, t = 'ok') => {
    setNotif({ m, t });
    setTimeout(() => setNotif(null), 3000);
  };

  // V4.0 Debug Logger
  const addDebugLog = useCallback((type, message, data = null) => {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      type, // 'info', 'success', 'error', 'warning'
      message,
      data
    };
    setDebugLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
    console.log(`[${type.toUpperCase()}] ${message}`, data || '');
  }, []);

  const categories = [
    { id: 'trending', name: '🔥 Trending', searches: ['TikTok viral products right now', 'Amazon movers shakers today', 'trending products this month'] },
    { id: 'kitchen', name: '🍳 Kitchen', searches: ['kitchen gadgets TikTok viral now', 'cooking accessories trending this week', 'viral kitchen organization'] },
    { id: 'home', name: '🏠 Home', searches: ['home organization TikTok trending', 'storage solutions viral now', 'home decor trending this month'] },
    { id: 'cleaning', name: '🧹 Cleaning', searches: ['cleaning products TikTok viral now', 'viral cleaning gadgets this week', 'cleaning hacks products trending'] },
    { id: 'beauty', name: '💄 Beauty', searches: ['beauty tools TikTok viral this month', 'skincare gadgets trending now', 'viral makeup accessories'] },
    { id: 'tech', name: '📱 Tech', searches: ['tech gadgets TikTok viral now', 'phone accessories trending this week', 'viral desk gadgets'] },
    { id: 'pets', name: '🐕 Pets', searches: ['pet products TikTok viral now', 'dog accessories trending today', 'viral pet gadgets'] },
    { id: 'fitness', name: '💪 Fitness', searches: ['fitness gadgets TikTok trending', 'workout accessories viral now', 'trending gym equipment'] },
  ];

  // FBA Fee Calculator
  const calculateFBA = useCallback(() => {
    const { cost, sellPrice, weight, size, ppcBudget } = calc;
    
    // FBA fees (simplified calculation)
    const referralFee = sellPrice * 0.15; // 15% Amazon referral
    const fbaFee = size === 'standard' ? (weight < 1 ? 3.22 : 3.22 + (weight - 1) * 0.50) : 
                    (weight < 1 ? 4.75 : 4.75 + (weight - 1) * 0.80);
    const storageFee = 0.75; // Monthly per unit
    
    const totalFees = referralFee + fbaFee + storageFee;
    const profit = sellPrice - cost - totalFees;
    const margin = ((profit / sellPrice) * 100).toFixed(1);
    const roi = ((profit / cost) * 100).toFixed(0);
    
    // Break-even calculation
    const breakEvenUnits = Math.ceil(ppcBudget / profit);
    const monthlyProfit = (profit * 300).toFixed(0); // Assuming 300 units/mo
    const yearlyProfit = (profit * 3600).toFixed(0);
    
    return {
      referralFee: referralFee.toFixed(2),
      fbaFee: fbaFee.toFixed(2),
      storageFee: storageFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      profit: profit.toFixed(2),
      margin,
      roi,
      breakEvenUnits,
      monthlyProfit,
      yearlyProfit
    };
  }, [calc]);

  // Product Validation Score - MUST BE DEFINED FIRST
  const getValidationScore = (product) => {
    let score = 0;
    const reasons = [];
    
    // Demand check (BSR)
    if (product.bsr?.rank) {
      if (product.bsr.rank < 5000) { score += 25; reasons.push('Excellent demand (BSR < 5000)'); }
      else if (product.bsr.rank < 15000) { score += 20; reasons.push('Good demand (BSR < 15000)'); }
      else if (product.bsr.rank < 50000) { score += 15; reasons.push('Moderate demand (BSR < 50000)'); }
      else { score += 5; reasons.push('Lower demand (BSR > 50000)'); }
    }
    
    // Competition check
    if (product.competition?.level === 'Low') { score += 25; reasons.push('Low competition'); }
    else if (product.competition?.level === 'Medium') { score += 15; reasons.push('Medium competition'); }
    else { score += 5; reasons.push('High competition'); }
    
    // Profitability check
    if (product.price?.margin > 60) { score += 25; reasons.push('High margins (>60%)'); }
    else if (product.price?.margin > 40) { score += 20; reasons.push('Good margins (>40%)'); }
    else if (product.price?.margin > 25) { score += 10; reasons.push('Acceptable margins (>25%)'); }
    
    // Trend check
    if (product.bsr?.trend === 'Rising') { score += 15; reasons.push('Rising trend'); }
    else if (product.bsr?.trend === 'Stable') { score += 10; reasons.push('Stable trend'); }
    
    // Reviews check
    if (product.reviews?.rating >= 4.5) { score += 10; reasons.push('Excellent reviews (4.5+)'); }
    else if (product.reviews?.rating >= 4.0) { score += 5; reasons.push('Good reviews (4.0+)'); }
    
    // Rating
    let rating = 'Poor';
    let color = 'red';
    if (score >= 80) { rating = 'Excellent'; color = 'green'; }
    else if (score >= 60) { rating = 'Good'; color = 'blue'; }
    else if (score >= 40) { rating = 'Fair'; color = 'yellow'; }
    
    return { score, rating, color, reasons };
  };

  // V4.0 NEW: Trend Prediction AI
  const predictTrend = useCallback((product) => {
    const bsr = product.bsr?.rank || 50000;
    const reviews = product.reviews?.count || 0;
    const viral = product.viral?.score || 0;
    
    let prediction = 'Stable';
    let confidence = 50;
    let bestTimeToLaunch = 'Now';
    let window = 90; // days
    
    // Rising indicators
    if (viral > 75 && bsr < 10000) {
      prediction = 'Rising Fast';
      confidence = 85;
      bestTimeToLaunch = 'Immediately';
      window = 30;
    } else if (bsr < 20000 && reviews < 500) {
      prediction = 'Rising';
      confidence = 70;
      bestTimeToLaunch = 'Within 2 weeks';
      window = 45;
    } else if (bsr > 100000 || viral < 30) {
      prediction = 'Falling';
      confidence = 60;
      bestTimeToLaunch = 'Not recommended';
      window = 0;
    }
    
    return { prediction, confidence, bestTimeToLaunch, window };
  }, []);

  // V4.0 NEW: Market Saturation Analyzer
  const analyzeSaturation = useCallback((product) => {
    const sellers = product.competition?.sellers || 50;
    const bsr = product.bsr?.rank || 50000;
    
    let saturation = 0;
    let level = 'Low';
    let recommendation = '';
    
    if (sellers < 20 && bsr < 15000) {
      saturation = 15;
      level = 'Blue Ocean';
      recommendation = 'Excellent opportunity! Low competition with high demand.';
    } else if (sellers < 50 && bsr < 30000) {
      saturation = 35;
      level = 'Low';
      recommendation = 'Good opportunity. Manageable competition.';
    } else if (sellers < 100) {
      saturation = 60;
      level = 'Medium';
      recommendation = 'Moderate competition. Differentiation needed.';
    } else {
      saturation = 85;
      level = 'High';
      recommendation = 'Saturated market. Only enter with unique angle.';
    }
    
    return { saturation, level, recommendation };
  }, []);

  // V4.0 NEW: Launch Success Predictor
  const predictLaunchSuccess = useCallback((product) => {
    const validation = getValidationScore(product);
    const trend = predictTrend(product);
    const saturation = analyzeSaturation(product);
    
    let probability = 50;
    let risk = 'Medium';
    let requiredInventory = 100;
    let timeToProfit = 90; // days
    
    // Calculate success probability
    probability = (
      (validation.score * 0.4) +
      (trend.confidence * 0.3) +
      ((100 - saturation.saturation) * 0.3)
    );
    
    if (probability >= 75) {
      risk = 'Low';
      requiredInventory = 150;
      timeToProfit = 45;
    } else if (probability >= 60) {
      risk = 'Medium';
      requiredInventory = 100;
      timeToProfit = 60;
    } else {
      risk = 'High';
      requiredInventory = 50;
      timeToProfit = 120;
    }
    
    return {
      probability: Math.round(probability),
      risk,
      requiredInventory,
      timeToProfit,
      recommendedPPC: Math.round(requiredInventory * (product.price?.cost || 10) * 0.3)
    };
  }, []);

  // V4.0 NEW: Australian Retail Stock Checker (simulated - would use real APIs in production)
  const checkAustralianRetail = useCallback(async (productName) => {
    addDebugLog('info', 'Checking AU retail stock', { productName });
    
    // Simulated retail check - in production, would call Target/Kmart/BigW APIs
    const retailers = [
      { name: 'Target AU', url: 'https://www.target.com.au' },
      { name: 'Kmart', url: 'https://www.kmart.com.au' },
      { name: 'Big W', url: 'https://www.bigw.com.au' }
    ];
    
    const stock = {};
    
    retailers.forEach(retailer => {
      const hasStock = Math.random() > 0.4; // 60% chance of stock
      const price = hasStock ? (Math.random() * 30 + 10).toFixed(2) : null;
      const stockLevel = hasStock ? ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] : 'Out of Stock';
      
      stock[retailer.name] = {
        available: hasStock,
        price,
        stockLevel,
        trending: hasStock && Math.random() > 0.7, // 30% chance of trending
        url: retailer.url
      };
    });
    
    addDebugLog('success', 'AU retail check complete', stock);
    return stock;
  }, [addDebugLog]);

  // Enhanced AI Search Function with V4.0 features
  const scan = useCallback(async (searchQuery = '', categoryData = null) => {
    if (scanning) return;
    
    const startTime = Date.now();
    setScanning(true);
    setError('');
    setProducts([]);
    
    const cat = categoryData || categories[0];
    setStatus(`🔍 Searching TikTok, Instagram, Amazon & AU Retail...`);
    addDebugLog('info', 'Search started', { category: cat.name, query: searchQuery });

    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' });
    const currentYear = now.getFullYear();

    try {
      addDebugLog('info', 'Calling AI API...', { model: 'claude-sonnet-4' });
      
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Amazon FBA product research for ${cat.name.replace(/🔥|🍳|🏠|🧹|💄|📱|🐕|💪/g, '').trim()} ${searchQuery || ''} (${currentMonth} ${currentYear})

Use web_search to find 8 trending products from TikTok, Amazon Best Sellers, AU retail.

Return ONLY JSON array (no markdown):
[{"name":"Product","category":"${cat.name}","emoji":"📦","desc":"trending reason","asin":"B08XXX","price":{"cost":8,"sell":25,"margin":68,"roi":213},"bsr":{"rank":3500,"category":"Category","monthlySales":600},"reviews":{"count":850,"rating":4.4},"competition":{"sellers":42,"level":"Medium"},"viral":{"score":84,"platform":"TikTok","reason":"reason","views":"3M"},"trend":{"direction":"Rising","velocity":"Fast"},"suppliers":{"alibaba":7.5,"cj":8.2},"profitability":{"breakeven":35,"monthly":2100,"yearly":25200}}]`
        })
      });

      addDebugLog('success', 'API response received', { status: res.status });

      const data = await res.json();
      
      if (data.error) {
        addDebugLog('error', 'API returned error', data.error);
        throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      }
      
      let txt = '';
      if (data.content) {
        for (const block of data.content) {
          if (block.type === 'text') txt += block.text;
        }
      }

      addDebugLog('info', 'Extracted response text', { length: txt.length, preview: txt.substring(0, 150) });

      let productArray = null;
      
      const startIdx = txt.indexOf('[');
      const endIdx = txt.lastIndexOf(']');
      
      addDebugLog('info', 'JSON search', { startIdx, endIdx, found: startIdx !== -1 && endIdx !== -1 });
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const jsonStr = txt.substring(startIdx, endIdx + 1);
        
        try {
          productArray = JSON.parse(jsonStr);
          addDebugLog('success', 'JSON parsed successfully', { count: productArray?.length });
          
          if (!Array.isArray(productArray) || productArray.length === 0 || !productArray[0].name) {
            addDebugLog('warning', 'Invalid product array structure');
            productArray = null;
          }
        } catch (e) {
          addDebugLog('error', 'JSON parse failed', e.message);
        }
      } else {
        addDebugLog('error', 'No JSON array found in response');
      }

      if (productArray && productArray.length > 0) {
        const prods = productArray.map((p, i) => ({
          ...p,
          id: `p-${Date.now()}-${i}`,
          price: p.price || { cost: 10, sell: 30, margin: 67, roi: 200 },
          viral: p.viral || { score: 75, platform: 'TikTok' },
          market: p.market || { urgency: 'Medium' },
          bsr: p.bsr || { rank: 25000 },
          reviews: p.reviews || { count: 0, rating: 0 },
          competition: p.competition || { level: 'Medium', sellers: 50 },
          trend: p.trend || { direction: 'Stable' },
        }));
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        setProducts(prods);
        
        // Update dashboard stats
        setDashboardStats(prev => ({
          totalSearches: prev.totalSearches + 1,
          productsFound: prev.productsFound + prods.length,
          avgValidationScore: Math.round(prods.reduce((sum, p) => sum + getValidationScore(p).score, 0) / prods.length),
          topCategory: cat.name
        }));
        
        addDebugLog('success', `Found ${prods.length} products in ${duration}s`, { duration, count: prods.length });
        notify(`Found ${prods.length} products!`);
      } else {
        addDebugLog('error', 'No valid products in response');
        throw new Error('AI returned no products. Try different category or search term.');
      }
    } catch (err) {
      addDebugLog('error', 'Search failed', err.message);
      setError(err.message || 'Search failed - check debug panel');
      notify(err.message?.substring(0, 50) || 'Search failed', 'err');
    } finally {
      setScanning(false);
      setStatus('');
    }
  }, [scanning, categories, notify, addDebugLog, getValidationScore]);

  // Add competitor
  const addCompetitor = useCallback(() => {
    if (!newAsin.trim()) return;
    const comp = {
      id: Date.now(),
      asin: newAsin.trim(),
      name: `Product ${newAsin.substring(0, 8)}`,
      addedDate: new Date().toLocaleDateString(),
      price: (Math.random() * 30 + 10).toFixed(2),
      bsr: Math.floor(Math.random() * 50000 + 1000),
      reviews: Math.floor(Math.random() * 2000 + 100),
      rating: (Math.random() * 1 + 4).toFixed(1),
    };
    setCompetitors(prev => [comp, ...prev]);
    setNewAsin('');
    addDebugLog('success', 'Competitor added', { asin: comp.asin });
    notify('Competitor added!');
  }, [newAsin, notify, addDebugLog]);

  const removeCompetitor = useCallback((id) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    addDebugLog('info', 'Competitor removed');
    notify('Competitor removed');
  }, [notify, addDebugLog]);

  // Toggle save/bundle
  const toggleSave = useCallback((p) => {
    setSaved(prev => {
      const exists = prev.find(s => s.id === p.id);
      if (exists) {
        addDebugLog('info', 'Product unsaved', { name: p.name });
        return prev.filter(s => s.id !== p.id);
      } else {
        addDebugLog('success', 'Product saved', { name: p.name });
        return [...prev, p];
      }
    });
  }, [addDebugLog]);

  const isSaved = useCallback((id) => saved.some(s => s.id === id), [saved]);

  const toggleBundle = useCallback((p) => {
    setBundles(prev => {
      const exists = prev.find(b => b.id === p.id);
      if (exists) {
        addDebugLog('info', 'Product removed from bundle', { name: p.name });
        return prev.filter(b => b.id !== p.id);
      } else {
        addDebugLog('success', 'Product added to bundle', { name: p.name });
        return [...prev, p];
      }
    });
  }, [addDebugLog]);

  const inBundle = useCallback((id) => bundles.some(b => b.id === id), [bundles]);

  const saveCurrentBundle = useCallback(() => {
    if (bundles.length === 0) {
      notify('Add products to bundle first!', 'err');
      return;
    }
    const name = bundleName.trim() || `Bundle ${savedBundles.length + 1}`;
    const newBundle = {
      id: Date.now(),
      name,
      products: [...bundles],
      created: new Date().toLocaleDateString(),
      totalCost: bundles.reduce((sum, p) => sum + (p.price?.cost || 0), 0),
      bundlePrice: bundles.reduce((sum, p) => sum + (p.price?.sell || 0), 0) * 0.8,
    };
    setSavedBundles(prev => [...prev, newBundle]);
    setBundles([]);
    setBundleName('');
    addDebugLog('success', 'Bundle saved', { name, items: bundles.length });
    notify(`Bundle "${name}" saved!`);
  }, [bundles, bundleName, savedBundles.length, notify, addDebugLog]);

  const deleteSavedBundle = useCallback((id) => {
    setSavedBundles(prev => prev.filter(b => b.id !== id));
    addDebugLog('info', 'Bundle deleted');
    notify('Bundle deleted');
  }, [notify, addDebugLog]);

  const loadBundle = useCallback((bundle) => {
    setBundles(bundle.products);
    addDebugLog('success', 'Bundle loaded', { name: bundle.name });
    notify(`Loaded "${bundle.name}"`);
  }, [notify, addDebugLog]);

  // Export functions
  const exportCSV = useCallback(() => {
    const csv = [
      ['Name', 'Category', 'Cost', 'Sell', 'Margin', 'ROI', 'BSR', 'Reviews', 'Competition', 'Score'].join(','),
      ...products.map(p => {
        const validation = getValidationScore(p);
        return [
          p.name,
          p.category,
          p.price?.cost || 0,
          p.price?.sell || 0,
          p.price?.margin || 0,
          p.price?.roi || 0,
          p.bsr?.rank || 'N/A',
          p.reviews?.count || 0,
          p.competition?.level || 'N/A',
          validation.score
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ark-products-v4-${Date.now()}.csv`;
    a.click();
    addDebugLog('success', 'CSV exported', { products: products.length });
    notify('CSV exported!');
  }, [products, notify, addDebugLog]);

  // V4.0 Export debug logs
  const exportDebugLogs = useCallback(() => {
    const logsText = debugLogs.map(log => 
      `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}${log.data ? '\n  Data: ' + JSON.stringify(log.data, null, 2) : ''}`
    ).join('\n\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ark-debug-logs-${Date.now()}.txt`;
    a.click();
    notify('Debug logs exported!');
  }, [debugLogs, notify]);

  // ========== V4.3 PHASE 2 LITE FEATURES ==========
  
  // Simple Bundle AI - finds complementary products
  const suggestBundles = useCallback(() => {
    if (products.length < 2) {
      notify('Need at least 2 products to suggest bundles!', 'err');
      return;
    }
    
    const suggestions = [];
    
    // Simple algorithm: match by category and price range
    for (let i = 0; i < products.length && suggestions.length < 5; i++) {
      for (let j = i + 1; j < products.length && suggestions.length < 5; j++) {
        const p1 = products[i];
        const p2 = products[j];
        
        // Check if compatible
        const sameCat = p1.category === p2.category;
        const priceMatch = Math.abs((p1.price?.sell || 0) - (p2.price?.sell || 0)) < 15;
        const validation1 = getValidationScore(p1);
        const validation2 = getValidationScore(p2);
        const bothGood = validation1.score >= 60 && validation2.score >= 60;
        
        if (sameCat && priceMatch && bothGood) {
          const bundleCost = (p1.price?.cost || 0) + (p2.price?.cost || 0);
          const bundlePrice = ((p1.price?.sell || 0) + (p2.price?.sell || 0)) * 0.85;
          const profit = bundlePrice - bundleCost;
          const margin = ((profit / bundlePrice) * 100).toFixed(1);
          
          suggestions.push({
            id: `bundle-${i}-${j}`,
            products: [p1, p2],
            bundleCost: bundleCost.toFixed(2),
            bundlePrice: bundlePrice.toFixed(2),
            profit: profit.toFixed(2),
            margin,
            score: Math.min(validation1.score, validation2.score)
          });
        }
      }
    }
    
    setBundleSuggestions(suggestions);
    setShowBundleAI(true);
    addDebugLog('success', 'Bundle AI generated suggestions', { count: suggestions.length });
    notify(`Found ${suggestions.length} bundle opportunities!`);
  }, [products, notify, addDebugLog]);

  // Login screen
  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl mb-6 animate-pulse">
              <Icon name="brain" size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Ark Bundle Hub</h1>
            <p className="text-purple-300 font-bold">V4.3 Lite - Bundle AI Edition</p>
            <p className="text-purple-400 text-sm mt-2">🇦🇺 AU Retail • AI Predictions • Advanced Analytics</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
            <div className="space-y-4">
              <div className="relative">
                <Icon name="lock" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASSWORD && setAuth(true)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400"
                  placeholder="Enter password"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name={showPw ? 'eyeOff' : 'eye'} size={20} />
                </button>
              </div>
              <button
                onClick={() => pw === ADMIN_PASSWORD ? setAuth(true) : notify('Invalid password', 'err')}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white font-bold rounded-xl text-lg"
              >
                Access V4.3 Lite
              </button>
            </div>
          </div>
          <div className="mt-6 text-center text-purple-300 text-sm">
            <p className="mb-2">✨ New in V4.0 Phase 1:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2">🏪 AU Retail Stock</div>
              <div className="bg-white/5 rounded-lg p-2">📈 Trend Predictions</div>
              <div className="bg-white/5 rounded-lg p-2">🎯 Saturation AI</div>
              <div className="bg-white/5 rounded-lg p-2">🐛 Debug Panel</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calcResults = calculateFBA();

  // Main Dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      {notif && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-white ${notif.t === 'err' ? 'bg-red-500' : 'bg-green-500'}`}>
          <Icon name="check" size={20} />
          {notif.m}
          <button onClick={() => setNotif(null)}><Icon name="x" size={18} /></button>
        </div>
      )}

      {/* V4.0 Debug Panel Toggle Button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 right-4 z-50 p-4 bg-slate-800 text-white rounded-full shadow-2xl hover:bg-slate-700 transition-all hover:scale-110"
        title="Toggle Debug Panel"
      >
        <Icon name={showDebug ? 'code' : 'bug'} size={24} />
      </button>

      {/* V4.0 Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-20 right-4 w-96 max-h-96 bg-slate-900 text-white rounded-2xl shadow-2xl z-40 overflow-hidden flex flex-col animate-slide-in">
          <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Icon name="bug" size={20} className="text-green-400" />
              <h3 className="font-bold">Debug Panel</h3>
              <span className="text-xs text-slate-400">({debugLogs.length} logs)</span>
            </div>
            <div className="flex gap-2">
              <button onClick={exportDebugLogs} className="p-2 hover:bg-slate-700 rounded transition-all" title="Export logs">
                <Icon name="download" size={16} />
              </button>
              <button onClick={() => setDebugLogs([])} className="p-2 hover:bg-slate-700 rounded transition-all" title="Clear logs">
                <Icon name="x" size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs font-mono">
            {debugLogs.length === 0 ? (
              <div className="text-slate-500 text-center py-8">No logs yet. Start searching!</div>
            ) : (
              debugLogs.map(log => (
                <div key={log.id} className={`p-2 rounded transition-all ${
                  log.type === 'error' ? 'bg-red-900/50 border-l-2 border-red-500' :
                  log.type === 'success' ? 'bg-green-900/50 border-l-2 border-green-500' :
                  log.type === 'warning' ? 'bg-yellow-900/50 border-l-2 border-yellow-500' :
                  'bg-slate-800/50 border-l-2 border-blue-500'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-400">{log.timestamp}</span>
                    <span className={`font-bold text-xs ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>{log.type.toUpperCase()}</span>
                  </div>
                  <div className="text-white text-xs">{log.message}</div>
                  {log.data && (
                    <details className="mt-1">
                      <summary className="text-slate-400 text-xs cursor-pointer hover:text-slate-300">View data</summary>
                      <div className="mt-1 text-slate-400 text-xs overflow-x-auto bg-slate-950 p-2 rounded">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white px-5 py-2 rounded-xl font-black text-xl shadow-lg">
                <Icon name="brain" size={28} /> ARK
              </div>
              <div>
                <p className="font-bold text-lg">V4.3 Lite Edition</p>
                <p className="text-sm text-purple-300">🇦🇺 AU Retail • AI Predictions • v4.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <div className="text-purple-300">Searches: {dashboardStats.totalSearches}</div>
                <div className="text-purple-300">Found: {dashboardStats.productsFound}</div>
              </div>
              <button onClick={() => setAuth(false)} className="p-3 rounded-xl bg-white/10 hover:bg-red-500 transition-all">
                <Icon name="lock" size={20} />
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('discover')} className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === 'discover' ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/80'}`}>
              <Icon name="search" size={18} /> Discover
            </button>
            <button onClick={() => setActiveTab('calculator')} className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/80'}`}>
              <Icon name="calculator" size={18} /> Profit Calc
            </button>
            <button onClick={() => setActiveTab('competitors')} className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === 'competitors' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/80'}`}>
              <Icon name="target" size={18} /> Competitors
            </button>
            <button onClick={() => setActiveTab('saved')} className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === 'saved' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/80'}`}>
              <Icon name="bookmark" size={18} /> Saved ({saved.length})
            </button>
            <button onClick={() => setActiveTab('bundles')} className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeTab === 'bundles' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80'}`}>
              <Icon name="layers" size={18} /> Bundles ({savedBundles.length})
            </button>
          </div>
        </div>
      </header>

      {status && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 font-medium flex items-center gap-3 justify-center shadow-lg animate-pulse">
          <Icon name="loader" size={20} className="animate-spin" />
          <span>{status}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* DISCOVER TAB */}
        {activeTab === 'discover' && (
          <div>
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Icon name="search" size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && scan(searchTerm)}
                    placeholder="Search for products..."
                    className="w-full pl-14 pr-4 py-4 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 border-2 border-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
                <button
                  onClick={() => scan(searchTerm)}
                  disabled={scanning}
                  className="px-10 py-4 bg-gradient-to-r from-amber-400 to-red-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-3"
                >
                  {scanning ? <Icon name="loader" size={24} className="animate-spin" /> : <Icon name="search" size={24} />}
                  {scanning ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.id); scan('', c); }}
                    disabled={scanning}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap ${selectedCategory === c.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* V4.3 Bundle AI Button */}
            {products.length >= 2 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="brain" size={32} className="text-white" />
                    <div>
                      <h3 className="text-white font-bold text-lg">Bundle AI Suggester</h3>
                      <p className="text-purple-100 text-sm">Find profitable 2-pack combinations</p>
                    </div>
                  </div>
                  <button
                    onClick={suggestBundles}
                    className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2"
                  >
                    <Icon name="sparkles" size={20} />
                    Suggest Bundles
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-red-700">
                <div className="flex items-center gap-2">
                  <Icon name="alert" size={20} />
                  {error}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {products.length === 0 && !scanning && !error && (
              <div className="text-center py-20">
                <Icon name="gift" size={64} className="mx-auto text-amber-400 mb-4" />
                <p className="text-slate-500 text-lg">Select a category or search to find products</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => {
                const validation = getValidationScore(p);
                const isExpanded = expanded === p.id;
                return (
                  <div key={p.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Validation Score Bar */}
                    <div className={`h-2 bg-gradient-to-r ${validation.color === 'green' ? 'from-green-500 to-emerald-500' : validation.color === 'blue' ? 'from-blue-500 to-cyan-500' : validation.color === 'yellow' ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500'}`} />
                    
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-3xl">{p.emoji || '📦'}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{p.category}</span>
                            {/* V4.0 Trend Arrow */}
                            {p.trend?.direction && (
                              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-bold ${
                                p.trend.direction === 'Rising' ? 'bg-green-100 text-green-700' :
                                p.trend.direction === 'Falling' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {p.trend.direction === 'Rising' ? '↗️' : p.trend.direction === 'Falling' ? '↘️' : '→'} 
                                {p.trend.direction}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg mb-1">{p.name}</h3>
                          {p.asin && <p className="text-xs text-slate-500">ASIN: {p.asin}</p>}
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-black ${validation.color === 'green' ? 'text-green-600' : validation.color === 'blue' ? 'text-blue-600' : validation.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {validation.score}
                          </div>
                          <div className="text-xs text-slate-500">{validation.rating}</div>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm mb-4">{p.desc}</p>

                      {/* V4.0 Quick Stats with Trend & Success Prediction */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <div className="text-xs text-slate-500">BSR Rank</div>
                          <div className="font-bold text-blue-700">#{(p.bsr?.rank || 0).toLocaleString()}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl">
                          <div className="text-xs text-slate-500">Margin</div>
                          <div className="font-bold text-green-700">{p.price?.margin || 0}%</div>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="mb-4 space-y-3 border-t-2 border-slate-100 pt-4">
                          {/* Pricing Grid */}
                          <div className="bg-slate-50 rounded-xl p-4">
                            <h4 className="font-bold text-slate-700 mb-3 text-sm">💰 Pricing Breakdown</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500">Cost:</span>
                                <span className="font-bold text-slate-800 ml-2">${p.price?.cost || 0}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Sell:</span>
                                <span className="font-bold text-green-600 ml-2">${p.price?.sell || 0}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Margin:</span>
                                <span className="font-bold text-blue-600 ml-2">{p.price?.margin || 0}%</span>
                              </div>
                              <div>
                                <span className="text-slate-500">ROI:</span>
                                <span className="font-bold text-purple-600 ml-2">{p.price?.roi || 0}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Competition & Reviews */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-orange-50 rounded-xl p-3">
                              <div className="text-xs text-slate-500">Competition</div>
                              <div className={`font-bold text-sm ${p.competition?.level === 'Low' ? 'text-green-600' : p.competition?.level === 'Medium' ? 'text-orange-600' : 'text-red-600'}`}>
                                {p.competition?.level || 'N/A'}
                              </div>
                              <div className="text-xs text-slate-500">{p.competition?.sellers || 0} sellers</div>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-3">
                              <div className="text-xs text-slate-500">Reviews</div>
                              <div className="font-bold text-sm text-yellow-700">⭐ {p.reviews?.rating || 'N/A'}</div>
                              <div className="text-xs text-slate-500">{(p.reviews?.count || 0).toLocaleString()} reviews</div>
                            </div>
                          </div>

                          {/* Suppliers */}
                          {(p.suppliers?.alibaba || p.suppliers?.cj) && (
                            <div className="bg-purple-50 rounded-xl p-3">
                              <h4 className="font-bold text-purple-700 mb-2 text-sm">🏭 Suppliers</h4>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {p.suppliers?.alibaba && (
                                  <div>
                                    <span className="text-slate-600">Alibaba:</span>
                                    <span className="font-bold text-purple-600 ml-1">${p.suppliers.alibaba}</span>
                                  </div>
                                )}
                                {p.suppliers?.cj && (
                                  <div>
                                    <span className="text-slate-600">CJ:</span>
                                    <span className="font-bold text-purple-600 ml-1">${p.suppliers.cj}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Profitability */}
                          {p.profitability && (
                            <div className="bg-green-50 rounded-xl p-3">
                              <h4 className="font-bold text-green-700 mb-2 text-sm">📊 Profit Potential</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Break-even:</span>
                                  <span className="font-bold">{p.profitability.breakeven} units</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Monthly:</span>
                                  <span className="font-bold text-green-600">${p.profitability.monthly?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Yearly:</span>
                                  <span className="font-bold text-green-700">${p.profitability.yearly?.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Quick Links */}
                          <div className="flex gap-2">
                            {p.asin && (
                              <a href={`https://amazon.com/dp/${p.asin}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 bg-orange-500 text-white text-xs font-bold rounded-lg text-center hover:bg-orange-600">
                                View on Amazon
                              </a>
                            )}
                            <a href={`https://alibaba.com/trade/search?SearchText=${encodeURIComponent(p.name)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 bg-blue-500 text-white text-xs font-bold rounded-lg text-center hover:bg-blue-600">
                              Find Supplier
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Expand Button */}
                      <button 
                        onClick={() => setExpanded(isExpanded ? null : p.id)}
                        className="w-full py-2 mb-3 text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
                      >
                        {isExpanded ? (
                          <>Less Details <Icon name="chevronUp" size={14} /></>
                        ) : (
                          <>More Details <Icon name="chevronDown" size={14} /></>
                        )}
                      </button>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button onClick={() => toggleBundle(p)} className={`flex-1 py-3 rounded-xl font-bold ${inBundle(p.id) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {inBundle(p.id) ? '✓ Added' : '+ Bundle'}
                        </button>
                        <button onClick={() => toggleSave(p)} className={`p-3 rounded-xl ${isSaved(p.id) ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon name="bookmark" size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {products.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button onClick={exportCSV} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2">
                  <Icon name="download" size={20} />
                  Export to CSV
                </button>
              </div>
            )}
          </div>
        )}

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Icon name="calculator" size={32} className="text-blue-600" />
                Advanced FBA Profit Calculator
              </h2>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product Cost ($)</label>
                  <input
                    type="number"
                    value={calc.cost}
                    onChange={e => setCalc({...calc, cost: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sell Price ($)</label>
                  <input
                    type="number"
                    value={calc.sellPrice}
                    onChange={e => setCalc({...calc, sellPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={calc.weight}
                    onChange={e => setCalc({...calc, weight: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Size Tier</label>
                  <select
                    value={calc.size}
                    onChange={e => setCalc({...calc, size: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="oversize">Oversize</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">PPC Launch Budget ($)</label>
                  <input
                    type="number"
                    value={calc.ppcBudget}
                    onChange={e => setCalc({...calc, ppcBudget: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Calculation Results</h3>
                
                {/* Fee Breakdown */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-bold text-slate-700 mb-4">Fee Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amazon Referral (15%)</span>
                      <span className="font-bold text-slate-800">${calcResults.referralFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">FBA Fulfillment</span>
                      <span className="font-bold text-slate-800">${calcResults.fbaFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Monthly Storage</span>
                      <span className="font-bold text-slate-800">${calcResults.storageFee}</span>
                    </div>
                    <div className="border-t-2 border-slate-200 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-slate-700">Total Fees</span>
                      <span className="font-bold text-red-600">${calcResults.totalFees}</span>
                    </div>
                  </div>
                </div>

                {/* Profitability */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="text-sm text-green-600 mb-1">Net Profit/Unit</div>
                    <div className="text-3xl font-black text-green-700">${calcResults.profit}</div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="text-sm text-blue-600 mb-1">Profit Margin</div>
                    <div className="text-3xl font-black text-blue-700">{calcResults.margin}%</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="text-sm text-purple-600 mb-1">ROI</div>
                    <div className="text-3xl font-black text-purple-700">{calcResults.roi}%</div>
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <h4 className="font-bold text-orange-700 mb-4">Revenue Projections</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Break-Even Units (PPC budget)</span>
                      <span className="text-2xl font-black text-orange-600">{calcResults.breakEvenUnits} units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Monthly Profit (300 units)</span>
                      <span className="text-2xl font-black text-green-600">${calcResults.monthlyProfit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Yearly Profit (3,600 units)</span>
                      <span className="text-2xl font-black text-green-600">${calcResults.yearlyProfit}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`border-2 rounded-xl p-6 ${parseFloat(calcResults.margin) > 40 ? 'bg-green-50 border-green-200' : parseFloat(calcResults.margin) > 25 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="award" size={24} className={parseFloat(calcResults.margin) > 40 ? 'text-green-600' : parseFloat(calcResults.margin) > 25 ? 'text-yellow-600' : 'text-red-600'} />
                    <h4 className="font-bold text-lg">Recommendation</h4>
                  </div>
                  <p className={`${parseFloat(calcResults.margin) > 40 ? 'text-green-700' : parseFloat(calcResults.margin) > 25 ? 'text-yellow-700' : 'text-red-700'}`}>
                    {parseFloat(calcResults.margin) > 40 ? '✅ Excellent margins! This product has strong profit potential.' : 
                     parseFloat(calcResults.margin) > 25 ? '⚠️ Acceptable margins. Consider negotiating better supplier pricing.' :
                     '❌ Low margins. This product may not be profitable after PPC costs.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPETITORS TAB */}
        {activeTab === 'competitors' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Icon name="target" size={32} className="text-red-600" />
                Competitor Tracker
              </h2>

              {/* Add Competitor */}
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-slate-700 mb-4">Add Competitor ASIN</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAsin}
                    onChange={e => setNewAsin(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCompetitor()}
                    placeholder="Enter ASIN (e.g., B08XYZ123)"
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none"
                  />
                  <button onClick={addCompetitor} className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">
                    <Icon name="plus" size={20} />
                  </button>
                </div>
              </div>

              {/* Competitors List */}
              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="target" size={64} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">No competitors tracked yet. Add an ASIN above to start monitoring.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {competitors.map(comp => (
                    <div key={comp.id} className="bg-slate-50 rounded-xl p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 mb-1">{comp.name}</h4>
                        <p className="text-sm text-slate-500 mb-3">ASIN: {comp.asin} • Added: {comp.addedDate}</p>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-slate-500">Price</div>
                            <div className="font-bold text-green-600">${comp.price}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">BSR</div>
                            <div className="font-bold text-blue-600">#{comp.bsr.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Reviews</div>
                            <div className="font-bold text-purple-600">{comp.reviews}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Rating</div>
                            <div className="font-bold text-orange-600">⭐ {comp.rating}</div>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeCompetitor(comp.id)} className="ml-4 p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200">
                        <Icon name="x" size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Icon name="bookmark" size={32} className="text-purple-600" />
                Saved Products ({saved.length})
              </h2>
            </div>

            {saved.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="bookmark" size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No saved products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map(p => {
                  const validation = getValidationScore(p);
                  const isExpanded = expanded === p.id;
                  
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Validation Score Bar */}
                      <div className={`h-2 bg-gradient-to-r ${validation.color === 'green' ? 'from-green-500 to-emerald-500' : validation.color === 'blue' ? 'from-blue-500 to-cyan-500' : validation.color === 'yellow' ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500'}`} />
                      
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-3xl">{p.emoji || '📦'}</span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">{p.category}</span>
                              {p.trend?.direction && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-bold ${
                                  p.trend.direction === 'Rising' ? 'bg-green-100 text-green-700' :
                                  p.trend.direction === 'Falling' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {p.trend.direction === 'Rising' ? '↗️' : p.trend.direction === 'Falling' ? '↘️' : '→'} 
                                  {p.trend.direction}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{p.name}</h3>
                            {p.asin && <p className="text-xs text-slate-500">ASIN: {p.asin}</p>}
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-black ${validation.color === 'green' ? 'text-green-600' : validation.color === 'blue' ? 'text-blue-600' : validation.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {validation.score}
                            </div>
                            <div className="text-xs text-slate-500">{validation.rating}</div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-4">{p.desc}</p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-blue-50 p-3 rounded-xl">
                            <div className="text-xs text-slate-500">BSR Rank</div>
                            <div className="font-bold text-blue-700">#{(p.bsr?.rank || 0).toLocaleString()}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-xl">
                            <div className="text-xs text-slate-500">Margin</div>
                            <div className="font-bold text-green-700">{p.price?.margin || 0}%</div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="mb-4 space-y-3 border-t-2 border-purple-100 pt-4">
                            {/* Pricing Grid */}
                            <div className="bg-slate-50 rounded-xl p-4">
                              <h4 className="font-bold text-slate-700 mb-3 text-sm">💰 Pricing Breakdown</h4>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-slate-500">Cost:</span> <span className="font-bold text-slate-800 ml-2">${p.price?.cost || 0}</span></div>
                                <div><span className="text-slate-500">Sell:</span> <span className="font-bold text-green-600 ml-2">${p.price?.sell || 0}</span></div>
                                <div><span className="text-slate-500">Margin:</span> <span className="font-bold text-blue-600 ml-2">{p.price?.margin || 0}%</span></div>
                                <div><span className="text-slate-500">ROI:</span> <span className="font-bold text-purple-600 ml-2">{p.price?.roi || 0}%</span></div>
                              </div>
                            </div>

                            {/* Suppliers */}
                            {p.suppliers && (
                              <div className="bg-amber-50 rounded-xl p-4">
                                <h4 className="font-bold text-slate-700 mb-3 text-sm">📦 Supplier Prices</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between"><span className="text-slate-600">Alibaba:</span> <span className="font-bold">${p.suppliers.alibaba || 'N/A'}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">CJ Dropshipping:</span> <span className="font-bold">${p.suppliers.cj || 'N/A'}</span></div>
                                </div>
                              </div>
                            )}

                            {/* Profitability */}
                            {p.profitability && (
                              <div className="bg-green-50 rounded-xl p-4">
                                <h4 className="font-bold text-slate-700 mb-3 text-sm">💵 Profitability</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between"><span className="text-slate-600">Break-even:</span> <span className="font-bold">{p.profitability.breakeven} units</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Monthly:</span> <span className="font-bold text-green-600">${p.profitability.monthly?.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Yearly:</span> <span className="font-bold text-green-700">${p.profitability.yearly?.toLocaleString()}</span></div>
                                </div>
                              </div>
                            )}

                            {/* Competition & Reviews */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-red-50 rounded-xl p-4">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm">👥 Competition</h4>
                                <div className="text-xs space-y-1">
                                  <div><span className="text-slate-600">Sellers:</span> <span className="font-bold ml-1">{p.competition?.sellers || 'N/A'}</span></div>
                                  <div><span className="text-slate-600">Level:</span> <span className="font-bold ml-1">{p.competition?.level || 'N/A'}</span></div>
                                </div>
                              </div>
                              <div className="bg-blue-50 rounded-xl p-4">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm">⭐ Reviews</h4>
                                <div className="text-xs space-y-1">
                                  <div><span className="text-slate-600">Count:</span> <span className="font-bold ml-1">{p.reviews?.count || 0}</span></div>
                                  <div><span className="text-slate-600">Rating:</span> <span className="font-bold ml-1">{p.reviews?.rating || 'N/A'}</span></div>
                                </div>
                              </div>
                            </div>

                            {/* Links */}
                            <div className="flex gap-2 text-xs">
                              {p.asin && (
                                <a href={`https://amazon.com/dp/${p.asin}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-center font-bold hover:bg-amber-600">
                                  View on Amazon
                                </a>
                              )}
                              <a href={`https://alibaba.com/trade/search?SearchText=${encodeURIComponent(p.name)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-center font-bold hover:bg-orange-600">
                                Find on Alibaba
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setExpanded(isExpanded ? null : p.id)} 
                            className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
                          >
                            <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={18} />
                            {isExpanded ? 'Hide Details' : 'View Details'}
                          </button>
                          <button 
                            onClick={() => toggleSave(p)} 
                            className="flex-1 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BUNDLES TAB */}
        {activeTab === 'bundles' && (
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <Icon name="layers" size={32} className="text-green-600" />
                  Bundle Builder
                </h2>
                <div className="text-sm text-slate-500">
                  Current: {bundles.length} items | Saved: {savedBundles.length} bundles
                </div>
              </div>
            </div>

            {/* Current Bundle Being Built */}
            {bundles.length > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-4">
                  <h3 className="text-lg font-bold text-green-800 mb-4">📦 Current Bundle (Unsaved)</h3>
                  
                  {/* Bundle Name Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={bundleName}
                      onChange={e => setBundleName(e.target.value)}
                      placeholder="Enter bundle name (optional)"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none"
                    />
                  </div>

                  {/* Bundle Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Items</div>
                      <div className="text-2xl font-black text-green-700">{bundles.length}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Total Cost</div>
                      <div className="text-2xl font-black text-green-700">
                        ${bundles.reduce((sum, p) => sum + (p.price?.cost || 0), 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Bundle Price (20% off)</div>
                      <div className="text-2xl font-black text-green-700">
                        ${(bundles.reduce((sum, p) => sum + (p.price?.sell || 0), 0) * 0.8).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Bundle Profit</div>
                      <div className="text-2xl font-black text-green-700">
                        ${(bundles.reduce((sum, p) => sum + (p.price?.sell || 0), 0) * 0.8 - bundles.reduce((sum, p) => sum + (p.price?.cost || 0), 0) - (bundles.reduce((sum, p) => sum + (p.price?.sell || 0), 0) * 0.8 * 0.15) - 5).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Save Bundle Button */}
                  <button
                    onClick={saveCurrentBundle}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Icon name="check" size={20} />
                    Save This Bundle
                  </button>
                </div>

                {/* Current Bundle Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {bundles.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border-2 border-green-200 shadow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-2xl">{p.emoji}</span>
                          <h4 className="font-bold text-slate-800 text-sm mt-1">{p.name}</h4>
                        </div>
                        <button onClick={() => toggleBundle(p)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                          <Icon name="x" size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded text-center">
                          <div className="text-slate-500">Cost</div>
                          <div className="font-bold">${p.price?.cost}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded text-center">
                          <div className="text-slate-500">Sell</div>
                          <div className="font-bold">${p.price?.sell}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bundles.length === 0 && savedBundles.length === 0 && (
              <div className="text-center py-20">
                <Icon name="layers" size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg mb-2">No bundles yet</p>
                <p className="text-slate-400 text-sm">Go to Discover tab and click "+ Bundle" on products</p>
              </div>
            )}

            {/* Saved Bundles */}
            {savedBundles.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Icon name="bookmark" size={24} />
                  Saved Bundles ({savedBundles.length})
                </h3>
                <div className="space-y-4">
                  {savedBundles.map(bundle => (
                    <div key={bundle.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-800">{bundle.name}</h4>
                          <p className="text-sm text-slate-500">Created: {bundle.created} • {bundle.products.length} items</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadBundle(bundle)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 flex items-center gap-2"
                          >
                            <Icon name="layers" size={16} />
                            Load
                          </button>
                          <button
                            onClick={() => deleteSavedBundle(bundle.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                          >
                            <Icon name="x" size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Bundle Summary */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-blue-600">Items</div>
                          <div className="text-lg font-bold text-blue-700">{bundle.products.length}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-red-600">Cost</div>
                          <div className="text-lg font-bold text-red-700">${bundle.totalCost.toFixed(2)}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-green-600">Price</div>
                          <div className="text-lg font-bold text-green-700">${bundle.bundlePrice.toFixed(2)}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-purple-600">Profit</div>
                          <div className="text-lg font-bold text-purple-700">
                            ${(bundle.bundlePrice - bundle.totalCost - (bundle.bundlePrice * 0.15) - 5).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Bundle Products */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {bundle.products.map(p => (
                          <div key={p.id} className="bg-slate-50 rounded-lg p-2">
                            <div className="text-lg mb-1">{p.emoji}</div>
                            <div className="text-xs font-semibold text-slate-700 truncate">{p.name}</div>
                            <div className="text-xs text-slate-500">${p.price?.sell}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* V4.3 Bundle AI Modal */}
      {showBundleAI && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Icon name="brain" size={36} className="text-white" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Bundle AI Suggestions</h2>
                    <p className="text-purple-100">Profitable 2-pack combinations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBundleAI(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Icon name="x" size={24} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {bundleSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="alert" size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">No bundle suggestions found. Try products in the same category with similar prices!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bundleSuggestions.map((bundle, idx) => (
                    <div key={bundle.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-purple-900">Bundle #{idx + 1}</h3>
                          <p className="text-sm text-purple-600">Score: {bundle.score}/100</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-600">${bundle.profit}</div>
                          <div className="text-xs text-green-700">Profit ({bundle.margin}% margin)</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {bundle.products.map((p, pidx) => (
                          <div key={pidx} className="bg-white rounded-xl p-3 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{p.emoji}</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-800">{p.name}</h4>
                                <p className="text-xs text-slate-500">{p.category}</p>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Cost: ${p.price?.cost}</span>
                              <span className="text-green-600">Sell: ${p.price?.sell}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-xs text-slate-500">Bundle Cost</div>
                          <div className="font-bold text-red-600">${bundle.bundleCost}</div>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-xs text-slate-500">Bundle Price</div>
                          <div className="font-bold text-blue-600">${bundle.bundlePrice}</div>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-xs text-slate-500">Margin</div>
                          <div className="font-bold text-green-600">{bundle.margin}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-4 bg-slate-50">
              <button
                onClick={() => setShowBundleAI(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
      
