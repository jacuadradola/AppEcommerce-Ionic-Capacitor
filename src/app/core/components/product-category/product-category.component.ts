import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentLoading } from '../../services/basic.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {

  products: Product[] = [];
  buscar = '';

  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private modalService: ModalService
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    const category = this.navParams.get('category_id');
    if (isNullOrUndefined(category)) {
      this.api.getResponse('product', 'GET', []).then((res: { data: Product[] }) => {
        this.products = res.data;
        dismissLoading();
      }, () => dismissLoading());
    } else {
      this.api.getResponse('category/' + category + '/products', 'GET', []).then((res: { data: Product[] }) => {
        this.products = res.data;
        dismissLoading();
      }, () => dismissLoading());
    }
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  getProduct(id) {
    this.modalService.product(id);
  }

  search(ev) {
    this.buscar = ev.detail.value;
  }

}
