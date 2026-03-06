import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedOrdersComponent } from './abandoned-orders.component';

describe('AbandonedOrdersComponent', () => {
  let component: AbandonedOrdersComponent;
  let fixture: ComponentFixture<AbandonedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
