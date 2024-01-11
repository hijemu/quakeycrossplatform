import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntensitiesPage } from './intensities.page';

const routes: Routes = [
  {
    path: '',
    component: IntensitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntensitiesPageRoutingModule {}
