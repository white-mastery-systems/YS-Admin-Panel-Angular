import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-setup-payment',
  templateUrl: './setup-payment.component.html',
  styleUrls: ['./setup-payment.component.scss']
})
export class SetupPaymentComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
