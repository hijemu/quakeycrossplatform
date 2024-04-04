import { Component } from '@angular/core';

@Component({
  selector: 'app-intensities',
  templateUrl: './intensities.page.html',
  styleUrls: ['./intensities.page.scss'],
})
export class IntensitiesPage {

  constructor() { }

  handleImageClick(intensity: number, iconIndex: number) {
    console.log("Clicked on icon with intensity:", intensity);
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
    
  
    icon.style.animation = `${keyframesIdentifier} 3s ease-in-out`; 
    
    setTimeout(() => {
      console.log("Stop shaking");
     
      style.remove();
      icon.style.animation = '';
    }, 3000); //3000 = 3 sec
  }
  
}
