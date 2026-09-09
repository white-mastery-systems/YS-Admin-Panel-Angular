import { Component, OnInit } from '@angular/core';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-ad-orders',
    templateUrl: './ad-orders.component.html',
    styleUrls: ['./ad-orders.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class AdOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; currDate = new Date();
  list: any = []; filterForm: any = {};
  adOrderDetails: any = {}; deleteForm: any = {};
  imgBaseUrl = environment.img_baseurl;
  tempFilter: any = {}; selectedItem: any; addForm: any;
  status_list: any = [
    { name: 'All Orders', value: 'all' },
    { name: 'Scheduled Orders', value: 'scheduled' },
    { name: 'Uploaded Orders', value: 'uploaded' },
    { name: 'Completed Orders', value: 'completed' },
    { name: 'Cancelled Orders', value: 'cancelled' }
  ];
  layoutTypes: any = [
    { name: "Primary Slider", value: "primary_slider" },
    { name: "Main Slider", value: "slider" },
    { name: "Section Grid", value: "section" },
    { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Highlighted Section", value: "highlighted_section" },
    { name: "Multi-Highlighted Section", value: "multiple_highlighted_section" },
    { name: "Multi-tab Featured Products", value: "multiple_featured_product" },
    { name: "Secondary Banner", value: "secondary" },
    { name: "Flexible Segment", value: "flexible" }
  ];

  constructor(public api: StoreApiService, public commonService: CommonService, public modalService: NgbModal) {
    if (this.commonService.ys_features.indexOf('testimonials') !== -1)
      this.layoutTypes.push({ name: "Testimonial", value: "testimonial" });
    if (this.commonService.ys_features.indexOf('shopping_assistant') !== -1)
      this.layoutTypes.push({ name: "Shopping Assistant", value: "shopping_assistant" });
    if (this.commonService.ys_features.indexOf('blogs') !== -1)
      this.layoutTypes.push({ name: "Blogs", value: "blogs" });
    if (this.commonService.ys_features.indexOf('shop_the_look') !== -1)
      this.layoutTypes.push({ name: "Shop the Look", value: "shop_the_look" });
    if (this.commonService.store_details?.package_info?.category != 'genie') {
      this.layoutTypes.push({ name: "Video Section", value: "video_section" });
      this.layoutTypes.push({ name: "Highlights", value: "highlights" });
      this.layoutTypes.push({ name: "Instagram", value: "instagram" });
    }
  }
  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for (let key in this.filterForm) {
      if (this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }
    this.selectedItem = "Status";
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }
  ngOnInit(): void {
    this.commonService.redirect = '/features/ad-management';
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: 'all', vendor_id: 'all' };
    this.getAdOrderList();
    this.filterForm.type = "all";
  }
  findType(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value == type);
    if (index != -1) return this.layoutTypes[index].name;
    else return "";
  }
  getAdOrderList() {
    this.list = [];
    if (this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      if (document.getElementById('closeModal')) document.getElementById('closeModal').click();
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0, 0, 0, 0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23, 59, 59, 999));
      this.api.LIST_AD_ORDERS(this.filterForm).subscribe((result) => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if (result.status) {
          this.list = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
          this.list.forEach(el => {
            el.segment_disp_type = this.findType(el.segment_type);
            el.vendor_name = "NA";
            let vIndex = this.commonService.vendor_list.findIndex(obj => obj._id == el.vendor_id);
            if (vIndex != -1) el.vendor_name = this.commonService.vendor_list[vIndex].company_details.brand;
            el.disp_status = el.status;
            el.from = new Date(el.from);
            el.to = new Date(el.to);
            if (this.commonService.store_details.login_type != 'vendor') {
              if (el.disp_status == 'scheduled' && new Date() > el.from) el.disp_status = 'upload delay';
              if (el.disp_status == 'uploaded' && new Date() > el.to) el.disp_status = 'overshoot';
            }
          });
        }
        else console.log("response", result);
      });
    }
  }

  onView(x, modalName) {
    this.adOrderDetails = { exist_status: x.status };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.adOrderDetails[key] = x[key];
    }
    this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  onUpdateStaus() {
    let formData: any = { _id: this.adOrderDetails._id, form_type: 'change_status', status: this.adOrderDetails.status };
    if(formData.status=='cancelled') formData.refund_amt = this.adOrderDetails.refund_amt;
    this.api.UPDATE_AD_ORDERS(formData).subscribe((result) => {
      if(result.status){
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }else{
        console.log("response", result);
        this.adOrderDetails.errorMsg = result.message;
      }
    });
  }

}