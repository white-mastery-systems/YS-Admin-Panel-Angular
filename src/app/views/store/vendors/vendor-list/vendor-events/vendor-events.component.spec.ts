import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEventsComponent } from './vendor-events.component';

describe('VendorEventsComponent', () => {
  let component: VendorEventsComponent;
  let fixture: ComponentFixture<VendorEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
