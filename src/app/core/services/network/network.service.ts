import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Network } = Plugins;

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private toastController: ToastController, private plt: Platform) {
    this.plt.ready().then(async () => {
      this.initializeNetworkEvents();
      const status = (await Network.getStatus()).connectionType !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {

    const handler = Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        if (this.status.getValue() === ConnectionStatus.Offline) {
          this.updateNetworkStatus(ConnectionStatus.Online);
        }
      } else {
        if (this.status.getValue() === ConnectionStatus.Online) {
          this.updateNetworkStatus(ConnectionStatus.Offline);
        }
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection = status === ConnectionStatus.Offline ? 'desconectado de' : 'conectado a';
    const toast = this.toastController.create({
      message: `Tu estás ${connection} internet`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast1 => {
      toast1.present();
    });
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
