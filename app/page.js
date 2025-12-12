'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export default function Home() {
  // ============================================================================
  // PASSWORD & AUTH
  // ============================================================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ark_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'arkglobal2024') {
      localStorage.setItem('ark_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Wrong password!');
      setPasswordInput('');
    }
  };

  // ============================================================================
  // TABS & TOAST
  // ============================================================================
  const [activeTab, setActiveTab] = useState('search');
  const [toast, setToast] = useState(null);
  
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [showBundleAI, setShowBundleAI] = useState(false);
  const [bundleSuggestion, setBundleSuggestion] = useState('');
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const [bsrHistory, setBsrHistory] = useState({});
  const [showCharts, setShowCharts] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  
  // Advanced search filters
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minMargin: '',
    maxBSR: '',
    minReviews: '',
    minRating: '',
    sortBy: 'profit' // profit, margin, bsr, reviews, rating
  });

  // ============================================================================
  // MASSIVE CATEGORY EXPANSION - 50+ CATEGORIES
  // ============================================================================
  const categories = [
    // YOUR SHOP BUNDLES
    {
      id: 'alpha-performance',
      name: '💪 Alpha Performance',
      icon: '🏋️',
      description: 'Fitness & Gym Equipment',
      searches: [
        'gym equipment bundle',
        'resistance bands set',
        'fitness gear pack',
        'workout accessories',
        'exercise equipment kit',
        'home gym essentials',
        'strength training gear',
        'fitness starter pack'
      ]
    },
    {
      id: 'executive-grooming',
      name: '✂️ Executive Grooming',
      icon: '💼',
      description: "Men's Grooming & Care",
      searches: [
        'mens grooming kit',
        'beard care set',
        'shaving kit premium',
        'cologne gift set',
        'skincare men bundle',
        'grooming essentials',
        'barber tools kit',
        'mens personal care'
      ]
    },
    {
      id: 'tactical-edc',
      name: '🔦 Tactical EDC',
      icon: '⚔️',
      description: 'Everyday Carry & Survival',
      searches: [
        'edc gear bundle',
        'tactical flashlight',
        'survival kit',
        'multi tool set',
        'pocket knife combo',
        'everyday carry essentials',
        'tactical accessories',
        'emergency preparedness'
      ]
    },
    {
      id: 'home-gym',
      name: '🏠 Home Gym Starter',
      icon: '🎯',
      description: 'Home Fitness Equipment',
      searches: [
        'home gym equipment',
        'adjustable dumbbells',
        'yoga mat set',
        'jump rope fitness',
        'foam roller',
        'workout bench',
        'kettlebell set',
        'exercise ball'
      ]
    },
    {
      id: 'desk-commander',
      name: '🖥️ Desk Commander',
      icon: '💻',
      description: 'Office & Productivity',
      searches: [
        'desk accessories bundle',
        'standing desk mat',
        'blue light glasses',
        'cable organizer set',
        'desk lamp led',
        'ergonomic mouse pad',
        'monitor stand',
        'desk organization'
      ]
    },
    {
      id: 'weekend-warrior',
      name: '🏕️ Weekend Warrior',
      icon: '⛰️',
      description: 'Outdoor & Adventure',
      searches: [
        'camping gear bundle',
        'hiking backpack',
        'outdoor survival kit',
        'portable speaker waterproof',
        'sunglasses polarized',
        'cooler bag insulated',
        'camping accessories',
        'outdoor essentials'
      ]
    },
    {
      id: 'gentleman-whiskey',
      name: '🥃 Gentleman\'s Set',
      icon: '🎩',
      description: 'Bar & Spirits',
      searches: [
        'whiskey glass set',
        'whiskey stones',
        'decanter crystal',
        'bar accessories',
        'cocktail kit',
        'cigar accessories',
        'bourbon gift set',
        'barware collection'
      ]
    },
    {
      id: 'tech-essentials',
      name: '📱 Tech Essentials',
      icon: '⚡',
      description: 'Electronics & Gadgets',
      searches: [
        'wireless earbuds',
        'power bank portable',
        'phone stand adjustable',
        'usb cable kit',
        'screen cleaner',
        'tech accessories bundle',
        'smartphone gadgets',
        'charging station'
      ]
    },

    // EXPANDED AMAZON FBA CATEGORIES
    {
      id: 'kitchen',
      name: '🍳 Kitchen & Dining',
      icon: '🔪',
      description: 'Cookware & Kitchen Tools',
      searches: [
        'kitchen utensil set',
        'cookware set nonstick',
        'knife set professional',
        'cutting board set',
        'measuring cups spoons',
        'food storage containers',
        'baking tools',
        'kitchen gadgets'
      ]
    },
    {
      id: 'pet-supplies',
      name: '🐾 Pet Supplies',
      icon: '🐕',
      description: 'Dog, Cat & Pet Care',
      searches: [
        'dog toys bundle',
        'cat toys interactive',
        'pet grooming kit',
        'dog leash collar set',
        'pet feeding bowls',
        'cat scratching post',
        'dog training treats',
        'pet care essentials'
      ]
    },
    {
      id: 'baby-products',
      name: '👶 Baby Products',
      icon: '🍼',
      description: 'Baby Care & Essentials',
      searches: [
        'baby bottles set',
        'diaper bag organizer',
        'baby toys educational',
        'pacifier clip set',
        'baby grooming kit',
        'teething toys',
        'baby care bundle',
        'nursery essentials'
      ]
    },
    {
      id: 'automotive',
      name: '🚗 Automotive',
      icon: '🔧',
      description: 'Car Accessories & Tools',
      searches: [
        'car cleaning kit',
        'car phone mount',
        'tire pressure gauge',
        'jumper cables',
        'car vacuum cleaner',
        'car organizer trunk',
        'dash cam',
        'auto detailing tools'
      ]
    },
    {
      id: 'toys-games',
      name: '🎮 Toys & Games',
      icon: '🧩',
      description: 'Kids Toys & Board Games',
      searches: [
        'building blocks set',
        'board games family',
        'puzzle set kids',
        'stem toys educational',
        'action figures set',
        'card games bundle',
        'outdoor toys kids',
        'learning toys toddler'
      ]
    },
    {
      id: 'beauty-personal',
      name: '💄 Beauty & Personal',
      icon: '✨',
      description: 'Beauty & Personal Care',
      searches: [
        'makeup brush set',
        'skincare routine bundle',
        'hair styling tools',
        'nail care kit',
        'facial cleansing brush',
        'makeup organizer',
        'beauty tools set',
        'cosmetic accessories'
      ]
    },
    {
      id: 'sports-outdoors',
      name: '⚽ Sports & Outdoors',
      icon: '🏃',
      description: 'Sports Equipment & Gear',
      searches: [
        'basketball accessories',
        'soccer training equipment',
        'tennis racket set',
        'baseball glove bat',
        'cycling accessories',
        'swimming goggles',
        'sports water bottle',
        'athletic gear bundle'
      ]
    },
    {
      id: 'garden-outdoor',
      name: '🌱 Garden & Outdoor',
      icon: '🌻',
      description: 'Gardening & Patio',
      searches: [
        'garden tools set',
        'plant pots decorative',
        'gardening gloves',
        'watering can set',
        'seed starter kit',
        'pruning shears',
        'outdoor planters',
        'gardening accessories'
      ]
    },
    {
      id: 'office-school',
      name: '📚 Office & School',
      icon: '✏️',
      description: 'Stationery & Supplies',
      searches: [
        'pens set premium',
        'notebook journal set',
        'desk organizer',
        'sticky notes bundle',
        'highlighter set',
        'pencil case accessories',
        'office supplies kit',
        'school supplies bundle'
      ]
    },
    {
      id: 'travel',
      name: '✈️ Travel & Luggage',
      icon: '🧳',
      description: 'Travel Accessories',
      searches: [
        'packing cubes set',
        'travel pillow neck',
        'luggage tags',
        'travel adapter universal',
        'toiletry bag hanging',
        'travel bottles tsa',
        'luggage organizer',
        'travel essentials kit'
      ]
    },
    {
      id: 'crafts-sewing',
      name: '✂️ Crafts & Sewing',
      icon: '🧵',
      description: 'Arts, Crafts & DIY',
      searches: [
        'sewing kit complete',
        'crochet hooks set',
        'craft supplies bundle',
        'knitting needles',
        'embroidery kit',
        'art supplies set',
        'fabric scissors',
        'crafting tools'
      ]
    },
    {
      id: 'electronics',
      name: '⚡ Electronics',
      icon: '🔌',
      description: 'Gadgets & Accessories',
      searches: [
        'bluetooth speaker',
        'smart watch',
        'gaming headset',
        'laptop stand',
        'webcam hd',
        'keyboard mouse combo',
        'usb hub',
        'cable management'
      ]
    },
    {
      id: 'health-wellness',
      name: '🧘 Health & Wellness',
      icon: '💊',
      description: 'Health & Wellness Products',
      searches: [
        'yoga accessories kit',
        'meditation cushion',
        'foam roller massage',
        'resistance bands therapy',
        'essential oils set',
        'fitness tracker',
        'massage gun',
        'wellness bundle'
      ]
    },
    {
      id: 'camping-hiking',
      name: '⛺ Camping & Hiking',
      icon: '🥾',
      description: 'Camping & Hiking Gear',
      searches: [
        'camping cookware set',
        'hiking backpack',
        'sleeping bag',
        'camping tent',
        'trekking poles',
        'camping lantern',
        'portable stove',
        'camping essentials'
      ]
    },
    {
      id: 'fishing',
      name: '🎣 Fishing',
      icon: '🐟',
      description: 'Fishing Gear & Tackle',
      searches: [
        'fishing lures set',
        'fishing rod combo',
        'tackle box organizer',
        'fishing hooks assorted',
        'fishing line',
        'fishing pliers tools',
        'bait bucket',
        'fishing accessories'
      ]
    },
    {
      id: 'cycling',
      name: '🚴 Cycling',
      icon: '🚲',
      description: 'Bike Accessories',
      searches: [
        'bike lights set',
        'bike lock heavy duty',
        'bike repair kit',
        'bike water bottle holder',
        'cycling gloves',
        'bike phone mount',
        'bike pump portable',
        'cycling accessories'
      ]
    },
    {
      id: 'photography',
      name: '📷 Photography',
      icon: '📸',
      description: 'Camera Accessories',
      searches: [
        'camera lens kit',
        'tripod smartphone',
        'camera bag',
        'memory card bundle',
        'lens cleaning kit',
        'camera strap',
        'photography lighting',
        'camera accessories'
      ]
    },
    {
      id: 'music',
      name: '🎵 Music',
      icon: '🎸',
      description: 'Musical Instruments & Accessories',
      searches: [
        'guitar picks set',
        'guitar strings bundle',
        'drum sticks set',
        'microphone stand',
        'guitar capo',
        'music stand',
        'instrument cables',
        'music accessories'
      ]
    },
    {
      id: 'party-events',
      name: '🎉 Party & Events',
      icon: '🎈',
      description: 'Party Supplies & Decorations',
      searches: [
        'party decorations set',
        'balloons bundle',
        'party favors bulk',
        'tablecloth decorative',
        'party games',
        'candles birthday',
        'party supplies kit',
        'celebration essentials'
      ]
    },
    {
      id: 'cleaning',
      name: '🧹 Cleaning',
      icon: '🧼',
      description: 'Cleaning Supplies & Tools',
      searches: [
        'cleaning supplies bundle',
        'microfiber cloths set',
        'spray bottles',
        'scrub brushes set',
        'cleaning gloves',
        'sponges variety pack',
        'cleaning caddy organizer',
        'cleaning tools kit'
      ]
    },
    {
      id: 'storage-organization',
      name: '📦 Storage & Organization',
      icon: '🗄️',
      description: 'Storage Solutions',
      searches: [
        'storage bins set',
        'drawer organizer',
        'closet organizer',
        'shoe storage',
        'under bed storage',
        'storage baskets',
        'wall shelves',
        'organization accessories'
      ]
    },
    {
      id: 'bathroom',
      name: '🚿 Bathroom',
      icon: '🛁',
      description: 'Bath & Shower Accessories',
      searches: [
        'shower curtain set',
        'bathroom organizer',
        'bath mat non slip',
        'shower caddy',
        'towel hooks',
        'soap dispenser set',
        'toothbrush holder',
        'bathroom accessories'
      ]
    },
    {
      id: 'bedding',
      name: '🛏️ Bedding',
      icon: '😴',
      description: 'Bedding & Sleep Accessories',
      searches: [
        'bed sheets set',
        'pillow set',
        'comforter set',
        'mattress protector',
        'blanket throw',
        'pillow cases',
        'bed skirt',
        'bedding essentials'
      ]
    },
    {
      id: 'seasonal',
      name: '🎄 Seasonal',
      icon: '❄️',
      description: 'Holiday & Seasonal Items',
      searches: [
        'christmas decorations',
        'halloween costumes',
        'easter decorations',
        'valentines day gifts',
        'summer beach toys',
        'winter accessories',
        'holiday lights',
        'seasonal decor'
      ]
    },
    {
      id: 'luggage-bags',
      name: '👜 Bags & Luggage',
      icon: '🎒',
      description: 'Backpacks, Bags & Cases',
      searches: [
        'backpack laptop',
        'duffel bag gym',
        'messenger bag',
        'tote bag canvas',
        'crossbody bag',
        'makeup bag organizer',
        'lunch bag insulated',
        'bag accessories'
      ]
    },
    {
      id: 'jewelry-watches',
      name: '⌚ Jewelry & Watches',
      icon: '💍',
      description: 'Jewelry & Watch Accessories',
      searches: [
        'jewelry organizer box',
        'watch bands replacement',
        'necklace set',
        'bracelet set',
        'earrings set',
        'watch case',
        'jewelry cleaning kit',
        'jewelry storage'
      ]
    },
    {
      id: 'footwear-accessories',
      name: '👟 Footwear Accessories',
      icon: '🥾',
      description: 'Shoe Care & Accessories',
      searches: [
        'shoe organizer',
        'shoe cleaning kit',
        'shoe insoles',
        'shoe laces set',
        'shoe trees',
        'shoe horn',
        'boot storage',
        'shoe care products'
      ]
    },
    {
      id: 'phone-tablet',
      name: '📱 Phone & Tablet',
      icon: '📲',
      description: 'Mobile Accessories',
      searches: [
        'phone case protective',
        'screen protector',
        'phone charger fast',
        'phone holder car',
        'tablet case',
        'stylus pen',
        'phone accessories bundle',
        'mobile tech essentials'
      ]
    },
    {
      id: 'computer',
      name: '💻 Computer',
      icon: '⌨️',
      description: 'Computer Accessories',
      searches: [
        'laptop sleeve',
        'wireless mouse',
        'keyboard mechanical',
        'laptop stand',
        'usb hub multiport',
        'laptop cooling pad',
        'computer cleaning kit',
        'pc accessories'
      ]
    },
    {
      id: 'smart-home',
      name: '🏡 Smart Home',
      icon: '💡',
      description: 'Smart Home Devices',
      searches: [
        'smart light bulbs',
        'smart plug wifi',
        'security camera',
        'doorbell camera',
        'smart speaker',
        'smart thermostat',
        'motion sensor',
        'smart home bundle'
      ]
    },
    {
      id: 'audio',
      name: '🎧 Audio',
      icon: '🔊',
      description: 'Headphones & Audio Gear',
      searches: [
        'wireless headphones',
        'earbuds noise cancelling',
        'gaming headset',
        'bluetooth speaker',
        'aux cable bundle',
        'headphone stand',
        'audio accessories',
        'sound equipment'
      ]
    },
    {
      id: 'gaming',
      name: '🎮 Gaming',
      icon: '🕹️',
      description: 'Gaming Accessories',
      searches: [
        'gaming mouse pad',
        'controller charging dock',
        'gaming chair cushion',
        'headset stand',
        'gaming keyboard',
        'controller grips',
        'cable management gaming',
        'gaming setup accessories'
      ]
    },
    {
      id: 'books-reading',
      name: '📖 Books & Reading',
      icon: '📚',
      description: 'Reading Accessories',
      searches: [
        'book light reading',
        'book stand holder',
        'bookmark set',
        'book sleeve cover',
        'reading pillow',
        'book organizer',
        'reading glasses',
        'bookend set'
      ]
    },
    {
      id: 'meditation',
      name: '🧘 Meditation & Yoga',
      icon: '☯️',
      description: 'Meditation & Mindfulness',
      searches: [
        'meditation cushion',
        'yoga mat premium',
        'yoga blocks set',
        'yoga strap',
        'singing bowl',
        'incense holder',
        'meditation timer',
        'mindfulness accessories'
      ]
    },
    {
      id: 'emergency-prep',
      name: '🚨 Emergency Prep',
      icon: '⚠️',
      description: 'Emergency & Preparedness',
      searches: [
        'first aid kit',
        'emergency food supply',
        'survival blanket',
        'emergency radio',
        'fire extinguisher',
        'emergency flashlight',
        'survival kit complete',
        'disaster preparedness'
      ]
    },
    {
      id: 'men-fashion',
      name: '👔 Men\'s Fashion',
      icon: '🕴️',
      description: 'Men\'s Accessories',
      searches: [
        'mens wallet leather',
        'tie set mens',
        'belt mens leather',
        'cufflinks set',
        'mens hat',
        'mens sunglasses',
        'mens accessories bundle',
        'fashion accessories men'
      ]
    },
    {
      id: 'women-fashion',
      name: '👗 Women\'s Fashion',
      icon: '👠',
      description: 'Women\'s Accessories',
      searches: [
        'womens handbag',
        'scarf set women',
        'hair accessories set',
        'womens sunglasses',
        'jewelry set women',
        'womens wallet',
        'fashion accessories women',
        'womens accessory bundle'
      ]
    },
    {
      id: 'kids-fashion',
      name: '👧 Kids Fashion',
      icon: '🧒',
      description: 'Kids Accessories',
      searches: [
        'kids backpack',
        'kids lunchbox',
        'kids water bottle',
        'kids hat set',
        'kids accessories bundle',
        'school supplies kids',
        'kids fashion accessories',
        'children accessories'
      ]
    },
    {
      id: 'laundry',
      name: '🧺 Laundry',
      icon: '👕',
      description: 'Laundry Accessories',
      searches: [
        'laundry hamper',
        'drying rack',
        'laundry basket set',
        'clothes pins',
        'laundry bag mesh',
        'iron board cover',
        'laundry organizer',
        'laundry accessories'
      ]
    }
  ];

  // ============================================================================
  // ADVANCED SEARCH WITH FILTERS
  // ============================================================================
  const searchProducts = async () => {
    if (!category && !keyword) {
      setError('Please select a category or enter a keyword');
      return;
    }

    setLoading(true);
    setError('');
    setProducts([]);
    addDebugLog('🔍 Starting search...', { category, keyword, filters });

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          category,
          keyword,
          filters,
          timestamp: Date.now()
        })
      });

      const data = await response.json();
      addDebugLog('📦 Response received', data);

      if (data.error) {
        setError(data.error);
        addDebugLog('❌ Error in response', { error: data.error });
      } else if (data.products && data.products.length > 0) {
        setProducts(data.products);
        addDebugLog('✅ Products loaded', { count: data.products.length });
        
        // Load price/BSR history for products
        loadProductHistory(data.products);
      } else {
        setError('No products found. Try different keywords or category.');
        addDebugLog('⚠️ No products returned');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      addDebugLog('💥 Fetch error', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // PRICE & BSR HISTORY TRACKING
  // ============================================================================
  const loadProductHistory = async (productList) => {
    try {
      const asins = productList.map(p => p.asin).filter(Boolean);
      if (asins.length === 0) return;

      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asins })
      });

      const data = await response.json();
      if (data.priceHistory) setPriceHistory(data.priceHistory);
      if (data.bsrHistory) setBsrHistory(data.bsrHistory);
      
      addDebugLog('📊 History loaded', { 
        priceCount: Object.keys(data.priceHistory || {}).length,
        bsrCount: Object.keys(data.bsrHistory || {}).length
      });
    } catch (err) {
      console.error('History load error:', err);
      addDebugLog('⚠️ History load failed', { error: err.message });
    }
  };

  // ============================================================================
  // SAVE/TRACK PRODUCTS
  // ============================================================================
  const saveProduct = async (product) => {
    try {
      setSavedProducts(prev => [...prev, product]);
      addDebugLog('💾 Product saved', { asin: product.asin });
      
      // Could save to Supabase here
      const response = await fetch('/api/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        alert('Product saved successfully! 🎉');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product');
    }
  };

  // ============================================================================
  // COMPETITOR MONITORING
  // ============================================================================
  const addCompetitor = async (asin) => {
    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin, action: 'add' })
      });
      
      const data = await response.json();
      if (data.success) {
        setCompetitors(prev => [...prev, data.competitor]);
        alert('Competitor added! You\'ll get alerts on price changes. 📊');
      }
    } catch (err) {
      console.error('Competitor add error:', err);
      alert('Failed to add competitor');
    }
  };

  // ============================================================================
  // EMAIL ALERTS
  // ============================================================================
  const setupAlert = async (product, alertType, threshold) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin: product.asin,
          alertType, // 'price_drop', 'bsr_change', 'stock_alert'
          threshold,
          email: 'your-email@example.com' // Could get from user profile
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAlerts(prev => [...prev, data.alert]);
        alert(`Alert set! You'll get notified when ${alertType} reaches ${threshold} 🔔`);
      }
    } catch (err) {
      console.error('Alert setup error:', err);
      alert('Failed to setup alert');
    }
  };

  // ============================================================================
  // BUNDLE AI SUGGESTER (Enhanced)
  // ============================================================================
  const generateBundleAI = async () => {
    if (products.length < 2) {
      alert('Need at least 2 products to create a bundle!');
      return;
    }

    setShowBundleAI(true);
    setBundleSuggestion('🤖 AI is analyzing products...');

    try {
      const productDescriptions = products
        .slice(0, 5)
        .map(p => `${p.title} ($${p.price})`)
        .join(', ');

      const response = await fetch('/api/bundle-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: products.slice(0, 5),
          category
        })
      });

      const data = await response.json();
      setBundleSuggestion(data.suggestion || 'Could not generate bundle suggestion');
    } catch (err) {
      console.error('Bundle AI error:', err);
      setBundleSuggestion('Error generating bundle. Try again!');
    }
  };

  // ============================================================================
  // CHART VISUALIZATION
  // ============================================================================
  const showPriceChart = (product) => {
    const history = priceHistory[product.asin];
    if (!history || history.length === 0) {
      alert('No price history available for this product yet!');
      return;
    }
    
    setSelectedChart({ type: 'price', product, data: history });
    setShowCharts(true);
  };

  const showBSRChart = (product) => {
    const history = bsrHistory[product.asin];
    if (!history || history.length === 0) {
      alert('No BSR history available for this product yet!');
      return;
    }
    
    setSelectedChart({ type: 'bsr', product, data: history });
    setShowCharts(true);
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  const addDebugLog = (message, data = null) => {
    const log = {
      time: new Date().toLocaleTimeString(),
      message,
      data
    };
    setDebugLogs(prev => [log, ...prev].slice(0, 50));
  };

  const calculateProfit = useCallback((product) => {
    const amazonPrice = parseFloat(product.price) || 0;
    const supplierCost = parseFloat(product.supplier_price) || 0;
    const fbaFee = amazonPrice * 0.15; // 15% FBA fee
    const profit = amazonPrice - supplierCost - fbaFee;
    const margin = amazonPrice > 0 ? ((profit / amazonPrice) * 100).toFixed(1) : 0;
    const roi = supplierCost > 0 ? ((profit / supplierCost) * 100).toFixed(1) : 0;

    return {
      profit: profit.toFixed(2),
      margin: `${margin}%`,
      roi: `${roi}%`,
      monthly: (profit * 30).toFixed(2),
      yearly: (profit * 365).toFixed(2)
    };
  }, []);

  const formatBSR = (bsr) => {
    if (!bsr) return 'N/A';
    return parseInt(bsr).toLocaleString();
  };

  // ============================================================================
  // FILTERED & SORTED PRODUCTS
  // ============================================================================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.minPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.maxPrice));
    }
    if (filters.minMargin) {
      filtered = filtered.filter(p => {
        const calc = calculateProfit(p);
        return parseFloat(calc.margin) >= parseFloat(filters.minMargin);
      });
    }
    if (filters.maxBSR) {
      filtered = filtered.filter(p => {
        const bsr = parseInt(p.bsr) || 999999;
        return bsr <= parseInt(filters.maxBSR);
      });
    }
    if (filters.minReviews) {
      filtered = filtered.filter(p => {
        const reviews = parseInt(p.reviews) || 0;
        return reviews >= parseInt(filters.minReviews);
      });
    }
    if (filters.minRating) {
      filtered = filtered.filter(p => {
        const rating = parseFloat(p.rating) || 0;
        return rating >= parseFloat(filters.minRating);
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      const calcA = calculateProfit(a);
      const calcB = calculateProfit(b);

      switch (filters.sortBy) {
        case 'profit':
          return parseFloat(calcB.profit) - parseFloat(calcA.profit);
        case 'margin':
          return parseFloat(calcB.margin) - parseFloat(calcA.margin);
        case 'bsr':
          return (parseInt(a.bsr) || 999999) - (parseInt(b.bsr) || 999999);
        case 'reviews':
          return (parseInt(b.reviews) || 0) - (parseInt(a.reviews) || 0);
        case 'rating':
          return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters, calculateProfit]);

  // ============================================================================
  // PASSWORD SCREEN
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-800 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg mb-4 shadow-xl">
              <span className="text-3xl font-bold text-white">ARK</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bundle Scanner</h1>
            <p className="text-orange-400 font-semibold">V6.0 ULTIMATE</p>
            <p className="text-gray-400 text-xs mt-2">50+ Categories • Real-time Tracking • $0.50/mo</p>
          </div>
          
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 text-white mb-4"
            placeholder="Enter password"
            autoFocus
          />
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-lg font-bold text-white transition shadow-lg hover:shadow-xl"
          >
            🚀 Access Scanner
          </button>
        </form>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50">
          ✅ {toast}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg shadow-lg">
                <span className="text-2xl font-bold text-white">ARK</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Bundle Scanner V6 Ultimate</h1>
                <p className="text-orange-100 text-sm">50+ Categories • Advanced Filters • Real-time Tracking</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('ark_auth');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition"
            >
              🚪 Logout
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'search', icon: '🔍', label: 'Search' },
              { id: 'saved', icon: '💾', label: `Saved (${savedProducts.length})` },
              { id: 'bundles', icon: '📦', label: `Bundles (${bundles.length})` },
              { id: 'competitors', icon: '👁️', label: `Watch (${competitors.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600'
                    : 'bg-orange-700 text-white hover:bg-orange-600'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
              >
                {showDebug ? '🔍 Hide Debug' : '🔍 Debug'}
              </button>
              <button
                onClick={() => setShowCompetitors(!showCompetitors)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
              >
                📊 Competitors ({competitors.length})
              </button>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
              >
                🔔 Alerts ({alerts.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-orange-400">🔍 Product Search</h2>
          
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-300">
              Select Category ({categories.length} available)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 bg-black rounded-lg border border-gray-800">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setKeyword('');
                  }}
                  className={`p-4 rounded-lg transition-all duration-200 text-left ${
                    category === cat.id
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-semibold text-sm mb-1">{cat.name}</div>
                  <div className="text-xs opacity-75">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Search */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-300">
              Or Search by Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCategory('');
              }}
              placeholder="e.g., resistance bands, yoga mat, camping gear..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500"
            />
          </div>

          {/* Advanced Filters */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-orange-400">⚙️ Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs mb-1 text-gray-400">Min Price ($)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Max Price ($)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="999"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Min Margin (%)</label>
                <input
                  type="number"
                  value={filters.minMargin}
                  onChange={(e) => setFilters(prev => ({ ...prev, minMargin: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Max BSR</label>
                <input
                  type="number"
                  value={filters.maxBSR}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxBSR: e.target.value }))}
                  placeholder="100000"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Min Reviews</label>
                <input
                  type="number"
                  value={filters.minReviews}
                  onChange={(e) => setFilters(prev => ({ ...prev, minReviews: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400">Min Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs mb-1 text-gray-400">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full md:w-64 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
              >
                <option value="profit">💰 Highest Profit</option>
                <option value="margin">📊 Highest Margin %</option>
                <option value="bsr">🏆 Best BSR (lowest)</option>
                <option value="reviews">⭐ Most Reviews</option>
                <option value="rating">🌟 Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={searchProducts}
            disabled={loading || (!category && !keyword)}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
              loading || (!category && !keyword)
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? '🔄 Searching...' : '🚀 Search Products'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Stats */}
        {filteredProducts.length > 0 && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-gray-300">
                <span className="text-2xl font-bold text-orange-400">{filteredProducts.length}</span> products found
                {filteredProducts.length !== products.length && (
                  <span className="text-gray-500 ml-2">({products.length} total, {products.length - filteredProducts.length} filtered out)</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateBundleAI}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm font-semibold"
                >
                  🤖 Generate Bundle AI
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      minPrice: '',
                      maxPrice: '',
                      minMargin: '',
                      maxBSR: '',
                      minReviews: '',
                      minRating: '',
                      sortBy: 'profit'
                    });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                >
                  🔄 Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const calc = calculateProfit(product);
              const hasHistory = priceHistory[product.asin] || bsrHistory[product.asin];

              return (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-orange-600 group"
                >
                  {/* Product Image */}
                  {product.image_url && (
                    <div className="relative h-48 bg-gray-800 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {hasHistory && (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            📊 Tracked
                          </span>
                        )}
                        {parseFloat(calc.margin) > 50 && (
                          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                            🔥 Hot
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 min-h-[48px]">
                      {product.title}
                    </h3>

                    {/* Price & Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="bg-gray-800 p-2 rounded">
                        <div className="text-gray-400 text-xs">Amazon Price</div>
                        <div className="text-green-400 font-bold">${product.price}</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                        <div className="text-gray-400 text-xs">Supplier Cost</div>
                        <div className="text-blue-400 font-bold">${product.supplier_price || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                        <div className="text-gray-400 text-xs">BSR</div>
                        <div className="text-purple-400 font-bold">{formatBSR(product.bsr)}</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                        <div className="text-gray-400 text-xs">Reviews</div>
                        <div className="text-yellow-400 font-bold">
                          ⭐ {product.rating || 'N/A'} ({product.reviews || 0})
                        </div>
                      </div>
                    </div>

                    {/* Profit Metrics */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 p-3 rounded-lg mb-3 border border-orange-700/50">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Profit</div>
                          <div className="text-orange-400 font-bold">${calc.profit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Margin</div>
                          <div className="text-orange-400 font-bold">{calc.margin}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">ROI</div>
                          <div className="text-orange-400 font-bold">{calc.roi}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm font-semibold transition"
                      >
                        📊 Details
                      </button>
                      <button
                        onClick={() => saveProduct(product)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => addCompetitor(product.asin)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                      >
                        👁️
                      </button>
                    </div>

                    {/* Chart Buttons */}
                    {hasHistory && (
                      <div className="flex gap-2 mt-2">
                        {priceHistory[product.asin] && (
                          <button
                            onClick={() => showPriceChart(product)}
                            className="flex-1 px-2 py-1 bg-green-700/50 hover:bg-green-700 rounded text-xs transition"
                          >
                            📈 Price
                          </button>
                        )}
                        {bsrHistory[product.asin] && (
                          <button
                            onClick={() => showBSRChart(product)}
                            className="flex-1 px-2 py-1 bg-purple-700/50 hover:bg-purple-700 rounded text-xs transition"
                          >
                            📊 BSR
                          </button>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-2 mt-3 text-xs">
                      {product.amazon_url && (
                        <a
                          href={product.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-center transition"
                        >
                          🛒 Amazon
                        </a>
                      )}
                      {product.supplier_url && (
                        <a
                          href={product.supplier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-center transition"
                        >
                          🔗 Supplier
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white pr-8">{selectedProduct.title}</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {selectedProduct.image_url && (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-full max-h-64 object-contain mb-6 bg-gray-800 rounded-lg p-4"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Product Details</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-gray-400 text-sm">ASIN</div>
                        <div className="text-white font-mono">{selectedProduct.asin || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-gray-400 text-sm">Amazon Price</div>
                        <div className="text-green-400 text-xl font-bold">${selectedProduct.price}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-gray-400 text-sm">Supplier Cost</div>
                        <div className="text-blue-400 text-xl font-bold">${selectedProduct.supplier_price || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-gray-400 text-sm">Best Sellers Rank</div>
                        <div className="text-purple-400 font-bold">{formatBSR(selectedProduct.bsr)}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-gray-400 text-sm">Rating & Reviews</div>
                        <div className="text-yellow-400 font-bold">
                          ⭐ {selectedProduct.rating || 'N/A'} ({selectedProduct.reviews || 0} reviews)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Profit Analysis</h3>
                    <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-4 rounded-lg border border-orange-700/50 mb-4">
                      {(() => {
                        const calc = calculateProfit(selectedProduct);
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-gray-300 text-sm mb-1">Profit per Unit</div>
                                <div className="text-2xl font-bold text-orange-400">${calc.profit}</div>
                              </div>
                              <div>
                                <div className="text-gray-300 text-sm mb-1">Profit Margin</div>
                                <div className="text-2xl font-bold text-orange-400">{calc.margin}</div>
                              </div>
                              <div>
                                <div className="text-gray-300 text-sm mb-1">ROI</div>
                                <div className="text-2xl font-bold text-orange-400">{calc.roi}</div>
                              </div>
                              <div>
                                <div className="text-gray-300 text-sm mb-1">Monthly Revenue</div>
                                <div className="text-xl font-bold text-green-400">${calc.monthly}</div>
                              </div>
                            </div>
                            <div className="border-t border-orange-700/50 pt-3">
                              <div className="text-gray-300 text-sm mb-1">Yearly Projection</div>
                              <div className="text-3xl font-bold text-green-400">${calc.yearly}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Alert Setup */}
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-3 text-white">🔔 Set Price Alert</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Target price"
                          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                        />
                        <button
                          onClick={() => setupAlert(selectedProduct, 'price_drop', 20)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded transition"
                        >
                          Set Alert
                        </button>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                      {selectedProduct.amazon_url && (
                        <a
                          href={selectedProduct.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-center font-semibold transition"
                        >
                          🛒 View on Amazon →
                        </a>
                      )}
                      {selectedProduct.supplier_url && (
                        <a
                          href={selectedProduct.supplier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-center font-semibold transition"
                        >
                          🔗 View Supplier →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bundle AI Modal */}
        {showBundleAI && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">🤖 AI Bundle Suggestion</h2>
                <button
                  onClick={() => setShowBundleAI(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap text-gray-300">
                {bundleSuggestion}
              </div>
            </div>
          </div>
        )}

        {/* Chart Modal */}
        {showCharts && selectedChart && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full border border-gray-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedChart.type === 'price' ? '📈 Price History' : '📊 BSR History'}
                </h2>
                <button
                  onClick={() => setShowCharts(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg h-96">
                {/* Chart would render here - using a library like recharts or chart.js */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  Chart visualization for {selectedChart.product.title}
                  <br />
                  (Integrate with Chart.js or Recharts)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {showDebug && (
          <div className="fixed bottom-4 right-4 w-96 bg-gray-900 rounded-lg border border-gray-800 shadow-2xl max-h-96 overflow-hidden">
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
              <span className="font-semibold text-sm">🔍 Debug Logs</span>
              <button
                onClick={() => setDebugLogs([])}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Clear
              </button>
            </div>
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {debugLogs.map((log, i) => (
                <div key={i} className="text-xs bg-gray-800 p-2 rounded border border-gray-700">
                  <div className="text-gray-400 mb-1">{log.time}</div>
                  <div className="text-white font-semibold mb-1">{log.message}</div>
                  {log.data && (
                    <pre className="text-gray-400 text-xs overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>ARK Bundle Scanner V6.0 - The Beast Edition</p>
          <p className="mt-1">
            {categories.length} Categories • Advanced Filters • Real-time Tracking • BSR History • Price Alerts
          </p>
          <p className="mt-1 text-orange-400">
            💰 Still only ~$0.50/month vs competitors at $19-99/month
          </p>
        </div>
      </div>
    </div>
  );
}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">💾 Saved Products ({savedProducts.length})</h2>
            {savedProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-xl">
                <p className="text-gray-400">No saved products yet. Start searching!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedProducts.map((product, i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <div className="text-sm space-y-1 mb-3">
                      <div className="text-green-400">${product.price}</div>
                      <div className="text-blue-400">Supplier: ${product.supplier_price}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setSavedProducts(prev => prev.filter((_, idx) => idx !== i));
                        showToast('Removed!');
                      }}
                      className="px-3 py-1 bg-red-600 rounded text-xs"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BUNDLES TAB */}
        {activeTab === 'bundles' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📦 Bundles ({bundles.length})</h2>
            <button 
              onClick={() => {
                const name = prompt('Bundle name?');
                if (name) {
                  const newBundle = { name, products: [], created: Date.now() };
                  const updated = [...bundles, newBundle];
                  setBundles(updated);
                  localStorage.setItem('ark_bundles', JSON.stringify(updated));
                  showToast('Created!');
                }
              }}
              className="mb-4 px-6 py-3 bg-orange-600 rounded-lg font-semibold"
            >
              ➕ Create Bundle
            </button>
            <div className="space-y-4">
              {bundles.map((bundle, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold">{bundle.name}</h3>
                  <p className="text-gray-400">Products: {bundle.products?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPETITORS TAB */}
        {activeTab === 'competitors' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">👁️ Watching ({competitors.length})</h2>
            <div className="space-y-4">
              {competitors.map((comp, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 flex justify-between">
                  <div>
                    <p className="font-semibold">ASIN: {comp.asin}</p>
                    <p className="text-sm text-gray-400">Added: {new Date(comp.added_at).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setCompetitors(prev => prev.filter((_, idx) => idx !== i));
                      showToast('Removed!');
                    }}
                    className="px-4 py-2 bg-red-600 rounded"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
