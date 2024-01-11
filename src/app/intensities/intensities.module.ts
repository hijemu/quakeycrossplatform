import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntensitiesPageRoutingModule } from './intensities-routing.module';

import { IntensitiesPage } from './intensities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntensitiesPageRoutingModule
  ],
  declarations: [IntensitiesPage]
})
export class IntensitiesPageModule {}
