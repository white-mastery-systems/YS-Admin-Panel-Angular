import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCardListComponent } from './grid-card-list.component';

describe('GridCardListComponent', () => {
  let component: GridCardListComponent;
  let fixture: ComponentFixture<GridCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
