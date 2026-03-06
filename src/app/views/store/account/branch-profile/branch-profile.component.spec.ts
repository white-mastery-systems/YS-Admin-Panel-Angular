import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchProfileComponent } from './branch-profile.component';

describe('BranchProfileComponent', () => {
  let component: BranchProfileComponent;
  let fixture: ComponentFixture<BranchProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchProfileComponent]
    });
    fixture = TestBed.createComponent(BranchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
