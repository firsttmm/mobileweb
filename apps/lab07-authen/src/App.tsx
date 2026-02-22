import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonSpinner
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, lockClosed } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import LoginPage from './pages/LoginPage';
import { authService } from './auth/auth-service';

/* Core & Basic CSS (เหมือนเดิม) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // ตรวจสอบสถานะการ Login ครั้งแรกที่แอปโหลด
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // แสดง Loading ระหว่างรอเช็คสถานะ Auth
  if (isAuthenticated === null) {
    return (
      <IonApp>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Route สำหรับ Login: ถ้า Login แล้วให้ดีดไปหน้า Tab1 */}
          <Route exact path="/login">
            {isAuthenticated ? <Redirect to="/tab1" /> : <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />}
          </Route>

          {/* Route สำหรับหน้าหลักที่มี Tabs: ถ้ายังไม่ Login ให้ดีดไปหน้า Login */}
          <Route path="/" render={() => (
            isAuthenticated ? (
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/tab1"><Tab1 /></Route>
                  <Route exact path="/tab2"><Tab2 /></Route>
                  <Route path="/tab3"><Tab3 /></Route>
                  <Route exact path="/"><Redirect to="/tab1" /></Route>
                </IonRouterOutlet>
                
                <IonTabBar slot="bottom">
                  <IonTabButton tab="tab1" href="/tab1">
                    <IonIcon icon={triangle} />
                    <IonLabel>Tab 1</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab2" href="/tab2">
                    <IonIcon icon={ellipse} />
                    <IonLabel>Tab 2</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab3" href="/tab3">
                    <IonIcon icon={square} />
                    <IonLabel>Tab 3</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            ) : (
              <Redirect to="/login" />
            )
          )} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;