import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { numeral } from 'src/app/core/constante/constante';
import { MonedaPipe } from 'src/app/core/pipes/moneda.pipe';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from 'src/app/core/services/basic.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { StoragesService } from 'src/app/core/services/storages/storages.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  bill: CartBill = null;
  view = false;

  constructor(
    private api: ApiService,
    private storage: StoragesService,
    private modalService: ModalService,
    private alert: AlertController
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.get();
  }

  async get() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {

      this.api.getResponse('user/' + info.id + '/cart/0', 'GET', []).then((res: { data: CartBill }) => {
        this.bill = res.data;
       /*  console.log(this.bill); */
        this.view = true;
        dismissLoading();
      }, (err) => { dismissLoading(); console.log(err); });
    } else {
      dismissLoading();
    }
  }

  async clickMenu(ev) {
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      if (ev === 'record') {
        this.modalService.record();
      }
      if (ev === 'favorite') {
        this.modalService.favorite();
      }
      if (ev === 'active') {
        this.modalService.activeClient();
      }
    } else {
      presentAlert('No ha iniciado sesión');
    }
  }

  updateOrder(order: Order) {
    this.alert.create({
      header: 'Actualizar cantidad',
      inputs: [
        {
          type: 'number',
          name: 'quantity',
          value: order.quantity,
          placeholder: 'Ingrese cantidad',
          min: 1
        }
      ],
      buttons: [
        {
          text: 'Actualizar',
          handler: async (data) => {
            if (data.quantity > 0) {

              await presentLoading();
              const dataUpdate = {
                quantity: data.quantity
              };
              this.api.getResponse('order/' + order.id, 'PATCH', dataUpdate).then(async () => {
                dismissLoading();
                await presentAlert('Se actualizó la cantidad exitosamente');
                await this.get();
              }, async () => { dismissLoading(); await presentAlert('No se logró actualizar'); });
            } else {
              this.updateOrder(order);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  deleteOrder(order: Order) {
    this.alert.create({
      header: '¿Seguro que quiere eliminar?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            await presentLoading();
            this.api.getResponse('order/' + order.id, 'DELETE', []).then(async () => {
              dismissLoading();
              await presentAlert('Se eliminó el producto exitosamente');
              await this.get();
            }, () => { dismissLoading(); presentAlert('No se logró eliminar'); });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  async buy() {
    this.alert.create({
      header: 'Confirmar pedido',
      subHeader: 'Valor del pedido: $' + (new MonedaPipe().transform(this.bill.total)),
      message: 'Recuerde que debe pagar dentro de las proximas 12 horas.',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            await presentLoading();
            const data = {
              total: 0,
              active: 1,
              status_id: numeral.status.enCurso
            };
            this.bill.orders.forEach(order => {
              data.total = data.total + (order.price * order.quantity);
            });
            this.api.getResponse('bill/' + this.bill.id, 'PATCH', data).then(async () => {
              dismissLoading();
              await this.accountActive('Se realizó la compra exitosamente. ');
              this.get();
            }, () => { dismissLoading(); presentAlert('No se logró realizar la compra'); });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());

  }

  async accountActive(msj = '') {
    await presentLoading();
    this.api.getResponse('accountActive', 'GET', {}).then((res: { data: Account1 }) => {
      dismissLoading();
      this.alert.create({
        header: 'Realice su transferencia o consignación en CORRESPONSAL BANCARIO',
        subHeader: msj,
        message: `Número de cuenta: ${res.data.name}<br>
        Tipo de cuenta: ${res.data.type_account.name}<br>
        Títular de la cuenta: ${res.data.name_person}<br>
        Cédula de ciudadanía: ${res.data.cc}<br>
        <br>
        Nota: Recuerde que tiene 11 horas para realizar el pago. Después de dicho tiempo se declina la compra.
        <br>
        <br>
        Si desea volver a ver este mensaje debe presionar el boton que se encuntra en la parte superior derecha.`
      }).then(alert => alert.present());
    }, () => { dismissLoading(); presentAlert(msj + 'Ocurrio un error al obtener la cuenta. <br> Para volver a intentar la busqueda presiona el boton que se encuntra en la parte superior derecha.'); })
  }

}
