import { Facility, ServiceCounter, QueueToken, AIRecommendation } from './types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-citycare',
    name: 'CityCare Hospital',
    category: 'Hospital',
    address: '450 Health Sciences Parkway, Metro Medical District',
    operatingHours: '08:00 AM - 08:00 PM',
    departments: [
      {
        id: 'dept-general',
        name: 'General Consultation',
        code: 'A',
        description: 'Outpatient primary care, general triage, and physician consultations',
        avgServiceMinutes: 3.2,
        activeCountersCount: 3,
        location: 'Wing B, 1st Floor',
        iconName: 'Stethoscope',
      },
      {
        id: 'dept-cardio',
        name: 'Cardiology & ECG',
        code: 'C',
        description: 'Cardiovascular screening, ECG diagnostics, and specialist evaluations',
        avgServiceMinutes: 8.5,
        activeCountersCount: 2,
        location: 'Heart Center, 2nd Floor',
        iconName: 'HeartPulse',
      },
      {
        id: 'dept-radiology',
        name: 'Radiology & Imaging',
        code: 'R',
        description: 'X-Ray, Ultrasound, and CT Scan diagnostics',
        avgServiceMinutes: 12.0,
        activeCountersCount: 2,
        location: 'Basement Level 1',
        iconName: 'ScanLine',
      },
      {
        id: 'dept-pharmacy',
        name: 'Central Pharmacy Dispensation',
        code: 'P',
        description: 'Prescription pickup and dosage counseling',
        avgServiceMinutes: 2.1,
        activeCountersCount: 4,
        location: 'Main Lobby East',
        iconName: 'Pill',
      },
    ],
  },
  {
    id: 'fac-apex-diag',
    name: 'Apex Diagnostic & Pathology Center',
    category: 'Diagnostic Center',
    address: '120 Science Boulevard, Suite 300',
    operatingHours: '06:30 AM - 09:00 PM',
    departments: [
      {
        id: 'dept-blood-tests',
        name: 'Phlebotomy & Blood Draws',
        code: 'B',
        description: 'Fasting routine blood tests, lipid panels, and CBC',
        avgServiceMinutes: 2.8,
        activeCountersCount: 4,
        location: 'Suite 101',
        iconName: 'Syringe',
      },
      {
        id: 'dept-mri',
        name: 'Advanced MRI Suite',
        code: 'M',
        description: 'High-definition 3T MRI scanning appointments',
        avgServiceMinutes: 22.0,
        activeCountersCount: 2,
        location: 'Suite 104',
        iconName: 'Activity',
      },
    ],
  },
  {
    id: 'fac-metro-bank',
    name: 'Metro First National Bank',
    category: 'Bank',
    address: '88 Wall & Commerce Avenue',
    operatingHours: '09:00 AM - 05:00 PM',
    departments: [
      {
        id: 'dept-teller',
        name: 'Cash Deposits & Teller Services',
        code: 'T',
        description: 'Cash deposits, withdrawals, foreign exchange, and drafts',
        avgServiceMinutes: 4.0,
        activeCountersCount: 5,
        location: 'Ground Floor Teller Hall',
        iconName: 'Coins',
      },
      {
        id: 'dept-loans',
        name: 'Personal & Business Loans',
        code: 'L',
        description: 'Mortgage inquiries, SME credit lines, and refinancing',
        avgServiceMinutes: 15.0,
        activeCountersCount: 3,
        location: '2nd Floor Advisory Suites',
        iconName: 'Briefcase',
      },
    ],
  },
  {
    id: 'fac-civic-office',
    name: 'Metropolitan Citizen & Passport Center',
    category: 'Government Office',
    address: '500 Civic Square, Tower North',
    operatingHours: '08:30 AM - 04:30 PM',
    departments: [
      {
        id: 'dept-passport',
        name: 'Passport & Identity Verification',
        code: 'D',
        description: 'Biometric capture, renewal verification, and expedited processing',
        avgServiceMinutes: 6.5,
        activeCountersCount: 6,
        location: 'Hall A',
        iconName: 'FileText',
      },
      {
        id: 'dept-notary',
        name: 'Licensing & Property Records',
        code: 'N',
        description: 'Title registrations, deed notarizations, and permits',
        avgServiceMinutes: 9.0,
        activeCountersCount: 3,
        location: 'Hall B',
        iconName: 'Stamp',
      },
    ],
  },
  {
    id: 'fac-summit-univ',
    name: 'Summit State University Registrar',
    category: 'College',
    address: 'Hall of Sciences, Central Campus Quad',
    operatingHours: '09:00 AM - 04:00 PM',
    departments: [
      {
        id: 'dept-admissions',
        name: 'Enrollment & Transcripts',
        code: 'U',
        description: 'Graduation checks, certified transcripts, course adds/drops',
        avgServiceMinutes: 5.0,
        activeCountersCount: 3,
        location: 'Student Hub 200',
        iconName: 'GraduationCap',
      },
    ],
  },
];

