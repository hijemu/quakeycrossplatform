import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'; 

import { BotPage } from './bot.page';

describe('BotPage', () => {
  let component: BotPage;
  let fixture: ComponentFixture<BotPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BotPage]
    }).compileComponents().then(() => { 
      fixture = TestBed.createComponent(BotPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
