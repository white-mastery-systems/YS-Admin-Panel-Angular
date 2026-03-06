import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss'],
  animations: [SharedAnimations]
})

export class ProductReviewsComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10; list: any = [];
  filterForm: any = {};
  imgBaseUrl = environment.img_baseurl;
  configData: any = environment.config_data;
  tempFilter: any = {}; selectedItem: any;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService, public commonService: CommonService, private router: Router) { }
  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }       
    this.selectedItem = "bystatus";
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit(): void {
    if(localStorage.getItem("review_filter")) {
      this.filterForm = JSON.parse(localStorage.getItem("review_filter"));
      this.filterForm.from_date = new Date(this.filterForm.from_date);
      this.filterForm.to_date = new Date(this.filterForm.to_date);
      localStorage.removeItem("review_filter");
    }
    else this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: 'all', search_bar: "" };
    this.getReviewProducts();
  }

  getReviewProducts() {
    if(this.commonService.store_details?.package_details?.package_id==this.configData.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else {
      if(this.filterForm.from_date && this.filterForm.to_date) {
        this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
        this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      }
      if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
      this.pageLoader = true;
      this.api.REVIEWED_PRODUCT_LIST(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.product_sku = obj.productDetails[0].sku;
            obj.product_name = obj.productDetails[0].name;
          });
        }
        else console.log("response", result);
      });
    }
  }

  onSelect(x) {
    localStorage.setItem("review_filter", JSON.stringify(this.filterForm));
    this.router.navigate(["/product-sections/reviews/"+x._id]);
  }

}