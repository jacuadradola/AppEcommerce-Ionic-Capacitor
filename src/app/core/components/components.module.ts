import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductComponent } from './product/product.component';
import { MenuComponent } from './menu/menu.component';
import { RecordComponent } from './record/record.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { BillComponent } from './bill/bill.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { OptionFormComponent } from './admin/option-form/option-form.component';
import { ProviderFormComponent } from './admin/provider-form/provider-form.component';
import { CategoryFormComponent } from './admin/category-form/category-form.component';
import { MenuBillComponent } from './admin/menu-bill/menu-bill.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { BillFinishComponent } from './admin/bill-finish/bill-finish.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { BillActiveComponent } from './bill-active/bill-active.component';
import { AccountFormComponent } from './admin/account-form/account-form.component';


@NgModule({
  declarations: [
    // componentes
    ProductCategoryComponent,
    ProductComponent,
    MenuComponent,
    RecordComponent,
    FavoriteComponent,
    BillComponent,
    ProductFormComponent,
    OptionFormComponent,
    ProviderFormComponent,
    CategoryFormComponent,
    MenuBillComponent,
    InventoryComponent,
    BillFinishComponent,
    BillDetailComponent,
    BillActiveComponent,
    AccountFormComponent,
  ],
  exports: [
    // componentes
    ProductCategoryComponent,
    ProductComponent,
    MenuComponent,
    RecordComponent,
    FavoriteComponent,
    BillComponent,
    ProductFormComponent,
    OptionFormComponent,
    ProviderFormComponent,
    CategoryFormComponent,
    MenuBillComponent,
    InventoryComponent,
    BillFinishComponent,
    BillDetailComponent,
    BillActiveComponent,
    AccountFormComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule,
  ],
})
export class ComponentsModule { }
export const components = [
  // componentes
  ProductCategoryComponent,
  ProductComponent,
  MenuComponent,
  RecordComponent,
  FavoriteComponent,
  BillComponent,
  ProductFormComponent,
  OptionFormComponent,
  ProviderFormComponent,
  CategoryFormComponent,
  MenuBillComponent,
  InventoryComponent,
  BillFinishComponent,
  BillDetailComponent,
  BillActiveComponent,
  AccountFormComponent
];
