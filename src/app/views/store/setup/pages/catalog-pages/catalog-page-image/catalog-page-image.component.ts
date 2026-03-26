import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../../services/store-api.service';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from '../../../../../../../environments/environment';
import { SetupService } from '../../../setup.service';

@Component({
  selector: 'app-catalog-page-image',
  templateUrl: './catalog-page-image.component.html',
  styleUrls: ['./catalog-page-image.component.scss']
})

export class CatalogPageImageComponent implements OnInit {

  layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: 'Top Left', value: 't_l' }, { name: 'Top Center', value: 't_c' }, { name: 'Top Right', value: 't_r' },
    { name: 'Middle Left', value: 'm_l' }, { name: 'Middle Center', value: 'm_c' }, { name: 'Middle Right', value: 'm_r' },
    { name: 'Bottom Left', value: 'b_l' }, { name: 'Bottom Center', value: 'b_c' }, { name: 'Bottom Right', value: 'b_r' }
  ];
  grid_details: any = {};
  fileList: FormData;
  fileLimitInKB = 500;
  maxImgCount = 10;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService,
    public commonService: CommonService, public setup: SetupService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = '/setup/pages/catalog-pages/modify/' + params.id;
      this.commonService.secondary_header = ' ';
      this.pageLoader = true; this.btnLoader = false; this.params = params;

      this.setup.GET_SEGMENT_CATALOG_PAGE(this.params.id, this.params.seg_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if (result.status) {
          this.layoutDetails = result.data;
          this.commonService.secondary_header = this.layoutDetails.name;

          if (this.layoutDetails.type === 'section') {
            this.grid_details = this.commonService.grid_list.find(obj => obj.type === this.layoutDetails.section_grid_type);
            if (this.grid_details) {
              if (!this.layoutDetails.image_list.length) {
                for (let i = 1; i <= this.grid_details.resolutions.length; i++)
                  this.layoutDetails.image_list.push({ rank: i });
              }
            } else if (!this.layoutDetails.image_list.length) {
              this.layoutDetails.image_list.push({ rank: 1 });
            }
          } else if (this.layoutDetails.type === 'testimonial') {
            this.layoutDetails.image_list.forEach(el => {
              if (!el.content_details) el.content_details = {};
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push({ rank: 1, content_details: {} });
          } else if (this.layoutDetails.type === 'highlighted_section') {
            this.layoutDetails.image_list.forEach(el => {
              if (!el.content_details) el.content_details = {};
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push({ rank: 1, content_details: {} });
          } else if (!this.layoutDetails.image_list.length) {
            this.layoutDetails.image_list.push({ rank: 1 });
          }
        } else {
          console.log('response', result);
          this.router.navigateByUrl('/setup/pages/catalog-pages/modify/' + this.params.id);
        }
      });
    });
  }

  addNewImg() {
    if (this.layoutDetails.type === 'testimonial') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1, content_details: {} });
    } else if (this.layoutDetails.type === 'highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1, content_details: {} });
    } else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1 });
    }
  }

  async onUpdateLayout() {
    this.btnLoader = true;
    let layoutData = structuredClone(this.layoutDetails);
    this.fileList = new FormData();

    this.onSetFormData(layoutData.image_list).then((imgList) => {
      layoutData.image_list = imgList;
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.page_id = this.params.id;
      layoutData._id = this.layoutDetails._id;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.setup.SEGMENT_IMAGE_CATALOG_PAGE(this.fileList).subscribe(result => {
        this.btnLoader = false;
        if (result.status) {
          this.router.navigate(['/setup/pages/catalog-pages/modify/' + this.params.id]);
        } else {
          this.layoutDetails.errorMsg = result.message;
          console.log('response', result);
        }
      });
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve) => {
      let updatedList = [];
      for (let i = 0; i < imgList.length; i++) {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        delete objData.temp_desktop_img; delete objData.temp_mobile_img;
        if (imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], i + '_d');
        }
        if (imgData.mobile_img_change) {
          delete objData.mobile_img;
          this.fileList.append('attachments', imgData['mobile_img'], i + '_m');
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(devType, index, event) {
    delete this.layoutDetails.image_list[index]?.d_err_msg;
    delete this.layoutDetails.image_list[index]?.m_err_msg;
    if (event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size / 1024);
      if (['image/jpeg', 'image/png', 'image/gif'].indexOf(fileData.type) !== -1) {
        let reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          if (devType === 'desktop') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_img = (<FileReader>e.target).result;
              this.layoutDetails.image_list[index].desktop_img = fileData;
              this.layoutDetails.image_list[index].desktop_img_change = true;
            } else { this.layoutDetails.image_list[index].d_err_msg = true; }
          } else {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_img = (<FileReader>e.target).result;
              this.layoutDetails.image_list[index].mobile_img = fileData;
              this.layoutDetails.image_list[index].mobile_img_change = true;
            } else { this.layoutDetails.image_list[index].m_err_msg = true; }
          }
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

}
