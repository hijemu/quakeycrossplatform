import { ComponentFixture, TestBed, async } from '@angular/core/testing'; // Import async

import { ChecklistPage } from './checklist.page';

describe('ChecklistPage', () => {
  let component: ChecklistPage;
  let fixture: ComponentFixture<ChecklistPage>;

  beforeEach(async(() => {
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
