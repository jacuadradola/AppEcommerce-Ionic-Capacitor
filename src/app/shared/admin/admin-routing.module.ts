import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../private/admin/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'client',
        loadChildren: () => import('../../private/admin/client/client.module').then( m => m.ClientPageModule)
      },
      {
        path: 'bill',
        loadChildren: () => import('../../private/admin/bill/bill.module').then( m => m.BillPageModule)
      },  
      {
        path: 'account',
        loadChildren: () => import('../../private/admin/account/account.module').then( m => m.AccountPageModule)
      },   
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}

