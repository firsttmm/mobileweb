<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div style="text-align: center; margin-top: 20px;">
        <h2>รหัสนักศึกษา: 663380244-5</h2>
        <h3>ชื่อ-สกุล:อรจิรา แสนตา</h3>
      </div>

      <ion-grid>
        <ion-row>
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera, trash, close } from 'ionicons/icons';
import {
  IonPage, IonHeader, IonFab, IonFabButton, IonIcon,
  IonToolbar, IonTitle, IonContent, IonGrid, IonRow,
  IonCol, IonImg
} from '@ionic/vue';
// ตรวจสอบ path นี้ดีๆ ว่าตรงกับชื่อไฟล์ที่คุณสร้างไหม
import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, takePhoto } = usePhotoGallery();
</script>