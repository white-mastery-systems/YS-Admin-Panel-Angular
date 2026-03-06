import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBrandsComponent } from './menu-brands.component';

describe('MenuBrandsComponent', () => {
  let component: MenuBrandsComponent;
  let fixture: ComponentFixture<MenuBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuBrandsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
