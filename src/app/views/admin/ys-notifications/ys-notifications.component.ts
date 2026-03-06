import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ys-notifications',
  templateUrl: './ys-notifications.component.html',
  styleUrls: ['./ys-notifications.component.scss'],
  animations: [SharedAnimations]
})

export class YsNotificationsComponent implements OnInit {
  
  pageLoader: boolean; search_bar: string;
  pageSize = 10; page = 1; list: any = [];
  deleteForm: any = {}; scrollPos: number = 0;

  constructor(public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      delete this.commonService.page_attr;
    };
    this.pageLoader = true;
    this.adminApi.NOTIFY_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
    });
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.adminApi.DELETE_NOTIFY(this.deleteForm).subscribe(result => {
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

  captureData() {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
  }

}