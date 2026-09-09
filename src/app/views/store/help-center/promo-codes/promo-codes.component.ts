import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-promo-codes',
    templateUrl: './promo-codes.component.html',
    styleUrls: ['./promo-codes.component.scss'],
    standalone: false
})
export class PromoCodesComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
