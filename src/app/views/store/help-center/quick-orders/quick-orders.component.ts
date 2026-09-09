import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-quick-orders',
    templateUrl: './quick-orders.component.html',
    styleUrls: ['./quick-orders.component.scss'],
    standalone: false
})
export class QuickOrdersComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
