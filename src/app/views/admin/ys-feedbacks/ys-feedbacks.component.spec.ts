import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsFeedbacksComponent } from './ys-feedbacks.component';

describe('YsFeedbacksComponent', () => {
  let component: YsFeedbacksComponent;
  let fixture: ComponentFixture<YsFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsFeedbacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YsFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
