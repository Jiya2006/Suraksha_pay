export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DeviceSignals {
  isScreenSharingActive: boolean;
  isOnActiveCall: boolean;
  callDurationMinutes: number;
  isPayeeInContacts: boolean;
  isPayeeVerifiedMerchant: boolean;
  payeeAccountAgeDays: number;
  unusualHour: boolean; // e.g. late night 11pm - 5am
  amountSurgeRatio: number; // e.g. 1.0 = normal, 5.0 = 5x typical transaction
  urgencyKeywordFound: boolean;
  detectedKeywords: string[];
}

export interface TransactionInput {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  note: string;
  transactionType: 'UPI_PAY' | 'COLLECT_REQUEST' | 'QR_SCAN';
  signals: DeviceSignals;
}

export interface RuleViolation {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
  category: 'SCREEN_SHARE' | 'PHONE_COERCION' | 'UNVERIFIED_PAYEE' | 'URGENCY_ENGINEERING' | 'ANOMALOUS_AMOUNT';
}

export interface FeatureContribution {
  featureName: string;
  featureLabel: string;
  value: string | number | boolean;
  impactScore: number; // + points contributed to risk
  direction: 'RISK' | 'SAFE';
}

export interface RiskAssessment {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  ruleViolations: RuleViolation[];
  featureContributions: FeatureContribution[];
  mlConfidence: number; // 0 - 1
  primaryThreatType: string;
  primaryThreatTypeHi: string;
  plainLanguageSummary: string;
  plainLanguageSummaryHi: string;
  coachingRecommendations: {
    english: string[];
    hinglish: string[];
  };
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  amount: number;
  payeeVpa: string;
  payeeName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryThreat: string;
  userDecision: 'ABORTED_SAFE' | 'OVERRIDDEN_PROCEEDED' | 'REPORTED_FALSE_ALARM';
  interceptionReason: string;
  signals: DeviceSignals;
}

export interface DemoScenario {
  id: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  category: 'SCAM' | 'SAFE';
  threatName: string;
  data: TransactionInput;
  scamStory: string;
  scamStoryHi: string;
  rbiPatternRef: string;
}

export interface ModelMetrics {
  totalSyntheticSamples: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falseAlarmRate: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}
