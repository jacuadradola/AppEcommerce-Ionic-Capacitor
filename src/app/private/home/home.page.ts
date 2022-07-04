import { Component } from '@angular/core';
import { ProductCategoryComponent } from 'src/app/core/components/product-category/product-category.component';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentLoading } from 'src/app/core/services/basic.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  categories: Category[] = [];
  segment = 3;

  constructor(
    private api: ApiService,
    private modalService: ModalService
  ) {}

  async ionViewDidEnter() {
    await this.getAllCategories();
    
  }

  async getAllCategories() {
    await presentLoading();
    this.api.getResponse('category', 'GET', []).then((res: { data: Category[]}) => {
      this.categories = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  segmentChanged(event) {
    this.segment = Number.parseInt(event.detail.value);
  }

  productCategory(category) {
    this.modalService.productCategory(category);
  }

}
