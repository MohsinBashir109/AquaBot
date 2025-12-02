import Speech from '@mhpdev/react-native-speech';

interface TextToSpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
}

class TextToSpeechService {
  private isSpeaking: boolean = false;
  private currentUtteranceId: string | null = null;

  /**
   * Check if TTS is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const available = await Speech.isAvailable();
      return available;
    } catch (error) {
      console.error('🔊 [TTS] Error checking availability:', error);
      return false;
    }
  }

  /**
   * Normalize any value to a string for TTS
   */
  private normalizeText(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return value
        .map(item => this.normalizeText(item))
        .filter(Boolean)
        .join(', ');
    }
    if (typeof value === 'object') {
      // Common backend shapes
      const possibleKeys = [
        'text',
        'message',
        'Message',
        'messageEnglish',
        'MessageEnglish',
        'content',
        'Content',
        'replyText',
        'ReplyText',
      ];
      for (const key of possibleKeys) {
        if (value[key]) {
          return this.normalizeText(value[key]);
        }
      }
      try {
        return JSON.stringify(value);
      } catch (err) {
        console.warn('🔊 [TTS] Unable to stringify value for speech:', err);
        return '';
      }
    }
    return String(value);
  }

  /**
   * Speak the given text
   */
  async speak(
    text: string | any,
    options: TextToSpeechOptions = {},
  ): Promise<void> {
    try {
      // Normalize text to ensure it's always a string
      const normalizedText = this.normalizeText(text);
      
      // Stop any ongoing speech first
      if (this.isSpeaking) {
        await this.stop();
      }

      if (!normalizedText || normalizedText.trim().length === 0) {
        console.warn('🔊 [TTS] Empty text provided after normalization');
        return;
      }

      // Default options
      const defaultOptions = {
        language: options.language || 'en-US', // Default to English
        pitch: options.pitch || 1.0,
        rate: options.rate || 1.0, // Normal speed (1.0 = normal, range typically 0.0-2.0)
      };

      console.log('🔊 [TTS] Speaking:', {
        text: normalizedText.substring(0, 50) + '...',
        language: defaultOptions.language,
        originalType: typeof text,
      });

      // Generate a unique ID for this utterance
      this.currentUtteranceId = `tts-${Date.now()}`;
      this.isSpeaking = true;

      // Ensure we're passing a clean string to the native module
      const finalText = normalizedText.trim();
      
      // Speak the text using speakWithOptions - pass text and options separately
      // The library expects: speakWithOptions(text: string, options: VoiceOptions)
      await Speech.speakWithOptions(finalText, {
        language: String(defaultOptions.language),
        pitch: Number(defaultOptions.pitch),
        rate: Number(defaultOptions.rate),
      });

      // Note: The library doesn't provide a callback for when speech finishes
      // So we'll set isSpeaking to false after a reasonable delay
      // This is a limitation of the library
      setTimeout(() => {
        this.isSpeaking = false;
        this.currentUtteranceId = null;
      }, finalText.length * 100); // Rough estimate: 100ms per character
    } catch (error: any) {
      console.error('🔊 [TTS] Error speaking:', error);
      this.isSpeaking = false;
      this.currentUtteranceId = null;
      throw error;
    }
  }

  /**
   * Stop current speech
   */
  async stop(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        console.log('🔊 [TTS] Stopped speaking');
      }
      this.isSpeaking = false;
      this.currentUtteranceId = null;
    } catch (error) {
      console.error('🔊 [TTS] Error stopping speech:', error);
      this.isSpeaking = false;
      this.currentUtteranceId = null;
    }
  }

  /**
   * Get current speaking status
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get language code based on locale
   */
  getLanguageCode(locale: 'en' | 'ur'): string {
    switch (locale) {
      case 'ur':
        return 'ur-PK'; // Urdu (Pakistan)
      case 'en':
      default:
        return 'en-US'; // English (US)
    }
  }
}

export const textToSpeechService = new TextToSpeechService();
export default textToSpeechService;

