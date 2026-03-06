import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEventComponent } from './blog-event.component';

describe('BlogEventComponent', () => {
  let component: BlogEventComponent;
  let fixture: ComponentFixture<BlogEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
