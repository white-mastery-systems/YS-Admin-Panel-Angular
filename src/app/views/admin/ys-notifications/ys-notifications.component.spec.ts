import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsNotificationsComponent } from './ys-notifications.component';

describe('YsNotificationsComponent', () => {
  let component: YsNotificationsComponent;
  let fixture: ComponentFixture<YsNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsNotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
