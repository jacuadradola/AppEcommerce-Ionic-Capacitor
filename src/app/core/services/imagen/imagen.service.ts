import { Injectable } from '@angular/core';
import { CameraResultType, Plugins } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor() { }

  captureImage() {
    return new Promise(async (resolve, reject) => {
      try {
        const picture = await Camera.getPhoto({
          quality: 90,
          // allowEditing: true,
          resultType: CameraResultType.Base64,
          promptLabelPhoto: 'Escoger Foto',
          promptLabelPicture: 'Tomar foto',
          promptLabelHeader: 'Foto',
          promptLabelCancel: 'Cancelar'
        });
        const image = `data:image/${picture.format};base64,${picture.base64String}`;
        // console.log(picture);
        const data = {
          imagen: picture.base64String,
          type_image: picture.format,
          // imagen: image
        }
        resolve(data);
      } catch (error) {
        reject(0);
      }
    });
  }
}
