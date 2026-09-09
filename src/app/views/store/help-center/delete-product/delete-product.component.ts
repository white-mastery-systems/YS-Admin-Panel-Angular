import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
@Component({
    selector: 'app-delete-product',
    templateUrl: './delete-product.component.html',
    styleUrls: ['./delete-product.component.scss'],
    standalone: false
})
export class DeleteProductComponent implements OnInit {


  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/account";
      this.commonService.secondary_header = "Support";
    }
  }
}
