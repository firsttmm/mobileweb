import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage,
  IonIcon, IonCard, IonCardContent,
  IonGrid, IonRow, IonCol, IonBadge, useIonRouter // <--- ต้องมี useIonRouter
} from '@ionic/react';
import { wallet, cash, trendingUp, trendingDown, timeOutline, pricetagOutline } from 'ionicons/icons';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: Timestamp;
}

const Tab1: React.FC = () => {
  const router = useIonRouter(); // <--- ประกาศตัวแปร router
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[];
      setExpenses(newData);
      setTotalIncome(newData.filter(i => i.type === 'income').reduce((sum, item) => sum + item.amount, 0));
      setTotalExpense(newData.filter(i => i.type === 'expense').reduce((sum, item) => sum + item.amount, 0));
    });
    return () => unsubscribe();
  }, []);

  const moneyRain = Array.from({ length: 15 }).map((_, i) => (
    <div key={i} className="falling-money" style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }}>💸</div>
  ));

  return (
    <IonPage>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(250px) rotate(360deg); opacity: 0; }
        }
        .falling-money {
          position: absolute; top: -20px; font-size: 24px;
          animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite;
          z-index: 1; opacity: 0.6;
          pointer-events: none; /* <--- บรรทัดนี้สำคัญมาก! ทำให้คลิกทะลุเงินได้ */
        }
      `}</style>

      <IonContent fullscreen style={{ '--background': '#f0f4f8' }}>
        <div style={{
          background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
          height: '280px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px',
          paddingTop: '60px', position: 'relative', overflow: 'hidden', textAlign: 'center'
        }}>
           {moneyRain}
           <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
              <div style={{ opacity: 0.9, marginBottom: '8px' }}>ยอดเงินคงเหลือปัจจุบัน</div>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                ฿{(totalIncome - totalExpense).toLocaleString()}
              </div>
           </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '-100px auto 0 auto', padding: '0 16px', position: 'relative', zIndex: 20 }}>
          <IonCard style={{ background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', margin: '0 0 25px 0' }}>
            <IonCardContent style={{ padding: '25px' }}>
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="6" style={{ borderRight: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>+{totalIncome.toLocaleString()}</div>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>รายรับ</span>
                  </IonCol>
                  <IonCol size="6" style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>-{totalExpense.toLocaleString()}</div>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>รายจ่าย</span>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>รายการล่าสุด</h3>
            <IonBadge color="medium">{expenses.length} รายการ</IonBadge>
          </div>

          <div style={{ paddingBottom: '20px' }}>
            {expenses.map((item) => (
              <div 
                key={item.id}
                onClick={() => router.push(`/edit/${item.id}`)} // <--- ต้องมี onClick
                style={{
                  background: 'white', borderRadius: '16px', padding: '15px', marginBottom: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', cursor: 'pointer'
                }}
              >
                <div style={{
                  minWidth: '50px', height: '50px', borderRadius: '14px', marginRight: '15px',
                  background: item.type === 'income' ? '#ecfdf5' : '#fef2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <IonIcon icon={item.type === 'income' ? wallet : cash} style={{ fontSize: '1.5rem', color: item.type === 'income' ? '#059669' : '#dc2626' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#334155' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.category}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: item.type === 'income' ? '#059669' : '#dc2626' }}>
                  {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Tab1;