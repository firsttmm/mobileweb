import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonAvatar, 
  IonItem, 
  IonLabel, 
  IonList,
  IonIcon
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { logOutOutline, personCircleOutline, mailOutline, callOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service';
import { AuthUser } from '../auth/auth-interface';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // ดึงข้อมูล User เมื่อหน้าจอโหลด
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    // ทำการ Refresh หน้าจอเพื่อให้กลับไปที่หน้า Login ตามเงื่อนไขใน App.tsx
    window.location.href = '/login';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>ข้อมูลผู้ใช้งาน</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        {user ? (
          <div className="profile-container">
            <IonCard>
              <IonCardContent className="ion-text-center">
                {/* แสดงรูป Profile (ถ้ามี) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                  <IonAvatar style={{ width: '100px', height: '100px' }}>
                    <img 
                      src={user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                      alt="Profile" 
                    />
                  </IonAvatar>
                </div>

                <h2 style={{ fontWeight: 'bold' }}>{user.displayName || 'ไม่ระบุชื่อ'}</h2>
                <p>UID: {user.uid}</p>
              </IonCardContent>

              <IonList lines="full">
                <IonItem>
                  <IonIcon slot="start" icon={mailOutline} />
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{user.email || 'ไม่มีข้อมูล'}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={callOutline} />
                  <IonLabel>
                    <h3>Phone</h3>
                    <p>{user.phoneNumber || 'ไม่มีข้อมูล'}</p>
                  </IonLabel>
                </IonItem>
              </IonList>

              <div className="ion-padding">
                <IonButton expand="block" color="danger" onClick={handleLogout}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  ออกจากระบบ
                </IonButton>
              </div>
            </IonCard>
          </div>
        ) : (
          <div className="ion-text-center ion-padding">
            <p>ไม่พบข้อมูลผู้ใช้งาน</p>
            <IonButton routerLink="/login">ไปที่หน้า Login</IonButton>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;