import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../../services/common.service';
import { DeploymentService } from '../../../deployment/deployment.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-billing-stmt',
    templateUrl: './billing-stmt.component.html',
    styleUrls: ['./billing-stmt.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class BillingStmtComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; filterForm:any = {};
  packageDetails: any = {}; selectedBill: any = {};
  imgBaseUrl = environment.img_baseurl; tempFilter: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private api: DeploymentService) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }       
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  ngOnInit(): void {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }
  
  download_pdf(x)
  {
    window.open(this.imgBaseUrl+'uploads/'+this.commonService.store_details._id+'/invoices/'+x._id+'.pdf')
  }

  getList() {
    this.commonService.redirect = "/account/billing";
    this.commonService.secondary_header = "Billing Statement";
    this.pageLoader = true;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
    }
    this.api.BILLING_STMT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.packageDetails = result.packages;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

}