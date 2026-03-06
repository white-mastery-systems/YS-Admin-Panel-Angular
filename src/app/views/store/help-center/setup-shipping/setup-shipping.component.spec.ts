import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupShippingComponent } from './setup-shipping.component';

describe('SetupShippingComponent', () => {
  let component: SetupShippingComponent;
  let fixture: ComponentFixture<SetupShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupShippingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
