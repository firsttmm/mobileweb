import React, { useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonItem, IonInput, IonLabel,
  IonTextarea, IonButton, IonIcon, IonLoading, IonAlert,
  useIonRouter, IonCard, IonCardContent, IonSegment, IonSegmentButton
} from '@ionic/react';
import { useParams } from 'react-router-dom'; // ใช้ตัวนี้ชัวร์กว่า
import { trashBin, saveOutline, wallet, cash } from 'ionicons/icons';

// Firebase
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();

  // State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // 1. ดึงข้อมูลเก่า (Read)
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("กำลังดึงข้อมูล ID:", id);
        const docRef = doc(db, "expenses", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setAmount(data.amount.toString());
          setType(data.type);
          setCategory(data.category);
          setNote(data.note);
        } else {
          alert("ไม่พบข้อมูลรายการนี้ (อาจถูกลบไปแล้ว)");
          router.goBack();
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        // แสดง Error จริงๆ ออกมาดูเลย
        alert("เกิดข้อผิดพลาด: " + error.message);
        router.goBack();
      }
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  // 2. อัปเดตข้อมูล (Update)
  const handleUpdate = async () => {
    if (!title || !amount) {
      alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
      return;
    }
    if (!id) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, "expenses", id), {
        title,
        amount: Number(amount),
        type,
        category,
        note
      });
      setLoading(false);
      router.goBack();
    } catch (error: any) {
      console.error("Error updating document:", error);
      setLoading(false);
      alert("บันทึกไม่สำเร็จ: " + error.message);
    }
  };

  // 3. ลบข้อมูล (Delete)
  const handleDelete = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "expenses", id));
      setLoading(false);
      router.push('/tab1', 'back');
    } catch (error: any) {
      console.error("Error deleting document:", error);
      setLoading(false);
      alert("ลบไม่สำเร็จ: " + error.message);
    }
  };

  const inputItemStyle = {
    background: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '15px',
    border: '1px solid #e2e8f0'
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{
          '--background': 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
          '--color': 'white'
        }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" color="light" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>แก้ไขรายการ</IonTitle>
          <IonButtons slot="end">
             <IonButton onClick={() => setShowAlert(true)}>
               <IonIcon icon={trashBin} slot="icon-only" color="light" />
             </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f0f4f8' }}>
        <IonLoading isOpen={loading} message="กำลังประมวลผล..." />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="⚠️ ยืนยันการลบ"
          message="คุณแน่ใจหรือไม่ที่จะลบรายการนี้? ไม่สามารถกู้คืนได้"
          buttons={[
            { text: 'ยกเลิก', role: 'cancel' },
            { text: 'ลบข้อมูล', role: 'confirm', handler: handleDelete, cssClass: 'danger-button' }
          ]}
        />

        <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
          <IonCard style={{
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
            background: 'white',
            marginTop: '20px'
          }}>
            <IonCardContent className="ion-no-padding">

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

              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <IonLabel style={{ color: '#94a3b8', fontSize: '0.9rem' }}>จำนวนเงิน</IonLabel>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IonInput
                    type="number"
                    placeholder="0"
                    value={amount}
                    onIonInput={e => setAmount(e.detail.value!)}
                    style={{
                      fontSize: '3rem',
                      fontWeight: '800',
                      color: type === 'income' ? '#10b981' : '#ef4444',
                      maxWidth: '250px',
                      textAlign: 'center',
                      '--padding-start': '0'
                    }}
                  />
                  <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '15px' }}>THB</span>
                </div>
              </div>

              <div style={{ padding: '0 20px 20px 20px' }}>
                <IonItem lines="none" style={inputItemStyle}>
                  <IonLabel position="stacked" style={{color: '#64748b'}}>ชื่อรายการ</IonLabel>
                  <IonInput value={title} onIonInput={e => setTitle(e.detail.value!)} style={{ fontWeight: 'bold' }}></IonInput>
                </IonItem>

                <IonItem lines="none" style={inputItemStyle}>
                   <IonLabel position="stacked" style={{color: '#64748b'}}>หมวดหมู่</IonLabel>
                   <IonInput value={category} onIonInput={e => setCategory(e.detail.value!)}></IonInput>
                </IonItem>

                <IonItem lines="none" style={inputItemStyle}>
                   <IonLabel position="stacked" style={{color: '#64748b'}}>หมายเหตุ</IonLabel>
                   <IonTextarea value={note} onIonInput={e => setNote(e.detail.value!)} rows={3}></IonTextarea>
                </IonItem>

                <IonButton
                  expand="block"
                  onClick={handleUpdate}
                  style={{
                    '--background': 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
                    '--border-radius': '12px',
                    '--box-shadow': '0 4px 12px rgba(0, 180, 219, 0.4)',
                    height: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginTop: '20px'
                  }}
                >
                   <IonIcon icon={saveOutline} slot="start" /> บันทึกการแก้ไข
                </IonButton>
              </div>

            </IonCardContent>
          </IonCard>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default EditExpense;