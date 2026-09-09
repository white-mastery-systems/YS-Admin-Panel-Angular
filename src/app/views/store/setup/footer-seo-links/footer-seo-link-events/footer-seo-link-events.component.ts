import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { StoreApiService } from '../../../../../services/store-api.service';
import { SetupService } from '../../setup.service';

@Component({
    selector: 'app-footer-seo-link-events',
    templateUrl: './footer-seo-link-events.component.html',
    styleUrls: ['./footer-seo-link-events.component.scss'],
    standalone: false
})

export class FooterSeoLinkEventsComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean;
  collectionForm: any; maxRank: any = 0; params: any;

  constructor(
    private api: SetupService, private router: Router, private activeRoute: ActivatedRoute,
    public commonService: CommonService, private storeApi: StoreApiService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.btnLoader = false;
      this.maxRank = this.params.rank;
      this.collectionForm = { rank: this.maxRank, links: [{ link_type: 'category' }] };
      this.commonService.redirect = "/setup/footer-seo-links";
      this.commonService.secondary_header = "Add Links";
      if(this.params.id) {
        this.commonService.secondary_header = "Update Links";
        this.pageLoader = true;
        this.api.FSEO_LINK_DETAILS(this.params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.collectionForm = result.data;
            this.collectionForm.prev_rank = this.collectionForm.rank;
            if(this.collectionForm.links?.length) {
              for(let x of this.collectionForm.links)
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
		this.collectionForm.links[index].productList = [];
    this.collectionForm.links[index].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.storeApi.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.collectionForm.links[index].productList = result.list;
				else console.log("response", result);
        this.collectionForm.links[index].searchLoader = false;
			});
		}
	}

  onSubmit() {
    this.btnLoader = true;
    if (this.params.id) {
      this.api.UPDATE_FSEO_LINK(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if (result.status) this.router.navigate(['/setup/footer-seo-links']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_FSEO_LINK(this.collectionForm).subscribe(result => {
        this.btnLoader = false;
        if (result.status) this.router.navigate(['/setup/footer-seo-links']);
        else {
          this.collectionForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}