export const INITIAL_COUNTERS: ServiceCounter[] = [
  {
    id: 'counter-1',
    counterNumber: 1,
    name: 'Counter 01',
    staffName: 'Dr. Sarah Jenkins',
    staffRole: 'Senior Attending Physician',
    departmentId: 'dept-general',
    status: 'busy',
    servedCountToday: 18,
    avgHandlingMinutes: 3.1,
    currentServingToken: {
      id: 'tok-a34',
      tokenNumber: 'A-34',
      sequenceNumber: 34,
      userName: 'Robert Miller',
      userPhone: '+1 (555) 302-8819',
      facilityId: 'fac-citycare',
      facilityName: 'CityCare Hospital',
      departmentId: 'dept-general',
      departmentName: 'General Consultation',
      status: 'serving',
      joinedAt: '10:48 AM',
      calledAt: '11:12 AM',
      counterId: 'counter-1',
      counterName: 'Counter 01',
      priority: 'standard',
      estimatedWaitMinutes: 0,
    },
  },
  {
    id: 'counter-2',
    counterNumber: 2,
    name: 'Counter 02',
    staffName: 'Dr. Michael Chen',
    staffRole: 'Consulting Physician',
    departmentId: 'dept-general',
    status: 'busy',
    servedCountToday: 16,
    avgHandlingMinutes: 3.4,
    currentServingToken: {
      id: 'tok-a35',
      tokenNumber: 'A-35',
      sequenceNumber: 35,
      userName: 'Elena Rostova',
      userPhone: '+1 (555) 749-1120',
      facilityId: 'fac-citycare',
      facilityName: 'CityCare Hospital',
      departmentId: 'dept-general',
      departmentName: 'General Consultation',
      status: 'serving',
      joinedAt: '10:52 AM',
      calledAt: '11:14 AM',
      counterId: 'counter-2',
      counterName: 'Counter 02',
      priority: 'standard',
      estimatedWaitMinutes: 0,
    },
  },
  {
    id: 'counter-3',
    counterNumber: 3,
    name: 'Counter 03',
    staffName: 'Dr. Amara Patel',
    staffRole: 'Triage & Specialist',
    departmentId: 'dept-general',
    status: 'active',
    servedCountToday: 19,
    avgHandlingMinutes: 2.9,
    currentServingToken: null,
  },
];

