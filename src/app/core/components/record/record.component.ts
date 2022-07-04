import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentLoading } from '../../services/basic.service';
import { StoragesService } from '../../services/storages/storages.service';
import { BillDetailComponent } from '../bill-detail/bill-detail.component';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {

  bills: CartBill[] = [];
  view = false;

  constructor(
    private api: ApiService,
    private storage: StoragesService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string);
    if (!isNullOrUndefined(info)) {
      this.api.getResponse('user/'+info.id+'/cart/1', 'GET', []).then((res: {data: CartBill[]}) => {
        this.bills = res.data;

        this.view = true;
        dismissLoading();
      }, () => dismissLoading());
    } else {
      dismissLoading();
    }
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
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
