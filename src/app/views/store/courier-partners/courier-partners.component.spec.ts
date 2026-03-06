import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierPartnersComponent } from './courier-partners.component';

describe('CourierPartnersComponent', () => {
  let component: CourierPartnersComponent;
  let fixture: ComponentFixture<CourierPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
