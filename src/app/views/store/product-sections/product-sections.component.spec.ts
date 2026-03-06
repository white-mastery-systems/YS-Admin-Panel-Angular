import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSectionsComponent } from './product-sections.component';

describe('ProductSectionsComponent', () => {
  let component: ProductSectionsComponent;
  let fixture: ComponentFixture<ProductSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
