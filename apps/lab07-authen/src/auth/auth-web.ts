import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfiWyhVKLthXzS4JKe3n8arDU-VbXiH2g",
  authDomain: "web2025-mobilewebapp.firebaseapp.com",
  projectId: "web2025-mobilewebapp",
  storageBucket: "web2025-mobilewebapp.firebasestorage.app",
  messagingSenderId: "702141441945",
  appId: "1:702141441945:web:f75fa9a2169119d5045508",
  measurementId: "G-7Y85XDCRE6"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
    phoneNumber: u.phoneNumber,
  };
}

let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
const recaptchaContainerId = "recaptcha-container";

export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
      size: "invisible",
    });
  }
  return verifier;
}

export class FirebaseWebAuthService implements IAuthService {

  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(firebaseAuth, (user) => {
        unsub();
        resolve(user ? mapUser(user) : null);
      });
    });
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(firebaseAuth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async logout() {
    await firebaseAuth.signOut();
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(firebaseAuth, creds.phoneNumberE164, verifier);
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) throw new Error("No confirmation result");
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }
}
