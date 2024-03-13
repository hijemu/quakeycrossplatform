import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

const apiUrl = "http://208.87.132.134/earthquake-rest-api/public/earthquake";

@Component({
  selector: 'app-bot',
  templateUrl: 'bot.page.html',
  styleUrls: ['bot.page.scss'],
})
export class BotPage {
  data: any = {}; 
  posts: any;
  loading: any;
  bots: any;
  bot1: any;
  bot2: any;
  bot3: any;
  bot4: any;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    await this.loadBot2();
  }

  async loadBot2() {
    this.showLoading();
  
    const apiUrl = "http://208.87.132.134/earthquake-rest-api/public/earthquake";
  
    this.http.get(apiUrl).subscribe(
      (data: any) => {
        console.log('Response data:', data);
  
        const earthquakeData = data?.earthquake_data || [];
  
        this.bot1 = earthquakeData[0];
        this.bot2 = earthquakeData[1];
        this.bot3 = earthquakeData[2];
        this.bot4 = earthquakeData[3];
  
        this.bots = [this.bot1, this.bot2, this.bot3, this.bot4];
        
        console.log('Bots array:', this.bots); 
  
        this.loading.dismiss();
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loading.dismiss();
      }
    );
  }
  
  

  

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Help',
      message: 'Social media chatters on recent Philippine earthquakes',
      buttons: ['OK'],
      cssClass: 'my-alert',
    });
    await alert.present();
  }

  linkify(text: string) { 
    if (!text) return ''; 
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url: string) { 
      return '<a href="' + url + '">' + url + '</a>';
    });
  }
}
