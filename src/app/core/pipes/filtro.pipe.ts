import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string, columna: string, tipo = 1): any[] {
    
    if (tipo === 1) {

      if (texto === '') {
        return arreglo;
      }
      texto = texto.toLocaleLowerCase();
      /*  let array = */
      return arreglo.filter(item => {
        return item[columna].toLowerCase().includes(texto);
      });
      /* let base = 15;
      return array.slice(0, base * contNext); */
    } 

    if (tipo === 2) {
      return arreglo.filter(item => {
        return item[columna];
      });
    }

    return arreglo;
    
  }

}
