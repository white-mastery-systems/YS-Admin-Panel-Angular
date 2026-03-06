import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdMgmtEventsComponent } from './ad-mgmt-events.component';

describe('AdMgmtEventsComponent', () => {
  let component: AdMgmtEventsComponent;
  let fixture: ComponentFixture<AdMgmtEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdMgmtEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdMgmtEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
