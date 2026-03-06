import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogSectionEventComponent } from './catalog-section-event.component';

describe('CatalogSectionEventComponent', () => {
  let component: CatalogSectionEventComponent;
  let fixture: ComponentFixture<CatalogSectionEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogSectionEventComponent]
    });
    fixture = TestBed.createComponent(CatalogSectionEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
