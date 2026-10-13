/**
 * Web Speech API Voice Coach for elderly & first-time digital users
 * Reads aloud real-time plain language warnings in Hindi or English
 */

class VoiceCoachService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, lang: 'hi-IN' | 'en-IN' | 'en-US' = 'hi-IN', onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment');
      return;
    }

    this.stop(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower pace for clarity and elderly comprehension
    utterance.pitch = 1.0;

    // Pick best available voice matching requested language if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const voiceCoach = new VoiceCoachService();
