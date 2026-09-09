import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-modify-addons',
    templateUrl: './modify-addons.component.html',
    styleUrls: ['./modify-addons.component.scss'],
    standalone: false
})

export class ModifyAddonsComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean;
  addonForm: any; maxRank: any = 0; measurementList: any = [];
  imgBaseUrl = environment.img_baseurl;
  vendor_id: string = "";
  configData: any= environment.config_data;

  constructor(private api: ProductExtrasApiService, public commonService: CommonService, public router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
        this.commonService.redirect = "/product-extras/addons";
        this.commonService.secondary_header = "";
      this.btnLoader = false; this.pageLoader = true; this.maxRank = params.rank;
      if(params.vendor_id) this.vendor_id = params.vendor_id;
      // edit
      if(this.router.url.includes("modify")) {
         this.commonService.secondary_header = "Update Add-On";
        let tempMmList = [];
        this.api.MEASUREMENT_LIST(this.vendor_id).subscribe(result => {
          if(result.status) tempMmList = result.list;
          else console.log("mm response", result);
          // addon details
          this.api.ADDON_DETAILS(params.addon_id, this.vendor_id).subscribe(result => {
            if(result.status) {
              this.addonForm = result.data;
              this.addonForm.prev_rank = this.addonForm.rank;
              this.mmListModify(tempMmList, this.addonForm.mm_list).then((list) => {
                this.measurementList = list;
              });
              if(this.addonForm.notes_list && this.addonForm.notes_list.length) this.addonForm.notes_status = true;
            }
            else console.log("addon response", result);
            setTimeout(() => { this.pageLoader = false; }, 500);
          });
        });
      }
      else {
        this.commonService.secondary_header = "Add Add-On";
        this.addonForm = { rank: this.maxRank, custom_list: [], min_stock: 0 };
        this.api.MEASUREMENT_LIST(this.vendor_id).subscribe(result => {
          if(result.status) this.measurementList = result.list;
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }

  onSubmit() {
    this.btnLoader = true;
    // measurement set
    this.addonForm.mm_list = [];
    if(this.addonForm.mm_status) {
      this.measurementList.forEach(object => {
        if(object.mm_checked) this.addonForm.mm_list.push({ mmset_id: object._id });
      });
    }
    if(!this.addonForm.notes_status) {
      delete this.addonForm.notes_title;
      this.addonForm.notes_list = [];
    }
    if(this.vendor_id) this.addonForm.vendor_id = this.vendor_id;
    if(this.router.url.includes("modify")) {
      this.api.UPDATE_ADDON(this.addonForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          this.router.navigate(['/product-extras/addons']);
        }
        else {
          this.addonForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_ADDON(this.addonForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          this.router.navigate(['/product-extras/addons']);
        }
        else {
          this.addonForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  mmListModify(defaultList, mmList) {
    return new Promise((resolve, reject) => {
      let checkedCount = 0;
      defaultList.forEach(object => {
        let index = mmList.findIndex(x => x.mmset_id == object._id);
        if(index != -1) {
          checkedCount++;
          object.mm_checked = true;
          this.addonForm.mm_status = true;
        }
      });
      if(defaultList.length==checkedCount) this.addonForm.select_all = true;
      resolve(defaultList);
    });
  }

  mainFileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.addonForm.image = (<FileReader>event.target).result;
        this.addonForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");    
    }
  }
  fileChangeListener(parentIndex, index, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.addonForm.custom_list[parentIndex].option_list[index].image = (<FileReader>event.target).result;
        this.addonForm.custom_list[parentIndex].option_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  selectAllmmSets(value) {
    this.measurementList.forEach(object => {
      object.mm_checked = value;
    });
  }

  ngOnDestroy() {
    if(this.vendor_id) sessionStorage.setItem("vid", this.vendor_id);
  }

}