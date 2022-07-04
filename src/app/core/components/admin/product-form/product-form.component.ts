import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from 'src/app/core/services/basic.service';
import { ImagenService } from 'src/app/core/services/imagen/imagen.service';
import { OptionFormComponent } from '../option-form/option-form.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  data: Product = {
    active: 0,
    category_id: null,
    description: '',
    discount: 0,
    name: '',
    umbral_group: false,
    provider_id: null,
    photo: null,
  };

  product_id = null;
  categories: Category[] = [];
  providers: Provider[] = [];
  options: Option[] = [];
  exit = false;
  imagen = null;
  albums: Album[] = [];

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
    private alert: AlertController,
    private image: ImagenService
  ) { }

  async ngOnInit() {
    await presentLoading();
    const product: Product = this.navParams.get('product');
    if (!isNullOrUndefined(product)) {
      this.product_id = product.id;
      this.data.active = product.active;
      this.data.description = product.description;
      this.data.discount = product.discount;
      this.data.name = product.name;
      this.data.umbral_group = product.umbral_group;
      this.imagen = product.image;
      await this.getOption();
      setTimeout(() => {
        this.data.provider_id = product.provider_id;
        this.data.category_id = product.category_id;
      }, 1000);
      await this.getAlbum();
    }
    await this.getCategory();
    await this.getProvider();
    dismissLoading();
  }

  async getOption() {
    try {
      this.options = (await this.api.getResponse('product/' + this.product_id + '/options', 'GET', []) as { data: Option[] }).data;
    } catch (error) {
      dismissLoading();
    }
  }

  async getCategory() {
    try {
      this.categories = (await this.api.getResponse('categoryAdmin', 'GET', []) as { data: Category[] }).data;
      if (this.product_id == null) {
        this.data.category_id = this.categories[0].id;
      }
    } catch (error) {
      dismissLoading();
    }
  }

  async getProvider() {
    try {
      this.providers = (await this.api.getResponse('provider', 'GET', []) as { data: Provider[] }).data;
      if (this.product_id == null) {
        this.data.provider_id = this.providers[0].id;
      }
    } catch (error) {
      dismissLoading();
    }
  }

  closeModal(data = null) {
    data = this.exit ? 1 : data;
    this.modalCtrl.dismiss(data);
  }

  async photo() {
    await presentLoading();
    this.image.captureImage().then((res: ImageForm) => {
      this.data.photo = res;
      this.imagen = `data:image/${res.type_image};base64,${res.imagen}`;
      dismissLoading();
    }, () => { dismissLoading(); presentAlert('Ocurrio un error al tomar la foto'); });
  }

  async send() {
    await presentLoading();
    if (this.product_id != null) {
      this.api.getResponse('product/' + this.product_id, 'PATCH', this.data).then((res) => {
        dismissLoading();
        this.exit = true;
        presentAlert('Se actualizó el producto exitosamente');
      }, () => { dismissLoading(); presentAlert('No se logró actualizar el producto'); });
    } else if (this.data.photo != null) {
      this.api.getResponse('product', 'POST', this.data).then((res: { data: Product }) => {
        dismissLoading();
        this.alert.create({
          header: 'Se agregó el producto exitosamente',
          message: '¿Desea agregar una opción?',
          buttons: [
            {
              text: 'Si',
              handler: () => {
                this.exit = true;
                this.product_id = res.data.id;
              }
            },
            {
              text: 'No',
              handler: () => {
                this.closeModal(1);
              }
            }
          ]
        }).then(alert => alert.present());
      }, () => { dismissLoading(); presentAlert('No se logró crear el producto'); });
    } else {
      dismissLoading();
      presentAlert('Es necesaria la foto');
    }
  }

  optionForm(option: Option = null) {
    this.modalCtrl.create({
      component: OptionFormComponent,
      componentProps: {
        option,
        product_id: this.product_id
      }
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(async (info) => {
        if (info.data != null) {
          if (option != null) {
            await this.getOption();
          } else {
            this.options.push(info.data);
          }
        }
      })
    })
  }

  async getAlbum() {
    try {
      this.albums = (await this.api.getResponse('album/' + this.product_id, 'GET', []) as { data: Album[] }).data;
    } catch (error) {
      dismissLoading();
    }
  }

  addAlbum() {
    this.image.captureImage().then((res: ImageForm) => {
      const data: Album = {
        photo: res,
        product_id: this.product_id
      };

      this.api.getResponse('album', 'POST', data).then((res1: { data: Album }) => {
        this.albums.push(res1.data);
        presentAlert('Imagen Agregada');
      }, () => presentAlert('No se pudo agregar'));

    }, () => presentAlert('Ocurrio un error al tomar la foto'))
  }

  removeAlbum(id) {
    this.alert.create({
      header: 'Alerta',
      message: '¿Seguro que quiere eliminar?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.api.getResponse('album/' + id, 'DELETE', {}).then(async () => {
              await this.getAlbum();
              presentAlert('Imagen eliminada');
            }, () => presentAlert('No se pudo eliminar'));
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  updateAlbum(id) {
    this.image.captureImage().then((res: ImageForm) => {
      this.alert.create({
        header: 'Alerta',
        subHeader: '¿Seguro que quiere actualizar?',
        message: 'La imagen actual sera eliminada',
        buttons: [
          {
            text: 'Si',
            handler: () => {
              const data: Album = {
                photo: res,
              };

              this.api.getResponse('album/' + id, 'PATCH', data).then(async () => {
                await this.getAlbum();
                presentAlert('Imagen Actualizada');
              }, () => presentAlert('No se pudo Actualizar'));
            }
          },
          {
            text: 'No',
            role: 'cancel'
          }
        ]
      }).then(alert => alert.present());

    }, () => presentAlert('Ocurrio un error al tomar la foto'))
  }

}
