import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { presentAlert } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent implements OnInit {

  typeAccounts: TypeAccount[] = [];
  data: Account1 = {
    name: '',
    type_account_id: null,
    name_person: '',
    cc: ''
  }

  constructor(private api: ApiService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getTypeAccount();
  }

  getTypeAccount() {
    this.api.getResponse('typeAccount', 'GET', {}).then((res: {data: TypeAccount[]}) => {
      this.typeAccounts = res.data;
    });
  }

  send() {
    this.api.getResponse('account', 'POST', this.data).then(() => {
      presentAlert('Se creó el número de cuenta');
      this.closeModal(1);
    }, () => presentAlert('Error al crear'));
  }

  closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

}
