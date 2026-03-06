import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupUserDetailsComponent } from './signup-user-details.component';

describe('SignupUserDetailsComponent', () => {
  let component: SignupUserDetailsComponent;
  let fixture: ComponentFixture<SignupUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
