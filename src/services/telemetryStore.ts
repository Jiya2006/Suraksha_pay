import { TelemetryLog, RiskAssessment, TransactionInput } from '../types';

const STORAGE_KEY = 'suraksha_upi_telemetry_logs_v1';

// Seed initial realistic history so the feedback loop is immediately demonstrated
const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'LOG-101',
    timestamp: '2026-10-04T14:12:00.000Z',
    amount: 11,
    payeeVpa: 'discom.billupdate992@paytm',
    payeeName: 'Bijli Bill Office Desk',
    riskScore: 88,
    riskLevel: 'CRITICAL',
    primaryThreat: 'Utility Disconnection Extortion & Coercion',
    userDecision: 'ABORTED_SAFE',
    interceptionReason: 'User followed warning to cut call and cancel transaction',
    signals: {
      isScreenSharingActive: false,
      isOnActiveCall: true,
      callDurationMinutes: 8,
      isPayeeInContacts: false,
      isPayeeVerifiedMerchant: false,
      payeeAccountAgeDays: 3,
      unusualHour: false,
      amountSurgeRatio: 0.2,
      urgencyKeywordFound: true,
      detectedKeywords: ['electricity', 'urgent']
    }
  },
  {
    id: 'LOG-102',
    timestamp: '2026-10-04T13:40:00.000Z',
    amount: 45000,
    payeeVpa: 'helpdesk.bankrefund44@okaxis',
    payeeName: 'Customer Support Server',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    primaryThreat: 'Remote Screen Mirroring Attack',
    userDecision: 'ABORTED_SAFE',
    interceptionReason: 'User terminated AnyDesk screen share and aborted payment',
    signals: {
      isScreenSharingActive: true,
      isOnActiveCall: true,
      callDurationMinutes: 14,
      isPayeeInContacts: false,
      isPayeeVerifiedMerchant: false,
      payeeAccountAgeDays: 1,
      unusualHour: false,
      amountSurgeRatio: 6.5,
      urgencyKeywordFound: true,
      detectedKeywords: ['refund', 'support']
    }
  },
  {
    id: 'LOG-103',
    timestamp: '2026-10-04T12:05:00.000Z',
    amount: 25000,
    payeeVpa: 'flipkart.support.claim7@ybl',
    payeeName: 'Flipkart Order Refund Desk',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    primaryThreat: 'Reverse Collect Request Deception',
    userDecision: 'ABORTED_SAFE',
    interceptionReason: 'User realized PIN would deduct money instead of credit refund',
    signals: {
      isScreenSharingActive: false,
      isOnActiveCall: true,
      callDurationMinutes: 6,
      isPayeeInContacts: false,
      isPayeeVerifiedMerchant: false,
      payeeAccountAgeDays: 5,
      unusualHour: false,
      amountSurgeRatio: 4.2,
      urgencyKeywordFound: true,
      detectedKeywords: ['refund', 'claim']
    }
  },
  {
    id: 'LOG-104',
    timestamp: '2026-10-04T11:15:00.000Z',
    amount: 15000,
    payeeVpa: 'sbi.kyc.verification91@ibl',
    payeeName: 'KYC Verification Officer',
    riskScore: 85,
    riskLevel: 'CRITICAL',
    primaryThreat: 'Social Engineering & Impersonation Panic',
    userDecision: 'ABORTED_SAFE',
    interceptionReason: 'User identified fake KYC deactivation scare',
    signals: {
      isScreenSharingActive: false,
      isOnActiveCall: true,
      callDurationMinutes: 12,
      isPayeeInContacts: false,
      isPayeeVerifiedMerchant: false,
      payeeAccountAgeDays: 2,
      unusualHour: true,
      amountSurgeRatio: 3.8,
      urgencyKeywordFound: true,
      detectedKeywords: ['kyc', 'freeze']
    }
  },
  {
    id: 'LOG-105',
    timestamp: '2026-10-04T09:30:00.000Z',
    amount: 480,
    payeeVpa: 'shreekrishna.kirana@hdfcbank',
    payeeName: 'Shree Krishna Daily Provisions',
    riskScore: 12,
    riskLevel: 'SAFE',
    primaryThreat: 'None (Legitimate Verified Transaction)',
    userDecision: 'OVERRIDDEN_PROCEEDED',
    interceptionReason: 'Normal safe purchase completed',
    signals: {
      isScreenSharingActive: false,
      isOnActiveCall: false,
      callDurationMinutes: 0,
      isPayeeInContacts: true,
      isPayeeVerifiedMerchant: true,
      payeeAccountAgeDays: 850,
      unusualHour: false,
      amountSurgeRatio: 0.8,
      urgencyKeywordFound: false,
      detectedKeywords: []
    }
  }
];

export function getTelemetryLogs(): TelemetryLog[] {
  if (typeof window === 'undefined') return INITIAL_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
}

export function logTransactionDecision(
  tx: TransactionInput,
  assessment: RiskAssessment,
  decision: 'ABORTED_SAFE' | 'OVERRIDDEN_PROCEEDED' | 'REPORTED_FALSE_ALARM',
  reason: string
): TelemetryLog {
  const newLog: TelemetryLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    amount: tx.amount,
    payeeVpa: tx.payeeVpa,
    payeeName: tx.payeeName,
    riskScore: assessment.riskScore,
    riskLevel: assessment.riskLevel,
    primaryThreat: assessment.primaryThreatType,
    userDecision: decision,
    interceptionReason: reason,
    signals: { ...tx.signals }
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getTelemetryLogs();
      const updated = [newLog, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving telemetry log:', e);
    }
  }

  return newLog;
}

export function clearTelemetryLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getTelemetrySummary() {
  const logs = getTelemetryLogs();
  const totalLogs = logs.length;
  const abortedScams = logs.filter(l => l.userDecision === 'ABORTED_SAFE' && l.riskScore >= 60);
  const rupeesSaved = abortedScams.reduce((sum, l) => sum + l.amount, 0);
  const falseAlarms = logs.filter(l => l.userDecision === 'REPORTED_FALSE_ALARM').length;
  const highRiskInterventions = logs.filter(l => l.riskScore >= 60).length;
  const interventionSuccessRate = highRiskInterventions > 0 
    ? Math.round((abortedScams.length / highRiskInterventions) * 100) 
    : 100;

  return {
    totalLogs,
    abortedScamsCount: abortedScams.length,
    rupeesSaved,
    falseAlarms,
    interventionSuccessRate
  };
}
