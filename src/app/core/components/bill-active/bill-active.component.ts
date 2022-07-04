import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, presentLoading } from '../../services/basic.service';
import { BillDetailComponent } from '../bill-detail/bill-detail.component';

@Component({
  selector: 'app-bill-active',
  templateUrl: './bill-active.component.html',
  styleUrls: ['./bill-active.component.scss'],
})
export class BillActiveComponent implements OnInit {

  bills: Bill[] = [];

  constructor(
    private api:ApiService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('clientBillActive', 'GET', []).then((res: {data: Bill[]}) => {
      this.bills = res.data;
      
      dismissLoading();
    }, () => dismissLoading());
  }

  closeModal() {
    this.modalCtrl.dismiss();
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
