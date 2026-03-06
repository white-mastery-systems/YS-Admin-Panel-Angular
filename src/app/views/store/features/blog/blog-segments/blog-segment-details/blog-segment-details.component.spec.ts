import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSegmentDetailsComponent } from './blog-segment-details.component';

describe('BlogSegmentDetailsComponent', () => {
  let component: BlogSegmentDetailsComponent;
  let fixture: ComponentFixture<BlogSegmentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogSegmentDetailsComponent]
    });
    fixture = TestBed.createComponent(BlogSegmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