// Generates the realistic queue line leading up to A-47
export function createInitialTokens(): QueueToken[] {
  const tokens: QueueToken[] = [];

  // Completed tokens
  for (let i = 28; i <= 33; i++) {
    tokens.push({
      id: `tok-a${i}`,
      tokenNumber: `A-${i}`,
      sequenceNumber: i,
      userName: `Patient #${i}`,
      userPhone: `+1 (555) 234-${1000 + i}`,
      facilityId: 'fac-citycare',
      facilityName: 'CityCare Hospital',
      departmentId: 'dept-general',
      departmentName: 'General Consultation',
      status: 'completed',
      joinedAt: `10:${i} AM`,
      completedAt: `11:0${i - 28} AM`,
      priority: 'standard',
      estimatedWaitMinutes: 0,
    });
  }

  // Currently serving tokens A-34 and A-35
  tokens.push({
    id: 'tok-a34',
    tokenNumber: 'A-34',
    sequenceNumber: 34,
    userName: 'Robert Miller',
    userPhone: '+1 (555) 302-8819',
    facilityId: 'fac-citycare',
    facilityName: 'CityCare Hospital',
    departmentId: 'dept-general',
    departmentName: 'General Consultation',
    status: 'serving',
    joinedAt: '10:48 AM',
    calledAt: '11:12 AM',
    counterId: 'counter-1',
    counterName: 'Counter 01',
    priority: 'standard',
    estimatedWaitMinutes: 0,
  });

  tokens.push({
    id: 'tok-a35',
    tokenNumber: 'A-35',
    sequenceNumber: 35,
    userName: 'Elena Rostova',
    userPhone: '+1 (555) 749-1120',
    facilityId: 'fac-citycare',
    facilityName: 'CityCare Hospital',
    departmentId: 'dept-general',
    departmentName: 'General Consultation',
    status: 'serving',
    joinedAt: '10:52 AM',
    calledAt: '11:14 AM',
    counterId: 'counter-2',
    counterName: 'Counter 02',
    priority: 'standard',
    estimatedWaitMinutes: 0,
  });

  // Approaching tokens
  const sampleNames = [
    'Marcus Vance',
    'Chloe Bennett',
    'Aaliyah Khan',
    'David O\'Connor',
    'Sophia Martinez',
    'James Liu',
    'Grace Hopper',
    'Rajesh Kumar',
    'Emma Watson',
    'Liam Smith',
    'Noah Williams',
    'Olivia Taylor', // A-46
    'Alex Morgan', // A-47 (Our Demo User!)
    'Daniel Craig',
    'Mia Johansson',
    'Ethan Hunt',
    'Isabella Rossi',
    'Lucas Scott',
    'Harper Lee',
    'Benjamin Franklin',
  ];

  // From A-36 up to A-55
  for (let i = 36; i <= 55; i++) {
    const isOurUser = i === 47;
    const nameIndex = i - 36;
    const name = isOurUser ? 'You (Demo Patient)' : (sampleNames[nameIndex] || `Visitor ${i}`);
    const phone = isOurUser ? '+1 (555) 892-4412' : `+1 (555) 441-${2000 + i}`;
    
    // Status: 36 and 37 are 'approaching'
    const status = (i <= 37) ? 'approaching' : 'waiting';
    const ahead = i - 35; // e.g. for 47, ahead is 12!
    const wait = Math.round(ahead * 2.0); // 12 * 2 = 24 mins

    tokens.push({
      id: `tok-a${i}`,
      tokenNumber: `A-${i}`,
      sequenceNumber: i,
      userName: name,
      userPhone: phone,
      facilityId: 'fac-citycare',
      facilityName: 'CityCare Hospital',
      departmentId: 'dept-general',
      departmentName: 'General Consultation',
      status: status,
      joinedAt: `11:${i < 50 ? '0' + (i - 35) : (i - 35)} AM`,
      priority: (i === 38) ? 'senior' : (i === 42 ? 'urgent' : 'standard'),
      estimatedWaitMinutes: wait,
    });
  }

  return tokens;
}

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'staffing',
    title: 'Surge in General Consultation Queue',
    impact: 'Reduces average wait by 11.4 mins',
    description: 'General Consultation is experiencing a 34% velocity surge. Telehealth Counter 4 is currently idle. Reallocate Dr. Davis to activate Counter 4 immediately.',
    confidenceScore: 94,
    suggestedAction: 'Activate Counter 4 with Dr. Davis',
    applied: false,
    timestamp: 'Just now',
  },
  {
    id: 'rec-2',
    type: 'express_routing',
    title: 'Express Vitals Triage Route',
    impact: 'Clears 6 patients in ~8 minutes',
    description: 'Tokens A-38, A-41, and A-44 require prescription renewal & blood pressure vitals only. Route to the Express Station to bypass main consultation stalls.',
    confidenceScore: 89,
    suggestedAction: 'Enable Express Lane Routing',
    applied: false,
    timestamp: '4 mins ago',
  },
  {
    id: 'rec-3',
    type: 'crowd_surge',
    title: 'Predictive Lunchtime Spike (12:15 PM - 1:45 PM)',
    impact: 'Prevent 45-min bottleneck',
    description: 'Historic Monday intake predicts 42 walk-ins between 12:30 and 1:30 PM. Stagger doctor lunch rotations by 25 minutes to maintain 3 active counters.',
    confidenceScore: 96,
    suggestedAction: 'Stagger Staff Break Schedule',
    applied: false,
    timestamp: '12 mins ago',
  },
];

export const HOURLY_QUEUE_ANALYTICS = [
  { hour: '08:00 AM', waiting: 8, served: 12, avgWait: 11 },
  { hour: '09:00 AM', waiting: 16, served: 24, avgWait: 15 },
  { hour: '10:00 AM', waiting: 24, served: 31, avgWait: 19 },
  { hour: '11:00 AM', waiting: 27, served: 28, avgWait: 24 }, // Current hour
  { hour: '12:00 PM', waiting: 34, served: 26, avgWait: 29 }, // Predicted peak
  { hour: '01:00 PM', waiting: 29, served: 30, avgWait: 23 },
  { hour: '02:00 PM', waiting: 18, served: 25, avgWait: 17 },
  { hour: '03:00 PM', waiting: 14, served: 22, avgWait: 13 },
  { hour: '04:00 PM', waiting: 9, served: 16, avgWait: 10 },
];

export const COUNTER_PERFORMANCE_METRICS = [
  { name: 'Counter 01 (Dr. Jenkins)', patientsServed: 18, avgTime: 3.1, rating: 4.9, efficiency: 96 },
  { name: 'Counter 02 (Dr. Chen)', patientsServed: 16, avgTime: 3.4, rating: 4.8, efficiency: 91 },
  { name: 'Counter 03 (Dr. Patel)', patientsServed: 19, avgTime: 2.9, rating: 4.9, efficiency: 98 },
  { name: 'Counter 04 (Express / Idle)', patientsServed: 7, avgTime: 2.0, rating: 4.7, efficiency: 84 },
];
