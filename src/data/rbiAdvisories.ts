export interface FraudAdvisory {
  id: string;
  category: string;
  title: string;
  titleHi: string;
  modUsOperandi: string;
  modUsOperandiHi: string;
  redFlags: string[];
  safeAction: string;
  source: string;
}

export const RBI_FRAUD_ADVISORIES: FraudAdvisory[] = [
  {
    id: 'rbi-electricity',
    category: 'Utility Bill Threat',
    title: 'Electricity Power Disconnection Threat Scam',
    titleHi: 'बिजली बिल कटने की धमकी वाला फ्रॉड (Electricity Scam)',
    modUsOperandi: 'Fraudsters send spoofed SMS claiming power supply will be cut off by 9:30 PM due to an unpaid bill. When the victim calls the fake helpline, the fraudster asks them to pay ₹10/₹11 via a malicious UPI link or install a remote app.',
    modUsOperandiHi: 'स्कैमर नकली SMS भेजते हैं कि आज रात बिजली कट जाएगी। कॉल करने पर विक्टिम से ₹10/₹11 का टोकन पेमेंट या ऐप डाउनलोड करने को कहते हैं और खाता खाली कर देते हैं।',
    redFlags: [
      'Urgent threats of immediate utility cutoff',
      'Caller insists on staying on phone while you open your UPI app',
      'Asking to pay a small token fee (₹10 or ₹15) to an unverified private UPI ID'
    ],
    safeAction: 'Never pay through numbers received in SMS. Always check your official Discom electricity portal or state app.',
    source: 'RBI Cyber Safety Circular & National Cyber Crime Helpline (1930)'
  },
  {
    id: 'rbi-screenshare',
    category: 'Remote Screen Mirroring',
    title: 'Remote Access App Screen Recording (AnyDesk / TeamViewer / RustDesk)',
    titleHi: 'स्क्रीन शेयरिंग / रिमोट एक्सेस फ्रॉड (AnyDesk/TeamViewer)',
    modUsOperandi: 'Fraudster impersonates bank support or courier delivery agent and convinces user to install a screen-sharing tool. The scammer watches in real-time as the victim enters their 4/6 digit secret UPI PIN and drains their account.',
    modUsOperandiHi: 'धोखेबाज़ बैंक या कूरियर सपोर्ट बनकर मोबाइल में AnyDesk/TeamViewer डाउनलोड करवाता है। स्क्रीन शेयरिंग चालू होते ही वह आपका गुप्त UPI PIN देख लेता है।',
    redFlags: [
      'Active screen sharing icon or app running in the notification bar',
      'Caller instructing: "Do not cut the call, just open your GPay/PhonePe and put your PIN"',
      'No genuine bank official ever asks customers to share their phone screen'
    ],
    safeAction: 'Disconnect the screen sharing session immediately and turn off Wi-Fi/Mobile Data if suspicious.',
    source: 'RBI BE(A)WARE Booklet - Fraud Modus Operandi & NPCI Safety Directives'
  },
  {
    id: 'rbi-collect-request',
    category: 'UPI Collect / QR Code Confusion',
    title: 'Fake Refund / "Enter PIN to Receive Money" Fraud',
    titleHi: 'रिफंड / पैसे पाने के लिए PIN डालने का धोखा (Collect Request)',
    modUsOperandi: 'Victims selling goods on OLX or seeking refunds for failed deliveries receive a UPI "Collect Request" or QR Code. The scammer claims: "Scan this and enter your PIN to claim ₹25,000 refund into your bank account".',
    modUsOperandiHi: 'स्कैमर कहता है "पैसे आपके खाते में आने वाले हैं, बस QR कोड स्कैन करें और अपना PIN डालें"। सच यह है कि UPI में पैसे प्राप्त करने के लिए कभी भी PIN की ज़रूरत नहीं होती।',
    redFlags: [
      'Claiming you need to enter UPI PIN to RECEIVE cash (Rule: PIN is ONLY for DEDUCTION)',
      'Receiving unexpected "Collect Money" requests from unknown handles',
      'Caller rushing you saying the refund link will expire in 2 minutes'
    ],
    safeAction: 'Remember the golden rule: UPI PIN is entered ONLY to SEND money, NEVER to receive money.',
    source: 'NPCI UPI Safety Directive & RBI Consumer Awareness'
  },
  {
    id: 'rbi-kyc-expiry',
    category: 'Banking KYC / PAN Threat',
    title: 'Bank Account / SIM KYC Expiry & Deactivation Scare',
    titleHi: 'बैंक खाता / SIM कार्ड KYC बंद होने का डर (Fake KYC)',
    modUsOperandi: 'Fraudsters send messages warning that bank account, credit card, or SIM card will be deactivated within 24 hours unless KYC is updated via an APK link or quick verification transfer to an executive UPI ID.',
    modUsOperandiHi: 'संदेश भेजा जाता है कि आपका बैंक अकाउंट या SIM 24 घंटे में बंद हो जाएगा। तुरंत KYC नवीनीकरण के लिए इस नंबर पर पैसे भेजें या APK डाउनलोड करें।',
    redFlags: [
      'Panic inducing words: "URGENT", "BLOCKED IN 2 HOURS", "DEACTIVATION NOTICE"',
      'Payment demanded to an individual UPI handle (e.g. rahul987@okaxis) rather than corporate portal',
      'Request to install an APK file directly outside Google Play Store'
    ],
    safeAction: 'Banks never ask for KYC updates over WhatsApp, SMS links, or personal UPI IDs. Visit your branch or official net banking.',
    source: 'RBI Alert on KYC Frauds & CERT-In Advisory'
  }
];
