import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'mail' },
    { title: 'Bot', url: '/bot', icon: 'paper-plane' },
    { title: 'Intensities', url: '/intensities', icon: 'heart' },
    { title: 'Checklist', url: '/checklist', icon: 'archive' },
    { title: 'About', url: '/about', icon: 'information-circle'},
  ];
  constructor() {}
}
