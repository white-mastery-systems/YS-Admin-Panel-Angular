import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupUsersComponent } from './signup-users.component';

describe('SignupUsersComponent', () => {
  let component: SignupUsersComponent;
  let fixture: ComponentFixture<SignupUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
