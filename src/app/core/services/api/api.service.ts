import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { StoragesService } from '../storages/storages.service';
import { NetworkService } from '../network/network.service';
import { ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../constante/constante';
import { delay } from 'rxjs/operators';
import { isNullOrUndefined } from '../basic.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public PATH = environment.URL;

  constructor(
    private http: HttpClient,
    private storages: StoragesService,
    private net: NetworkService,
    private toast: ToastController,
    private router: Router,
    private alert: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
  ) { }

  async getToken() {
    const data: any = await this.storages.get('info');

    if (!isNullOrUndefined(data)) {
      const token: Info = JSON.parse(data);
      if (!isNullOrUndefined(token.token)) {
        const c = token.token as string;
        return c;
      }
      return '';
    } else {
      return '';
    }

  }

  getHeader() {
    return new Promise((resolve, reject) => {
      this.getToken().then((res) => {
        const data: any = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        };
        if (res !== '') {
         /*  console.log(res); */
          data['Authorization'] = `Bearer ${res}`;
        }
        const head = new HttpHeaders(data);

        resolve(head);


      });
    });
  }



  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.status >= 400 && error.status < 500) {
      if (error.status === 401 || error.status === 403) {
        this.tokenerror();
      }

      return {
        error: error.error[Object.keys(error.error)[0]][0],
        error1: error.error,
        status: {
          number: error.status,
          text: error.statusText,
        },
      };
    } else {
      // console.log(error);
      return {
        error: 'Problemas en el servidor',
        status: {
          number: error.status,
          text: error.statusText,
        },
      };
    }

  }

  getRequest(method, route: string, options, time = 1) {
    return new Promise((resolve, reject) => {
      this.http.request(method, route, options).pipe(delay(time)).subscribe(
        (res: any) => {
          resolve({
            data: res,
            status: {
              number: 200,
              text: 'Ok',
            },
          });
        },
        (error) => {
          console.log(error);
          resolve(this.handleError(error));
        }
      );
    });
  }

  /**
   * Todas las consultas a REST
   * @param ruta ubicacion a buscar
   * @param method REST (GET, POST, PATCH, DELETE)
   * @param datas Información a enviar
   * @param time Tiempo de espera
   * @param tipo tipo de consulta: 0->Api 1->Wompi
   */
  getResponse(ruta: string, method: string, datas) {
    return new Promise((resolve, reject) => {
      if (this.net.getCurrentNetworkStatus() === 0) {
        this.getHeader().then((head: HttpHeaders) => {
          const options: any = {
            body: datas,
            headers: head
          };

          this.getRequest(method, this.PATH + ruta, options).then(
            (data: any) => {
              if (data.status.number === 200) {
                resolve(data.data);
              } else {
                reject(data.error1);
              }
            }
          );
        });
      } else {
        reject({ error: 'No está conectado' });
        this.presentToast('No está conectado a internet');
      }
    });
  }

  async presentToast(msj) {
    const toast = await this.toast.create({
      message: msj,
      duration: 3000,
    });
    toast.present();
  }

  async tokenerror() {
    const loading = await this.loadingController.getTop();
    if (loading) {
      loading.dismiss();
    }
    this.storages.clear().then(() => {
      this.alert.create({
        header: 'Atención',
        message: 'Para realizar esta acción, es necesario iniciar sesión',
        backdropDismiss: false,
        buttons: [{
          text: 'Ir',
          handler: async () => {
            const modal = await this.modalController.getTop();
            if (modal) {
              modal.dismiss();
            }
            this.router.navigate(['login']);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            const modal = await this.modalController.getTop();
            if (modal) {
              modal.dismiss();
            }
          }
        }
        ]
      }).then(alert => {
        alert.present();
      });

    });
  }
}
