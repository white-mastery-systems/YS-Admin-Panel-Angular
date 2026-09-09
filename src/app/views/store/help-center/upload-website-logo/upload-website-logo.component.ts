import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-upload-website-logo',
    templateUrl: './upload-website-logo.component.html',
    styleUrls: ['./upload-website-logo.component.scss'],
    standalone: false
})
export class UploadWebsiteLogoComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
