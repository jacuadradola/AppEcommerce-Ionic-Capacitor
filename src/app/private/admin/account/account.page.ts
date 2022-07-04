import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountFormComponent } from 'src/app/core/components/admin/account-form/account-form.component';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentAlert, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  accounts: Account1[] = [];

  constructor(private api:ApiService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.get();
  }
  async get() {
    await presentLoading();
    this.api.getResponse('account', 'GET', {}).then((res: {data: Account1[]}) => {
      this.accounts = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  async updateActive(id) {
    await presentLoading();
    const data = {
      active: true
    };
    this.api.getResponse('account/'+id, 'PATCH', data).then(() => {
      dismissLoading();
      this.get();
    }, () => {dismissLoading();presentAlert('No se pudo actualizar');});
  }

  async delete(id) {
    await presentLoading();
    this.api.getResponse('account/'+id, 'DELETE', {}).then(() => {
      dismissLoading();
      this.get();
    }, () => {dismissLoading();presentAlert('No se pudo eliminar');});
  }

  create() {
    this.modalCtrl.create({
      component: AccountFormComponent
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(info => {
        if (info.data === 1) {
          this.get();
        }
      })
    });
  }

}
