import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedComponent } from './abandoned.component';

describe('AbandonedComponent', () => {
  let component: AbandonedComponent;
  let fixture: ComponentFixture<AbandonedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
