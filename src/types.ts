export type QueueStatus = 'waiting' | 'approaching' | 'serving' | 'completed' | 'skipped' | 'cancelled';

export type PriorityLevel = 'standard' | 'senior' | 'accessibility' | 'urgent';

export interface QueueToken {
  id: string;
  tokenNumber: string;
  sequenceNumber: number;
  userName: string;
  userPhone: string;
  facilityId: string;
  facilityName: string;
  departmentId: string;
  departmentName: string;
  status: QueueStatus;
  joinedAt: string; // ISO string or time string
  calledAt?: string;
  completedAt?: string;
  counterId?: string;
  counterName?: string;
  priority: PriorityLevel;
  estimatedWaitMinutes: number;
  notes?: string;
  steppingOut?: boolean;
  returnEta?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string; // e.g. 'A', 'B', 'C'
  description: string;
  avgServiceMinutes: number;
  activeCountersCount: number;
  location: string;
  iconName: string;
}

export interface Facility {
  id: string;
  name: string;
  category: 'Hospital' | 'Diagnostic Center' | 'Bank' | 'Government Office' | 'College' | 'Service Center';
  address: string;
  operatingHours: string;
  departments: Department[];
  bannerImage?: string;
}

export interface ServiceCounter {
  id: string;
  counterNumber: number;
  name: string;
  staffName: string;
  staffRole: string;
  departmentId: string;
  currentServingToken?: QueueToken | null;
  status: 'active' | 'busy' | 'break' | 'closed';
  servedCountToday: number;
  avgHandlingMinutes: number;
}

export interface AIRecommendation {
  id: string;
  type: 'staffing' | 'crowd_surge' | 'break_optimization' | 'express_routing';
  title: string;
  impact: string;
  description: string;
  confidenceScore: number;
  suggestedAction: string;
  applied: boolean;
  timestamp: string;
}

export interface QueueStats {
  totalWaiting: number;
  currentlyServing: number;
  totalServedToday: number;
  averageWaitTimeMinutes: number;
  peakHour: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  congestionPercentage: number;
}

export type AppView = 
  | 'landing' 
  | 'join' 
  | 'live-token' 
  | 'admin-dashboard' 
  | 'signage-screen';

export type UserRole = 'user' | 'admin';
