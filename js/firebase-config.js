/* OBSIDIA — Firebase initialization (shared across all pages) */

const firebaseConfig = {
  apiKey: "AIzaSyAEFO8DMprPh2hSBUHwK4o8DoWqZ93qPc8",
  authDomain: "obsidia-b9207.firebaseapp.com",
  projectId: "obsidia-b9207",
  storageBucket: "obsidia-b9207.firebasestorage.app",
  messagingSenderId: "1007171074401",
  appId: "1:1007171074401:web:8b6f531812d02cd92ded20"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
