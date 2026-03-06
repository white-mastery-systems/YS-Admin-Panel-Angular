import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryEventComponent } from './gallery-event.component';

describe('GalleryEventComponent', () => {
  let component: GalleryEventComponent;
  let fixture: ComponentFixture<GalleryEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
