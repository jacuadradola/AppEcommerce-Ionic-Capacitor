import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login.guard';
import { TabsGuard } from './core/guards/tabs.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./shared/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [TabsGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./public/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./shared/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AdminGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
