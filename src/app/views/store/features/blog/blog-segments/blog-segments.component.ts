import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../../features-api.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
    selector: 'app-blog-segments',
    templateUrl: './blog-segments.component.html',
    styleUrls: ['./blog-segments.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class BlogSegmentsComponent implements OnInit {

  page = 1; pageSize = 10; popupLoader: boolean;
  pageLoader: boolean; search_bar: string;
  maxRank: any = 0;
  segForm: any = {}; deleteForm: any = {};
  layoutTypes: any = [
    // { name: "Main Slider", value: "slider" },
    // { name: "Section Grid", value: "grid" },
    // { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Highlighted Product", value: "highlighted_product" },
    // { name: "Highlighted Section", value: "highlighted_section" },
    // { name: "Multi-Highlighted Section", value: "multiple_highlighted_section" },
    // { name: "Secondary Banner", value: "secondary" },
    { name: "Flexible Segment", value: "flexible" },
    // { name: "Video Section", value: "video_section" }
  ];
  blogDetails: any = { segments: [] };
  productList: any = []; searchLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private activeRoute: ActivatedRoute, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.commonService.redirect = "/setting/advanced-blogs";
      this.api.BLOG_DETAILS(params.id).subscribe(result => {
        if(result.status) {
          this.blogDetails = result.data;
          this.maxRank = this.blogDetails.segments.length;
          this.commonService.secondary_header = this.blogDetails.name;
          setTimeout(() => { this.pageLoader = false; }, 500);
        }
        else console.log("response", result);
      });
    });
  }

  searchProduct(catId, searchTerm) {
		this.productList = []; this.searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.storeApi.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.productList = result.list;
				else console.log("response", result);
				this.searchLoader = false;
			});
		}
	}

  onAddNewSegment(modalName) {
    this.productList = [];
    this.popupLoader = false;
    this.segForm = { layout_list: [{}], form_type: 'add', rank: this.maxRank+1 };
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  onSubmit() {
    this.segForm.submit = true;
    this.segForm.blog_id = this.blogDetails._id;
    if(this.segForm.form_type=='add') {
      this.api.ADD_BLOG_SEGMENT(this.segForm).subscribe(result => {
        this.segForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.segForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_BLOG_SEGMENT(this.segForm).subscribe(result => {
        this.segForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.segForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEditDetails(x, modalName) {
    this.productList = [];
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.BLOG_SEGMENT_DETAILS(this.blogDetails._id, x._id).subscribe(result => {
      if(result.status) {
        this.popupLoader = false;
        this.segForm = result.data;
        this.segForm.form_type = 'edit';
        this.segForm.prev_rank = this.segForm.rank;
        this.segForm.dup_type = this.findType(this.segForm.type);
        if(this.segForm.type!='grid')
          delete this.segForm.grid_type;
        if(this.segForm.grid_type)
          this.segForm.dup_grid_type = this.findGridType(this.segForm.grid_type);
        if(this.segForm.featured_category_id && this.segForm.featured_product_id) {
          this.storeApi.PRODUCT_DETAILS(this.segForm.featured_product_id).subscribe(result => {
            if(result.status) this.productList = [result.data];
            else console.log("response", result);
          });
        }
      }
      else console.log("response", result);
    });
  }

  // DELETE
  onDelete() {
    this.deleteForm.btnLoader = true;
    this.deleteForm.blog_id = this.blogDetails._id;
    this.api.DELETE_BLOG_SEGMENT(this.deleteForm).subscribe(result => {
      this.deleteForm.btnLoader = false;
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

  findType(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value==type);
    if(index!=-1) return this.layoutTypes[index].name;
    else return "";
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(obj => obj.type==type);
    if(index!=-1) return this.commonService.grid_list[index].name;
    else return "";
  }

  onChangeType(x) {
    this.segForm.grid_list = [];
    delete this.segForm.grid_type;
    if(x=='grid') {
      this.segForm.grid_list = this.commonService.grid_list;
      this.segForm.grid_type = this.segForm.grid_list[0].type;
    }
  }

}