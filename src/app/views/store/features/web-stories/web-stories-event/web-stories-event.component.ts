import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-web-stories-event',
  templateUrl: './web-stories-event.component.html',
  styleUrls: ['./web-stories-event.component.scss']
})
export class WebStoriesEventComponent implements OnInit {

  pageLoader: boolean;
  storyForm: any = {};
  currentDate: Date = new Date();
  imgBaseUrl = environment.img_baseurl;
  fileList: FormData = new FormData();

  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/features/web-stories";
      this.commonService.secondary_header = "Add Web Story";
      this.storyForm = { form_type: 'add', created_on: this.currentDate, seo_details: {}, list: [{}] };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Web Story";
        this.api.WEB_STORY_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.storyForm = result.data;
            this.storyForm.form_type = 'edit';
            this.storyForm.created_on = new Date(this.storyForm.created_on);
            if(!this.storyForm.seo_details) this.storyForm.seo_details = {};
            this.storyForm.seo_details.meta_keyword_list = [];
            if(this.storyForm.seo_details.meta_keywords.length) {
              this.storyForm.seo_details.meta_keywords.forEach(obj => {
                this.storyForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
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
    this.fileList = new FormData();
    this.storyForm.errorMsg = '';
    // this.storyForm.submit = true;
    this.storyForm.seo_status = true;
    this.storyForm.seo_details.meta_keywords = [];
    if(this.storyForm.seo_details?.meta_keyword_list) {
      this.storyForm.seo_details.meta_keyword_list.forEach(obj => {
        this.storyForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    if(this.storyForm.img_change) this.fileList.append('attachments', this.storyForm.img_file, 'b_img');
    this.onSetFormData(this.storyForm.list).then(() => {
      let formData = Object.assign({}, this.storyForm);
      delete formData.temp_img;
      if(formData.list?.length){
        formData.list = formData.list.map(item => {
          const { temp_img, ...rest } = item;
          return rest;
        });
      }
      this.fileList.append('data', JSON.stringify(formData)); 

      if(this.storyForm.form_type=='add') {
        this.api.ADD_WEB_STORY(this.fileList).subscribe(result => {
          this.storyForm.submit = false;
          if(result.status) this.router.navigate(['/features/web-stories']);
          else {
            this.storyForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else {
        this.api.UPDATE_WEB_STORY(this.fileList).subscribe(result => {
          this.storyForm.submit = false;
          if(result.status) this.router.navigate(['/features/web-stories']);
          else {
            this.storyForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
    })
  }

  onChangeTitle() {
    if(this.storyForm.form_type=='add') {
      this.storyForm.seo_details.page_url = this.commonService.urlFormat(this.storyForm.name);
      let tempName = this.storyForm.name.substring(0, 70);
      this.storyForm.seo_details.h1_tag = tempName;
      this.storyForm.seo_details.page_title = 'Web Stories - '+tempName;
    }
  }
  onChangeDesc() {
    if(this.storyForm.form_type=='add')
      this.storyForm.seo_details.meta_desc = this.commonService.stripHtml(this.storyForm.description).substring(0, 320);
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      for(let i=0; i<imgList.length; i++) {
        if(imgList[i].img_change) this.fileList.append('attachments', imgList[i].img_file, i+'_img');
      }
      resolve(true);
    });
  }

  fileChangeListener(event, index) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(index!=null){
          this.storyForm.list[index].temp_img = (<FileReader>event.target).result;
          this.storyForm.list[index].img_change = true;
          this.storyForm.list[index].img_file = inFile;
        }
        else{
          this.storyForm.temp_img = (<FileReader>event.target).result;
          this.storyForm.img_change = true;
          this.storyForm.img_file = inFile;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}
