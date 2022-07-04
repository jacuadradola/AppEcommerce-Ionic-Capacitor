import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  constructor() { }
}

export function isNullOrUndefined(data: any) {
  return data === null || data === undefined;
}

export function isNull(data: any) {
  return data === null;
}

export function isUndefined(data: any) {
  return data === undefined;
}

export async function presentAlert(msj) {
  const alertCtrl = new AlertController();
  const alert = await alertCtrl.create({
    message: msj,
    /* buttons: ['Ok'] */
    animated: true,
    translucent: true,
    cssClass: 'size-20',
    keyboardClose: true
  });
  await alert.present();
}

export async function presentLoading() {
  const loadingCtrl = new LoadingController();
  const load = await loadingCtrl.create({
    message: 'Espera un momento, por favor...',
  });
  await load.present();
}

export function dismissLoading() {
  const loadingCtrl = new LoadingController();
  loadingCtrl.dismiss();
}
