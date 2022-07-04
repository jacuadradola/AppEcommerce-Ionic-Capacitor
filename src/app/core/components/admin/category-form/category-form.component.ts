import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, isNullOrUndefined, presentAlert, presentLoading } from 'src/app/core/services/basic.service';
import { ImagenService } from 'src/app/core/services/imagen/imagen.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {

  data: Category = {
    name: '',
    umbral_group: 0,
    photo: null,
    exclusive: false
  };

  category_id = null;
  imagen = null
  umbral: Umbral[] = [];

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
    private image: ImagenService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    await presentLoading();
    const category: Category = this.navParams.get('category');
    if (!isNullOrUndefined(category)) {
      this.category_id = category.id;
      this.data.exclusive = category.exclusive;
      this.data.name = category.name;
      this.data.umbral_group = category.umbral_group;
      this.imagen = category.image;
      this.getUmbral();
    }
    dismissLoading();
  }

  closeModal(data = null) {
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
    if (this.category_id != null) {
      this.api.getResponse('category/' + this.category_id, 'PATCH', this.data).then(() => {
        dismissLoading();
        presentAlert('Categoría actualizada');
        this.closeModal(1);
      }, () => { dismissLoading(); presentAlert('No se logró actualizar'); });
    } else if (this.data.photo != null) {
      this.api.getResponse('category', 'POST', this.data).then(() => {
        dismissLoading();
        presentAlert('Se creó la categoría exitosamente');
        this.closeModal(1);
      }, () => { dismissLoading(); presentAlert('No se logró crear la categoría'); });
    } else {
      dismissLoading();
      presentAlert('Es requerida la foto');
    }
  }

  umbralForm(umbral: Umbral = null) {

    this.alertCtrl.create({
      header: umbral == null ? 'Crear Umbral' : 'Actualizar umbral',
      inputs: [
        {
          name: 'value_min',
          type: 'number',
          placeholder: 'Valor minimo',
          value: umbral == null ? null : umbral.value_min
        },
        {
          name: 'value_max',
          type: 'number',
          placeholder: 'Valor maximo',
          value: umbral == null ? null : umbral.value_max
        },
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: async (data) => {
            const num_min = Number(data.value_min);
            const num_max = Number(data.value_max);
            /* console.log(data); */

            if (num_min >= num_max) {
              presentAlert('Los valores no son aceptados. ' + num_min + ' debe ser menor que ' + num_max);
            } else {
              await presentLoading();
              const d = {
                value_min: num_min,
                value_max: num_max,
                category_id: this.category_id
              };
              if (umbral == null) {
                this.api.getResponse('umbral', 'POST', d).then(() => {
                  dismissLoading();
                  presentAlert('Creación exitosa');
                  this.getUmbral();
                }, () => { dismissLoading(); presentAlert('No se pudo crear'); });
              } else {
                this.api.getResponse('umbral/' + umbral.id, 'PATCH', d).then(() => {
                  dismissLoading();
                  presentAlert('Actualización exitosa');
                  this.getUmbral();
                }, () => { dismissLoading(); presentAlert('No se pudo crear'); });
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

  async getUmbral() {
    try {
      this.umbral = (await this.api.getResponse('category/' + this.category_id + '/umbrals', 'GET', []) as { data: Umbral[] }).data;
    } catch (error) {
      dismissLoading();
    }
  }
}
