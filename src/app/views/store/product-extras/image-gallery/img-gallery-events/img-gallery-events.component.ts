import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from '../../../../../../environments/environment';
import { CommonService } from '../../../../../services/common.service';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { ExcelService } from '../../../../../services/excel.service';

@Component({
    selector: 'app-img-gallery-events',
    templateUrl: './img-gallery-events.component.html',
    styleUrls: ['./img-gallery-events.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class ImgGalleryEventsComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean;
	galDetails: any; imgList: any = [];
  resizeForm: any; fileLimitInKB: number = 3000;
  imgWidth: number; imgHeight: number;
  imgBaseUrl = environment.img_baseurl;
  fileList: FormData; deleteForm: any;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService,
    public modalService: NgbModal, private api: ProductExtrasApiService, private excelService: ExcelService
  ) {
    let resolution = this.commonService.store_details.additional_features.cropper_resolution.split("x");
    this.imgWidth = parseFloat(resolution[0]); this.imgHeight = parseFloat(resolution[1]);
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if(params.id) {
        this.commonService.redirect = "/product-extras/image-gallery";
        this.commonService.secondary_header = " ";
        this.pageLoader = true;
        this.api.GALLERY_DETAILS(params.id).subscribe((result) => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.galDetails = result.data;
            this.galDetails.list.forEach((el, index) => {
              el.index = index;
            });
            this.commonService.secondary_header = this.galDetails.name;
          }
          else console.log("response",result);
        });
      }
      else this.router.navigate(['/product-extras/image-gallery']);
    });
  }

  onSubmit() {
    this.fileList = new FormData();
    if(this.imgList.length) {
      this.galDetails.submit = true;
      this.onSetFormData(this.imgList).then((imgList) => {
        this.fileList.append('data', JSON.stringify({ _id: this.galDetails._id, image_list: imgList }));
        this.api.UPDATE_GALLERY(this.fileList).subscribe((result) => {
          this.galDetails.submit = false;
          if(result.status) this.router.navigate(['/product-extras/image-gallery']);
          else {
            this.galDetails.errorMsg = result.message;
            console.log('response', result)
          }
        });
      });
    }
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.deleteForm.type = 'image';
    this.deleteForm._id = this.galDetails._id;
    this.api.DELETE_GALLERY(this.deleteForm).subscribe((result) => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let imgData of imgList) {
        this.fileList.append('attachments', imgData.image);
        updatedList.push({ resize_config: imgData.resize_config });
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(event) {
    if(event.target.files.length) {
      let maxLimit = 50 - this.imgList.length;
      for(let i=0; i<maxLimit; i++) {
        let fileData = event.target.files[i];
        if(fileData) {
          let imgSplit = fileData.name.split('.');
          let fileType = '.'+imgSplit[imgSplit.length-1];
          let fileName = fileData.name.split(fileType)[0];
          if(this.imgList.findIndex(el => el.name==fileName)==-1 && this.galDetails.list.findIndex(el => el.name==fileName)==-1) {
            let fileInKB = Math.round(fileData.size/ 1024);
            if(fileInKB <= this.fileLimitInKB && ["image/jpeg", "image/png"].indexOf(fileData.type) != -1) {
              let sizekb = fileData.size/1024;
              let myReader: FileReader = new FileReader();
              myReader.onload = (event: ProgressEvent) => {
                let imgTag: any = new Image();
                imgTag.src = (<FileReader>event.target).result;
                imgTag.onload = () => {
                  this.resizeForm = {};
                  this.resizeForm.width = imgTag.width;
                  this.resizeForm.height = imgTag.height;
                  this.imgAlgorithm(sizekb);
                  this.imgList.push({ image: fileData, name: fileName, resize_config: this.resizeForm, temp_img: imgTag.src });
                }              
              }
              myReader.readAsDataURL(fileData);
            }
          }
        }
      }
    }
  }

  imgAlgorithm(sizekb) {
    let ratio = this.resizeForm.height/this.resizeForm.width;
    let customValue = (sizekb/(this.resizeForm.width*this.resizeForm.height))*100000;
    let compression = 97.005769-(0.399058*customValue);
    this.resizeForm.quality = parseFloat(compression.toFixed(0));
    if(this.resizeForm.width === this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth;
    }
    else if(this.resizeForm.width > this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
    }
    else if(this.resizeForm.width < this.resizeForm.height) {
      if(ratio <= 1.177) {
        this.resizeForm.crop_width = this.imgWidth;
        this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
      }
      else {
        this.resizeForm.crop_width = this.imgHeight/this.resizeForm.height*this.resizeForm.width;
        this.resizeForm.crop_height = this.imgHeight; 
      }
    }
    this.resizeForm.crop_width = parseFloat(this.resizeForm.crop_width.toFixed(0));
    this.resizeForm.crop_height = parseFloat(this.resizeForm.crop_height.toFixed(0));
  }


  exportAsXLSX() {
    let imgList = [];
    this.galDetails.list.forEach(obj => {
      imgList.push({ "Image Name": obj.name, "Image URL": obj.image });
    });
    this.excelService.exportAsExcelFile(imgList, this.galDetails.name);
  }

}