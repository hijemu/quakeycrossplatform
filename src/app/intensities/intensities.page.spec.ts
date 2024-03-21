import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntensitiesPage } from './intensities.page';

describe('IntensitiesPage', () => {
  let component: IntensitiesPage;
  let fixture: ComponentFixture<IntensitiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntensitiesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IntensitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
