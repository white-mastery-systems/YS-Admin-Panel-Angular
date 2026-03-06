import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCatalogsComponent } from './article-catalogs.component';

describe('ArticleCatalogsComponent', () => {
  let component: ArticleCatalogsComponent;
  let fixture: ComponentFixture<ArticleCatalogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCatalogsComponent]
    });
    fixture = TestBed.createComponent(ArticleCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
