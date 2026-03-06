import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBillingComponent } from './vendor-billing.component';

describe('VendorBillingComponent', () => {
  let component: VendorBillingComponent;
  let fixture: ComponentFixture<VendorBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
