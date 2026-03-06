import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogEventComponent } from './catalog-event.component';

describe('CatalogEventComponent', () => {
  let component: CatalogEventComponent;
  let fixture: ComponentFixture<CatalogEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
