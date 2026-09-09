import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../features-api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [SharedAnimations]
})
export class GalleryComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10; 
  search_bar: string; list: any = [];
	galForm: any; deleteForm: any;
  popupLoader: boolean;
  scrollPos: number = 0; listCount: number = 1

  constructor(public modalService: NgbModal, public commonService: CommonService, private router: Router, private api: FeaturesApiService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/features/gallery";
    this.commonService.secondary_header = "Site Gallery";
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
    }
    this.pageLoader = true;
    this.api.GALLERY_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      if(result.status) {
        this.list = result.list;
        this.listCount = this.list.length? this.list.length: 1;
      }
      else console.log("response",result);
		});
  }

  onAdd() {
    this.galForm.submit = true;
    this.api.ADD_GALLERY(this.galForm).subscribe((result) => {
      this.galForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.galForm.errorMsg = result.message;
        console.log("response",result)
      }
    });
  }
  onEdit(x) {
    this.popupLoader = true;
    this.api.GALLERY_DETAILS(x._id).subscribe((result) => {
      if(result.status) {
        this.galForm = result.data;
        this.galForm.form_type = 'update';
        this.galForm.prev_rank = this.galForm.rank;
        if(!this.galForm.seo_details) {
          this.galForm.seo_details = { page_url: '', h1_tag: '', page_title: '', meta_desc: '' };
        }
        this.popupLoader = false;
      }
      else console.log("response",result);
		});
    this.galForm = {...x}
    this.galForm.form_type='update'
    this.galForm.prev_rank = this.galForm.rank
    if(!this.galForm.seo_details) {
      this.galForm.seo_details = { page_url: '', h1_tag: '', page_title: '', meta_desc: '' };
    }
  }

  onUpdate() {
    this.galForm.submit = true;
    let formdata = new FormData()
    formdata.append('data', JSON.stringify(this.galForm))
    this.api.UPDATE_GALLERY(formdata).subscribe((result) => {
      this.galForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.galForm.errorMsg = result.message;
        console.log("response",result)
      }
    });
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.deleteForm.type = 'folder';
    this.api.DELETE_GALLERY(this.deleteForm).subscribe((result) => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  goViewPage(x) {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(['/features/site-gallery/'+x._id]);
  }

}
