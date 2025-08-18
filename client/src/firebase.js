import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  //FacebookAuthProvider 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgL-IVvwNGjVOb9GHIEUyKk1ZHEGQWhQ8",
  authDomain: "rekker-brands.firebaseapp.com",
  projectId: "rekker-brands",
  storageBucket: "rekker-brands.firebasestorage.app",
  messagingSenderId: "636958688936",
  appId: "1:636958688936:web:4ae6e444eb50d37168649d",
  measurementId: "G-FJKZN95Z54"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Add provider exports
export const googleProvider = new GoogleAuthProvider();
//export const facebookProvider = new FacebookAuthProvider();