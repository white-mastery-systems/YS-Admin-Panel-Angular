import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPageImageComponent } from './extra-page-image.component';

describe('ExtraPageImageComponent', () => {
  let component: ExtraPageImageComponent;
  let fixture: ComponentFixture<ExtraPageImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPageImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraPageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
