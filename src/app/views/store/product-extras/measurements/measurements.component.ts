import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss'],
  animations: [SharedAnimations]
})

export class MeasurementsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
	list: any = []; maxRank: any = 0;
	deleteForm: any; pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  vendor_id: string = "";
  filterForm: any = {}; tempFilter: any = {};

	constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = this.vendor_id;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Measurement Sets";
    this.pageLoader = true; this.list = [];
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
		this.api.MEASUREMENT_LIST(this.vendor_id).subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;     
      }
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }
  
  // DELETE
  onDelete() {
    if(this.vendor_id) this.deleteForm.vendor_id = this.vendor_id;
    this.api.DELETE_MEASUREMENT(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}