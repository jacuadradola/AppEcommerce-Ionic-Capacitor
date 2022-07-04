import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { numeral } from '../constante/constante';
import { isNullOrUndefined } from '../services/basic.service';
import { StoragesService } from '../services/storages/storages.service';

@Injectable({
  providedIn: 'root'
})
export class TabsGuard implements CanActivate {
  constructor(
    private storage: StoragesService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.storage.get('info').then((information: string) => {
        const info: Info = JSON.parse(information);
        if (isNullOrUndefined(info)) {
          return true;
        } else {
          if (info.type == numeral.type_user.client) {
            return true;
          } else {
            this.router.navigate(['admin']);
            return false;
          }
        }
      });
  }

  
  
}
