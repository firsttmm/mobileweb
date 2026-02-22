import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonInput, IonItem, IonLabel, IonList,
  IonText, IonIcon, IonLoading, IonToast
} from '@ionic/react';
import { mailOutline, logoGoogle, callOutline, lockClosedOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  
  const [showLoading, setShowLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Email/Password Login
  const handleEmailLogin = async () => {
    if (!email || !password) return setToastMsg('กรุณากรอก Email และ Password');
    setShowLoading(true);
    try {
      await authService.loginWithEmailPassword({ email, password });
      onLoginSuccess();
    } catch (e: any) {
      setToastMsg('Login ล้มเหลว: ' + e.message);
    } finally {
      setShowLoading(false);
    }
  };

  // 2. Google Login
  const handleGoogleLogin = async () => {
    setShowLoading(true);
    try {
      await authService.loginWithGoogle();
      onLoginSuccess();
    } catch (e: any) {
      setToastMsg('Google Login ล้มเหลว: ' + e.message);
    } finally {
      setShowLoading(false);
    }
  };

  // 3. Phone Login (Step 1: ขอ OTP)
  const handleStartPhoneLogin = async () => {
    if (!phoneNumber) return setToastMsg('กรุณากรอกเบอร์โทรศัพท์ (เช่น +66812345678)');
    setShowLoading(true);
    try {
      const res = await authService.startPhoneLogin({ phoneNumberE164: phoneNumber });
      setVerificationId(res.verificationId);
      setToastMsg('ส่งรหัส OTP เรียบร้อยแล้ว');
    } catch (e: any) {
      setToastMsg('ส่ง OTP ล้มเหลว: ' + e.message);
    } finally {
      setShowLoading(false);
    }
  };

  // 3. Phone Login (Step 2: ยืนยัน OTP)
  const handleConfirmOtp = async () => {
    if (!otpCode || !verificationId) return;
    setShowLoading(true);
    try {
      await authService.confirmPhoneCode({ verificationId, verificationCode: otpCode });
      onLoginSuccess();
    } catch (e: any) {
      setToastMsg('รหัส OTP ไม่ถูกต้อง: ' + e.message);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>เข้าสู่ระบบ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/* ส่วน Email Login */}
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput value={email} type="email" onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput value={password} type="password" onIonChange={e => setPassword(e.detail.value!)} />
          </IonItem>
          <IonButton expand="block" onClick={handleEmailLogin} className="ion-margin-top">
            <IonIcon slot="start" icon={mailOutline} /> Login with Email
          </IonButton>
        </IonList>

        <div className="ion-text-center ion-padding">หรือ</div>

        {/* ส่วน Google Login */}
        <IonButton expand="block" color="light" onClick={handleGoogleLogin}>
          <IonIcon slot="start" icon={logoGoogle} /> Login with Google
        </IonButton>

        <hr className="ion-margin-vertical" />

        {/* ส่วน Phone Login */}
        <IonList>
          {!verificationId ? (
            <>
              <IonItem>
                <IonLabel position="stacked">เบอร์โทรศัพท์ (+66...)</IonLabel>
                <IonInput value={phoneNumber} placeholder="+66812345678" onIonChange={e => setPhoneNumber(e.detail.value!)} />
              </IonItem>
              <IonButton expand="block" color="tertiary" onClick={handleStartPhoneLogin}>
                <IonIcon slot="start" icon={callOutline} /> Request OTP
              </IonButton>
            </>
          ) : (
            <>
              <IonItem>
                <IonLabel position="stacked">รหัส OTP 6 หลัก</IonLabel>
                <IonInput value={otpCode} onIonChange={e => setOtpCode(e.detail.value!)} />
              </IonItem>
              <IonButton expand="block" color="success" onClick={handleConfirmOtp}>
                <IonIcon slot="start" icon={lockClosedOutline} /> Confirm OTP
              </IonButton>
              <IonButton fill="clear" expand="block" onClick={() => setVerificationId(null)}>เปลี่ยนเบอร์โทรศัพท์</IonButton>
            </>
          )}
        </IonList>

        {/* Container สำหรับ reCAPTCHA (สำคัญมากสำหรับ Web) */}
        <div id="recaptcha-container"></div>

        <IonLoading isOpen={showLoading} message={'กำลังดำเนินการ...'} />
        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;