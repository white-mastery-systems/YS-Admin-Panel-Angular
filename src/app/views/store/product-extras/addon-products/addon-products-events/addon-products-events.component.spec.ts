import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonProductsEventsComponent } from './addon-products-events.component';

describe('AddonProductsEventsComponent', () => {
  let component: AddonProductsEventsComponent;
  let fixture: ComponentFixture<AddonProductsEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddonProductsEventsComponent]
    });
    fixture = TestBed.createComponent(AddonProductsEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
