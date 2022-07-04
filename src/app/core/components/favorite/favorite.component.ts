import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from '../../services/basic.service';
import { StoragesService } from '../../services/storages/storages.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {

  products: Product[] = [];
  view = false;

  constructor(
    private api: ApiService,
    private storage: StoragesService,
    private modalCtrl: ModalController,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.get();
  }

  async get() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse('client/' + info.id_client + '/product', 'GET', []).then((res: { data: Product[] }) => {
        this.products = res.data;

        this.view = true;
        dismissLoading();
      }, () => dismissLoading())
    } else {
      dismissLoading();
    }
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  async delete(id) {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse(`client/${info.id_client}/product/${id}`, 'DELETE', []).then((res: { data: Product[] }) => {
        this.products = res.data;
        dismissLoading();
        presentAlert('El producto se eliminó de favoritos');
      }, () => dismissLoading());
    } else {
      dismissLoading();
    }
  }

  getProduct(id) {
    this.modalService.product(id);
  }

}
