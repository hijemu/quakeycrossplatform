import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'mail' },
    { title: 'Bot', url: '/folder/bot', icon: 'paper-plane' },
    { title: 'Intensities', url: '/folder/intensities', icon: 'heart' },
    { title: 'Checklist', url: '/folder/checklist', icon: 'archive' },
    { title: 'About', url: '/folder/about', icon: 'trash' },
  ];
  constructor() {}
}
