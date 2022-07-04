import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { numeral } from '../../constante/constante';
import { ApiService } from '../api/api.service';
import { NotificationService } from '../notification/notification.service';
import { StoragesService } from '../storages/storages.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private api: ApiService,
    private storage: StoragesService,
    private noti: NotificationService
  ) { }

  getLogout() {
    return new Promise((resolve, reject) => {
      this.api.getHeader().then((res: HttpHeaders) => {
        const options = {
          headers: res,
        };

        this.api.getRequest('POST', `${this.api.PATH}logout`, options).then((data: any) => {
          if (data.status.number === 200) {
            this.storage.clear().then(() => {
              resolve(1);
            })
          } else {
            resolve(data.error);
          }
        });
      });
    });
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      const data: Login = {
        "email": username,
        "password": password,
        "remember_me": true,
        "token_notification": this.noti.getUserId()
      }
      this.api.getResponse('login', 'POST', data).then((res: LoginRes) => {
        const info: Info = {
          token: res.access_token,
          id: res.id,
          id_client: res.id_client,
          type: res.type
        };
        this.storage.set('info', JSON.stringify(info)).then(() => {
          resolve(1);
        })
      }, () => {
        reject('Acceso denegado');
      });
    });
  }

}
