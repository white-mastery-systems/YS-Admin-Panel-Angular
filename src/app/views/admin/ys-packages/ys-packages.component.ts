import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-packages',
  templateUrl: './ys-packages.component.html',
  styleUrls: ['./ys-packages.component.scss'],
  animations: [SharedAnimations]
})

export class YsPackagesComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = [];
  deleteForm: any; search_bar: string;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.adminApi.PACKAGE_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.admin_packages = this.list;
        this.commonService.updateLocalData('admin_packages', this.commonService.admin_packages);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // DELETE
  onDelete() {
    this.adminApi.DELETE_PACKAGE(this.deleteForm).subscribe(result => {
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