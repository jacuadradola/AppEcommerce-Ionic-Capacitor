import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from 'src/app/core/services/basic.service';
import { LoginService } from 'src/app/core/services/login/login.service';
import { StoragesService } from 'src/app/core/services/storages/storages.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;
  view = false;

  constructor(
    private api: ApiService,
    private alert: AlertController,
    private login: LoginService,
    private router: Router,
    private storage: StoragesService
  ) { }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    await this.get();
  }

  async get() {
    await presentLoading();
    const info: Info = JSON.parse(await this.storage.get('info') as string); 
    if (!isNullOrUndefined(info)) {
      this.api.getResponse('user', 'GET', []).then((res: User) => {
        this.user = res;
        this.view = true;
        dismissLoading();
      }, () => dismissLoading());
    } else {
      dismissLoading();
    }
  }

  changePassword(passOld = '', passNew = '', passReNew = '') {
    this.alert.create({
      header: 'Cambiar contraseña',
      inputs: [
        {
          type: 'password',
          value: passOld,
          placeholder: 'Contraseña actual',
          name: 'passOld'
        },
        {
          type: 'password',
          value: passNew,
          placeholder: 'Nueva contraseña',
          name: 'passNew'
        },
        {
          type: 'password',
          value: passReNew,
          placeholder: 'Repetir nueva contraseña',
          name: 'passReNew'
        },
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: async (data) => {
            if (data.passOld === '' || data.passNew === '' || data.passReNew === '') {
              this.changePassword(data.passOld, data.passNew, data.passReNew);
              presentAlert('Todos los campos son requeridos');
            } else {
              if (data.passNew === data.passReNew) {
                await presentLoading();
                const d = {
                  password: data.passNew,
                  passwordOld: data.passOld
                };
                this.api.getResponse('user', 'PATCH', d).then(() => {
                  dismissLoading();
                  presentAlert('Se actualizó la contraseña exitosamente');
                }, () => {
                  dismissLoading();
                  this.changePassword();
                  presentAlert('La contraseña actual no es correcta');
                })
              } else {
                this.changePassword(data.passOld);
                presentAlert('Las contraseñas no coinciden');
              }
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  async logOut() {
    await presentLoading();
    this.login.getLogout().then((res) => {
      if (res === 1) {
        this.view = false;
        dismissLoading();
        this.router.navigate(['login']);
      } else {
        dismissLoading();
      }
    }, () => dismissLoading());
  }

}
