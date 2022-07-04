import { Injectable, EventEmitter } from '@angular/core';
//import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isNullOrUndefined } from '../basic.service';
import { StoragesService } from '../storages/storages.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  num = new EventEmitter<number>();

  //mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body de la push',
    //   date: new Date()
    // }
  //];

  private userId: string;

  //pushListener = new EventEmitter<OSNotificationPayload>();



  /* constructor(private oneSignal: OneSignal,
    private storage: StoragesService) {

    this.cargarMensajes();
  } */

  /* async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  } */

  /* configuracionInicial() {
    this.oneSignal.startInit('c0855f6d-ca44-4d35-8736-39b7716debe9', '633406386002');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      //console.log('Notificación recibida', noti);
      this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      //console.log('Notificación abierta', noti);
      await this.notificacionRecibida(noti.notification);
    });


    // Obtener ID del suscriptor
    this.oneSignal.getIds().then(info => {
      this.userId = info.userId || 'bb4c4088-3427-44ff-8380-570aa6c1ce1a';
    });

    this.oneSignal.endInit();

  } */

  /* async getUserIdOneSignal() {
    // Obtener ID del suscriptor
    const info = await this.oneSignal.getIds();
    this.userId = info.userId;
    return info.userId;
  } */

 /*  async notificacionRecibida(noti: OSNotification) {

    await this.cargarMensajes();

    const payload = noti.payload;

    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);

    await this.guardarMensajes();

  } */

  /* guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  } */

  /* async cargarMensajes() {
    let mensaje = await this.storage.get('mensajes') || [];

    this.mensajes = isNullOrUndefined(mensaje) ? [] : <OSNotificationPayload[]>mensaje;
    this.num.emit(this.mensajes.length);
    return this.mensajes;

  } */

  /* async borrarMensajes() {
    await this.storage.remove("mensajes");
    this.mensajes = [];
    this.num.emit(this.mensajes.length);
    this.guardarMensajes();
  } */

  getUserId() {
    return this.userId;
  }


}
