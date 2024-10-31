import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5fmY9FTzoCWior7svEhnb_GES8swl-68",
  authDomain: "bartendis-b64bc.firebaseapp.com",
  projectId: "bartendis-b64bc",
  storageBucket: "bartendis-b64bc.appspot.com",
  messagingSenderId: "970144785513",
  appId: "1:970144785513:web:de9a262785fd8b35472ef8",
  measurementId: "G-8LS456GTVM",
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

export const firebaseApp = createFirebaseApp(firebaseConfig);
// const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
console.log("firebaseApp :", firebaseApp);

export const firebaseFirestore = getFirestore(firebaseApp);
console.log("firebaseFirestore :", firebaseFirestore);
// export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
console.log("firebaseStorage :", firebaseStorage);
// export const firebaseAnalytics = getAnalytics(firebaseApp);
// export const firebaseAnalytics =
//   typeof window !== "undefined" ? getAnalytics(firebaseApp) : null;

// firebaseAuth.useDeviceLanguage();
// firebaseAuth.languageCode = "pt-br";
