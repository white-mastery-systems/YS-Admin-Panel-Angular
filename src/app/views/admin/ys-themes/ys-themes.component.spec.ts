import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsThemesComponent } from './ys-themes.component';

describe('YsThemesComponent', () => {
  let component: YsThemesComponent;
  let fixture: ComponentFixture<YsThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsThemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YsThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
