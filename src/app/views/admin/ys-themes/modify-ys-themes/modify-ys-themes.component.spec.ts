import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyYsThemesComponent } from './modify-ys-themes.component';

describe('ModifyYsThemesComponent', () => {
  let component: ModifyYsThemesComponent;
  let fixture: ComponentFixture<ModifyYsThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyYsThemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyYsThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
