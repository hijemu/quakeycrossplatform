import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vibration } from '@ionic-native/vibration/ngx';
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
  declarations: [IntensitiesPage],
  providers: [
    Vibration,
  ],
  
})
export class IntensitiesPageModule {}
