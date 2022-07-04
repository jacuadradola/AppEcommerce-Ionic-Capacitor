import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora',
})
export class HoraPipe implements PipeTransform {
  transform(value: string, tipo = 1, ...args: any[]): any {

    if (tipo === 1) {
      return new Date(value).toLocaleTimeString();
    } else {
      return new Date(value).toTimeString();
    }

  }
}
