import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { FeaturesApiService } from '../../features-api.service';

@Component({
  selector: 'app-modify-collections',
  templateUrl: './modify-collections.component.html',
  styleUrls: ['./modify-collections.component.scss']
})

export class ModifyCollectionsComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean;
  collectionForm: any; maxRank: any = 0; params: any;

  constructor(
    private api: FeaturesApiService, private storeApi: StoreApiService, private router: Router,
    private activeRoute: ActivatedRoute, public commonService: CommonService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.btnLoader = false;
      this.maxRank = this.params.rank;
      this.collectionForm = { rank: this.maxRank, option_list: [{}] };
        this.commonService.redirect = "/setting/collections";
        this.commonService.secondary_header = "Add Collection";
      if(this.params.collection_id) {
        this.commonService.secondary_header = "Update Collection";
        this.pageLoader = true;
        this.api.COLLECTION_DETAILS({ _id: this.params.collection_id }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.collectionForm = result.data;
            this.collectionForm.prev_rank = this.collectionForm.rank;
            if(this.collectionForm.option_list?.length) {
              for(let x of this.collectionForm.option_list)
              {
                x.productList = [];
                if(x.link_type=='product' && x.product_id) {
                  this.storeApi.PRODUCT_DETAILS(x.product_id).subscribe(result => {
                    if(result.status) x.productList = [result.data];
                    else console.log("response", result);
                  });
                }
              }
            }
          }
          else console.log("response", result);
        });
      }
    });
  }

  searchProduct(catId, searchTerm, index) {
		this.collectionForm.option_list[index].productList = [];
    this.collectionForm.option_list[index].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.storeApi.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.collectionForm.option_list[index].productList = result.list;
				else console.log("response", result);
        this.collectionForm.option_list[index].searchLoader = false;
			});
		}
	}

  onSubmit() {
    this.btnLoader = true;
    if(this.params.collection_id) {
      this.api.UPDATE_COLLECTION(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/setting/collections']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_COLLECTION(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/setting/collections']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}