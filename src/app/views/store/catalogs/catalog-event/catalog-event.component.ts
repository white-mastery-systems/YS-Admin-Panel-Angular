import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { SetupService } from '../../setup/setup.service';

@Component({
    selector: 'app-catalog-event',
    templateUrl: './catalog-event.component.html',
    styleUrls: ['./catalog-event.component.scss'],
    standalone: false
})

export class CatalogEventComponent implements OnInit {

  pageLoader: boolean;
  catForm: any;
  catalogPageList: any[] = [];
  catalogPageOptions: any[] = [];
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;

  constructor(
    private router: Router, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private api: StoreApiService, private setupApi: SetupService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadCatalogOptions();
    this.loadCatalogPages();
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/product-sections/catalogs";
      this.commonService.secondary_header = "Add Catalog";
      this.catForm = { form_type: 'add', social_media_links: [], seo_details: {}, faqs: [], catalog_page_id: null };
      this.refreshCatalogPageOptions();
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Catalog";
        this.api.CATALOG_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.catForm = result.data;
            this.catForm.form_type = 'edit';
            this.catForm.catalog_page_id = this.catForm.catalog_page_id || null;
            if(!this.catForm.seo_details) this.catForm.seo_details = {};
            if(this.catForm.social_media_links.length) this.catForm.social_media_status = true;
            this.catForm.seo_details.meta_keyword_list = [];
            if(this.catForm.seo_details.meta_keywords?.length) {
              this.catForm.seo_details.meta_keywords.forEach(obj => {
                this.catForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
            if(this.catForm.sub_catalogs?.length) {
              this.commonService.catalog_list.forEach(el => {
                el.selected = false;
                if(el._id!=this.catForm._id && !el.isPrimary && this.catForm.sub_catalogs.indexOf(el._id.toString())!=-1) el.selected = true;
              });
            }
            if(this.catForm.faqs.length) this.catForm.faq_status = true;
            this.refreshCatalogPageOptions();
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }
  
  onSubmit() {
    this.catForm.submit = true;
    this.catForm.seo_status = true;
    this.catForm.catalog_page_id = this.catForm.catalog_page_id || null;
    this.catForm.seo_details.meta_keywords = [];
    if(this.catForm.seo_details?.meta_keyword_list) {
      this.catForm.seo_details.meta_keyword_list.forEach(obj => {
        this.catForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    this.catForm.sub_catalogs = [];
    this.commonService.catalog_list.forEach(obj => {
      if(!obj.isPrimary && obj._id!=this.catForm._id && obj.selected) this.catForm.sub_catalogs.push(obj._id);
    });
    if(!this.catForm.faq_status) {
      this.catForm.faq_title = ''; this.catForm.faqs = [];
    }
    if(!this.catForm.profile_status) {
      this.catForm.profile_details = {};
    }
    if(this.catForm.form_type=='add') {
      this.api.ADD_CATALOG(this.catForm).subscribe(result => {
        this.catForm.submit = false;
        if(result.status) this.router.navigate(['/product-sections/catalogs']);
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_CATALOG(this.catForm).subscribe(result => {
        this.catForm.submit = false;
        if(result.status) this.router.navigate(['/product-sections/catalogs']);
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.catForm.submit = true;
    this.api.DELETE_CATALOG(this.catForm).subscribe(result => {
      this.catForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/product-sections/catalogs']);
      }
      else {
        this.catForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(type=='banner') {
          this.catForm.banner_image = (<FileReader>event.target).result;
          this.catForm.b_img_change = true;
        }
        else if(type=='profile') {
          this.catForm.profile_details.image = (<FileReader>event.target).result;
          this.catForm.p_img_change = true;
        }
        else {
          this.catForm.image = (<FileReader>event.target).result;
          this.catForm.img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  onChangeTitle() {
    if(this.catForm.form_type=='add') {
      this.catForm.seo_details.page_url = this.commonService.urlFormat(this.catForm.name);
      let tempName = this.catForm.name.substring(0, 70);
      this.catForm.seo_details.h1_tag = tempName;
      this.catForm.seo_details.page_title = 'Buy '+tempName;
    }
  }
  onChangeDesc() {
    if(this.catForm.form_type=='add')
      this.catForm.seo_details.meta_desc = this.commonService.stripHtml(this.catForm.description).substring(0, 320);
  }

  loadCatalogOptions() {
    this.api.CATALOG_LIST().subscribe(result => {
      if(result.status) {
        this.commonService.catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
        this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
        this.refreshCatalogPageOptions();
      }
      else console.log("response", result);
    });
  }

  loadCatalogPages() {
    this.setupApi.CATALOG_PAGE_LIST().subscribe(result => {
      if(result.status) {
        this.catalogPageList = result.list || [];
        this.refreshCatalogPageOptions();
      }
      else console.log("response", result);
    });
  }

  refreshCatalogPageOptions() {
    const currentCatalogId = this.toIdString(this.catForm?._id);
    const selectedPageId = this.toIdString(this.catForm?.catalog_page_id);
    const linkedPageIds = new Set(
      (this.commonService.catalog_list || [])
        .filter(obj => obj.catalog_page_id && this.toIdString(obj._id) !== currentCatalogId)
        .map(obj => obj.catalog_page_id.toString())
    );

    this.catalogPageOptions = (this.catalogPageList || [])
      .filter(obj => obj.page_kind === 'property_product')
      .filter(obj => !linkedPageIds.has(this.toIdString(obj._id)) || this.toIdString(obj._id) === selectedPageId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  toIdString(value) {
    return value ? value.toString() : '';
  }

}
