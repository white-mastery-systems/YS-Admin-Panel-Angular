import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  animations: [SharedAnimations]
})

export class NewsletterComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean; list: any = []; exportLoader: boolean;
  tempFilter: any = {};
  filterForm: any = { from: new Date(new Date().setMonth(new Date().getMonth() - 1)), to: new Date() };

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, 
    public commonService: CommonService, private excelService: ExcelService
  ) { config.backdrop = 'static'; config.keyboard = false; }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Newsletter Subscribers";
    }
    if(this.filterForm.from && this.filterForm.to) {
      this.pageLoader = true;
      document.getElementById('closeModal')?.click();
      let sendData = {
        from: new Date(new Date(this.filterForm.from).setHours(0,0,0,0)),
        to: new Date(new Date(this.filterForm.to).setHours(23,59,59,999))
      };
      this.api.SUBSCRIBER_LIST(sendData).subscribe(result => {
        if(result.status) this.list = result.list;
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    }
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = Object.assign({}, this.filterForm);
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "Newsletter";
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }
  createList(list) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let x of list) {
        updatedList.push({ Email: x.email, created_on : x.created_on });
      }
      resolve(updatedList);
    });
  }

}