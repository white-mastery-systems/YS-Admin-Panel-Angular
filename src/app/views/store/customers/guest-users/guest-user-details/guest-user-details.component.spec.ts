import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestUserDetailsComponent } from './guest-user-details.component';

describe('GuestUserDetailsComponent', () => {
  let component: GuestUserDetailsComponent;
  let fixture: ComponentFixture<GuestUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
