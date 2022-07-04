import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class StoragesService {

  constructor(
  ) { }

  set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      Storage.set({key, value}).then((data: any) => {
        resolve(data);
      });

    });
  }
  get(key: string) {
    return new Promise((resolve, reject) => {
      Storage.get({key}).then((data: any) => {
        resolve(data.value);
      });
    });
  }

  remove(key: string) {
    return new Promise((resolve, reject) => {
      Storage.remove({key}).then((data: any) => {
        resolve(data);
      });
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      Storage.clear().then((data: any) => {
        resolve(data);
      });
    });
  }
}
