import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSeoLinksComponent } from './footer-seo-links.component';

describe('FooterSeoLinksComponent', () => {
  let component: FooterSeoLinksComponent;
  let fixture: ComponentFixture<FooterSeoLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterSeoLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterSeoLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
