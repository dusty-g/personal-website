import '../styles/globals.css'
import type { AppProps } from 'next/app'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// add database
import { getDatabase } from "firebase/database";
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCBY31T7EkEkpuPCOfbJvnjZhED1Q7ciQ",
  authDomain: "dustygalindo-23680.firebaseapp.com",
  projectId: "dustygalindo-23680",
  storageBucket: "dustygalindo-23680.appspot.com",
  messagingSenderId: "511115371107",
  appId: "1:511115371107:web:6a1e962419d31bec9a0e56",
  measurementId: "G-TB8HRQ45N7",
  // disable analytics
  autoanalyticsEnabled: false
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// get database and export
export const db = getDatabase(app);

// get auth and export
export const auth = getAuth(app);


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
