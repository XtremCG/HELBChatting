import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.manifest?.extra?.apiKey || Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.manifest?.extra?.authDomain || Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.manifest?.extra?.projectId || Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.manifest?.extra?.storageBucket || Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.manifest?.extra?.messagingSenderId || Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.manifest?.extra?.appId || Constants.expoConfig?.extra?.appId,
  databaseURL: Constants.manifest?.extra?.databaseURL || Constants.expoConfig?.extra?.databaseURL,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence using AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const database = getFirestore(app);
export const storage = getStorage(app);
