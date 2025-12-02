import { useState, useEffect, useCallback } from 'react';
import Voice from '@react-native-voice/voice';
import { Platform, PermissionsAndroid } from 'react-native';

interface UseSpeechToTextOptions {
  language?: 'en' | 'ur';
}

interface UseSpeechToTextReturn {
  isRecording: boolean;
  recognizedText: string;
  error: string | null;
  startRecording: (language?: 'en' | 'ur') => Promise<void>;
  stopRecording: () => Promise<void>;
  clearText: () => void;
}

export const useSpeechToText = (
  options?: UseSpeechToTextOptions,
): UseSpeechToTextReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Voice module and set up event listeners
    const initializeVoice = async () => {
      try {
        // Destroy any existing instance first to ensure clean state
        await Voice.destroy();
        console.log('🎤 [STT] Voice module initialized');
      } catch (err) {
        console.warn('🎤 [STT] Error initializing Voice module:', err);
      }
    };

    initializeVoice();

    // Set up event listeners
    Voice.onSpeechStart = () => {
      console.log('🎤 [STT] Speech recognition started');
      setIsRecording(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      console.log('🎤 [STT] Speech recognition ended');
      setIsRecording(false);
    };

    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        console.log('🎤 [STT] Recognized text:', text);
        setRecognizedText(text);
      }
    };

    Voice.onSpeechPartialResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        console.log('🎤 [STT] Partial result:', text);
        setRecognizedText(text);
      }
    };

    Voice.onSpeechError = (e: any) => {
      console.error('🎤 [STT] Speech recognition error:', e);
      setError(e.error?.message || 'Speech recognition error');
      setIsRecording(false);
    };

    // Cleanup on unmount
    return () => {
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch((err) => console.warn('🎤 [STT] Error cleaning up Voice:', err));
    };
  }, []);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        // First check if permission is already granted
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        
        if (checkResult) {
          console.log('🎤 [STT] Microphone permission already granted');
          return true;
        }

        // If not granted, request it
        console.log('🎤 [STT] Requesting microphone permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'AquaBot needs access to your microphone to convert speech to text.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('🎤 [STT] Permission request result:', granted, 'Granted:', isGranted);
        
        if (!isGranted) {
          console.warn('🎤 [STT] Microphone permission denied by user');
        }
        
        return isGranted;
      } catch (err) {
        console.error('🎤 [STT] Error requesting microphone permission:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const getLanguageCode = (lang?: 'en' | 'ur'): string => {
    const language = lang || options?.language || 'en';
    // Android speech recognition language codes
    switch (language) {
      case 'ur':
        return 'ur-PK'; // Urdu (Pakistan)
      case 'en':
      default:
        return 'en-US'; // English (US)
    }
  };

  const startRecording = useCallback(
    async (language?: 'en' | 'ur') => {
      try {
        setError(null);
        setRecognizedText('');

        // Request permission first
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          const errorMsg = 'Microphone permission is required. Please grant permission in app settings.';
          console.error('🎤 [STT]', errorMsg);
          setError(errorMsg);
          return;
        }

        // Double-check permission status before proceeding
        if (Platform.OS === 'android') {
          const checkResult = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          if (!checkResult) {
            const errorMsg = 'Microphone permission not granted. Please check app settings.';
            console.error('🎤 [STT]', errorMsg);
            setError(errorMsg);
            return;
          }
        }

        // Get language code
        const langCode = getLanguageCode(language);
        console.log('🎤 [STT] Starting recording with language:', langCode);

        // Ensure Voice module is properly initialized before starting
        try {
          // Destroy any existing instance to ensure clean state
          await Voice.destroy();
          console.log('🎤 [STT] Voice module cleaned up');
          
          // Small delay to ensure module is ready
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (destroyErr) {
          console.warn('🎤 [STT] Error destroying Voice (may be normal):', destroyErr);
        }

        // Try to start recognition directly - this will fail gracefully if not available
        // Skip the isAvailable() check as it may throw errors on some devices
        try {
          // Check if Voice module exists
          if (!Voice || typeof Voice.start !== 'function') {
            throw new Error('Voice module is not properly initialized. Please rebuild the app.');
          }
          
          await Voice.start(langCode);
          console.log('🎤 [STT] Successfully started recording');
        } catch (startError: any) {
          console.error('🎤 [STT] Voice.start() error:', startError);
          console.error('🎤 [STT] Error details:', JSON.stringify(startError, null, 2));
          
          // Provide more specific error messages based on the error
          let errorMessage = 'Failed to start speech recognition';
          
          const errorMsg = startError?.message || startError?.error?.message || String(startError);
          const errorCode = startError?.code || startError?.error?.code;
          
          console.log('🎤 [STT] Error message:', errorMsg);
          console.log('🎤 [STT] Error code:', errorCode);
          
          if (errorMsg) {
            const lowerMsg = errorMsg.toLowerCase();
            if (lowerMsg.includes('null') || lowerMsg.includes('startSpeech') || lowerMsg.includes('cannot read')) {
              errorMessage = 'Speech recognition module not initialized. Please restart the app and try again.';
            } else if (lowerMsg.includes('permission') || lowerMsg.includes('denied')) {
              errorMessage = 'Microphone permission denied. Please grant permission in app settings.';
            } else if (lowerMsg.includes('not available') || lowerMsg.includes('unavailable') || lowerMsg.includes('no recognition')) {
              errorMessage = 'Speech recognition is not available. Please ensure Google Speech Services are installed and updated.';
            } else if (lowerMsg.includes('network') || lowerMsg.includes('connection')) {
              errorMessage = 'Network error. Speech recognition requires internet connection.';
            } else if (lowerMsg.includes('language') || lowerMsg.includes('locale')) {
              errorMessage = 'Language not supported. Please try a different language.';
            } else {
              errorMessage = errorMsg;
            }
          } else if (errorCode) {
            // Handle specific error codes
            if (errorCode === 9 || errorCode === '9') {
              errorMessage = 'Speech recognition service is not available. Please install or update Google Speech Services.';
            } else if (errorCode === 6 || errorCode === '6') {
              errorMessage = 'No speech input detected. Please speak clearly.';
            } else {
              errorMessage = `Speech recognition error (code: ${errorCode}). Please try again.`;
            }
          }
          
          setError(errorMessage);
          setIsRecording(false);
        }
      } catch (err: any) {
        console.error('🎤 [STT] Unexpected error starting recording:', err);
        setError(err.message || 'Failed to start speech recognition. Please try again.');
        setIsRecording(false);
      }
    },
    [options?.language],
  );

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
      console.log('🎤 [STT] Stopped recording');
      setIsRecording(false);
    } catch (err: any) {
      console.error('🎤 [STT] Error stopping recording:', err);
      setError(err.message || 'Failed to stop speech recognition');
      setIsRecording(false);
    }
  }, []);

  const clearText = useCallback(() => {
    setRecognizedText('');
    setError(null);
  }, []);

  return {
    isRecording,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    clearText,
  };
};

