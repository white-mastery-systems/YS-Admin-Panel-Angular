import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from 'src/app/services/common.service';
import { StoreApiService } from 'src/app/services/store-api.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-menu-brands',
    templateUrl: './menu-brands.component.html',
    styleUrls: ['./menu-brands.component.scss'],
    standalone: false
})

export class MenuBrandsComponent implements OnInit {

  pageLoader: boolean;  menuId: string; editForm: any;
  list: any = []; maxRank: any = 0;
  imgBaseUrl = environment.img_baseurl;
  selectedMenu = JSON.parse(sessionStorage.getItem("selected_menu"));

  constructor( private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService,
    private storeApi: StoreApiService,) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if(!this.commonService.desktop_device) {
        this.commonService.redirect = "/features/menus";
      }
      this.pageLoader = true;
      this.menuId = params.menu_id;
      this.api.MENU_DETAILS({ _id:this.menuId }).subscribe(result => {
        if(result.status) {
        let x = result.data;
        this.commonService.secondary_header = x.name;
				if(x.top_brands?.length) {
          this.editForm = { _id: x._id, name: x.name, top_brands: x.top_brands, productList: [] };
          for(let brand of this.editForm.top_brands)
          {
            brand.productList = [];
            if(brand.link_status && brand.link_type=='product' && brand.product_id) {
              this.storeApi.PRODUCT_DETAILS(brand.product_id).subscribe(result => {
                if(result.status) brand.productList = [result.data];
                else console.log("response", result);
              });
            }
          }
        }
				else this.editForm = { _id: x._id, name: x.name, top_brands: [{rank:1}] };
        this.maxRank = this.editForm.top_brands.length;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  searchProduct(catId, searchTerm, index) {
		this.editForm.top_brands[index].productList = [];
    this.editForm.top_brands[index].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.storeApi.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.editForm.top_brands[index].productList = result.list;
				else console.log("response", result);
        this.editForm.top_brands[index].searchLoader = false;
			});
		}
	}

  // UPDATE
	onUpdate() {
    this.editForm.submit = true
    this.editForm.menu_id = this.menuId;
		this.api.UPDATE_BRAND_IMAGES(this.editForm).subscribe(result => {
      this.editForm.submit = false
      if(result.status) {
        this.router.navigate(['/features/menus'])
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
		let inFile = event.target.files[0];
		if(["image/jpeg", "image/jpg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.editForm.top_brands[index].image = (<FileReader>event.target).result;
        this.editForm.top_brands[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
	}
	else console.log("Invaid file");
    }
  }

}