import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSpinnerComponent } from './popup-spinner.component';

describe('PopupSpinnerComponent', () => {
  let component: PopupSpinnerComponent;
  let fixture: ComponentFixture<PopupSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
