import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsNotificationEventsComponent } from './ys-notification-events.component';

describe('YsNotificationEventsComponent', () => {
  let component: YsNotificationEventsComponent;
  let fixture: ComponentFixture<YsNotificationEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsNotificationEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YsNotificationEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
