<template>
  <ion-page>
    <ion-header><ion-toolbar color="primary"><ion-title>Lab09 Arm Exercise</ion-title></ion-toolbar></ion-header>

    <ion-content class="ion-padding ion-text-center">
      <div class="display-box">
        <small>จำนวนรอบ (Reps)</small>
        <h1 class="count-text">{{ state?.repDisplay || 0 }}</h1>
      </div>

      <ion-card>
        <ion-card-header><ion-card-title>Status</ion-card-title></ion-card-header>
        <ion-card-content>
          <h2 :class="state?.stats.lastMessage === 'OK' ? 'text-success' : 'text-danger'">
            {{ state?.stats.lastMessage || 'กด Start เพื่อเริ่ม' }}
          </h2>
        </ion-card-content>
      </ion-card>

      <div class="stats-area" v-if="state?.stats.repsTotal">
        <p>ทั้งหมด: {{ state.stats.repsTotal }} | ถูก: {{ state.stats.repsOk }} | ผิด: {{ state.stats.repsBad }}</p>
        <p>คะแนนรวม: {{ state.stats.score }} แต้ม</p>
      </div>

      <ion-button expand="block" size="large" @click="handleStart" v-if="state?.status !== 'RUNNING'">START</ion-button>
      <ion-button expand="block" size="large" color="danger" @click="handleStop" v-else>STOP</ion-button>
    </ion-content>

    <ion-footer class="ion-padding ion-text-center">
      663380244-5 อรจิรา แสนตา
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import { ArmWorkoutEngine } from '../core/ArmWorkoutEngine';
import { MotionService } from '../core/MotionService';
import { TtsService } from '../core/TtsService';
import { HapticsService } from '../core/HapticsService';
import type { WorkoutState } from '../core/types';

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();
const state = ref<WorkoutState | null>(null);

onMounted(() => engine.onChange((s) => (state.value = s)));

async function handleStart() {
  await tts.speak("เริ่มกายบริหารแขน ยกโทรศัพท์ขึ้นลงในแนวตั้ง");
  engine.start();
  await motion.start((s) => {
    const prevReps = state.value?.stats.repsTotal || 0;
    engine.process(s);
    // ตรวจสอบว่ามีการนับรอบใหม่หรือไม่ เพื่อส่งเสียง/สั่น
    if ((state.value?.stats.repsTotal || 0) > prevReps) {
      if (state.value?.stats.lastMessage === 'OK') {
        haptics.success();
        tts.speak(`${state.value?.repDisplay}`);
      } else {
        haptics.warning();
        tts.speak(state.value?.stats.lastMessage || "");
      }
    }
  });
}

async function handleStop() {
  await motion.stop();
  engine.stop();
  await tts.speak(`จบการทำงาน คะแนนของคุณคือ ${state.value?.stats.score} แต้ม`);
}
</script>

<style scoped>
.display-box { margin: 30px 0; border: 4px solid var(--ion-color-primary); border-radius: 20px; padding: 20px; }
.count-text { font-size: 5rem; margin: 0; color: var(--ion-color-primary); }
.text-success { color: #2dd36f; font-weight: bold; }
.text-danger { color: #eb445a; font-weight: bold; }
.stats-area { margin-top: 20px; font-size: 1.1rem; }
</style>