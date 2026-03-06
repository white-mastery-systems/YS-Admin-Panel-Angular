import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { CommonService } from 'src/app/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-ys-themes',
  templateUrl: './ys-themes.component.html',
  styleUrls: ['./ys-themes.component.scss'],
  animations: [SharedAnimations]
})

export class YsThemesComponent implements OnInit {

  constructor(
    private api: AdminApiService, public commonService: CommonService, private router: Router, public modalService: NgbModal
  ) { }

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  deleteForm: any; search_bar: string;
  pageLoader: boolean; scrollPos: number = 0;
  btnForm: any = {}; tempFilter: any = {};

  ngOnInit(): void {
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      delete this.commonService.page_attr;
    };
    this.pageLoader = true;
    this.api.THEMES_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
    });
  }

  goModifyPage(x) {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(['/admin/themes/modify/'+x._id+'/'+this.maxRank]);
  }

  // DELETE
  onDelete() {
    this.api.THEMES_REMOVE(this.deleteForm).subscribe(result => {
      if(result.status) this.ngOnInit();
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

}