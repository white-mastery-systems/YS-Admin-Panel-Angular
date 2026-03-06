import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMgmtComponent } from './wallet-mgmt.component';

describe('WalletMgmtComponent', () => {
  let component: WalletMgmtComponent;
  let fixture: ComponentFixture<WalletMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
