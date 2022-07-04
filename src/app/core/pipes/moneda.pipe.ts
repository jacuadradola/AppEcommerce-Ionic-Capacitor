import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
})
export class MonedaPipe implements PipeTransform {
  transform(data: any, ...args: any[]): any {
    if (typeof data) {
      data = String(data);
    }
    return data.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d)\.?)/g, '.');
  }
}
