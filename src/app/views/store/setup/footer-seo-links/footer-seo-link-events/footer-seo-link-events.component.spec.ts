import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSeoLinkEventsComponent } from './footer-seo-link-events.component';

describe('FooterSeoLinkEventsComponent', () => {
  let component: FooterSeoLinkEventsComponent;
  let fixture: ComponentFixture<FooterSeoLinkEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterSeoLinkEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterSeoLinkEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
