import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../../services/customer-api.service';
import { CommonService } from '../../../../../services/common.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reward-history',
  templateUrl: './reward-history.component.html',
  styleUrls: ['./reward-history.component.scss'],
  animations: [SharedAnimations]
})

export class RewardHistoryComponent implements OnInit {

  page = 1; pageSize = 10;
  search_bar: string; customerData: any = {};
  pageLoader: boolean; list: any = [];
  pointForm: any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private customerApi: CustomerApiService, public commonService: CommonService
  ) { config.backdrop = 'static'; config.keyboard = false; }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.commonService.redirect = "/setting/customers/signup-user";
      this.commonService.secondary_header = "Rewards Statement ";
      this.customerApi.REWARDS_STMT(params.id).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.customerData = result.data;
          this.commonService.secondary_header += "("+this.customerData.email+")";
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onSubmit() {
    delete this.pointForm.error_msg;
    this.pointForm.customer_id = this.customerData._id;
    this.pointForm.submit = true;
    this.customerApi.ADD_POINTS(this.pointForm).subscribe((result) => {
      this.pointForm.submit = false;
      if(result.status) {
        document.getElementById("closeModal").click();
        this.list = result.list;
        this.customerData = result.data;
      }
      else {
        this.pointForm.error_msg = result.message;
        console.log("eresponse", result);
      }      
    });
  }

}