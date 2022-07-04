import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CategoryFormComponent } from 'src/app/core/components/admin/category-form/category-form.component';
import { ProductFormComponent } from 'src/app/core/components/admin/product-form/product-form.component';
import { ProviderFormComponent } from 'src/app/core/components/admin/provider-form/provider-form.component';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentLoading, presentAlert } from 'src/app/core/services/basic.service';
import { LoginService } from 'src/app/core/services/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  segment = 'product';
  products: Product[] = [];
  providers: Provider[] = [];
  categories: Category[] = [];

  searchText = '';

  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private login: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.segmentChanged({detail:{value: 'product'}});
  }

  /**products */

  async getProduct() {
    await presentLoading();
    this.api.getResponse('productAdmin', 'GET', []).then((res: {data: Product[]}) => {
      this.products = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  productForm(product: Product = null) {
    this.modalCtrl.create({
      component: ProductFormComponent,
      componentProps: {
        product: product
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(info => {
        if (info.data === 1) {
          this.getProduct();
        }
      })
    });
  }

  /**provider */

  async getProvider() {
    await presentLoading();
    this.api.getResponse('provider', 'GET', []).then((res: {data: Provider[]}) => {
      this.providers = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  providerForm(provider: Provider = null) {
    this.modalCtrl.create({
      component: ProviderFormComponent,
      componentProps: {
        provider: provider
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(info => {
        if (info.data === 1) {
          this.getProvider();
        }
      })
    });
  }

  /**category */

  async getCategory() {
    await presentLoading();
    this.api.getResponse('categoryAdmin', 'GET', []).then((res: {data: Category[]}) => {
      this.categories = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  categoryForm(category: Category = null) {
    this.modalCtrl.create({
      component: CategoryFormComponent,
      componentProps: {
        category: category
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(info => {
        if (info.data === 1) {
          this.getCategory();
        }
      })
    });
  }

  segmentChanged(event) {
    this.segment = event.detail.value;
    if (this.segment === 'product') {
      this.getProduct();
    }
    if (this.segment === 'category') {
      this.getCategory();
    }
    if (this.segment === 'provider') {
      this.getProvider();
    }
  }

  actionAdd() {
    if(this.segment === 'product') {
      this.productForm();
    }
    if(this.segment === 'provider') {
      this.providerForm();
    }
    if(this.segment === 'category') {
      this.categoryForm();
    }
  }

  async logOut() {
    await presentLoading();
    this.login.getLogout().then((res) => {
      if (res === 1) {
        dismissLoading();
        this.router.navigate(['login']);
      } else {
        dismissLoading();
      }
    }, () => dismissLoading());
  }

  search(ev) {
    this.searchText = ev.detail.value;
  }

  deleteOrder() {
    this.api.getResponse('deleteOrder', 'POST',[]).then((res:any) => {
      presentAlert(res.data); 
    }, () => presentAlert('Error al borrar'));
  }

  modeStore() {
    this.api.getResponse('modeStore', 'POST',[]).then((res:any) => {
      presentAlert(res.data); 
    }, () => presentAlert('Error al cambiar el estado de la tienda'));
  }

}
