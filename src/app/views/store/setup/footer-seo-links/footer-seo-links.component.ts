import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-footer-seo-links',
    templateUrl: './footer-seo-links.component.html',
    styleUrls: ['./footer-seo-links.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class FooterSeoLinksComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
  pageLoader: boolean; search_bar: string;
  deleteForm: any; statForm: any;
  
  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  
  ngOnInit() {
    this.commonService.redirect = "/setup";
    this.commonService.secondary_header = "Footer SEO Links";
    if(this.commonService.page_attr?.type=='fsl') {
      let pageInfo = this.commonService.page_attr;
      this.page = pageInfo.page;
      delete this.commonService.page_attr;
    }
    this.pageLoader = true;
    this.api.FSEO_LINK_LIST().subscribe(result => {
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
    this.api.DELETE_FSEO_LINK(this.deleteForm).subscribe(result => {
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

  goModifyPage(x) {
    this.commonService.page_attr = { type: 'fsl', page: this.page, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/setup/footer-seo-links/modify/"+x._id+"/"+this.maxRank]);
  }

  // STATUS
  onChangeStatus(x, modalName) {
    this.statForm = Object.assign({}, x);
    this.statForm.prev_status = x.status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    if(this.statForm.status) this.statForm.status = false;
    else this.statForm.status = true;
    this.statForm.submit = true;
    this.api.UPDATE_FSEO_LINK({ _id: this.statForm._id, status: this.statForm.status }).subscribe(result => {
      this.statForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.statForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}