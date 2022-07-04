import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentLoading } from 'src/app/core/services/basic.service';
import { BillDetailComponent } from '../../bill-detail/bill-detail.component';

@Component({
  selector: 'app-bill-finish',
  templateUrl: './bill-finish.component.html',
  styleUrls: ['./bill-finish.component.scss'],
})
export class BillFinishComponent implements OnInit {

  bills: CartBill[] = [];

  constructor(
    private api: ApiService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    this.api.getResponse('billFinish', 'GET', []).then((res: {data: CartBill[]}) => {
      this.bills = res.data;
      console.log(this.bills);
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
