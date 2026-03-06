import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogNavigationEventsComponent } from './catalog-navigation-events.component';

describe('CatalogNavigationEventsComponent', () => {
  let component: CatalogNavigationEventsComponent;
  let fixture: ComponentFixture<CatalogNavigationEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogNavigationEventsComponent]
    });
    fixture = TestBed.createComponent(CatalogNavigationEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
