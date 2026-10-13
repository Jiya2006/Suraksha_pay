import { TransactionInput, RuleViolation } from '../types';

export function evaluateRules(tx: TransactionInput): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const { signals, transactionType, note, payeeVpa, payeeName, amount } = tx;

  // RULE 1: Active Screen Share (Fatal Security Violation)
  if (signals.isScreenSharingActive) {
    violations.push({
      id: 'RULE_SCREEN_SHARE_ACTIVE',
      title: 'Fatal Danger: Screen Mirroring / Sharing Active',
      titleHi: 'गंभीर खतरा: आपकी स्क्रीन शेयरिंग (AnyDesk/TeamViewer) चालू है!',
      description: 'Your screen is currently visible to someone else. If you enter your UPI PIN, the caller will see it and steal all your money.',
      descriptionHi: 'कोई अन्य व्यक्ति आपकी मोबाइल स्क्रीन देख रहा है। यदि आपने अपना गुप्त UPI PIN डाला, तो वह देख लेगा और आपका पूरा बैंक खाता खाली कर देगा।',
      severity: 'CRITICAL',
      weight: 50,
      category: 'SCREEN_SHARE'
    });
  }

  // RULE 2: Reverse Collect Request Confusion (The #1 UPI Refund Scam)
  if (transactionType === 'COLLECT_REQUEST') {
    const isRefundKeyword = /refund|reimburse|cashback|prize|reward|claim|win/i.test(note);
    if (isRefundKeyword || signals.isOnActiveCall) {
      violations.push({
        id: 'RULE_REVERSE_COLLECT_DECEPTION',
        title: 'Reverse Collect Trap: Money Will Be DEDUCTED, NOT Added!',
        titleHi: 'सावधान: यह पैसे मिलने का नहीं, आपके खाते से पैसे कटने का रिक्वेस्ट है!',
        description: 'You are approving a COLLECT request. UPI PIN is only needed to PAY. You NEVER need to enter PIN to receive money or refunds.',
        descriptionHi: 'यह पैसे पाने का नहीं बल्कि देने का अनुरोध है। UPI में पैसे आने के लिए कभी भी PIN नहीं डालना पड़ता। PIN डालने से आपके खाते से पैसे कट जाएंगे।',
        severity: 'CRITICAL',
        weight: 45,
        category: 'URGENCY_ENGINEERING'
      });
    }
  }

  // RULE 3: Active Phone Call with Unknown Stranger
  if (signals.isOnActiveCall && !signals.isPayeeInContacts && !signals.isPayeeVerifiedMerchant) {
    const durationText = signals.callDurationMinutes > 0 ? ` (${signals.callDurationMinutes} mins)` : '';
    violations.push({
      id: 'RULE_CALL_WITH_UNKNOWN_RECIPIENT',
      title: `Live Call Manipulation: Ongoing Phone Call${durationText}`,
      titleHi: `धोखाधड़ी का खतरा: आप अनजान व्यक्ति से फोन कॉल पर हैं${durationText}`,
      description: 'You are on an active phone call while paying an unknown person. 89% of UPI frauds happen while the victim is being coached on call.',
      descriptionHi: 'आप कॉल पर बात करते हुए किसी अनजान व्यक्ति को पैसे भेज रहे हैं। 89% ऑनलाइन ठगी इसी तरह कॉल पर निर्देश देकर कराई जाती है।',
      severity: 'HIGH',
      weight: 30,
      category: 'PHONE_COERCION'
    });
  }

  // RULE 4: Urgent Bill / Electricity Disconnection keywords
  const textCorpus = `${note} ${payeeName} ${payeeVpa}`.toLowerCase();
  const hasUrgencyKeywords = /electricity|bijli|discom|power|bill|cut|disconnect|kyc|pan|block|freeze|suspended|urgent/i.test(textCorpus);
  if (hasUrgencyKeywords && !signals.isPayeeVerifiedMerchant) {
    violations.push({
      id: 'RULE_SOCIAL_ENGINEERING_PANIC',
      title: 'Scam Threat Keywords: Utility or KYC Panic Detected',
      titleHi: 'धमकी भरे शब्द मिले: बिजली कटने या बैंक KYC बंद होने का बहाना',
      description: `Keywords found in transaction: "${signals.detectedKeywords.join(', ') || 'Urgent/Bill'}". Genuine utility boards or banks never ask for payment to private UPI handles.`,
      descriptionHi: `लेन-देन में धमकी भरे शब्द मिले। सरकारी बिजली विभाग या बैंक कभी भी निजी UPI ID पर पैसे नहीं मांगते।`,
      severity: 'HIGH',
      weight: 25,
      category: 'URGENCY_ENGINEERING'
    });
  }

  // RULE 5: Brand New Unverified VPA
  if (!signals.isPayeeVerifiedMerchant && signals.payeeAccountAgeDays <= 7) {
    violations.push({
      id: 'RULE_NEWLY_CREATED_VPA',
      title: `Brand New Untrusted Payee (Created ${signals.payeeAccountAgeDays} days ago)`,
      titleHi: `बिल्कुल नया अज्ञात खाता (सिर्फ ${signals.payeeAccountAgeDays} दिन पहले बना)`,
      description: 'Scammers frequently create temporary disposable UPI handles. This payee account was created just recently and has no trust history.',
      descriptionHi: 'धोखेबाज़ नए-नए UPI खाते बनाकर ठगी करते हैं। इस खाते का कोई पुराना रिकॉर्ड या ट्रस्ट स्कोर नहीं है।',
      severity: 'MEDIUM',
      weight: 15,
      category: 'UNVERIFIED_PAYEE'
    });
  }

  // RULE 6: Late Night / Unusual Time Anomaly with High Surge
  if (signals.unusualHour && signals.amountSurgeRatio > 2.0 && !signals.isPayeeInContacts) {
    violations.push({
      id: 'RULE_LATE_NIGHT_HIGH_SURGE',
      title: 'Odd Hours High-Surge Anomaly',
      titleHi: 'देर रात असामान्य बड़ी रकम का भुगतान',
      description: 'High-value transaction at an unusual hour (late night) to an unverified recipient.',
      descriptionHi: 'देर रात किसी अनजान खाते में सामान्य से बहुत अधिक राशि भेजी जा रही है।',
      severity: 'LOW',
      weight: 10,
      category: 'ANOMALOUS_AMOUNT'
    });
  }

  return violations;
}
