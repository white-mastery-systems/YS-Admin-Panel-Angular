import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-product-catalog',
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.scss'],
    standalone: false
})
export class ProductCatalogComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }

}
