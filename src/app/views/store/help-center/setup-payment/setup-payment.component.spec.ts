import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPaymentComponent } from './setup-payment.component';

describe('SetupPaymentComponent', () => {
  let component: SetupPaymentComponent;
  let fixture: ComponentFixture<SetupPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
