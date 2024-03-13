import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BotPage } from './bot.page';
import { BotPageRoutingModule } from './bot-routing.module'; 
@NgModule({
  declarations: [
    BotPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BotPageRoutingModule 
  ],
  exports: [
    BotPage
  ]
})
export class BotPageModule {}
