import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyYsPackagesComponent } from './modify-ys-packages.component';

describe('ModifyYsPackagesComponent', () => {
  let component: ModifyYsPackagesComponent;
  let fixture: ComponentFixture<ModifyYsPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyYsPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyYsPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
