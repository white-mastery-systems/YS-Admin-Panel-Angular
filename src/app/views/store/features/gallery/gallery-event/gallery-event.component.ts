import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import { FeaturesApiService } from '../../features-api.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-gallery-event',
  templateUrl: './gallery-event.component.html',
  styleUrls: ['./gallery-event.component.scss'],
  animations: [SharedAnimations]
})

export class GalleryEventComponent implements OnInit {

  page = 1; pageSize = 10; search_bar: string;
  pageLoader: boolean;
	galDetails: any = {}; imgList: any = [];
  fileLimitInKB: number = 3000;
  imgBaseUrl = environment.img_baseurl;
  fileList: FormData; deleteForm: any;
  viewList: any = []; imageDetails: any = {};
  selectedList: any = []; allSelected: boolean;
  imageCount: number = 1;

  constructor(
    private router: Router, public commonService: CommonService,private activeRoute: ActivatedRoute,
    public modalService: NgbModal, private excelService: ExcelService, private api: FeaturesApiService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if(params.id) {
        this.commonService.redirect = "/features/site-gallery";
        this.commonService.secondary_header = " ";
        this.pageLoader = true; this.allSelected = false;
        this.api.GALLERY_DETAILS(params.id).subscribe((result) => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.galDetails = result.data;
            this.galDetails.image_list.forEach((el, index) => {
              el.index = index;
            });
            this.commonService.secondary_header = this.galDetails.name;
            this.imageCount = this.galDetails.image_list.length? this.galDetails.image_list.length: 1
          }
          else console.log("response",result);
        });
      }
      else this.router.navigate(['/setting/gallery']);
    });
  }

  // add image
  onSubmit() {
    this.fileList = new FormData();
    if(this.imgList.length) {
      this.galDetails.submit = true;
      this.onSetFormData(this.imgList).then((imgList) => {
        this.fileList.append('data', JSON.stringify({ _id: this.galDetails._id, image_list: imgList }));
        this.api.UPDATE_GALLERY(this.fileList).subscribe((result) => {
          this.galDetails.submit = false;
          if(result.status) {
            this.clearImage()
            this.imgList = []; this.galDetails = result.data;
            let page = Math.ceil(this.galDetails.image_list.length / 10)
            if(page > this.page) this.page = page
          }
          else {
            console.log("response", result);
            this.galDetails.errorMsg = result.message;
          }
        });
      });
    }
  }
  
  // delete
  onOpenDeleteModal(modalName) {
    this.deleteForm = { imageList: [], ids: [] };
    this.selectedList.map(obj => {
      this.deleteForm.imageList.push(obj.name);
      this.deleteForm.ids.push(obj._id);
    });
    this.modalService.open(modalName);
  }
  onDelete() {
    this.deleteForm.submit = true;
    this.deleteForm._id = this.galDetails._id;
    this.api.DELETE_GALLERY_IMAGE(this.deleteForm).subscribe((result) => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        let listLen = this.galDetails.image_list.length - this.selectedList.length
        let page = Math.ceil(listLen / 10)
        if(page < this.page) this.page = page
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  // update
  onOpenEditModel(detail) {
    this.imageDetails = {...detail}
    this.imageDetails.prev_rank = detail.rank
  }
  onUpdate() {
    this.imageDetails.submit = true;
    this.imageDetails.parent_id = this.galDetails._id;
    this.api.UPDATE_GALLERY_IMAGE(this.imageDetails).subscribe((result) => {
      this.imageDetails.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else this.imageDetails.errorMsg = result.message;
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      imgList.forEach(imgData => {
        this.fileList.append('image_list', imgData.image);
        updatedList.push({ name:imgData.name });
      });
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
          // if(this.imgList.findIndex(el => el.name==fileName)==-1 && this.viewList.findIndex(el => el.name==fileName)==-1) {
            let fileInKB = Math.round(fileData.size/ 1024);
            if(fileInKB <= this.fileLimitInKB && ["image/jpeg", "image/png", "image/webp"].indexOf(fileData.type) != -1) {
              let myReader: FileReader = new FileReader();
              myReader.onload = (event: ProgressEvent) => {
                let imgTag: any = new Image();
                imgTag.src = (<FileReader>event.target).result;
                imgTag.onload = () => {
                  this.imgList.push({ image: fileData, name: fileName, temp_img: imgTag.src });
                }              
              }
              myReader.readAsDataURL(fileData);
            }
            else this.galDetails.size = true
          // }
        }
      }
    }
  }
  clearImage() {
    let el:any = document.getElementById('multi_image')
    if(el) el.value = ''
  }

  exportAsXLSX() {
    let imgList = [];
    this.galDetails.image_list.forEach(obj => {
      imgList.push({ "Image Name": obj.name, "Image URL": obj.path });
    });
    this.excelService.exportAsExcelFile(imgList, this.galDetails.name);
  }

  selectAll(x) {
    this.galDetails.image_list.map(p => { p.isSelected = x; this.onSelect(p); });
  }
  imageList = []
  onSelect(x) {
    this.imageList = []
    let index = this.selectedList.findIndex(el => el._id==x._id);
    if(index!=-1) {
      if(!x.isSelected) this.selectedList.splice(index, 1);
      this.checkAllSelect();
    }
    else {
      if(x.isSelected) {
        this.selectedList.push(x); 
        this.checkAllSelect();
      }
    }
  }
  checkAllSelect() {
    this.allSelected = true;
    if(this.galDetails.image_list.findIndex(el => !el.isSelected) != -1) this.allSelected = false;
  }

}
