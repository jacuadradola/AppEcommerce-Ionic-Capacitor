import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { numeral } from '../../constante/constante';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, presentAlert, presentLoading } from '../../services/basic.service';
import { ImagenService } from '../../services/imagen/imagen.service';
import { StoragesService } from '../../services/storages/storages.service';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss'],
})
export class BillDetailComponent implements OnInit {

  bill_id = null;
  bill: CartBill;
  view = false;
  admin = false;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private navParams: NavParams,
    private storage: StoragesService,
    private alertCtrl: AlertController,
    private imagenService: ImagenService,
  ) { }

  async ngOnInit() {
    this.bill_id = this.navParams.get('bill_id');
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('bill/' + this.bill_id, 'GET', []).then(async (res: { data: CartBill }) => {
      this.bill = res.data;
      /* console.log(this.bill); */
      const info: Info = JSON.parse(await this.storage.get('info') as string);
      if (info.type === numeral.type_user.admin) {
        this.admin = true;
      }
      this.view = true;
      dismissLoading();
    }, () => dismissLoading());
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  optionAdmin() {
    if (this.bill.status_id === numeral.status.enCurso) {
      this.update(numeral.status.enviado);
    } else if (this.bill.status_id === numeral.status.enviado) {
      this.alertCtrl.create({
        header: 'Atención',
        subHeader: 'Esta es una acción que debe realizar el cliente',
        message: 'Toque el boton "Si", solo si está seguro de que el cliente ya recibio su pedido',
        buttons: [
          {
            text: 'Si',
            handler: () => {
              this.update(numeral.status.finish);
            }
          },
          {
            text: 'No',
            role: 'cancel'
          }
        ]
      }).then(alert => alert.present());
    }
  }

  async update(status) {
    await presentLoading();
    const data = {
      status_id: status
    };
    this.api.getResponse('bill/' + this.bill_id, 'PATCH', data).then(() => {
      dismissLoading();
      presentAlert('Estado actualizado');
      this.get();
    }, () => { dismissLoading(); presentAlert('No se pudo actualizar'); });
  }

  async sendSupportPayment() {
    await presentLoading();
    this.imagenService.captureImage().then((res) => {
      const data = {
        photo_payment: res
      };
      this.api.getResponse('bill/' + this.bill_id, 'PATCH', data).then(() => {
        dismissLoading();
        presentAlert('Imagen enviada');
      }, () => { dismissLoading(); presentAlert('No se pudo enviar la imagen'); });
    }, () => { dismissLoading(); presentAlert('Imagen no capturada. Cancelando operación'); });
  }

}
