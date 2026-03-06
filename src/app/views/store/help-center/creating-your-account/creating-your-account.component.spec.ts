import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingYourAccountComponent } from './creating-your-account.component';

describe('CreatingYourAccountComponent', () => {
  let component: CreatingYourAccountComponent;
  let fixture: ComponentFixture<CreatingYourAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatingYourAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingYourAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
