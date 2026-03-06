import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgGalleryEventsComponent } from './img-gallery-events.component';

describe('ImgGalleryEventsComponent', () => {
  let component: ImgGalleryEventsComponent;
  let fixture: ComponentFixture<ImgGalleryEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgGalleryEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgGalleryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
