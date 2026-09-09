import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-recipe-event',
    templateUrl: './recipe-event.component.html',
    styleUrls: ['./recipe-event.component.scss'],
    standalone: false
})

export class RecipeEventComponent implements OnInit {

  pageLoader: boolean;
  recipeForm: any = {};
  currentDate: Date = new Date();
  imgBaseUrl = environment.img_baseurl;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
        this.commonService.redirect = "/setting/recipes";
        this.commonService.secondary_header = "Add Recipe";
      this.recipeForm = { form_type: 'add', created_on: this.currentDate, seo_details: {} };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Recipe";
        this.api.RECIPE_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.recipeForm = result.data;
            this.recipeForm.form_type = 'edit';
            this.recipeForm.created_on = new Date(this.recipeForm.created_on);
            if(!this.recipeForm.seo_details) this.recipeForm.seo_details = {};
            this.recipeForm.seo_details.meta_keyword_list = [];
            if(this.recipeForm.seo_details.meta_keywords.length) {
              this.recipeForm.seo_details.meta_keywords.forEach(obj => {
                this.recipeForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
            this.recipeForm.yields_list = [];
            if(this.recipeForm.yields?.length) {
              this.recipeForm.yields.forEach(obj => {
                this.recipeForm.yields_list.push({display: obj, value: obj});
              });
            }
            this.recipeForm.ingredients_list = [];
            if(this.recipeForm.ingredients?.length) {
              this.recipeForm.ingredients.forEach(obj => {
                this.recipeForm.ingredients_list.push({display: obj, value: obj});
              });
            }
            this.recipeForm.category_list = [];
            if(this.recipeForm.category.length) {
              this.recipeForm.category.forEach(obj => {
                this.recipeForm.category_list.push({display: obj, value: obj});
              });
            }
            this.recipeForm.cuisine_list = [];
            if(this.recipeForm.cuisine.length) {
              this.recipeForm.cuisine.forEach(obj => {
                this.recipeForm.cuisine_list.push({display: obj, value: obj});
              });
            }
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }

  onSubmit() {
    this.recipeForm.submit = true;
    this.recipeForm.seo_status = true;
    this.recipeForm.seo_details.meta_keywords = [];
    if(this.recipeForm.seo_details?.meta_keyword_list) {
      this.recipeForm.seo_details.meta_keyword_list.forEach(obj => {
        this.recipeForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    this.recipeForm.yields = [];
    if(this.recipeForm.yields_list.length) {
      this.recipeForm.yields = this.recipeForm.yields_list.map(el => el.value);
    }
    this.recipeForm.ingredients = [];
    if(this.recipeForm.ingredients_list.length) {
      this.recipeForm.ingredients = this.recipeForm.ingredients_list.map(el => el.value);
    }
    this.recipeForm.category = [];
    if(this.recipeForm.category_list.length) {
      this.recipeForm.category = this.recipeForm.category_list.map(el => el.value);
    }
    this.recipeForm.cuisine = [];
    if(this.recipeForm.cuisine_list.length) {
      this.recipeForm.cuisine = this.recipeForm.cuisine_list.map(el => el.value);
    }
    if(this.recipeForm.form_type=='add') {
      this.api.ADD_RECIPE(this.recipeForm).subscribe(result => {
        this.recipeForm.submit = false;
        if(result.status) this.router.navigate(['/setting/recipes']);
        else {
          this.recipeForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_RECIPE(this.recipeForm).subscribe(result => {
        this.recipeForm.submit = false;
        if(result.status) this.router.navigate(['/setting/recipes']);
        else {
          this.recipeForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onChangeTitle() {
    if(this.recipeForm.form_type=='add') {
      this.recipeForm.seo_details.page_url = this.commonService.urlFormat(this.recipeForm.name);
      let tempName = this.recipeForm.name.substring(0, 70);
      this.recipeForm.seo_details.h1_tag = tempName;
      this.recipeForm.seo_details.page_title = 'Recipes - '+tempName;
    }
  }
  onChangeDesc() {
    if(this.recipeForm.form_type=='add')
      this.recipeForm.seo_details.meta_desc = this.commonService.stripHtml(this.recipeForm.description).substring(0, 320);
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.recipeForm.image = (<FileReader>event.target).result;
        this.recipeForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}