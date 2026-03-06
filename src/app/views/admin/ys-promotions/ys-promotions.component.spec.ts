import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsPromotionsComponent } from './ys-promotions.component';

describe('YsPromotionsComponent', () => {
  let component: YsPromotionsComponent;
  let fixture: ComponentFixture<YsPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsPromotionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
