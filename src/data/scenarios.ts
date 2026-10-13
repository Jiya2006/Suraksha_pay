import { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scam-electricity',
    name: 'Electricity Disconnection Scam',
    nameHi: 'बिजली बिल कटने की फर्जी धमकी',
    tagline: 'Fake Discom Officer demanding ₹11 token bill while holding victim on live call',
    taglineHi: 'फर्जी बिजली विभाग अधिकारी कॉल पर रोककर ₹11 बिल भरने का दबाव बना रहा है',
    category: 'SCAM',
    threatName: 'Utility Disconnection Extortion & Coercion',
    data: {
      payeeVpa: 'discom.billupdate992@paytm',
      payeeName: 'Bijli Bill Office Desk',
      amount: 11,
      note: 'Electricity Bill Reconnect Urgent',
      transactionType: 'UPI_PAY',
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
        detectedKeywords: ['electricity', 'bill', 'urgent', 'reconnect']
      }
    },
    scamStory: 'The user received a panicked SMS: "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Call 98765-XXXX immediately." The victim dialed, and the fake officer instructed them to immediately send ₹11 to update the meter on their UPI app while staying on the call.',
    scamStoryHi: 'उपभोक्ता को SMS मिला कि आज रात 9:30 बजे बिजली कट जाएगी। कॉल करने पर कथित अधिकारी ने कहा कि तुरंत कॉल पर रहते हुए ₹11 टोकन अमाउंट इस UPI पर भेजें ताकि लाइन चालू रहे। यह एक संगठित साइबर ठगी है!',
    rbiPatternRef: 'rbi-electricity'
  },
  {
    id: 'scam-screenshare',
    name: 'Screen Share Hijack (AnyDesk / TeamViewer)',
    nameHi: 'स्क्रीन शेयरिंग रिमोट एक्सेस फ्रॉड',
    tagline: 'Active screen-sharing detected! Fraudster watching the victim type their secret UPI PIN',
    taglineHi: 'स्क्रीन शेयरिंग चालू है! धोखेबाज़ कॉल पर आपका सीक्रेट UPI PIN देख रहा है',
    category: 'SCAM',
    threatName: 'Remote Screen Mirroring & Credential Harvesting',
    data: {
      payeeVpa: 'helpdesk.bankrefund44@okaxis',
      payeeName: 'Customer Support Server',
      amount: 45000,
      note: 'Refund processing charge',
      transactionType: 'UPI_PAY',
      signals: {
        isScreenSharingActive: true, // CRITICAL DANGER
        isOnActiveCall: true,
        callDurationMinutes: 14,
        isPayeeInContacts: false,
        isPayeeVerifiedMerchant: false,
        payeeAccountAgeDays: 1,
        unusualHour: false,
        amountSurgeRatio: 6.5,
        urgencyKeywordFound: true,
        detectedKeywords: ['refund', 'support', 'processing']
      }
    },
    scamStory: 'A fake tech support caller told the victim: "Download QuickSupport / AnyDesk app from Play Store to fix your pending refund." With screen-sharing running, the caller asked the victim to approve a transaction. The scammer can see every digit entered on screen!',
    scamStoryHi: 'धोखेबाज़ ने विक्टिम को AnyDesk ऐप डाउनलोड करने को कहा। स्क्रीन शेयरिंग चालू है और विक्टिम जब अपना गुप्त PIN डालेगा तो स्कैमर उसे लाइव देख लेगा और खाता खाली कर देगा!',
    rbiPatternRef: 'rbi-screenshare'
  },
  {
    id: 'scam-collect-refund',
    name: 'Reverse Collect Request (Claim Refund Trap)',
    nameHi: 'फर्जी रिफंड / पैसे पाने के नाम पर कलेक्ट रिक्वेस्ट',
    tagline: 'User told to enter PIN to "receive" refund of ₹25,000, but money will actually be DEDUCTED',
    taglineHi: 'पैसे आने का झांसा देकर ₹25,000 काटने की रिक्वेस्ट भेजी गई है',
    category: 'SCAM',
    threatName: 'Reverse Collect Request Deception',
    data: {
      payeeVpa: 'flipkart.support.claim7@ybl',
      payeeName: 'Flipkart Order Refund Desk',
      amount: 25000,
      note: 'Collect Request: Receive ₹25,000 Refund',
      transactionType: 'COLLECT_REQUEST',
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
        detectedKeywords: ['refund', 'claim', 'receive']
      }
    },
    scamStory: 'Victim complained on Twitter/Google about an undelivered parcel. Fake customer care called and sent a UPI Collect Request with note "Receive ₹25,000 Refund". The caller says: "Sir, please enter your UPI PIN to credit the money into your account."',
    scamStoryHi: 'स्कैमर ने विक्टिम को ₹25,000 का कलेक्ट रिक्वेस्ट भेजा है और कॉल पर कह रहा है कि "रिफंड पाने के लिए अपना UPI PIN डालें"। UPI में पैसे प्राप्त करने के लिए कभी भी PIN की ज़रूरत नहीं होती!',
    rbiPatternRef: 'rbi-collect-request'
  },
  {
    id: 'scam-kyc-expiry',
    name: 'Bank KYC Expiry Panic (Late Night)',
    nameHi: 'बैंक KYC एक्सपायरी की धमकी (रात के समय)',
    tagline: 'SMS threat of account freeze sent at 11:45 PM, unverified payee, urgent call',
    taglineHi: 'देर रात बैंक खाता फ्रीज होने का डर दिखाकर पैसे ट्रांसफर करने का दबाव',
    category: 'SCAM',
    threatName: 'Social Engineering & Impersonation Panic',
    data: {
      payeeVpa: 'sbi.kyc.verification91@ibl',
      payeeName: 'KYC Verification Officer',
      amount: 15000,
      note: 'Mandatory KYC Verification Deposit',
      transactionType: 'UPI_PAY',
      signals: {
        isScreenSharingActive: false,
        isOnActiveCall: true,
        callDurationMinutes: 12,
        isPayeeInContacts: false,
        isPayeeVerifiedMerchant: false,
        payeeAccountAgeDays: 2,
        unusualHour: true, // 11:45 PM
        amountSurgeRatio: 3.8,
        urgencyKeywordFound: true,
        detectedKeywords: ['kyc', 'verification', 'mandatory', 'freeze']
      }
    },
    scamStory: 'At 11:45 PM, user received an SMS that their SBI account will be blocked by midnight due to unlinked PAN card. The scammer on phone says "Deposit ₹15,000 security holding to verify your identity; it will be refunded in 5 minutes."',
    scamStoryHi: 'रात 11:45 बजे विक्टिम को बैंक खाता ब्लॉक होने का डर दिखाया गया। स्कैमर कॉल पर बोल रहा है कि पैन कार्ड वेरिफिकेशन के लिए तुरंत ₹15,000 जमा करें जो 5 मिनट में वापस मिल जाएंगे।',
    rbiPatternRef: 'rbi-kyc-expiry'
  },
  {
    id: 'safe-grocery',
    name: 'Daily Grocery Payment (Known Merchant)',
    nameHi: 'दैनिक किराने की दुकान (सुरक्षित पेमेंट)',
    tagline: 'Verified merchant QR scan, normal daytime, no phone call or screen-sharing',
    taglineHi: 'वेरिफाइड दुकानदार, कोई फोन कॉल या स्क्रीन शेयरिंग नहीं',
    category: 'SAFE',
    threatName: 'None (Legitimate Verified Transaction)',
    data: {
      payeeVpa: 'shreekrishna.kirana@hdfcbank',
      payeeName: 'Shree Krishna Daily Provisions',
      amount: 480,
      note: 'Groceries and milk',
      transactionType: 'QR_SCAN',
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
    },
    scamStory: 'The user is physically at their neighborhood grocery store scanning the store QR standee to pay ₹480 for vegetables and milk. Verified merchant, zero coercion signals.',
    scamStoryHi: 'उपयोगकर्ता अपनी स्थानीय किराने की दुकान पर खड़े होकर ₹480 का सुरक्षित भुगतान कर रहा है। दुकानदार वेरिफाइड है और कोई संदिग्ध सिग्नल नहीं है।',
    rbiPatternRef: ''
  },
  {
    id: 'safe-rent',
    name: 'Monthly House Rent Transfer (Known Contact)',
    nameHi: 'महीने का मकान किराया (जान-पहचान का खाता)',
    tagline: 'High amount (₹22,000) but to a saved family contact with 3+ years history',
    taglineHi: 'बड़ी राशि (₹22,000) लेकिन कॉन्टैक्ट्स में सेव पुराने मकान मालिक को भुगतान',
    category: 'SAFE',
    threatName: 'None (Authorized Planned Transfer)',
    data: {
      payeeVpa: 'sharma.landlord42@sbi',
      payeeName: 'Ramesh Sharma (Landlord)',
      amount: 22000,
      note: 'October 2026 Flat Rent',
      transactionType: 'UPI_PAY',
      signals: {
        isScreenSharingActive: false,
        isOnActiveCall: false,
        callDurationMinutes: 0,
        isPayeeInContacts: true,
        isPayeeVerifiedMerchant: false,
        payeeAccountAgeDays: 1200,
        unusualHour: false,
        amountSurgeRatio: 2.5,
        urgencyKeywordFound: false,
        detectedKeywords: ['rent']
      }
    },
    scamStory: 'User is paying monthly house rent of ₹22,000 to their saved landlord contact. Although the amount is relatively large, the payee is long-established and no scam manipulation signals exist.',
    scamStoryHi: 'उपयोगकर्ता अपने पुराने मकान मालिक को ₹22,000 का किराया भेज रहा है। राशि बड़ी होने के बावजूद कोई कॉल या स्क्रीन शेयरिंग नहीं है और प्राप्तकर्ता विश्वसनीय है।',
    rbiPatternRef: ''
  }
];
