import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
})
export class ProviderFormComponent implements OnInit {

  data: Provider = {
    description: '',
    name: '',
    nit: ''
  };

  provider_id = null;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
  ) { }

  async ngOnInit() {
    await presentLoading();
    const provider: Provider = this.navParams.get('provider');
    if (!isNullOrUndefined(provider)) {
      this.provider_id = provider.id;
      this.data.nit = provider.nit;
      this.data.description = provider.description;
      this.data.name = provider.name;
    }
    dismissLoading();
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  async send() {
    await presentLoading();
    if (this.provider_id != null) {
      this.api.getResponse('provider/' + this.provider_id, 'PATCH', this.data).then(() => {
        dismissLoading();
        presentAlert('Se actualizó el proveedor exitosamente');
        this.closeModal(1);
      }, () => {dismissLoading();presentAlert('No se logró actualizar el proveedor');});
    } else {
      this.api.getResponse('provider', 'POST', this.data).then(() => {
        dismissLoading();
        presentAlert('Se creó el proveedor exitosamente');
        this.closeModal(1);
      }, () => {dismissLoading();presentAlert('No se logró crear el proveedor');});
    }
  }

}
