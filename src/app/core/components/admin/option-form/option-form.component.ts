import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController, NavParams } from "@ionic/angular";
import { ApiService } from "src/app/core/services/api/api.service";
import {
  dismissLoading,
  isNull,
  presentAlert,
  presentLoading,
} from "src/app/core/services/basic.service";

@Component({
  selector: "app-option-form",
  templateUrl: "./option-form.component.html",
  styleUrls: ["./option-form.component.scss"],
})
export class OptionFormComponent implements OnInit {
  data: Option = {
    description: "",
    name: "",
    price: 0,
    price_max: null,
    minimum: null,
    product_id: null,
    quantity: 0,
    active: true,
  };
  option_id = null;
  umbralOptions: UmbralOption[] = [];
  umbrals: Umbral[] = [];
  umbral_id = null;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private api: ApiService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await presentLoading();
    this.data.product_id = this.navParams.get("product_id");
    const option: Option = this.navParams.get("option");
    if (!isNull(option)) {
      this.option_id = option.id;
      this.data.description = option.description;
      this.data.active = option.active;
      this.data.name = option.name;
      this.data.price = option.price;
      this.data.minimum = option.minimum;
      this.data.price_max = option.price_max;
      this.data.quantity = option.quantity;
      this.getUmbralOption();
    }
    this.getUmbrals();
    dismissLoading();
  }

  async send() {
    await presentLoading();
    if (isNull(this.option_id)) {
      this.api.getResponse("option", "POST", this.data).then(
        (res: { data: Option }) => {
          dismissLoading();
          presentAlert("Se creó la opción exitosamente");
          this.closeModal(res.data);
        },
        () => {
          dismissLoading();
          presentAlert("No se logró crear la opción");
        }
      );
    } else {
      this.api.getResponse("option/" + this.option_id, "PATCH", this.data).then(
        (res: { data: Option }) => {
          dismissLoading();
          presentAlert("Se actualizó la opción exitosamente");
          this.closeModal(res.data);
        },
        () => {
          dismissLoading();
          presentAlert("No se logró actualizar la opción");
        }
      );
    }
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  umbralForm(umbralOption: UmbralOption = null) {
    if (umbralOption == null && this.umbral_id == null) {
      presentAlert(
        "Selecciona una opción de umbral. Si no hay opciones ingresa una desde el apartado de categoría"
      );
      return;
    }
    this.alertCtrl
      .create({
        header:
          umbralOption == null
            ? "Asignar precio a umbral"
            : "Actualizar precio del umbral",
        inputs: [
          {
            name: "price",
            placeholder: "Precio",
            value: umbralOption == null ? null : umbralOption.price,
          },
        ],
        buttons: [
          {
            text: "Enviar",
            handler: async (data) => {
              await presentLoading();
              const d = {
                price: data.price,
                option_id: this.option_id,
                umbral_id:
                  umbralOption == null
                    ? this.umbral_id
                    : umbralOption.umbral_id,
              };
              if (umbralOption == null) {
                this.api.getResponse("umbralOption", "POST", d).then(
                  () => {
                    dismissLoading();
                    presentAlert("Creación exitosa");
                    this.getUmbralOption();
                  },
                  () => {
                    dismissLoading();
                    presentAlert("No se pudo crear");
                  }
                );
              } else {
                this.api
                  .getResponse("umbralOption/" + umbralOption.id, "PATCH", d)
                  .then(
                    () => {
                      dismissLoading();
                      presentAlert("Actualización exitosa");
                      this.getUmbralOption();
                    },
                    () => {
                      dismissLoading();
                      presentAlert("No se pudo crear");
                    }
                  );
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  async getUmbralOption() {
    try {
      this.umbralOptions = (
        (await this.api.getResponse(
          "option/" + this.option_id + "/umbralOptions",
          "GET",
          []
        )) as { data: UmbralOption[] }
      ).data;
    } catch (error) {
      dismissLoading();
    }
  }

  async getUmbrals() {
    try {
      this.umbrals = (
        (await this.api.getResponse(
          "option/" + this.option_id + "/umbrals",
          "GET",
          []
        )) as { data: Umbral[] }
      ).data;
      this.umbral_id = this.umbrals[0].id;
    } catch (error) {
      dismissLoading();
    }
  }
  async deleteOptionUmbral(id: number) {
    await presentLoading();
    this.api.getResponse("umbralOption/" + id, "DELETE", []).then(
      () => {
        this.getUmbralOption();
        dismissLoading();
        presentAlert("Se eliminó correctamente");
      },
      () => {
        dismissLoading();
        presentAlert("No se logró completar la eliminación.");
      }
    );
  }
}
