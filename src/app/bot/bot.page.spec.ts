import { ComponentFixture, TestBed, async } from '@angular/core/testing'; // Import async

import { BotPage } from './bot.page';

describe('BotPage', () => {
  let component: BotPage;
  let fixture: ComponentFixture<BotPage>;

  beforeEach(async(() => {
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
