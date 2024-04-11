import { Component } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-intensities',
  templateUrl: './intensities.page.html',
  styleUrls: ['./intensities.page.scss'],
})

export class IntensitiesPage {
  isAnimating: boolean = false;

  constructor(private vibration: Vibration) { }

  vibratePhone() {
    this.vibration.vibrate(1000); // 1000 = 1 sec
  }

  handleImageClick(intensity: number, iconIndex: number) {
    if (this.isAnimating) {
      console.log("Animation is still ongoing. Ignoring click.");
      return;
    }

    console.log("Clicked on icon with intensity:", intensity);
    this.vibratePhone();
    const icon = document.querySelectorAll('.inten')[iconIndex - 1] as HTMLElement;

    const keyframesIdentifier = `shake-${intensity}-${iconIndex}-${Date.now()}`;

    const shakeKeyframes = `@keyframes ${keyframesIdentifier} {
      0% { transform: translateX(0); }
      10% { transform: translateX(-${intensity * 2}px); }
      20% { transform: translateX(${intensity * 2}px); }
      30% { transform: translateX(-${intensity * 2}px); }
      40% { transform: translateX(${intensity * 2}px); }
      50% { transform: translateX(-${intensity * 2}px); }
      60% { transform: translateX(${intensity * 2}px); }
      70% { transform: translateX(-${intensity * 2}px); }
      80% { transform: translateX(${intensity * 2}px); }
      90% { transform: translateX(-${intensity * 2}px); }
      100% { transform: translateX(${intensity * 2}px); }
    }`;

    const style = document.createElement('style');
    style.innerHTML = shakeKeyframes;
    document.head.appendChild(style);

    this.isAnimating = true;

    icon.style.animation = `${keyframesIdentifier} 3s ease-in-out`;

    setTimeout(() => {
      console.log("Stop shaking");
      style.remove();
      icon.style.animation = '';
      this.isAnimating = false; 
    }, 3000); // 3000 = 3 sec
  }
}