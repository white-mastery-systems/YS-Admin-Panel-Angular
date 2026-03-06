import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-design-homepage',
  templateUrl: './design-homepage.component.html',
  styleUrls: ['./design-homepage.component.scss']
})
export class DesignHomepageComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
