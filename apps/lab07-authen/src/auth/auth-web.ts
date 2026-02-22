const firebaseConfig = {
  apiKey: "AIzaSyB1Qlb4ikO43yghGH297h0lWvmWATRlisk",
  authDomain: "lab06-expense-eea5d.firebaseapp.com",
  projectId: "lab06-expense-eea5d",
  storageBucket: "web2025-wachi.firebasestorage.app",
  messagingSenderId: "71907196915",
  appId: "1:71907196915:web:f61190eb685f25e3431c86",
  measurementId: "G-3HMD9F71XR"
};
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials,PhoneCredentials } from "./auth-interface";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";


export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}


import { RecaptchaVerifier } from "firebase/auth";
import { code } from "ionicons/icons";


let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;


// ควรมี div สำหรับ reCAPTCHA ในหน้า login สำหรับโทรศัพท์ ด้วย id="recaptcha-container"
const recaptchaContainerId: string = "recaptcha-container";


export function getRecaptchaVerifier(
  containerId: string
): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      containerId,
      {
        size: "invisible", // หรือ "normal"
      }
    );
  }
  return verifier;
}


export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser() {
    return firebaseAuth.currentUser
      ? mapUser(firebaseAuth.currentUser)
      : null;
  }


  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
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


  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    return { verificationId: confirmationResult.verificationId };
  }


  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }


}
 