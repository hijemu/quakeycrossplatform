import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChecklistPageRoutingModule } from './checklist-routing.module';
import { ChecklistPage } from './checklist.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    ChecklistPageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [ChecklistPage],
  providers: [Storage]
})
export class ChecklistPageModule {}
