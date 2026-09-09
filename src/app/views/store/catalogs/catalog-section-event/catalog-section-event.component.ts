import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-catalog-section-event',
    templateUrl: './catalog-section-event.component.html',
    styleUrls: ['./catalog-section-event.component.scss'],
    standalone: false
})

export class CatalogSectionEventComponent implements OnInit {

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
      this.commonService.redirect = "/product-sections/catalogs";
      this.pageLoader = true; this.params = params;
      this.api.CATALOG_DETAILS(params.id).subscribe(result => {
        if(result.status) {
          this.catForm = result.data;
          this.commonService.secondary_header = this.catForm.name+" - Highlighted Sections";
          if(!this.catForm.highlighted_sections.length) this.catForm.highlighted_sections = [{}];
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }
  
  onSubmit() {
    this.catForm.submit = true;
    this.fileList = new FormData();
    this.onSetFormData(this.catForm.highlighted_sections).then((imgList) => {
      this.fileList.append('data', JSON.stringify({ _id: this.params.id, highlighted_sections: imgList }));
      this.api.UPDATE_CATALOG_HIGHLIGHTS(this.fileList).subscribe(result => {
        this.catForm.submit = false;
        if(result.status) this.router.navigate(['/product-sections/catalogs']);
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
        updatedList.push(objData)
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(index, event) {
    delete this.catForm.highlighted_sections[index]?.err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB<=this.fileLimitInKB) {
            this.catForm.highlighted_sections[index].temp_img = (<FileReader>event.target).result;
            this.catForm.highlighted_sections[index].image = fileData;
            this.catForm.highlighted_sections[index].img_change = true;
          }
          else this.catForm.highlighted_sections[index].err_msg = true;
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  searchProduct(catId, searchTerm, i) {
		this.catForm.highlighted_sections[i].productList = [];
    this.catForm.highlighted_sections[i].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.catForm.highlighted_sections[i].productList = result.list;
				else console.log("response", result);
        this.catForm.highlighted_sections[i].searchLoader = false;
			});
		}
	}

}