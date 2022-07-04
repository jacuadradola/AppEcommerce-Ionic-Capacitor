import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {

  products: Product[] = [];
  buscar = '';

  constructor(
    private api: ApiService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('inventory', 'GET', []).then((res: {data: Product[]}) => {
      this.products = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  search(ev) {
    this.buscar = ev.detail.value;
  }

}
