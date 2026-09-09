import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class FeedbackComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean;
  list: any = []; details: any = {}; tempFilter: any = {};
  filterForm: any = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService) {
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

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Feedback";
    }
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
      if(this.filterForm.from_date && this.filterForm.to_date) {
        this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
        this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      }
      this.api.FEEDBACK(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.name = obj.customer_details[0].name;
            obj.email = obj.customer_details[0].email;
            obj.rating = Math.round((obj.quality+obj.pricing+obj.shipping)/3);
          });
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    }
  }

}