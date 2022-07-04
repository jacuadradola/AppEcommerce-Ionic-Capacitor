import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
//mport { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionStatus, NetworkService } from './core/services/network/network.service';
// import { NotificationService } from './core/services/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar,
    private net: NetworkService,
    //private noti: NotificationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.backgroundColorByHexString('#ffc9e1ff');
      document.body.setAttribute('color-theme', 'light');
     /*  this.statusBar.styleDefault(); */
      //this.splashScreen.hide();
      //this.noti.configuracionInicial();
      this.net.onNetworkChange().subscribe((status: ConnectionStatus) => {
        // console.log('cambios red');
      });
    });
  }
}
