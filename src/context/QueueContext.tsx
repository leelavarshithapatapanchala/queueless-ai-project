import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  QueueToken, 
  Facility, 
  Department, 
  ServiceCounter, 
  AIRecommendation, 
  AppView, 
  UserRole,
  PriorityLevel,
  QueueStats
} from '../types';
import { 
  INITIAL_FACILITIES, 
  INITIAL_COUNTERS, 
  createInitialTokens, 
  INITIAL_RECOMMENDATIONS 
} from '../mockData';
import { playChimeSound } from '../utils/audio';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  time: string;
}

interface QueueContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  facilities: Facility[];
  selectedFacility: Facility;
  setSelectedFacility: (fac: Facility) => void;
  selectedDepartment: Department;
  setSelectedDepartment: (dept: Department) => void;
  tokens: QueueToken[];
  counters: ServiceCounter[];
  recommendations: AIRecommendation[];
  activeUserToken: QueueToken | null;
  setActiveUserToken: (token: QueueToken | null) => void;
  stats: QueueStats;
  notification: ToastMessage | null;
  dismissNotification: () => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  callNextToken: (counterId: string) => void;
  completeCurrentToken: (counterId: string) => void;
  recallCurrentToken: (counterId: string) => void;
  joinQueue: (data: {
    userName: string;
    userPhone: string;
    facilityId: string;
    departmentId: string;
    priority: PriorityLevel;
    notes?: string;
  }) => QueueToken;
  stepQueue: () => void;
  fastForwardToUserTurn: () => void;
  delayUserToken: (minutes: number) => void;
  toggleSteppingOut: () => void;
  applyRecommendation: (recId: string) => void;
  resetDemoData: () => void;
  selectDemoAccount: (accountRole: UserRole) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKENS: 'queueless_tokens_v1',
  COUNTERS: 'queueless_counters_v1',
  USER_TOKEN_ID: 'queueless_active_token_id_v1',
  RECS: 'queueless_recommendations_v1',
  ROLE: 'queueless_role_v1',
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<Facility>(INITIAL_FACILITIES[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(INITIAL_FACILITIES[0].departments[0]);
  const [userRole, setUserRoleState] = useState<UserRole>('user');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [notification, setNotification] = useState<ToastMessage | null>(null);

  // Initialize tokens from localStorage or mock
  const [tokens, setTokens] = useState<QueueToken[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOKENS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return createInitialTokens();
  });

  // Initialize counters from localStorage or mock
  const [counters, setCounters] = useState<ServiceCounter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNTERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COUNTERS;
  });

  // Active user token ID (defaults to 'tok-a47')
  const [activeTokenId, setActiveTokenId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_TOKEN_ID);
      if (saved !== null) return saved;
    } catch {
      // ignore
    }
    return 'tok-a47'; // Default demo token A-47
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RECOMMENDATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch { /* ignore */ }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
    } catch { /* ignore */ }
  }, [counters]);

  useEffect(() => {
    try {
      if (activeTokenId) {
        localStorage.setItem(STORAGE_KEYS.USER_TOKEN_ID, activeTokenId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_TOKEN_ID);
      }
    } catch { /* ignore */ }
  }, [activeTokenId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECS, JSON.stringify(recommendations));
    } catch { /* ignore */ }
  }, [recommendations]);

  // Derive active token object
  const activeUserToken = useMemo(() => {
    if (!activeTokenId) return null;
    return tokens.find((t) => t.id === activeTokenId) || null;
  }, [tokens, activeTokenId]);

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotification({
      id: Math.random().toString(),
      title,
      message,
      type,
      time,
    });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Compute Queue statistics
  const stats: QueueStats = useMemo(() => {
    const deptTokens = tokens.filter(t => t.departmentId === selectedDepartment.id);
    const waitingTokens = deptTokens.filter(t => t.status === 'waiting' || t.status === 'approaching');
    const servingTokens = deptTokens.filter(t => t.status === 'serving');
    const completedTokens = deptTokens.filter(t => t.status === 'completed');

    const totalWaiting = waitingTokens.length;
    const currentlyServing = servingTokens.length;
    const totalServedToday = completedTokens.length + 38; // base baseline
    const avgWait = Math.round(totalWaiting * (selectedDepartment.avgServiceMinutes / Math.max(1, selectedDepartment.activeCountersCount)));

    let crowdLevel: QueueStats['crowdLevel'] = 'Low';
    let congestionPercentage = 25;
    if (totalWaiting > 25) {
      crowdLevel = 'High';
      congestionPercentage = 88;
    } else if (totalWaiting > 15) {
      crowdLevel = 'Moderate';
      congestionPercentage = 60;
    }

    return {
      totalWaiting,
      currentlyServing,
      totalServedToday,
      averageWaitTimeMinutes: avgWait || 24,
      peakHour: '11:30 AM - 01:00 PM',
      crowdLevel,
      congestionPercentage,
    };
  }, [tokens, selectedDepartment]);

  // Call next token for a counter
  const callNextToken = useCallback((counterId: string) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter) return;

    // Find next eligible token in waiting or approaching status
    const waitingTokens = tokens.filter(
      t => t.departmentId === counter.departmentId && (t.status === 'waiting' || t.status === 'approaching')
    ).sort((a, b) => {
      // Prioritize urgent and senior
      const priorityOrder: Record<PriorityLevel, number> = { urgent: 0, accessibility: 1, senior: 2, standard: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.sequenceNumber - b.sequenceNumber;
    });

    if (waitingTokens.length === 0) {
      showToast('Queue Empty', `No waiting tokens for ${counter.name}`, 'info');
      return;
    }

    const nextToken = waitingTokens[0];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update tokens list
    setTokens(prev => {
      return prev.map(t => {
        // If previous token was serving on this counter, complete it
        if (t.id === counter.currentServingToken?.id) {
          return { ...t, status: 'completed', completedAt: nowStr };
        }
        // If this is the next token, set to serving
        if (t.id === nextToken.id) {
          return {
            ...t,
            status: 'serving',
            calledAt: nowStr,
            counterId: counter.id,
            counterName: counter.name,
            estimatedWaitMinutes: 0,
          };
        }
        // Update approaching status for the next 2 in line
        return t;
      });
    });

    // Update counter
    setCounters(prev => {
      return prev.map(c => {
        if (c.id === counterId) {
          return {
            ...c,
            status: 'busy',
            currentServingToken: {
              ...nextToken,
              status: 'serving',
              calledAt: nowStr,
              counterId: counter.id,
              counterName: counter.name,
            },
            servedCountToday: c.servedCountToday + 1,
          };
        }
        return c;
      });
    });

    // Play chime sound!
    playChimeSound();

    // Check if this token is our user's token!
    if (nextToken.id === activeTokenId) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
      showToast(
        `It's Your Turn! Token ${nextToken.tokenNumber}`,
        `Please proceed to ${counter.name} (${counter.staffName}).`,
        'alert'
      );
    } else {
      showToast(
        `Now Serving: ${nextToken.tokenNumber}`,
        `Called to ${counter.name} for ${nextToken.userName}`,
        'info'
      );
    }
  }, [counters, tokens, activeTokenId, showToast]);

  // Complete current token without calling next
  const completeCurrentToken = useCallback((counterId: string) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentServingToken) return;

    const completedToken = counter.currentServingToken;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTokens(prev => prev.map(t => {
      if (t.id === completedToken.id) {
        return { ...t, status: 'completed', completedAt: nowStr };
      }
      return t;
    }));

    setCounters(prev => prev.map(c => {
      if (c.id === counterId) {
        return {
          ...c,
          status: 'active',
          currentServingToken: null,
        };
      }
      return c;
    }));

    showToast('Consultation Finished', `Token ${completedToken.tokenNumber} marked as completed.`, 'success');
  }, [counters, showToast]);

  // Recall current token (re-chime & re-announce)
  const recallCurrentToken = useCallback((counterId: string) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentServingToken) return;

    playChimeSound();
    showToast(
      `Re-calling Token ${counter.currentServingToken.tokenNumber}`,
      `Please report to ${counter.name} immediately.`,
      'warning'
    );
  }, [counters, showToast]);

  // Step queue by 1 (Simulate 1 cycle)
  const stepQueue = useCallback(() => {
    // Choose Counter 1, 2, or 3 with least wait or active
    const availableCounter = counters.find(c => c.status === 'active') || counters[0];
    if (availableCounter) {
      callNextToken(availableCounter.id);
    }
  }, [counters, callNextToken]);

  // Fast forward directly to user's turn
  const fastForwardToUserTurn = useCallback(() => {
    if (!activeTokenId) return;
    const userTok = tokens.find(t => t.id === activeTokenId);
    if (!userTok) return;

    const targetCounter = counters[1] || counters[0]; // Counter 2
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTokens(prev => prev.map(t => {
      if (t.id === userTok.id) {
        return {
          ...t,
          status: 'serving',
          calledAt: nowStr,
          counterId: targetCounter.id,
          counterName: targetCounter.name,
          estimatedWaitMinutes: 0,
        };
      }
      // If sequence was before user, mark completed
      if (t.sequenceNumber < userTok.sequenceNumber && (t.status === 'waiting' || t.status === 'approaching')) {
        return { ...t, status: 'completed', completedAt: nowStr };
      }
      return t;
    }));

    setCounters(prev => prev.map(c => {
      if (c.id === targetCounter.id) {
        return {
          ...c,
          status: 'busy',
          currentServingToken: {
            ...userTok,
            status: 'serving',
            calledAt: nowStr,
            counterId: targetCounter.id,
            counterName: targetCounter.name,
          },
          servedCountToday: c.servedCountToday + 1,
        };
      }
      return c;
    }));

    playChimeSound();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#10b981'],
    });

    showToast(
      `Fast-Forward Complete! It's Your Turn!`,
      `Token ${userTok.tokenNumber} is now being served at ${targetCounter.name} (${targetCounter.staffName}).`,
      'alert'
    );
  }, [activeTokenId, tokens, counters, showToast]);

  // Delay user token by e.g. 10 mins (push back 3 spots)
  const delayUserToken = useCallback((minutes: number) => {
    if (!activeTokenId) return;
    setTokens(prev => {
      const userTok = prev.find(t => t.id === activeTokenId);
      if (!userTok) return prev;
      
      return prev.map(t => {
        if (t.id === activeTokenId) {
          return {
            ...t,
            sequenceNumber: t.sequenceNumber + 4,
            estimatedWaitMinutes: t.estimatedWaitMinutes + minutes,
            notes: `Delayed by user +${minutes}m`,
          };
        }
        return t;
      });
    });

    showToast(
      'Turn Delayed Successfully',
      `Your token has been pushed back by ~${minutes} minutes. We will notify you when you are 3 spots away.`,
      'info'
    );
  }, [activeTokenId, showToast]);

  // Toggle stepping out
  const toggleSteppingOut = useCallback(() => {
    if (!activeTokenId) return;
    setTokens(prev => prev.map(t => {
      if (t.id === activeTokenId) {
        const nextState = !t.steppingOut;
        const returnEta = nextState 
          ? new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined;
        return {
          ...t,
          steppingOut: nextState,
          returnEta,
        };
      }
      return t;
    }));

    const isNowSteppingOut = !activeUserToken?.steppingOut;
    showToast(
      isNowSteppingOut ? 'Stepping Out Mode Active' : 'Returned to Waiting Area',
      isNowSteppingOut 
        ? 'Safe zone enabled! We will send a priority SMS when 3 tokens remain (~7 min warning).' 
        : 'Welcome back. Your live position is locked in.',
      'success'
    );
  }, [activeTokenId, activeUserToken, showToast]);

  // Join queue
  const joinQueue = useCallback((data: {
    userName: string;
    userPhone: string;
    facilityId: string;
    departmentId: string;
    priority: PriorityLevel;
    notes?: string;
  }): QueueToken => {
    const facility = facilities.find(f => f.id === data.facilityId) || facilities[0];
    const department = facility.departments.find(d => d.id === data.departmentId) || facility.departments[0];
    
    // Find highest sequence number for department
    const deptTokens = tokens.filter(t => t.departmentId === department.id);
    const maxSeq = deptTokens.reduce((max, t) => Math.max(max, t.sequenceNumber), 46);
    const nextSeq = maxSeq + 1;
    const tokenNumber = `${department.code}-${nextSeq}`;
    
    // Calculate estimated wait
    const waitingCount = deptTokens.filter(t => t.status === 'waiting' || t.status === 'approaching').length;
    const waitMins = Math.max(4, Math.round((waitingCount + 1) * (department.avgServiceMinutes / Math.max(1, department.activeCountersCount))));

    const newToken: QueueToken = {
      id: `tok-${department.code.toLowerCase()}${nextSeq}`,
      tokenNumber,
      sequenceNumber: nextSeq,
      userName: data.userName.trim() || 'Visitor',
      userPhone: data.userPhone.trim() || '+1 (555) 000-0000',
      facilityId: facility.id,
      facilityName: facility.name,
      departmentId: department.id,
      departmentName: department.name,
      status: 'waiting',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: data.priority,
      estimatedWaitMinutes: waitMins,
      notes: data.notes,
    };

    setTokens(prev => [...prev, newToken]);
    setActiveTokenId(newToken.id);
    setSelectedFacility(facility);
    setSelectedDepartment(department);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#3b82f6', '#6366f1'],
    });

    showToast(
      `Token Generated: ${newToken.tokenNumber}`,
      `You're in line! Estimated wait is ~${waitMins} minutes.`,
      'success'
    );

    return newToken;
  }, [facilities, tokens, showToast]);

  // Apply AI Recommendation
  const applyRecommendation = useCallback((recId: string) => {
    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        return { ...r, applied: true };
      }
      return r;
    }));

    // If rec-1 (Activate Counter 4 with Dr. Davis)
    if (recId === 'rec-1') {
      setCounters(prev => {
        const existing4 = prev.find(c => c.id === 'counter-4');
        if (existing4) {
          return prev.map(c => c.id === 'counter-4' ? { ...c, status: 'active' } : c);
        }
        return [
          ...prev,
          {
            id: 'counter-4',
            counterNumber: 4,
            name: 'Counter 04 (Express)',
            staffName: 'Dr. Mark Davis',
            staffRole: 'Express Physician',
            departmentId: 'dept-general',
            status: 'active',
            servedCountToday: 8,
            avgHandlingMinutes: 2.2,
            currentServingToken: null,
          }
        ];
      });

      // Reduce estimated wait for all waiting tokens!
      setTokens(prev => prev.map(t => {
        if (t.status === 'waiting' || t.status === 'approaching') {
          return {
            ...t,
            estimatedWaitMinutes: Math.max(3, Math.round(t.estimatedWaitMinutes * 0.7)),
          };
        }
        return t;
      }));

      showToast(
        'Optimization Applied: Counter 4 Activated',
        'Dr. Mark Davis assigned to Express Consultations. Average patient wait reduced by 11.4 mins!',
        'success'
      );
    } else {
      showToast('Recommendation Applied', 'Queue routing rules adjusted in real-time.', 'success');
    }
  }, [showToast]);

  // Switch demo account role
  const selectDemoAccount = useCallback((role: UserRole) => {
    setUserRoleState(role);
    if (role === 'admin') {
      setCurrentView('admin-dashboard');
      showToast('Admin Session', 'Logged in as Administrator (admin@queueless.app)', 'info');
    } else {
      // If user has token, go to live-token; otherwise landing
      if (activeTokenId) {
        setCurrentView('live-token');
      } else {
        setCurrentView('join');
      }
      showToast('Patient Session', 'Logged in as Demo User (demo@queueless.app)', 'info');
    }
  }, [activeTokenId, showToast]);

  // Reset demo
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.COUNTERS);
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN_ID);
    localStorage.removeItem(STORAGE_KEYS.RECS);

    setTokens(createInitialTokens());
    setCounters(INITIAL_COUNTERS);
    setActiveTokenId('tok-a47');
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setSelectedFacility(INITIAL_FACILITIES[0]);
    setSelectedDepartment(INITIAL_FACILITIES[0].departments[0]);
    setCurrentView('landing');
    setUserRoleState('user');

    showToast('Demo State Reset', 'Fresh simulation data loaded with Token A-47 ready.', 'info');
  }, [showToast]);

  // Auto-simulation interval if enabled
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random counter to complete and advance
      const counterIdx = Math.floor(Math.random() * counters.length);
      const targetCounter = counters[counterIdx];
      if (targetCounter) {
        callNextToken(targetCounter.id);
      }
    }, 12000); // 12 seconds per step when auto-simulating

    return () => clearInterval(interval);
  }, [isSimulating, counters, callNextToken]);

  return (
    <QueueContext.Provider
      value={{
        userRole,
        setUserRole: setUserRoleState,
        currentView,
        setCurrentView,
        facilities,
        selectedFacility,
        setSelectedFacility,
        selectedDepartment,
        setSelectedDepartment,
        tokens,
        counters,
        recommendations,
        activeUserToken,
        setActiveUserToken: (t) => setActiveTokenId(t?.id || null),
        stats,
        notification,
        dismissNotification,
        isSimulating,
        setIsSimulating,
        callNextToken,
        completeCurrentToken,
        recallCurrentToken,
        joinQueue,
        stepQueue,
        fastForwardToUserTurn,
        delayUserToken,
        toggleSteppingOut,
        applyRecommendation,
        resetDemoData,
        selectDemoAccount,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
