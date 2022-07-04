import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BillActiveComponent } from '../../components/bill-active/bill-active.component';
import { FavoriteComponent } from '../../components/favorite/favorite.component';
import { ProductCategoryComponent } from '../../components/product-category/product-category.component';
import { ProductComponent } from '../../components/product/product.component';
import { RecordComponent } from '../../components/record/record.component';
import { isNullOrUndefined } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private modalCtrl: ModalController
  ) { }

  productCategory(category) {
    this.modalCtrl.create({
      component: ProductCategoryComponent,
      componentProps: {
        category_id: category
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((info) => {
        if (!isNullOrUndefined(info.data)) {
          if (info.data.name === 'product') {
            this.product(info.data.props.id)
          }
        }
      })
    });
  }

  product(id) {
    this.modalCtrl.create({
      component: ProductComponent,
      componentProps: {
        product_id: id
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then((info) => {
        if (!isNullOrUndefined(info.data)) {
          if (info.data.name === 'productCategory') {
            this.productCategory(info.data.props.id);
          }
        }
      });
    });
  }

  record() {
    this.modalCtrl.create({
      component: RecordComponent
    }).then(modal => modal.present());
  }

  favorite() {
    this.modalCtrl.create({
      component: FavoriteComponent
    }).then(modal => modal.present());
  }

  activeClient() {
    this.modalCtrl.create({
      component: BillActiveComponent
    }).then(modal => modal.present());
  }
}
