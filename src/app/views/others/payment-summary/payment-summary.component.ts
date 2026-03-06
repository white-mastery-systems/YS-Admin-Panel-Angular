import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})

export class PaymentSummaryComponent implements OnInit {

  pageLoader: boolean;
  params: any = {};
  redirection: any = "/session/signin";

  constructor(private storeApi: StoreApiService, private router: Router, private activeRoute: ActivatedRoute, private commonService: CommonService, private sbService: SidebarService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.params.store_id) this.redirection = "/vendor/signin/"+this.params.store_id;
      // this.pageLoader = true;
      // this.storeApi.ADV_STORE_DETAILS().subscribe(result => {
      //   setTimeout(() => { this.pageLoader = false; }, 500);
      //   if(result.status) this.sbService.resetStoreDetails(result);
      //   else console.log("response", result);
      // });
    });
  }

  ngOnDestroy() {
    this.commonService.clearData();
  }

}