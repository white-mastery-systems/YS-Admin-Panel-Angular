import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogNavigationsComponent } from './catalog-navigations.component';

describe('CatalogNavigationsComponent', () => {
  let component: CatalogNavigationsComponent;
  let fixture: ComponentFixture<CatalogNavigationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogNavigationsComponent]
    });
    fixture = TestBed.createComponent(CatalogNavigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
