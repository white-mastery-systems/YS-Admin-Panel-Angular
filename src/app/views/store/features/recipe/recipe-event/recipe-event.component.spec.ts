import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEventComponent } from './recipe-event.component';

describe('RecipeEventComponent', () => {
  let component: RecipeEventComponent;
  let fixture: ComponentFixture<RecipeEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
