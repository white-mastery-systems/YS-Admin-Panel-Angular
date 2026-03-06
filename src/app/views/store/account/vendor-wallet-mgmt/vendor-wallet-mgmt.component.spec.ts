import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWalletMgmtComponent } from './vendor-wallet-mgmt.component';

describe('VendorWalletMgmtComponent', () => {
  let component: VendorWalletMgmtComponent;
  let fixture: ComponentFixture<VendorWalletMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorWalletMgmtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorWalletMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
