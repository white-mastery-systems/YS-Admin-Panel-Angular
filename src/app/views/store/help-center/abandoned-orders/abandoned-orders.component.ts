import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-abandoned-orders',
    templateUrl: './abandoned-orders.component.html',
    styleUrls: ['./abandoned-orders.component.scss'],
    standalone: false
})
export class AbandonedOrdersComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
