import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSetupComponent } from './notification-setup.component';

describe('NotificationSetupComponent', () => {
  let component: NotificationSetupComponent;
  let fixture: ComponentFixture<NotificationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
