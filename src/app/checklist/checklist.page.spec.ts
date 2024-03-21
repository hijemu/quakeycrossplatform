import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'; 

import { ChecklistPage } from './checklist.page';

describe('ChecklistPage', () => {
  let component: ChecklistPage;
  let fixture: ComponentFixture<ChecklistPage>;

  beforeEach(waitForAsync(() => { 
    TestBed.configureTestingModule({
      declarations: [ChecklistPage]
    })
    .compileComponents(); 
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
