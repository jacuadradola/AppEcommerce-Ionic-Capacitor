import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { MonedaPipe } from './moneda.pipe';
import { FechaPipe } from './fecha.pipe';
import { HoraPipe } from './hora.pipe';



@NgModule({
  declarations: [FiltroPipe, MonedaPipe, FechaPipe, HoraPipe],
  exports: [FiltroPipe, MonedaPipe, FechaPipe, HoraPipe]
})
export class PipesModule { }
