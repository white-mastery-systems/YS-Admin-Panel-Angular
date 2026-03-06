import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonProductsComponent } from './addon-products.component';

describe('AddonProductsComponent', () => {
  let component: AddonProductsComponent;
  let fixture: ComponentFixture<AddonProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddonProductsComponent]
    });
    fixture = TestBed.createComponent(AddonProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
