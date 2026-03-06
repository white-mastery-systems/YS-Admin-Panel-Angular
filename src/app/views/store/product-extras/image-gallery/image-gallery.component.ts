import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../services/common.service';
import { ProductExtrasApiService } from '../product-extras-api.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  animations: [SharedAnimations]
})

export class ImageGalleryComponent implements OnInit {

  pageLoader: boolean;
  page=1; pageSize = 10; 
  search_bar: string; list: any = [];
	galForm: any; deleteForm: any;
  vendorId: string = 'all';
  scrollPos: number = 0;

  constructor(public modalService: NgbModal, public commonService: CommonService, private api: ProductExtrasApiService, private router: Router) { }

  ngOnInit(): void {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Image Uploader";
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
    }
    this.pageLoader = true;
    this.api.GALLERY_LIST(this.vendorId).subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      if(result.status) this.list = result.list;
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
    this.router.navigate(['/product-extras/image-gallery/'+x._id]);
  }

}