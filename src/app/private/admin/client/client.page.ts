import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentAlert, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {

  clients: Client[] = [];

  searchText = '';

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('client', 'GET', []).then((res: { data: Client[] }) => {
      this.clients = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  async changeOld(client: Client) {
    await presentLoading();
    this.api.getResponse('client/' + client.id, 'PATCH', { old: !client.old }).then(() => {
      dismissLoading();
      presentAlert('Se actualizó exitosamente');
    }, async () => { dismissLoading(); await presentAlert('No se logró actualizar'); this.get(); });
  }

  async changeActive(client: Client) {
    await presentLoading();
    this.api.getResponse('client/' + client.id, 'PATCH', { active: !client.active }).then(() => {
      presentAlert('Se actualizó exitosamente');
      dismissLoading();
    }, async () => { dismissLoading();await presentAlert('No se logró actualizar'); this.get(); });
  }

  search(ev) {
    this.searchText = ev.detail.value;
  }

  async changePassword(client: Client) {
    await presentLoading();
    this.api.getResponse('updatePassword', 'POST', { user: client.user_id }).then((res: any) => {
      dismissLoading();
      this.alertCtrl.create({
        header: 'Nueva Clave',
        message: 'Email: ' + res.data.email + "<br>Password: " + res.data.password
      }).then(alert => alert.present());
      
    }, async () => { dismissLoading();await presentAlert('No se logró actualizar'); });
  }

}
