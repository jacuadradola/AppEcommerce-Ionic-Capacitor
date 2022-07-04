import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from '../../services/basic.service';
import { StoragesService } from '../../services/storages/storages.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {

  bill: CartBill;
  option: Option;
  quantities: number[] = [];

  data: Order = {
    bill_id: null,
    option_id: null,
    price: 0,
    quantity: 0,
    description: ''
  }

  constructor(
    private api: ApiService,
    private storage: StoragesService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    await presentLoading();
    for (let i = 1; i < 50; i++) {
      this.quantities.push(i);
    }
    this.data.quantity = 1;
    this.option = this.navParams.get('option');
    this.data.option_id = this.option.id;
    this.data.price = this.option.price;
    this.get();
  }

  async get() {
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse('user/' + info.id + '/validcart/' + this.option.id, 'GET', []).then((res: { data: CartBill }) => {
        this.api.getResponse('option/' + this.option.id, 'GET', []).then((op: { data: Option }) => {
          this.option = op.data;


          if (res.data == null) {
            this.api.getResponse('client/' + info.id_client + '/direction', 'GET', []).then((res1: { data: Direction }) => {
              const data = {
                active: false,
                direction_id: res1.data.id,
              };
              this.api.getResponse('bill', 'POST', data).then((res3: { data: CartBill }) => {
                this.bill = res3.data;
                this.bill.orders = [];
                this.data.bill_id = this.bill.id;
                dismissLoading();
              }, () => dismissLoading());
            }, () => dismissLoading());
          } else {
            this.bill = res.data;
            this.data.bill_id = this.bill.id;
            dismissLoading();
          }
        }, () => dismissLoading());
      }, () => dismissLoading());
    } else {
      dismissLoading();
    }
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  async send() {
    /* console.log(this.data); */
    await presentLoading();
    if (this.option.quantity >= this.data.quantity) {
      this.api.getResponse('order', 'POST', this.data).then(() => {
        dismissLoading();
        presentAlert('Se agregó el producto correctamente');
        this.closeModal();
      }, () => { dismissLoading(); presentAlert('No se logró agregar el producto'); });
    } else {
      dismissLoading();
      presentAlert('La cantidad en bodega es inferior al solicitado');
    }
  }

  changeQuantity(ev) {
    if (this.option.minimum !== null) {
      if (ev.detail.value <= this.option.minimum) {
        this.data.price = this.option.price;
      } else {
        this.data.price = this.option.price_max;
      }
    }
  }

}
