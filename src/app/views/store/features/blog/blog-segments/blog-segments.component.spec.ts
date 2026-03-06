import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSegmentsComponent } from './blog-segments.component';

describe('BlogSegmentsComponent', () => {
  let component: BlogSegmentsComponent;
  let fixture: ComponentFixture<BlogSegmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogSegmentsComponent]
    });
    fixture = TestBed.createComponent(BlogSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
