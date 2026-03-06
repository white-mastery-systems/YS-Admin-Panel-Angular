import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBranchesComponent } from './store-branches.component';

describe('StoreBranchesComponent', () => {
  let component: StoreBranchesComponent;
  let fixture: ComponentFixture<StoreBranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreBranchesComponent]
    });
    fixture = TestBed.createComponent(StoreBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
