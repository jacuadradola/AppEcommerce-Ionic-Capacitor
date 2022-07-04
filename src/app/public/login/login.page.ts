import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/api.service';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { StoragesService } from 'src/app/core/services/storages/storages.service';
import { LoginService } from 'src/app/core/services/login/login.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { environment, numeral } from 'src/app/core/constante/constante';
import { dismissLoading, presentAlert, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  subscription;

  typeInput = 'password';
  iconpassword = 'eye-off-outline';

  public user = '';
  public pass = '';
  version = '';
  load;

  constructor(
    public api: ApiService,
    public router: Router,
    public Loading: LoadingController,
    public storages: StoragesService,
    private loginSer: LoginService,
    private platform: Platform,
    public net: NetworkService,
  ) {
    this.user = '';
    this.pass = '';
  }

  ngOnInit() {
    this.Loading.create({
      message: 'Espera un momento, por favor...'
    }).then(load => {
      load.present();
      this.user = '';
      this.pass = '';
      this.version = environment.version;
      load.dismiss();
    });


  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.subscription = this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
      });
    }, 1000);

  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  togglePasswordMode() {
    this.typeInput = this.typeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  async login() {
    await presentLoading();
    this.loginSer.login(this.user, this.pass).then(async (data) => {
      if (data === 1) {
        const info: Info = JSON.parse(await this.storages.get('info') as string);
        if (info.type === numeral.type_user.client) {
          this.user = '';
          this.pass = '';
          dismissLoading();
          this.router.navigate(['/tabs']);
        } else if (info.type === numeral.type_user.admin) {
          this.user = '';
          this.pass = '';
          dismissLoading();
          this.router.navigate(['/admin']);
        } else {

          this.storages.clear().then(() => {
            dismissLoading();
            presentAlert('No puede iniciar sesión con las credenciales proporcionadas');
            this.router.navigate(['/login']);
          });
        }
      } else {
        dismissLoading();
        presentAlert(data);
      }
    }, error => {
      dismissLoading();
      presentAlert('No puede iniciar sesión con las credenciales proporcionadas');
    });
  }


}
