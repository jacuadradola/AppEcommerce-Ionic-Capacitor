import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from '../../services/basic.service';
import { StoragesService } from '../../services/storages/storages.service';
import { BillComponent } from '../bill/bill.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  product: Product = null;
  optionSelect: Option;
  option_id = null;
  favorite = false;

  view = false;

  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private storage: StoragesService
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    const product = this.navParams.get('product_id');
    this.api.getResponse('product/' + product, 'GET', []).then((res: { data: Product }) => {
      this.product = res.data;
      if (this.product.options.length !== 0) {
        this.changeOption({ detail: { value: this.product.options[0].id } });
      }
      this.view = true;
      /* console.log(this.product.albums); */
      dismissLoading();
      this.getFavorite();
    }, () => dismissLoading());
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  changeOption(ev) {
    this.option_id = ev.detail.value;
    this.optionSelect = this.product.options.filter(option => option.id === this.option_id)[0];
  }

  async order() {
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.modalCtrl.create({
        component: BillComponent,
        componentProps: {
          option: this.optionSelect
        }
      }).then(modal => modal.present());
    } else {
      presentAlert('No ha iniciado sesión');
    }
  }

  async deleteFavorite() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse(`client/${info.id_client}/product/${this.product.id}`, 'DELETE', []).then(() => {
        this.favorite = false;
        dismissLoading();
        presentAlert('El producto se eliminó de favoritos');
      }, () => dismissLoading());
    } else {
      dismissLoading();
      presentAlert('No ha iniciado sesión');
    }
  }

  async getFavorite() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse(`client/${info.id_client}/product/${this.product.id}`, 'GET', []).then((res: { data: boolean }) => {
        this.favorite = res.data;
        dismissLoading();
      }, () => dismissLoading());
    } else {
      dismissLoading();
    }
  }

  async addFavorite() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse(`client/${info.id_client}/product/${this.product.id}`, 'PATCH', []).then(() => {
        this.favorite = true;
        dismissLoading();
        presentAlert('El producto se añadió de favoritos');
      }, () => dismissLoading());
    } else {
      dismissLoading();
      presentAlert('No ha iniciado sesión');
    }
  }


}
