import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-addon-products-events',
    templateUrl: './addon-products-events.component.html',
    styleUrls: ['./addon-products-events.component.scss'],
    standalone: false
})

export class AddonProductsEventsComponent {
  pageLoader: boolean; btnLoader: boolean;
  addonProductForm: any; maxRank: any = 0; measurementList: any = [];
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  imgIndex: number; fileList: FormData;

  constructor(private api: ProductExtrasApiService, public commonService: CommonService, public router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/product-extras/addon-products";
      this.commonService.secondary_header = "";      
      this.btnLoader = false; this.pageLoader = true; this.maxRank = params.rank;
      // edit
      if(this.router.url.includes("modify")) {
        this.commonService.secondary_header = "Update Addon Product";
        this.api.ADDON_PRODUCTS_DETAILS(params.multi_pro_id).subscribe(result => {
          if(result.status) {
            this.addonProductForm = result.data;
            this.addonProductForm.prev_rank = this.addonProductForm.rank;
          }
          else console.log("addon response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else {
        this.commonService.secondary_header = "Add Addon Product";
        this.addonProductForm = { rank: this.maxRank, image_list: [{}], stock: 0, stock_type: "lim" };
        setTimeout(() => { this.pageLoader = false; }, 500);
      }
    });
  }

  async onSubmit() {
    this.fileList = new FormData();
    this.btnLoader = true;
    delete this.addonProductForm.errorMsg;
    let formData: any = {};
    for(let key in this.addonProductForm) {
      if (this.addonProductForm.hasOwnProperty(key)) formData[key] = this.addonProductForm[key];
    }

    if(formData?.image_list?.length) formData.image_list = await this.onContSetFormData(formData?.image_list)
    this.fileList.append('data', JSON.stringify(formData));
    if(this.router.url.includes("modify")){
      this.api.UPDATE_ADDON_PRODUCTS(this.fileList).subscribe((result)=>{
        this.btnLoader = false;
        if(result.status){
          this.router.navigate(['/product-extras/addon-products']);
          this.addonProductForm={};
        }
        else {
          console.log("response", result);
          this.addonProductForm.errorMsg = result.message
        }
      })
    }
    else {
      this.api.ADD_ADDON_PRODUCTS(this.fileList).subscribe((result)=>{
        this.btnLoader = false;
        if(result.status){
          this.router.navigate(['/product-extras/addon-products']);
          this.addonProductForm={};
        }
        else {
          console.log("response", result);
          this.addonProductForm.errorMsg = result.message
        }
      })
    }
  }

  onContSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = Object.assign({}, imgList[i]);
        if(imgData.img_change) {
          this.fileList.append('attachments', imgData['file'], i+'_img');
          delete imgData.file; delete imgData.image;
        }
        updatedList.push(imgData);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.addonProductForm.image_list[index].image = (<FileReader>event.target).result;
        this.addonProductForm.image_list[index].img_change = true;
        this.addonProductForm.image_list[index].file = inFile;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  discountCalc(x) {
    let discPercentage = 0;
    if(x.disc_percentage && x.disc_percentage!='') discPercentage = x.disc_percentage;
    let sellPrice = 0;
    if(x.selling_price && x.selling_price!='') sellPrice = x.selling_price;
    x.discounted_price = this.discountFormula(sellPrice, discPercentage);
  }
  parseToFloat(num) {
    if(!Number(num)) num = 0;
    this.addonProductForm.weight = parseFloat(num);
  }

  discountFormula(price, percentage) {
    let discAmt: any = (price * (percentage/100)).toFixed(2);
    let discountedPrice = 0;
    if(parseFloat(price) >= discAmt) discountedPrice = price - discAmt;
    return discountedPrice;
  }

}