import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, 
  useIonRouter, IonCard, IonCardContent, IonSegment, 
  IonSegmentButton, IonIcon, IonChip, IonButtons, IonBackButton 
} from '@ionic/react';
import { 
  fastFood, bus, cart, duplicate, 
  addCircle, wallet, cash 
} from 'ionicons/icons';

// นำเข้าฟังก์ชันจาก Firebase
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const Tab2: React.FC = () => {
  const router = useIonRouter();

  // State
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<string>('expense');
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // หมวดหมู่แนะนำ (พร้อมไอคอน)
  const quickCategories = [
    { name: 'อาหาร', icon: fastFood },
    { name: 'เดินทาง', icon: bus },
    { name: 'ช้อปปิ้ง', icon: cart },
    { name: 'บิลต่างๆ', icon: duplicate },
  ];

  const saveExpense = async () => {
    if (!title || !amount) {
      alert("⚠️ กรุณากรอกชื่อรายการและจำนวนเงิน");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount),
        type: type,
        category: category || 'ทั่วไป',
        note: note,
        createdAt: new Date()
      });

      // Reset & Redirect
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('');
      setNote('');
      router.push('/tab1');

    } catch (e) {
      console.error("Error adding document: ", e);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

  return (
    <IonPage>
      {/* 1. Header ไล่สี เขียว-ฟ้า สดใส */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ 
          '--background': 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)', 
          '--color': 'white' 
        }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" color="light" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>บันทึกรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* พื้นหลังสีเทาอ่อน สบายตา */}
      <IonContent fullscreen style={{ '--background': '#f0f4f8' }}>
        
        <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Card หลัก */}
          <IonCard style={{ 
            borderRadius: '20px', 
            boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)', 
            margin: '0',
            background: 'white'
          }}>
            <IonCardContent className="ion-no-padding">
              
              {/* ส่วนเลือก รายรับ/รายจ่าย */}
              <div style={{ padding: '20px 20px 0 20px' }}>
                <IonSegment 
                  value={type} 
                  onIonChange={e => setType(e.detail.value as string)}
                  style={{ background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}
                >
                  <IonSegmentButton value="expense">
                    <IonLabel style={{ color: type === 'expense' ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                      <IonIcon icon={cash} style={{ verticalAlign: 'text-bottom' }} /> รายจ่าย
                    </IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="income">
                    <IonLabel style={{ color: type === 'income' ? '#10b981' : '#64748b', fontWeight: 'bold' }}>
                      <IonIcon icon={wallet} style={{ verticalAlign: 'text-bottom' }} /> รายรับ
                    </IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </div>

              {/* ส่วนกรอกตัวเลข (ใหญ่ๆ สะใจ) */}
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <IonLabel style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ระบุจำนวนเงิน</IonLabel>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: type === 'income' ? '#10b981' : '#ef4444', marginRight: '5px' }}>
                    {type === 'income' ? '+' : '-'}
                  </span>
                  <IonInput
                    type="number"
                    placeholder="0"
                    value={amount}
                    onIonInput={e => setAmount(e.detail.value!)}
                    style={{ 
                      fontSize: '3rem', 
                      fontWeight: '800', 
                      color: '#1e293b', 
                      maxWidth: '200px', 
                      textAlign: 'center',
                      '--padding-start': '0'
                    }}
                  />
                  <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '15px' }}>THB</span>
                </div>
              </div>

              {/* ฟอร์มกรอกข้อมูล */}
              <div style={{ padding: '0 20px 20px 20px' }}>
                
                {/* ชื่อรายการ */}
                <IonItem lines="none" style={{ background: '#f8fafc', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                  <IonInput 
                    label="ชื่อรายการ" 
                    labelPlacement="floating"
                    placeholder="เช่น ค่าข้าวเที่ยง"
                    value={title}
                    onIonInput={e => setTitle(e.detail.value!)}
                  />
                </IonItem>

                {/* หมวดหมู่ (Chips + Input) */}
                <div style={{ marginBottom: '15px' }}>
                  <IonLabel style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '5px' }}>เลือกหมวดหมู่</IonLabel>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '8px' }}>
                    {quickCategories.map((cat) => (
                      <IonChip 
                        key={cat.name} 
                        onClick={() => setCategory(cat.name)}
                        style={{
                          background: category === cat.name ? '#00b4db' : '#e0f2fe',
                          color: category === cat.name ? 'white' : '#0284c7',
                          fontWeight: 'bold'
                        }}
                      >
                        <IonIcon icon={cat.icon} />
                        <IonLabel>{cat.name}</IonLabel>
                      </IonChip>
                    ))}
                  </div>
                  <IonItem lines="none" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <IonInput 
                      placeholder="หรือพิมพ์หมวดหมู่เอง..." 
                      value={category}
                      onIonInput={e => setCategory(e.detail.value!)}
                    />
                  </IonItem>
                </div>

                {/* หมายเหตุ */}
                <IonItem lines="none" style={{ background: '#f8fafc', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                  <IonTextarea 
                    label="โน้ตช่วยจำ" 
                    labelPlacement="floating"
                    placeholder="..."
                    rows={2}
                    value={note}
                    onIonInput={e => setNote(e.detail.value!)}
                  />
                </IonItem>

                {/* ปุ่มบันทึก */}
                <IonButton 
                  expand="block" 
                  onClick={saveExpense}
                  style={{ 
                    '--background': 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
                    '--border-radius': '12px',
                    '--box-shadow': '0 4px 12px rgba(0, 180, 219, 0.4)',
                    height: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  <IonIcon slot="start" icon={addCircle} />
                  บันทึกข้อมูล
                </IonButton>

              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;