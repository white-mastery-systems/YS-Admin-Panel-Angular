import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementEventsComponent } from './measurement-events.component';

describe('MeasurementEventsComponent', () => {
  let component: MeasurementEventsComponent;
  let fixture: ComponentFixture<MeasurementEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
