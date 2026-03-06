import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-import-history',
  templateUrl: './import-history.component.html',
  styleUrls: ['./import-history.component.scss'],
  animations: [SharedAnimations]
})

export class ImportHistoryComponent implements OnInit {

  pageLoader: boolean;
  page=1; pageSize = 10; 
  search_bar: string; list: any = [];
  deleteForm: any = {}; vendorId: string = 'all';

  constructor(public modalService: NgbModal, private storeApi: StoreApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.commonService.redirect = "/product-sections/products/import";
    this.commonService.secondary_header = "Import History";
    this.storeApi.IMPORT_HISTORIES(this.vendorId).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.storeApi.UNDO_IMPORT({ _id: this.deleteForm._id }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
				this.ngOnInit();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}