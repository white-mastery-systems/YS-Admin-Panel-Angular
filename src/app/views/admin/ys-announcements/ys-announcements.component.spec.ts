import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsAnnouncementsComponent } from './ys-announcements.component';

describe('YsAnnouncementsComponent', () => {
  let component: YsAnnouncementsComponent;
  let fixture: ComponentFixture<YsAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsAnnouncementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YsAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
