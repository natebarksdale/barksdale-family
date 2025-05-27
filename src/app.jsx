import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, TrendingUp, Tablet, Star, Gift, DollarSign, PiggyBank, Building, Heart, Users, Settings, Download, Upload, RefreshCw, Wifi, WifiOff, LogOut, User, Lock, Eye, EyeOff } from 'lucide-react';

const FamilyAllowanceTracker = () => {
  const [kids, setKids] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentView, setCurrentView] = useState('parent');
  const [selectedKid, setSelectedKid] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // User accounts - you can customize these passwords
  const userAccounts = {
    parent: { 
      password: 'family123', 
      role: 'parent', 
      name: 'Parent',
      canEdit: true,
      canViewAll: true 
    },
    alex: { 
      password: 'alex5', 
      role: 'kid', 
      name: 'Alex',
      kidId: 1,
      canEdit: false,
      canViewSiblings: true 
    },
    jordan: { 
      password: 'jordan7', 
      role: 'kid', 
      name: 'Jordan',
      kidId: 2,
      canEdit: false,
      canViewSiblings: true 
    },
    riley: { 
      password: 'riley9', 
      role: 'kid', 
      name: 'Riley',
      kidId: 3,
      canEdit: false,
      canViewSiblings: true 
    }
  };

  // GitHub configuration
  const GITHUB_CONFIG = {
    owner: 'YOUR_GITHUB_USERNAME',
    repo: 'family-allowance-tracker',
    path: 'data/ledger.json',
    branch: 'main'
  };

  const isGitHubPages = window.location.hostname.includes('github.io');

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('familyAllowanceUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setShowLogin(false);
      } catch (error) {
        localStorage.removeItem('familyAllowanceUser');
      }
    }
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = loginForm;
    
    if (userAccounts[username] && userAccounts[username].password === password) {
      const userData = {
        username,
        ...userAccounts[username]
      };
      setCurrentUser(userData);
      localStorage.setItem('familyAllowanceUser', JSON.stringify(userData));
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
      
      if (userData.role === 'kid') {
        setCurrentView('kids');
        const kid = kids.find(k => k.id === userData.kidId);
        if (kid) setSelectedKid(kid);
      }
    } else {
      alert('Invalid username or password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedKid(null);
    setShowLogin(true);
    setCurrentView('parent');
    localStorage.removeItem('familyAllowanceUser');
  };

  // Initialize data
  const initializeData = () => {
    const sampleData = {
      kids: [
        {
          id: 1,
          name: 'Alex',
          age: 5,
          allowance: 25.50,
          savings: { cash: 15.00, moneyMarket: 8.25, sp500: 2.25, tithe: 0.00 },
          tabletTokens: 12,
          behaviorPoints: 45,
          streaks: { chores: 3, bedtime: 7, homework: 0 },
          completedChores: []
        },
        {
          id: 2,
          name: 'Jordan',
          age: 7,
          allowance: 42.75,
          savings: { cash: 20.00, moneyMarket: 15.50, sp500: 7.25, tithe: 0.00 },
          tabletTokens: 8,
          behaviorPoints: 38,
          streaks: { chores: 5, bedtime: 2, homework: 4 },
          completedChores: []
        },
        {
          id: 3,
          name: 'Riley',
          age: 9,
          allowance: 63.25,
          savings: { cash: 35.00, moneyMarket: 20.00, sp500: 8.25, tithe: 0.00 },
          tabletTokens: 15,
          behaviorPoints: 52,
          streaks: { chores: 8, bedtime: 4, homework: 6 },
          completedChores: []
        }
      ],
      transactions: [],
      lastUpdated: new Date().toISOString()
    };

    setKids(sampleData.kids);
    setTransactions(sampleData.transactions);
  };

  // Load data
  const loadData = async () => {
    try {
      if (isGitHubPages) {
        await loadFromGitHub();
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      initializeData();
    }
  };

  const loadFromGitHub = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`);
      
      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        setKids(content.kids || []);
        setTransactions(content.transactions || []);
        setLastSyncTime(new Date());
        setIsOnline(true);
      } else {
        throw new Error('Failed to load from GitHub');
      }
    } catch (error) {
      console.error('GitHub load error:', error);
      setIsOnline(false);
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const savedKids = localStorage.getItem('familyAllowanceKids');
    const savedTransactions = localStorage.getItem('familyAllowanceTransactions');
    
    if (savedKids && savedTransactions) {
      setKids(JSON.parse(savedKids));
      setTransactions(JSON.parse(savedTransactions));
    } else {
      initializeData();
    }
  };

  const saveToGitHub = async (kidsData, transactionsData) => {
    if (!isGitHubPages) return;

    setIsSyncing(true);
    try {
      const currentResponse = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`);
      
      let sha = null;
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        sha = currentData.sha;
      }

      const content = {
        kids: kidsData,
        transactions: transactionsData,
        lastUpdated: new Date().toISOString()
      };

      const requestBody = {
        message: `Update family allowance data - ${new Date().toLocaleString()}`,
        content: btoa(JSON.stringify(content, null, 2)),
        branch: GITHUB_CONFIG.branch
      };

      if (sha) {
        requestBody.sha = sha;
      }

      const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setLastSyncTime(new Date());
        setHasUnsavedChanges(false);
        setIsOnline(true);
      } else {
        throw new Error('Failed to save to GitHub');
      }
    } catch (error) {
      console.error('GitHub save error:', error);
      setIsOnline(false);
      setHasUnsavedChanges(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveToLocalStorage = (kidsData, transactionsData) => {
    localStorage.setItem('familyAllowanceKids', JSON.stringify(kidsData));
    localStorage.setItem('familyAllowanceTransactions', JSON.stringify(transactionsData));
  };

  const saveData = async (kidsData, transactionsData) => {
    saveToLocalStorage(kidsData, transactionsData);
    if (isGitHubPages && currentUser?.canEdit) {
      await saveToGitHub(kidsData, transactionsData);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (kids.length > 0 && currentUser?.canEdit) {
      saveData(kids, transactions);
    }
  }, [kids, transactions, currentUser]);

  const addTransaction = (kidId, type, category, amount, description) => {
    const newTransaction = {
      id: Date.now(),
      kidId,
      type,
      category,
      amount,
      description,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateKidData = (kidId, field, value, subfield = null) => {
    setKids(prev => prev.map(kid => {
      if (kid.id === kidId) {
        if (subfield) {
          return {
            ...kid,
            [field]: {
              ...kid[field],
              [subfield]: value
            }
          };
        }
        return { ...kid, [field]: value };
      }
      return kid;
    }));
  };

  const logChore = (kidId, choreDescription) => {
    const kid = kids.find(k => k.id === kidId);
    const newChore = {
      id: Date.now(),
      description: choreDescription,
      completedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    
    updateKidData(kidId, 'completedChores', [...(kid.completedChores || []), newChore]);
    addTransaction(kidId, 'log', 'chore', 1, `Completed chore: ${choreDescription}`);
    
    updateKidData(kidId, 'behaviorPoints', kid.behaviorPoints + 1);
    addTransaction(kidId, 'credit', 'behaviorPoints', 1, 'Chore completion bonus');
  };

  const adjustAllowance = (kidId, amount, description) => {
    if (!currentUser?.canEdit) return;
    
    const kid = kids.find(k => k.id === kidId);
    const newAmount = Math.max(0, kid.allowance + amount);
    updateKidData(kidId, 'allowance', newAmount);
    addTransaction(kidId, amount > 0 ? 'credit' : 'debit', 'allowance', Math.abs(amount), description);
  };

  const adjustPoints = (kidId, category, amount, description) => {
    if (!currentUser?.canEdit) return;
    
    const kid = kids.find(k => k.id === kidId);
    let newAmount;
    
    if (category === 'tabletTokens') {
      newAmount = Math.max(0, kid.tabletTokens + amount);
      updateKidData(kidId, 'tabletTokens', newAmount);
    } else if (category === 'behaviorPoints') {
      newAmount = Math.max(0, kid.behaviorPoints + amount);
      updateKidData(kidId, 'behaviorPoints', newAmount);
    }
    
    addTransaction(kidId, amount > 0 ? 'credit' : 'debit', category, Math.abs(amount), description);
  };

  const updateStreak = (kidId, streakType, value) => {
    if (!currentUser?.canEdit) return;
    updateKidData(kidId, 'streaks', Math.max(0, value), streakType);
  };

  const moveSavings = (kidId, fromCategory, toCategory, amount) => {
    if (currentUser?.role === 'kid' && currentUser.kidId !== kidId) return;
    
    const kid = kids.find(k => k.id === kidId);
    
    if (fromCategory === 'allowance') {
      if (kid.allowance >= amount) {
        updateKidData(kidId, 'allowance', kid.allowance - amount);
        updateKidData(kidId, 'savings', kid.savings[toCategory] + amount, toCategory);
        addTransaction(kidId, 'transfer', 'savings', amount, `Moved $${amount} from allowance to ${toCategory}`);
      }
    } else if (kid.savings[fromCategory] >= amount) {
      updateKidData(kidId, 'savings', kid.savings[fromCategory] - amount, fromCategory);
      if (toCategory === 'allowance') {
        updateKidData(kidId, 'allowance', kid.allowance + amount);
      } else {
        updateKidData(kidId, 'savings', kid.savings[toCategory] + amount, toCategory);
      }
      addTransaction(kidId, 'transfer', 'savings', amount, `Moved $${amount} from ${fromCategory} to ${toCategory}`);
    }
  };

  const exportData = () => {
    if (!currentUser?.canEdit) return;
    
    const data = {
      kids,
      transactions,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-allowance-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event) => {
    if (!currentUser?.canEdit) return;
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.kids && data.transactions) {
            setKids(data.kids);
            setTransactions(data.transactions);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const syncData = async () => {
    if (isGitHubPages) {
      await loadFromGitHub();
    }
  };

  // Login Component
  const LoginView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="text-white" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Family Allowance Tracker</h1>
          <p className="text-gray-600 mt-2">Please log in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Demo Accounts:</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div><strong>Parent:</strong> parent / family123</div>
            <div><strong>Alex:</strong> alex / alex5</div>
            <div><strong>Jordan:</strong> jordan / jordan7</div>
            <div><strong>Riley:</strong> riley / riley9</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SyncStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isGitHubPages ? (
        <>
          {isOnline ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
          <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
            {isOnline ? 'Synced' : 'Offline'}
          </span>
          {lastSyncTime && (
            <span className="text-gray-500">
              • Last sync: {lastSyncTime.toLocaleTimeString()}
            </span>
          )}
          {hasUnsavedChanges && (
            <span className="text-orange-600">• Unsaved changes</span>
          )}
          <button
            onClick={syncData}
            disabled={isSyncing}
            className="ml-2 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </>
      ) : (
        <span className="text-blue-600">Local Mode</span>
      )}
    </div>
  );

  const UserHeader = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
        <User size={16} />
        <span className="font-medium">Welcome, {currentUser?.name}!</span>
        <span className="text-xs bg-white/30 px-2 py-1 rounded">
          {currentUser?.role === 'parent' ? 'Parent' : 'Kid'}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );

  // Show login screen if not authenticated
  if (showLogin || !currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Family Allowance Tracker</h1>
          <div className="flex items-center gap-4">
            <UserHeader />
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('parent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  currentView === 'parent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                Parent View
              </button>
              <button
                onClick={() => setCurrentView('kids')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  currentView === 'kids'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                Kids View
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentView === 'parent' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Parent Dashboard</h2>
                <div className="flex items-center gap-4">
                  <SyncStatus />
                  {currentUser?.canEdit && (
                    <div className="flex gap-2">
                      <button
                        onClick={exportData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <Download size={16} />
                        Export Data
                      </button>
                      <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                        <Upload size={16} />
                        Import Data
                        <input type="file" accept=".json" onChange={importData} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kids.map(kid => (
                  <div key={kid.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{kid.name}</h3>
                      <span className="text-sm text-gray-500">Age {kid.age}</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-700">Allowance</span>
                          <span className="text-lg font-bold text-green-800">${kid.allowance.toFixed(2)}</span>
                        </div>
                        {currentUser?.canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => adjustAllowance(kid.id, 5, 'Weekly allowance')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                              <PlusCircle size={14} />
                              +$5
                            </button>
                            <button
                              onClick={() => adjustAllowance(kid.id, -1, 'Penalty deduction')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              <MinusCircle size={14} />
                              -$1
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-700">Tablet Tokens</span>
                          <span className="text-lg font-bold text-purple-800">{kid.tabletTokens}</span>
                        </div>
                        {currentUser?.canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => adjustPoints(kid.id, 'tabletTokens', 3, 'Good behavior bonus')}
                              className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                            >
                              <PlusCircle size={14} />
                              +3
                            </button>
                            <button
                              onClick={() => adjustPoints(kid.id, 'tabletTokens', -1, 'Used token')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              <MinusCircle size={14} />
                              -1
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-700">Behavior Points</span>
                          <span className="text-lg font-bold text-yellow-800">{kid.behaviorPoints}</span>
                        </div>
                        {currentUser?.canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => adjustPoints(kid.id, 'behaviorPoints', 5, 'Great behavior')}
                              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                            >
                              <PlusCircle size={14} />
                              +5
                            </button>
                            <button
                              onClick={() => adjustPoints(kid.id, 'behaviorPoints', -2, 'Behavior correction')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              <MinusCircle size={14} />
                              -2
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'kids' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Profile</h2>
                <div className="flex justify-center gap-4 flex-wrap">
                  {kids.map(kid => (
                    <button
                      key={kid.id}
                      onClick={() => setSelectedKid(kid)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                      {kid.name} ({kid.age})
                      {currentUser?.kidId === kid.id && ' (You)'}
                    </button>
                  ))}
                </div>
              </div>

              {selectedKid && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {selectedKid.id === currentUser?.kidId ? `Hi ${selectedKid.name}! 👋` : `${selectedKid.name}'s Dashboard`}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 p-4 rounded-lg">
                        <DollarSign className="mb-2" size={24} />
                        <div className="text-sm">Allowance</div>
                        <div className="text-2xl font-bold">${selectedKid.allowance.toFixed(2)}</div>
                      </div>
                      <div className="bg-white/20 p-4 rounded-lg">
                        <Tablet className="mb-2" size={24} />
                        <div className="text-sm">Tablet Tokens</div>
                        <div className="text-2xl font-bold">{selectedKid.tabletTokens}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <PiggyBank className="text-blue-500" />
                      Savings
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-700">Cash</div>
                        <div className="text-xl font-bold text-green-800">${selectedKid.savings.cash.toFixed(2)}</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-700">Money Market</div>
                        <div className="text-xl font-bold text-blue-800">${selectedKid.savings.moneyMarket.toFixed(2)}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-700">S&P 500</div>
                        <div className="text-xl font-bold text-purple-800">${selectedKid.savings.sp500.toFixed(2)}</div>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <div className="text-sm text-pink-700">Tithe</div>
                        <div className="text-xl font-bold text-pink-800">${selectedKid.savings.tithe.toFixed(2)}</div>
                      </div>
                    </div>

                    {(currentUser?.role === 'parent' || currentUser?.kidId === selectedKid.id) && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-3">Move Your Money</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              const amount = parseFloat(prompt(`How much would you like to save in Cash? (Available: ${selectedKid.allowance.toFixed(2)})`));
                              if (amount && amount > 0) moveSavings(selectedKid.id, 'allowance', 'cash', amount);
                            }}
                            className="bg-green-500 text-white p-2 rounded text-sm hover:bg-green-600"
                          >
                            Save → Cash
                          </button>
                          <button
                            onClick={() => {
                              const amount = parseFloat(prompt(`How much would you like to invest in Money Market? (Available: ${selectedKid.allowance.toFixed(2)})`));
                              if (amount && amount > 0) moveSavings(selectedKid.id, 'allowance', 'moneyMarket', amount);
                            }}
                            className="bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
                          >
                            Save → Money Market
                          </button>
                          <button
                            onClick={() => {
                              const amount = parseFloat(prompt(`How much would you like to invest in S&P 500? (Available: ${selectedKid.allowance.toFixed(2)})`));
                              if (amount && amount > 0) moveSavings(selectedKid.id, 'allowance', 'sp500', amount);
                            }}
                            className="bg-purple-500 text-white p-2 rounded text-sm hover:bg-purple-600"
                          >
                            Save → S&P 500
                          </button>
                          <button
                            onClick={() => {
                              const amount = parseFloat(prompt(`How much would you like to give to Tithe? (Available: ${selectedKid.allowance.toFixed(2)})`));
                              if (amount && amount > 0) moveSavings(selectedKid.id, 'allowance', 'tithe', amount);
                            }}
                            className="bg-pink-500 text-white p-2 rounded text-sm hover:bg-pink-600"
                          >
                            Give → Tithe
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Star className="text-yellow-500" />
                      Points & Streaks
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <Star className="mx-auto mb-2 text-yellow-500" size={24} />
                        <div className="text-sm text-yellow-700">Behavior Points</div>
                        <div className="text-2xl font-bold text-yellow-800">{selectedKid.behaviorPoints}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <Tablet className="mx-auto mb-2 text-purple-500" size={24} />
                        <div className="text-sm text-purple-700">Tablet Tokens</div>
                        <div className="text-2xl font-bold text-purple-800">{selectedKid.tabletTokens}</div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-bold text-orange-800 mb-2">Streaks 🔥</h5>
                      <div className="space-y-2">
                        {Object.entries(selectedKid.streaks).map(([type, value]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="capitalize text-orange-700">{type}:</span>
                            <span className="font-bold text-orange-800">{value} days</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(currentUser?.role === 'parent' || currentUser?.kidId === selectedKid.id) && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Gift className="text-green-500" />
                        Log Your Chores
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Clean room', 'Take out trash', 'Feed pets', 'Help with dishes', 'Vacuum', 'Other'].map(chore => (
                          <button
                            key={chore}
                            onClick={() => {
                              if (chore === 'Other') {
                                const customChore = prompt('What chore did you complete?');
                                if (customChore) logChore(selectedKid.id, customChore);
                              } else {
                                logChore(selectedKid.id, chore);
                              }
                            }}
                            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 text-sm font-medium"
                          >
                            {chore}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 text-xs text-gray-600 bg-green-50 p-2 rounded">
                        💡 Tip: Each completed chore earns you 1 behavior point!
                      </div>
                    </div>
                  )}

                  {selectedKid.completedChores && selectedKid.completedChores.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">Recent Completed Chores</h4>
                      <div className="space-y-2">
                        {selectedKid.completedChores.slice(-5).map(chore => (
                          <div key={chore.id} className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                            <span className="font-medium text-green-800">{chore.description}</span>
                            <span className="text-sm text-green-600">{chore.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedKid(null)}
                    className="w-full bg-gray-500 text-white py-3 rounded-xl text-lg font-bold hover:bg-gray-600"
                  >
                    Back to Profile Selection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyAllowanceTracker;