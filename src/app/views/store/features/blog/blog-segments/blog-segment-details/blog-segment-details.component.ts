import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../../services/store-api.service';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from '../../../../../../../environments/environment';
import { FeaturesApiService } from '../../../features-api.service';

@Component({
    selector: 'app-blog-segment-details',
    templateUrl: './blog-segment-details.component.html',
    styleUrls: ['./blog-segment-details.component.scss'],
    standalone: false
})

export class BlogSegmentDetailsComponent implements OnInit {

  productList: any = []; layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: "Top Left", value: "t_l" }, { name: "Top Center", value: "t_c" }, { name: "Top Right", value: "t_r" },
    { name: "Middle Left", value: "m_l" }, { name: "Middle Center", value: "m_c" }, { name: "Middle Right", value: "m_r" },
    { name: "Bottom Left", value: "b_l" }, { name: "Bottom Center", value: "b_c" }, { name: "Bottom Right", value: "b_r" }
  ];
  grid_details: any = {}; shopping_assist_config: any;
  fileList: FormData; fileLimitInKB: number = 500; videoLimitInKB: number = 5120;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService,
    public commonService: CommonService, public fApi: FeaturesApiService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setting/advanced-blogs/segments/"+params.id;
      this.commonService.secondary_header = " ";
      this.pageLoader = true; this.btnLoader = false; this.params = params;
      // layout details
      this.fApi.BLOG_SEGMENT_DETAILS(this.params.id, this.params.seg_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.layoutDetails = result.data;
          this.commonService.secondary_header = this.layoutDetails.name;
          if(this.layoutDetails.type!='flexible') {
            if(this.layoutDetails.type=='grid' && !this.layoutDetails.image_list.length) {
              let gridIndex = this.commonService.grid_list.findIndex(obj => obj.type==this.layoutDetails.grid_type);
              if(gridIndex!=-1) {
                this.grid_details = this.commonService.grid_list[gridIndex];
                for(let i=1; i<=this.grid_details.resolutions.length; i++) this.layoutDetails.image_list.push({ rank: i });
              }
              else this.layoutDetails.image_list.push({ rank: 1 });
            }
            else if(!this.layoutDetails.image_list.length) {
              let gridIndex = this.commonService.blog_grid_list.findIndex(obj => obj.type==this.layoutDetails.grid_type);
              if(gridIndex!=-1) {
                this.grid_details = this.commonService.blog_grid_list[gridIndex];
                for(let i=1; i<=this.grid_details.count; i++) this.layoutDetails.image_list.push({ rank: i });
              }
              else this.layoutDetails.image_list.push({ rank: 1 });
            }
            else if(!this.layoutDetails.image_list.length && this.layoutDetails.type!='video_section') {
              if(this.layoutDetails.type=='multiple_highlighted_section') this.layoutDetails.image_list.push({ rank: 1, content_status: true, content_details: {} });
              else this.layoutDetails.image_list.push({ rank: 1, points_list: [] });
            }
            else if(this.layoutDetails.type=='video_section' && !this.layoutDetails.video_details) {
              this.layoutDetails.video_details = {};
            }
          }
        }
        else {
          console.log("response", result);
          this.router.navigateByUrl(this.commonService.redirect);
        }
      });
    });
  }

  searchProduct(catId, searchTerm, i) {
    this.layoutDetails.image_list[i].productList = [];
    this.layoutDetails.image_list[i].searchLoader = true;
    if(catId && searchTerm.length>=3) {
      this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
        if(result.status) this.layoutDetails.image_list[i].productList = result.list;
        else console.log("response", result);
        this.layoutDetails.image_list[i].searchLoader = false;
      });
    }
  }
  searchProductForLook(catId, searchTerm, i, j) {
    this.layoutDetails.image_list[i].points_list[j].productList = [];
    this.layoutDetails.image_list[i].points_list[j].searchLoader = true;
    if(catId && searchTerm.length>=3) {
      this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
        if(result.status) this.layoutDetails.image_list[i].points_list[j].productList = result.list;
        else console.log("response", result);
        this.layoutDetails.image_list[i].points_list[j].searchLoader = false;
      });
    }
  }

  addNewImg() {
    if(this.layoutDetails.type=='multiple_highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_status: true, content_details: {} });
    }
    else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, points_list: [] });
    }
  }

  onUpdateLayout() {
    this.btnLoader = true;
    let layoutData: any = {};
    for(let key in this.layoutDetails) {
      if(this.layoutDetails.hasOwnProperty(key)) layoutData[key] = this.layoutDetails[key];
    }
    if(layoutData.type!='flexible') {
      this.fileList = new FormData();
      if(layoutData.type=='video_section') {
        layoutData.video_details = {};
        layoutData.store_id = this.commonService.store_details._id
          layoutData.blog_id = this.params.id;
        for(let key in this.layoutDetails.video_details) {
          if(this.layoutDetails.video_details.hasOwnProperty(key) && key!='thumbnail' && key!='src' && key!='temp_image' && key!='temp_video')
            layoutData.video_details[key] = this.layoutDetails.video_details[key];
        }
        if(this.layoutDetails.video_details.video_change) this.fileList.append('video', this.layoutDetails.video_details.src);
        else layoutData.video_details.src = this.layoutDetails.video_details.src;
        if(this.layoutDetails.video_details.img_change) this.fileList.append('thumbnail', this.layoutDetails.video_details.thumbnail);
        else layoutData.video_details.thumbnail = this.layoutDetails.video_details.thumbnail;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else {
        this.onSetFormData(layoutData.image_list).then((imgList) => {
          layoutData.image_list = imgList;
          layoutData.store_id = this.commonService.store_details._id;
          layoutData.blog_id = this.params.id;
          this.fileList.append('data', JSON.stringify(layoutData));
          this.callUpdateApi();
        });
      }
    }
    else {
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.blog_id = this.params.id;
      this.fApi.UPDATE_BLOG_SEGMENT_CONTENT(layoutData).subscribe(result => {
        this.btnLoader = false;
        if(result.status) {
          this.router.navigate([this.commonService.redirect]);
        }
        else {
          this.layoutDetails.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  callUpdateApi() {
    this.fApi.UPDATE_BLOG_SEGMENT_IMAGES(this.fileList).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate([this.commonService.redirect]);
      }
      else {
        this.layoutDetails.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        // image
        delete objData.temp_desktop_img; delete objData.temp_mobile_img;
        if(imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], i+'_d');
        }
        if(imgData.mobile_img_change) {
          delete objData.mobile_img;
          this.fileList.append('attachments', imgData['mobile_img'], i+'_m');
        }
        // video
        delete objData.temp_desktop_video; delete objData.temp_mobile_video;
        if(imgData.desktop_video_change) {
          delete objData.desktop_video;
          this.fileList.append('attachments', imgData['desktop_video'], i+'_dv');
        }
        if(imgData.mobile_video_change) {
          delete objData.mobile_video;
          this.fileList.append('attachments', imgData['mobile_video'], i+'_mv');
        }
        updatedList.push(objData)
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(devType, index, event) {
    delete this.layoutDetails.image_list[index].d_err_msg;
    delete this.layoutDetails.image_list[index].m_err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/gif"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(devType=='desktop') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_img = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].desktop_img = fileData;
              this.layoutDetails.image_list[index].desktop_img_change = true;
            }
            else this.layoutDetails.image_list[index].d_err_msg = true;
          }
          else {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_img = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].mobile_img = fileData;
              this.layoutDetails.image_list[index].mobile_img_change = true;
            }
            else this.layoutDetails.image_list[index].m_err_msg = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  videoChangeListener(devType, index, event) {
    delete this.layoutDetails.image_list[index].d_vid_err_msg;
    delete this.layoutDetails.image_list[index].m_vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      if(["video/mp4", "video/webm"].indexOf(fileData.type) != -1) {
        reader.onload = (event: ProgressEvent) => {
          if(devType=='desktop') {
            if(fileInKB<=this.videoLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_video = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].desktop_video = fileData;
              this.layoutDetails.image_list[index].desktop_video_change = true;
            }
            else this.layoutDetails.image_list[index].d_vid_err_msg = true;
          }
          else {
            if(fileInKB<=this.videoLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_video = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].mobile_video = fileData;
              this.layoutDetails.image_list[index].mobile_video_change = true;
            }
            else this.layoutDetails.image_list[index].m_vid_err_msg = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  videoSecFileChangeListener(event) {
    delete this.layoutDetails.video_details.img_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      if(["image/jpeg", "image/png"].indexOf(fileData.type) != -1) 
      {
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.fileLimitInKB) {
          this.layoutDetails.video_details.temp_image = (<FileReader>event.target).result;
          this.layoutDetails.video_details.thumbnail = fileData;
          this.layoutDetails.video_details.img_change = true;
        }
        else this.layoutDetails.video_details.img_err_msg = true;
      }
      reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }
  
  videoFileChangeListener(event) {
    delete this.layoutDetails.video_details.vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.videoLimitInKB) {
          this.layoutDetails.video_details.temp_video = (<FileReader>event.target).result;
          this.layoutDetails.video_details.src = fileData;
          this.layoutDetails.video_details.video_change = true;
        }
        else this.layoutDetails.video_details.vid_err_msg = true;
      }
      reader.readAsDataURL(fileData);
    }
  }

}