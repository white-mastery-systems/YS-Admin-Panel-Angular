import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignHomepageComponent } from './design-homepage.component';

describe('DesignHomepageComponent', () => {
  let component: DesignHomepageComponent;
  let fixture: ComponentFixture<DesignHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
