import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCatalogsComponent } from './import-catalogs.component';

describe('ImportCatalogsComponent', () => {
  let component: ImportCatalogsComponent;
  let fixture: ComponentFixture<ImportCatalogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportCatalogsComponent]
    });
    fixture = TestBed.createComponent(ImportCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
