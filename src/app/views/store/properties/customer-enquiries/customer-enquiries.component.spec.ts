import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEnquiriesComponent } from './customer-enquiries.component';

describe('CustomerEnquiriesComponent', () => {
  let component: CustomerEnquiriesComponent;
  let fixture: ComponentFixture<CustomerEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerEnquiriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
