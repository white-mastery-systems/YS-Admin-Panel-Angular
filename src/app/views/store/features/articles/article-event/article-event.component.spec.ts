import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEventComponent } from './article-event.component';

describe('ArticleEventComponent', () => {
  let component: ArticleEventComponent;
  let fixture: ComponentFixture<ArticleEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleEventComponent]
    });
    fixture = TestBed.createComponent(ArticleEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
