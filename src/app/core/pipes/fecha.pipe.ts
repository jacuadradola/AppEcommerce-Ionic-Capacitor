import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  transform(value: string, tipo = 1, ...args: any[]): any {

    if (tipo === 1) {
      return new Date(value).toLocaleString();
    } else {
      return new Date(value).toLocaleDateString();
    }

  }
}
