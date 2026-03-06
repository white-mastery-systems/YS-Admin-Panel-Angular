import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCatalogsComponent } from './blog-catalogs.component';

describe('BlogCatalogsComponent', () => {
  let component: BlogCatalogsComponent;
  let fixture: ComponentFixture<BlogCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogCatalogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
