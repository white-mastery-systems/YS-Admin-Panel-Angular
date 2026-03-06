import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebStoriesEventComponent } from './web-stories-event.component';

describe('WebStoriesEventComponent', () => {
  let component: WebStoriesEventComponent;
  let fixture: ComponentFixture<WebStoriesEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebStoriesEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebStoriesEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
