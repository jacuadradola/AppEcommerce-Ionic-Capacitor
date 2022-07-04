import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { dismissLoading, presentAlert, presentLoading } from 'src/app/core/services/basic.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  departments: Department[] = [];
  cities: City[] = [];

  data: CreateUser = {
    city_id: null,
    direction: '',
    email: '',
    identification: '',
    name: '',
    password: '',
    reference: '',
    telephone: ''
  };
  departmentId = null;
  password = '';

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.api.getResponse('department', 'get', []).then((res: { data: Department[] }) => {
      this.departments = res.data;
      this.departmentId = this.departments[0].id;
    });
  }

  async changeDepartment(ev) {
    await presentLoading();
    this.api.getResponse('department/' + ev.detail.value + '/cities', 'get', []).then((res: { data: City[] }) => {
      this.cities = res.data;
      dismissLoading();
    }, () => dismissLoading());
  }

  async send() {
    if (this.data.password === this.password) {
      await presentLoading();
      this.api.getResponse('signup', 'POST', this.data).then(() => {
        dismissLoading();
        presentAlert('Se creó la cuenta exitosamente');
        this.router.navigate(['login']);
      }, (error) => {
        dismissLoading();
        presentAlert(error[Object.keys(error)[0]][0]);
      });
    } else {
      presentAlert('Las contraseñas no coinciden');
    }
  }

}
