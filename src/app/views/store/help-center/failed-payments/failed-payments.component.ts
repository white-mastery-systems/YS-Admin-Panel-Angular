import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-failed-payments',
    templateUrl: './failed-payments.component.html',
    styleUrls: ['./failed-payments.component.scss'],
    standalone: false
})
export class FailedPaymentsComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
