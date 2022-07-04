import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { isNullOrUndefined } from '../basic.service';
import { StoragesService } from '../storages/storages.service';

interface Temp {
  category: number;
  quantity: number;
  umbral: number;
  order: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class UmbralGroupService {

  num = 0;

  constructor(private api: ApiService, private storage: StoragesService) { }

  /* async validCart(cart: CartBill) {
    return new Promise(async (resolve, reject) => {
      const info: Info = JSON.parse(await this.storage.get('info') as string);
      if (!isNullOrUndefined(info)) {

        if (cart != null) {
          let data: Temp[] = [];
          cart.orders.forEach(order => {

            if (order.option.product.umbral_group) {
              const aux1 = data.filter(item => item.category == order.option.product.category.id);
              if (aux1.length == 0) {
                const aux: Temp = {
                  category: order.option.product.category.id,
                  quantity: order.quantity,
                  umbral: order.option.product.category.umbral_group,
                  order: [order]
                };
                data.push(aux);
              } else {
                for (let i = 0; i < data.length; i++) {
                  const element = data[i];
                  if (data[i].category == order.option.product.category.id) {
                    data[i].quantity += order.quantity;
                    data[i].order.push(order);
                  }
                }
              }
            }
          });
          data.forEach(async (element) => {
            if (element.quantity > element.umbral) {
              element.order.forEach(async (element1) => {
                if (element1.price != element1.option.price_max) {
                  const up = {
                    price: element1.option.price_max
                  }
                  await this.api.getResponse('order/' + element1.id, 'PATCH', up);
                  this.num += 1;
                  if (this.num == data.length) {
                    resolve(1)
                  }
                } else {
                  if (this.num == data.length) {
                    resolve(1)
                  }
                }
              });
            } else {
              element.order.forEach(async (element1) => {
                if (element1.price != element1.option.price) {
                  const up = {
                    price: element1.option.price
                  }
                  await this.api.getResponse('order/' + element1.id, 'PATCH', up);
                  this.num += 1;
                  if (this.num == data.length) {
                    resolve(1)
                  }
                } else {
                  if (this.num == data.length) {
                    resolve(1)
                  }
                }
              });
            }
          });
        } else {
          resolve(1)
        }
      } else {
        resolve(1)
      }
    })
  } */
}
