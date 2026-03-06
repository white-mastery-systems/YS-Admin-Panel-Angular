import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWebsiteLogoComponent } from './upload-website-logo.component';

describe('UploadWebsiteLogoComponent', () => {
  let component: UploadWebsiteLogoComponent;
  let fixture: ComponentFixture<UploadWebsiteLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadWebsiteLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadWebsiteLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
