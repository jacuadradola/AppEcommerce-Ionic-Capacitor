import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { BillFinishComponent } from 'src/app/core/components/admin/bill-finish/bill-finish.component';
import { InventoryComponent } from 'src/app/core/components/admin/inventory/inventory.component';
import { BillDetailComponent } from 'src/app/core/components/bill-detail/bill-detail.component';
import { numeral } from 'src/app/core/constante/constante';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentAlert, presentLoading } from 'src/app/core/services/basic.service';
import { ImagenService } from 'src/app/core/services/imagen/imagen.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {

  bills: CartBill[] = [];

  constructor(
    private api: ApiService,
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private modalCtrl: ModalController,
    private image: ImagenService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('billActive', 'GET', []).then((res: { data: CartBill[] }) => {
      let bills = res.data;
      bills.map((bill) => {
        const date1 = moment(new Date(bill.updated_at));
        const date2 = moment(new Date());
        bill['hoursUpdate'] = date2.diff(date1, 'hour')
      });
      this.bills = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  options(bill: CartBill) {
    const button = [];
    if (bill.status_id === numeral.status.enCurso) {
      button.push({
        text: 'Enviar orden',
        handler: () => {
          this.alert.create({
            header: 'Debe añadir una foto de soporte',
            buttons: [
              {
                text: 'Ok',
                handler: async () => {
                  await presentLoading();
                  this.image.captureImage().then((res: ImageForm) => {
                    dismissLoading();
                    this.update(bill, 'enviado', res);
                  }, () => { dismissLoading(); presentAlert('Imagen no capturada. Cancelando operación'); });
                }
              },
              {
                text: 'Cancelar',
                role: 'cancel'
              }
            ]
          }).then(alert => alert.present());
        }
      });
      if (bill.hoursUpdate >= 12) {
        button.push({
          text: 'Cancelar orden',
          handler: () => {
            this.alert.create({
              header: '¿Esta seguro de cancelar este servicio',
              buttons: [{
                text: 'Si',
                handler: () => {
                  this.update(bill, 'cancelado');
                }
              },
              {
                text: 'No',
                role: 'cancel'
              }]
            }).then(alert => alert.present());
          }
        });
      }
    }
    if (bill.status_id === numeral.status.enviado) {
      button.push({
        text: 'Finalizar orden',
        handler: () => {
          this.alert.create({
            header: 'Atención',
            subHeader: 'Esta es una acción que debe realizar el cliente',
            message: 'Toque el boton "Sí", solo si está seguro de que el cliente ya recibio su pedido',
            buttons: [
              {
                text: 'Sí',
                handler: () => {
                  this.update(bill, 'finish');
                }
              },
              {
                text: 'No',
                role: 'cancel'
              }
            ]
          }).then(alert => alert.present());
        }
      });
    }

    button.push({
      text: 'Cancelar',
      role: 'cancel'
    });
    this.actionSheet.create({
      header: 'Opción',
      buttons: button
    }).then(action => action.present());
  }

  async update(bill: Bill, type, photo: ImageForm = null) {
    await presentLoading();
    let data = null;
    if (type === 'enviado') {
      data = {
        photo,
        status_id: numeral.status.enviado
      };
    }
    if (type === 'finish') {
      data = {
        status_id: numeral.status.finish
      };
    }
    if (type === 'cancelado') {
      data = {
        status_id: numeral.status.cancelado
      };
    }

    this.api.getResponse('bill/' + bill.id, 'PATCH', data).then(async () => {
      dismissLoading();
      await presentAlert('Se actualizó el estado del servicio exitosamente');
      this.get();
    }, () => { dismissLoading(); presentAlert('No se logró actualizar el estado del servicio'); });
  }

  clickMenuAction(ev) {
    if (ev === 'inventory') {
      this.inventory();
    }
    if (ev === 'finalized') {
      this.finalized();
    }
  }

  inventory() {
    this.modalCtrl.create({
      component: InventoryComponent
    }).then(modal => modal.present());
  }

  finalized() {
    this.modalCtrl.create({
      component: BillFinishComponent
    }).then(modal => modal.present());
  }

  detail(id) {
    this.modalCtrl.create({
      component: BillDetailComponent,
      componentProps: {
        bill_id: id
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(() => this.get());
    })
  }

}
