import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export const usePhotoGallery = () => {
  
  const photos = ref<UserPhoto[]>([]);

  
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera,      
      quality: 100,                     
    });

    const fileName = new Date().getTime() + '.jpeg';

   
    photos.value = [
      {
        filepath: fileName,
        webviewPath: photo.webPath 
      },
      ...photos.value,
    ];
  };

  return {
    photos,
    takePhoto,
  };
};