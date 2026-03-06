import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-catalog-navigation-events',
  templateUrl: './catalog-navigation-events.component.html',
  styleUrls: ['./catalog-navigation-events.component.scss']
})

export class CatalogNavigationEventsComponent implements OnInit {

  pageLoader: boolean;
  catForm: any; fileList: FormData; 
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  fileLimitInKB: number = 500; params: any;

  constructor(
    private router: Router, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private api: StoreApiService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.commonService.redirect = "/product-sections/catalogs/navigation/"+this.params.sectionId;
      this.api.CATALOG_NAVIGATION_DETAILS(this.params.sectionId, this.params.id).subscribe(result => {
        if(result.status) {
          this.catForm = result.data;
          this.commonService.secondary_header = this.catForm.name+" - Sections";
          if(!this.catForm.image_list.length) this.catForm.image_list = [{ isActive: true, images: [] }];
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }
  
  onSubmit() {
    this.catForm.submit = true;
    this.fileList = new FormData();
    this.onSetFormData(this.catForm.image_list).then((imgList) => {
      this.fileList.append('data', JSON.stringify({ _id: this.params.id, image_list: imgList }));
      this.api.UPDATE_CATALOG_NAVIGATION_SECTIONS(this.fileList).subscribe(result => {
        this.catForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        delete objData.temp_img;
        delete objData.productList;
        if(imgData.img_change) {
          delete objData.image;
          this.fileList.append('attachments', imgData['image'], i+'_c');
        }
        objData.images = [];
        if(imgData.images.length) {
          for(let j=0; j<imgData.images.length; j++)
          {
            let imgSetData = imgData.images[j];
            let objSetData = Object.assign({}, imgSetData);
            delete objSetData.temp_img;
            if(imgSetData.img_change) {
              delete objSetData.image;
              this.fileList.append('attachments', imgSetData['image'], i+'_'+j+'_c');
            }
            objData.images.push(objSetData)
          }
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(index: number, event) {
    delete this.catForm.image_list[index]?.err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB<=this.fileLimitInKB) {
            this.catForm.image_list[index].temp_img = (<FileReader>event.target).result;
            this.catForm.image_list[index].image = fileData;
            this.catForm.image_list[index].img_change = true;
          }
          else this.catForm.image_list[index].err_msg = true;
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }
  fileChangeListener2(pInd: number, index: number, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB<=this.fileLimitInKB) {
            if(index===-1) {
              this.catForm.image_list[pInd].images.push({});
              index = this.catForm.image_list[pInd].images.length - 1;
            }
            this.catForm.image_list[pInd].images[index].temp_img = (<FileReader>event.target).result;
            this.catForm.image_list[pInd].images[index].image = fileData;
            this.catForm.image_list[pInd].images[index].img_change = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  searchProduct(catId, searchTerm, i) {
    this.catForm.image_list[i].productList = [];
    this.catForm.image_list[i].searchLoader = true;
    if(catId && searchTerm.length>=3) {
      this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
        if(result.status) this.catForm.image_list[i].productList = result.list;
        else console.log("response", result);
        this.catForm.image_list[i].searchLoader = false;
      });
    }
  }

}