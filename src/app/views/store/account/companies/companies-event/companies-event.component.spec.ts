import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesEventComponent } from './companies-event.component';

describe('CompaniesEventComponent', () => {
  let component: CompaniesEventComponent;
  let fixture: ComponentFixture<CompaniesEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
