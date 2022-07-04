import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../private/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'Shopping',
        loadChildren: () => import('../../private/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartPageModule)

      },
      {
        path: 'profile',
        loadChildren: () => import('../../private/profile/profile.module').then(m => m.ProfilePageModule)

      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
