import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-setup-tax',
  templateUrl: './setup-tax.component.html',
  styleUrls: ['./setup-tax.component.scss']
})
export class SetupTaxComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
