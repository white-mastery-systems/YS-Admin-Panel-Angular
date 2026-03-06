import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTaxComponent } from './setup-tax.component';

describe('SetupTaxComponent', () => {
  let component: SetupTaxComponent;
  let fixture: ComponentFixture<SetupTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
