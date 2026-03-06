import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebStoriesComponent } from './web-stories.component';

describe('WebStoriesComponent', () => {
  let component: WebStoriesComponent;
  let fixture: ComponentFixture<WebStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebStoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
