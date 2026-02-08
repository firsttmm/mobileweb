import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonIcon, IonToggle, IonAvatar, 
  IonButton, IonAlert, IonNote
} from '@ionic/react';
import { 
  personCircleOutline, moon, trashBin, 
  logOutOutline, informationCircle, settings 
} from 'ionicons/icons';

// Firebase
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Tab3: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // ตรวจสอบ Dark Mode เริ่มต้น
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(prefersDark.matches);
  }, []);

  // ฟังก์ชันสลับ Dark Mode
  const toggleDarkMode = (ev: any) => {
    setDarkMode(ev.detail.checked);
    document.body.classList.toggle('dark', ev.detail.checked);
  };

  // ฟังก์ชันลบข้อมูลทั้งหมด (Reset Database)
  const handleClearAllData = async () => {
    try {
      const batch = writeBatch(db);
      const querySnapshot = await getDocs(collection(db, "expenses"));
      
      querySnapshot.forEach((document) => {
        const docRef = doc(db, "expenses", document.id);
        batch.delete(docRef);
      });

      await batch.commit();
      alert("ล้างข้อมูลเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#f0f4f8' }}>
          <IonTitle style={{ color: '#1e293b', fontWeight: 'bold' }}>การตั้งค่า</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f0f4f8' }}>
        
        {/* 1. ส่วนโปรไฟล์ (Profile Card) */}
        <div style={{ padding: '20px', textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ 
            width: '100px', height: '100px', margin: '0 auto', 
            borderRadius: '50%', background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
             <IonIcon icon={personCircleOutline} style={{ fontSize: '60px', color: 'white' }} />
          </div>
          <h2 style={{ fontWeight: 'bold', color: '#334155', marginTop: '15px' }}>ผู้ใช้งานทั่วไป</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Student ID: 66xxxxxx</p>
        </div>

        {/* 2. เมนูตั้งค่า (Settings List) */}
        <div style={{ padding: '0 16px' }}>
            <IonList style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                
                {/* Dark Mode */}
                <IonItem lines="full">
                    <IonIcon icon={moon} slot="start" style={{ color: '#6366f1' }} />
                    <IonLabel>โหมดมืด (Dark Mode)</IonLabel>
                    <IonToggle checked={darkMode} onIonChange={toggleDarkMode} />
                </IonItem>

                {/* เกี่ยวกับ */}
                <IonItem lines="full">
                    <IonIcon icon={informationCircle} slot="start" style={{ color: '#0ea5e9' }} />
                    <IonLabel>เวอร์ชันแอปพลิเคชัน</IonLabel>
                    <IonNote slot="end">v1.0.0</IonNote>
                </IonItem>

            </IonList>

            {/* 3. โซนอันตราย (Danger Zone) */}
            <h3 style={{ marginLeft: '10px', marginTop: '25px', fontSize: '0.9rem', color: '#ef4444', fontWeight: 'bold' }}>พื้นที่อันตราย</h3>
            <IonList style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <IonItem button onClick={() => setShowAlert(true)} lines="none">
                    <IonIcon icon={trashBin} slot="start" color="danger" />
                    <IonLabel color="danger">ล้างข้อมูลทั้งหมด</IonLabel>
                </IonItem>
            </IonList>

            {/* ปุ่มออกจากระบบ (Mock) */}
            <IonButton expand="block" fill="outline" color="medium" style={{ marginTop: '30px', borderRadius: '12px' }}>
                <IonIcon icon={logOutOutline} slot="start" />
                ออกจากระบบ
            </IonButton>
        </div>

        {/* Alert ยืนยันการลบ */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="ยืนยันการล้างข้อมูล"
          message="ข้อมูลรายรับ-รายจ่ายทั้งหมดจะหายไป คุณแน่ใจหรือไม่?"
          buttons={[
            { text: 'ยกเลิก', role: 'cancel' },
            { text: 'ยืนยันลบ', role: 'confirm', handler: handleClearAllData }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Tab3;