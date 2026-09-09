import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-create-new-page',
    templateUrl: './create-new-page.component.html',
    styleUrls: ['./create-new-page.component.scss'],
    standalone: false
})
export class CreateNewPageComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
