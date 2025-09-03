import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

export const useAuthListener = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async currentUser => {
      if (currentUser) {
        //  Get fresh token
        const idToken = await currentUser.getIdToken(true);

        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          provider: currentUser.providerData[0]?.providerId || 'email',
          idToken,
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(currentUser);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  return { user, initializing };
};
